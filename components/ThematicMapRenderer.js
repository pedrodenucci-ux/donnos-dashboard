'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function ThematicMapRenderer({ geospatial, theme, selectedLayer, cityCode }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const themeConfig = {
    density: {
      label: 'Densidade Populacional',
      description: 'Habitantes por km² (Censo 2022)',
      color: '#3b82f6',
      type: 'choropleth',
    },
    socioeconomic: {
      label: 'Índice Socioeconômico',
      description: 'Composição: renda, escolaridade, infraestrutura',
      color: '#10b981',
      type: 'choropleth',
    },
    companies: {
      label: 'Concentração de Empresas',
      description: 'Empresas ativas (Receita Federal, 2024)',
      color: '#f59e0b',
      type: 'choropleth',
    },
    telecom: {
      label: 'Infraestrutura de Telecom',
      description: 'ERBs (Anatel SMP 2024) e acessos de banda larga',
      color: '#ef4444',
      type: 'choropleth',
    },
  };

  const config = themeConfig[theme] || themeConfig.density;

  useEffect(() => {
    if (!mapContainer.current || !geospatial) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const layerData = geospatial[selectedLayer];
        if (!layerData || !layerData.features) {
          throw new Error(`Dados não disponíveis para ${selectedLayer}`);
        }

        // Get bounds from features
        let bounds = [180, 90, -180, -90];
        layerData.features.forEach((feature) => {
          if (feature.geometry.coordinates) {
            if (feature.geometry.type === 'Point') {
              const [lng, lat] = feature.geometry.coordinates;
              bounds[0] = Math.min(bounds[0], lng);
              bounds[1] = Math.min(bounds[1], lat);
              bounds[2] = Math.max(bounds[2], lng);
              bounds[3] = Math.max(bounds[3], lat);
            }
          }
        });

        const center = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];
        const zoom = 11;

        if (map.current) {
          map.current.remove();
        }

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
          center,
          zoom,
          pitch: 0,
          bearing: 0,
        });

        map.current.on('load', () => {
          if (!map.current) return;

          map.current.addSource('thematic-data', {
            type: 'geojson',
            data: layerData,
          });

          map.current.addLayer({
            id: 'thematic-features',
            type: 'circle',
            source: 'thematic-data',
            paint: {
              'circle-radius': 6,
              'circle-color': config.color,
              'circle-opacity': 0.7,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          });

          map.current.on('mouseenter', 'thematic-features', () => {
            if (map.current) map.current.getCanvas().style.cursor = 'pointer';
          });
          map.current.on('mouseleave', 'thematic-features', () => {
            if (map.current) map.current.getCanvas().style.cursor = '';
          });

          setIsLoading(false);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar mapa');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geospatial, theme, selectedLayer]);

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
