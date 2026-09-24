'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapRenderer({ geojsonUrl, cityName }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch GeoJSON data
        const response = await fetch(geojsonUrl);
        if (!response.ok) throw new Error(`Failed to load ${geojsonUrl}`);
        const geojson = await response.json();

        // Calculate bounds from features
        let bounds = [180, 90, -180, -90];
        if (geojson.features && geojson.features.length > 0) {
          geojson.features.forEach((feature) => {
            if (feature.geometry.coordinates) {
              const [lng, lat] = feature.geometry.coordinates;
              bounds[0] = Math.min(bounds[0], lng);
              bounds[1] = Math.min(bounds[1], lat);
              bounds[2] = Math.max(bounds[2], lng);
              bounds[3] = Math.max(bounds[3], lat);
            }
          });
        }

        // Initialize map with center and zoom based on bounds
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://demotiles.maplibre.org/style.json',
          center: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2],
          zoom: 11,
          pitch: 0,
          bearing: 0,
        });

        map.current.on('load', () => {
          if (!map.current) return;

          // Add GeoJSON source
          map.current.addSource('geospatial-data', {
            type: 'geojson',
            data: geojson,
          });

          // Color by feature type
          map.current.addLayer({
            id: 'geospatial-features',
            type: 'circle',
            source: 'geospatial-data',
            paint: {
              'circle-radius': 6,
              'circle-color': [
                'match',
                ['get', 'type'],
                'empresa',
                '#3b82f6',
                'torre',
                '#ef4444',
                'saúde',
                '#10b981',
                '#9ca3af',
              ],
              'circle-opacity': 0.8,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          });

          // Add hover effect
          map.current.on('mouseenter', 'geospatial-features', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = 'pointer';
            }
          });

          map.current.on('mouseleave', 'geospatial-features', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
            }
          });

          // Add popup on click
          map.current.on('click', 'geospatial-features', (e) => {
            const feature = e.features?.[0];
            if (!feature) return;

            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `<div class="p-2 text-sm">
                  <strong>${feature.properties?.name || 'Feature'}</strong><br />
                  Type: ${feature.properties?.type || 'Unknown'}
                </div>`
              )
              .addTo(map.current);
          });

          setIsLoading(false);
        });

        return () => {
          if (map.current) {
            map.current.remove();
          }
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();
  }, [geojsonUrl]);

  return (
    <div className="w-full h-full relative bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-gray-600">Loading map for {cityName}...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-red-600 text-center">
            <p>Error loading map</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
