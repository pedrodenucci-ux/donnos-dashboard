'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function ThematicMapRenderer({ geojsonUrl, theme, cityName }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const themeConfig = {
    densidade: {
      title: 'População',
      icon: '👥',
      filter: ['in', ['get', 'tipo_dados'], ['literal', ['empresa', 'torre_celular', 'saude']]],
      color: '#6b7280',
      radius: 6,
    },
    socioeconômico: {
      title: 'Índice Socioeconômico',
      icon: '📊',
      filter: ['==', ['get', 'tipo_dados'], 'saude'],
      color: '#10b981',
      radius: 7,
    },
    empresas: {
      title: 'Concentração Empresas',
      icon: '🏢',
      filter: ['==', ['get', 'tipo_dados'], 'empresa'],
      color: '#3b82f6',
      radius: 6,
    },
    telecom: {
      title: 'Infraestrutura Telecom',
      icon: '📡',
      filter: ['==', ['get', 'tipo_dados'], 'torre_celular'],
      color: '#ef4444',
      radius: 7,
    },
  };

  const config = themeConfig[theme] || themeConfig.densidade;

  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(geojsonUrl);
        if (!response.ok) throw new Error(`Failed to load ${geojsonUrl}`);
        const geojson = await response.json();

        // Filter features by theme
        const filteredFeatures = geojson.features.filter((feature) => {
          const tipo = feature.properties.tipo_dados;
          if (theme === 'densidade') return true;
          if (theme === 'socioeconômico') return tipo === 'saude';
          if (theme === 'empresas') return tipo === 'empresa';
          if (theme === 'telecom') return tipo === 'torre_celular';
          return true;
        });

        // Calculate bounds
        let bounds = [180, 90, -180, -90];
        filteredFeatures.forEach((feature) => {
          if (feature.geometry.coordinates) {
            const [lng, lat] = feature.geometry.coordinates;
            bounds[0] = Math.min(bounds[0], lng);
            bounds[1] = Math.min(bounds[1], lat);
            bounds[2] = Math.max(bounds[2], lng);
            bounds[3] = Math.max(bounds[3], lat);
          }
        });

        const center = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];
        const zoom = 11;

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://demotiles.maplibre.org/style.json',
          center,
          zoom,
          pitch: 0,
          bearing: 0,
        });

        map.current.on('load', () => {
          if (!map.current) return;

          // Add filtered geojson
          map.current.addSource('thematic-data', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: filteredFeatures,
            },
          });

          // Add circle layer
          map.current.addLayer({
            id: 'thematic-features',
            type: 'circle',
            source: 'thematic-data',
            paint: {
              'circle-radius': config.radius,
              'circle-color': config.color,
              'circle-opacity': 0.7,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          });

          // Hover
          map.current.on('mouseenter', 'thematic-features', () => {
            if (map.current) map.current.getCanvas().style.cursor = 'pointer';
          });
          map.current.on('mouseleave', 'thematic-features', () => {
            if (map.current) map.current.getCanvas().style.cursor = '';
          });

          setIsLoading(false);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();
  }, [geojsonUrl, theme]);

  return (
    <div className="w-full h-full relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      {/* Title */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur px-3 py-2 z-10 border-b border-gray-200">
        <h3 className="font-semibold text-sm text-gray-900">
          {config.icon} {config.title}
        </h3>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <div className="text-gray-600 text-sm">Loading...</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-20">
          <div className="text-red-600 text-center text-xs p-2">
            <p>Error loading map</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Map */}
      <div ref={mapContainer} className="w-full h-full" style={{ marginTop: '38px' }} />
    </div>
  );
}
