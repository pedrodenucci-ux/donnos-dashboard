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
      property: 'population_density',
      colorStops: [
        [0, '#fffcf0'],
        [25, '#fee5c3'],
        [100, '#fdbf6f'],
        [250, '#fe9929'],
        [500, '#d94701'],
        [1000, '#8c2d04']
      ],
      unit: 'hab/km²'
    },
    socioeconomic: {
      label: 'Índice Socioeconômico',
      property: 'socioeconomic_index',
      colorStops: [
        [0, '#e41a1c'],
        [20, '#fd8d3c'],
        [40, '#ffffbf'],
        [60, '#a1d99b'],
        [80, '#31a354'],
        [100, '#006837']
      ],
      unit: 'ISE'
    },
    companies: {
      label: 'Concentração de Empresas',
      property: 'enterprise_count',
      colorStops: [
        [0, '#f7fbff'],
        [10, '#deebf7'],
        [50, '#9ecae1'],
        [100, '#3182bd'],
        [200, '#08519c'],
        [500, '#08306b']
      ],
      unit: 'empresas'
    },
    telecom: {
      label: 'Infraestrutura de Telecom',
      property: 'tower_count',
      colorStops: [
        [0, '#ffffcc'],
        [1, '#ffeda0'],
        [2, '#fed976'],
        [3, '#feb24c'],
        [4, '#fd8d3c'],
        [5, '#fc4e2a'],
        [10, '#e31a1c'],
        [20, '#bd0026']
      ],
      unit: 'ERBs'
    }
  };

  const config = themeConfig[theme] || themeConfig.density;

  useEffect(() => {
    if (!mapContainer.current || !geospatial) {
      return;
    }

    const layerData = geospatial[selectedLayer];
    if (!layerData || !layerData.features) {
      setError(`Dados não disponíveis para ${selectedLayer}`);
      setIsLoading(false);
      return;
    }

    const initializeMap = () => {
      try {
        setIsLoading(true);
        setError(null);

        let bounds = [180, 90, -180, -90];
        layerData.features.forEach((feature) => {
          if (feature.geometry?.type === 'Polygon') {
            const coords = feature.geometry.coordinates[0];
            coords.forEach(([lng, lat]) => {
              bounds[0] = Math.min(bounds[0], lng);
              bounds[1] = Math.min(bounds[1], lat);
              bounds[2] = Math.max(bounds[2], lng);
              bounds[3] = Math.max(bounds[3], lat);
            });
          }
        });

        const center = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];
        const zoom = 12;

        if (map.current) {
          map.current.remove();
          map.current = null;
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

          try {
            map.current.addSource('choropleth-data', {
              type: 'geojson',
              data: layerData,
            });

            const colorExpression = [
              'interpolate',
              ['linear'],
              ['get', config.property],
              ...config.colorStops.flatMap(([value, color]) => [value, color])
            ];

            map.current.addLayer({
              id: 'choropleth-fill',
              type: 'fill',
              source: 'choropleth-data',
              paint: {
                'fill-color': colorExpression,
                'fill-opacity': 0.8,
              },
            });

            map.current.addLayer({
              id: 'choropleth-outline',
              type: 'line',
              source: 'choropleth-data',
              paint: {
                'line-color': '#fff',
                'line-width': 1.5,
                'line-opacity': 0.6,
              },
            });

            map.current.on('mousemove', 'choropleth-fill', (e) => {
              map.current.getCanvas().style.cursor = 'pointer';
            });

            map.current.on('mouseleave', 'choropleth-fill', () => {
              map.current.getCanvas().style.cursor = '';
            });

            setIsLoading(false);
          } catch (e) {
            console.error('Error adding choropleth layer:', e);
            setError(e instanceof Error ? e.message : 'Erro ao adicionar camada');
            setIsLoading(false);
          }
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setError('Erro ao carregar mapa');
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Map initialization error:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar mapa');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [geospatial, theme, selectedLayer]);

  return (
    <div className="w-full h-full relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapContainer} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <div className="text-gray-600 text-sm">Carregando mapa...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-20">
          <div className="text-red-600 text-center text-xs p-2">
            <p>Erro ao carregar mapa</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
