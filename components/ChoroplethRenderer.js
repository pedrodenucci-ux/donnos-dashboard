'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function ChoroplethRenderer({ cityCode, cityName }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNeighborhoods, setShowNeighborhoods] = useState(true); // true = neighborhoods, false = sectors

  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Determine which GeoJSON to load
        const geoJsonUrl = showNeighborhoods
          ? `/data/${cityCode}_geospatial_neighborhoods.geojson`
          : `/data/${cityCode}_geospatial_sectors.geojson`;

        // Fetch GeoJSON data
        const response = await fetch(geoJsonUrl);
        if (!response.ok) throw new Error(`Failed to load ${geoJsonUrl}`);
        const geojson = await response.json();

        // Calculate bounds from features
        let bounds = [180, 90, -180, -90];
        if (geojson.features && geojson.features.length > 0) {
          geojson.features.forEach((feature) => {
            if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates) {
              feature.geometry.coordinates[0].forEach(([lng, lat]) => {
                bounds[0] = Math.min(bounds[0], lng);
                bounds[1] = Math.min(bounds[1], lat);
                bounds[2] = Math.max(bounds[2], lng);
                bounds[3] = Math.max(bounds[3], lat);
              });
            }
          });
        }

        // Remove existing map if any
        if (map.current) {
          map.current.remove();
        }

        // Initialize map
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
          map.current.addSource('choropleth-data', {
            type: 'geojson',
            data: geojson,
          });

          // Calculate min/max for socioeconomic_index for color scale
          let minIndex = Infinity;
          let maxIndex = -Infinity;
          geojson.features.forEach((feature) => {
            const index = feature.properties.socioeconomic_index;
            if (index !== null && index !== undefined) {
              minIndex = Math.min(minIndex, index);
              maxIndex = Math.max(maxIndex, index);
            }
          });

          // Add fill layer for choropleth
          map.current.addLayer({
            id: 'choropleth-fill',
            type: 'fill',
            source: 'choropleth-data',
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'socioeconomic_index'],
                minIndex,
                '#0B1F2A', // dark blue
                (minIndex + maxIndex) / 2,
                '#F59E0B', // amber
                maxIndex,
                '#FF6B35', // orange
              ],
              'fill-opacity': 0.8,
            },
          });

          // Add stroke layer for borders
          map.current.addLayer({
            id: 'choropleth-stroke',
            type: 'line',
            source: 'choropleth-data',
            paint: {
              'line-color': '#fff',
              'line-width': 1,
              'line-opacity': 0.5,
            },
          });

          // Add hover effect
          map.current.on('mouseenter', 'choropleth-fill', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = 'pointer';
            }
          });

          map.current.on('mouseleave', 'choropleth-fill', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
            }
          });

          // Add popup on click
          map.current.on('click', 'choropleth-fill', (e) => {
            const feature = e.features?.[0];
            if (!feature) return;

            const props = feature.properties;
            const isApproximate = props.aproximado === true;

            let html = `<div class="p-2 text-sm">
              <strong>${props.neighborhood_name || props.bairro || 'Area'}</strong><br />
              Population: ${props.population || 'N/A'}<br />
              Density: ${props.population_density ? props.population_density.toFixed(1) : 'N/A'} hab/km²<br />
              Index: ${props.socioeconomic_index ? props.socioeconomic_index.toFixed(1) : 'N/A'}<br />
              Companies: ${props.enterprise_count || 'N/A'}<br />
              Towers: ${props.tower_count || 'N/A'}<br />
              Health: ${props.health_facility_count || 'N/A'}`;

            if (isApproximate) {
              html += `<br /><span class="text-red-600 text-xs">⚠ Aproximado</span>`;
            }

            html += '</div>';

            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(html)
              .addTo(map.current);
          });

          setIsLoading(false);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();
  }, [showNeighborhoods, cityCode]);

  return (
    <div className="w-full h-full relative bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-gray-600">Loading choropleth for {cityName}...</div>
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

      {/* Toggle buttons */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button
          onClick={() => setShowNeighborhoods(true)}
          className={`px-3 py-2 rounded text-sm font-medium transition ${
            showNeighborhoods
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Neighborhoods
        </button>
        <button
          onClick={() => setShowNeighborhoods(false)}
          className={`px-3 py-2 rounded text-sm font-medium transition ${
            !showNeighborhoods
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Official IBGE
        </button>
      </div>

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
