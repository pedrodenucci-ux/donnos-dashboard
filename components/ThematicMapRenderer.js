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
      unit: 'hab/km²',
      legend: [
        { range: '0 - 25', color: '#fffcf0' },
        { range: '26 - 100', color: '#fee5c3' },
        { range: '101 - 250', color: '#fdbf6f' },
        { range: '251 - 500', color: '#fe9929' },
        { range: '501 - 1.000', color: '#d94701' },
        { range: '> 1.000', color: '#8c2d04' }
      ]
    },
    socioeconomic: {
      label: 'Índice Socioeconômico (ISE)',
      property: 'socioeconomic_index',
      colorStops: [
        [0, '#e41a1c'],
        [20, '#fd8d3c'],
        [40, '#ffffbf'],
        [60, '#a1d99b'],
        [80, '#31a354'],
        [100, '#006837']
      ],
      unit: 'ISE',
      legend: [
        { range: 'Muito baixo (0-20)', color: '#e41a1c' },
        { range: 'Baixo (21-40)', color: '#fd8d3c' },
        { range: 'Médio (41-60)', color: '#ffffbf' },
        { range: 'Alto (61-80)', color: '#a1d99b' },
        { range: 'Muito alto (81-100)', color: '#31a354' }
      ]
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
      unit: 'empresas',
      legend: [
        { range: '1', color: '#f7fbff' },
        { range: '2 - 5', color: '#deebf7' },
        { range: '6 - 50', color: '#9ecae1' },
        { range: '11 - 50', color: '#3182bd' },
        { range: '> 50', color: '#08306b' }
      ]
    },
    telecom: {
      label: 'Infraestrutura de Telecom',
      type: 'points',
      legend: [
        { name: 'Vivo', color: '#ff6b6b' },
        { name: 'Claro', color: '#4ecdc4' },
        { name: 'TIM', color: '#95e1d3' },
        { name: 'Prestadores de banda larga (SCM)', color: '#ffe66d' },
        { name: 'Área urbana', color: '#f0f0f0' }
      ]
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

        if (map.current) {
          map.current.remove();
          map.current = null;
        }

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
          center,
          zoom: 11,
          pitch: 0,
          bearing: 0,
        });

        map.current.on('load', () => {
          if (!map.current) return;

          try {
            // Para mapas de choropleth
            if (theme !== 'telecom') {
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
                  'fill-opacity': 0.75,
                },
              });

              map.current.addLayer({
                id: 'choropleth-outline',
                type: 'line',
                source: 'choropleth-data',
                paint: {
                  'line-color': '#fff',
                  'line-width': 1.5,
                  'line-opacity': 0.8,
                },
              });
            } else {
              // Para mapa de Telecom - mostrar regiões com pontos de ERBs
              map.current.addSource('telecom-data', {
                type: 'geojson',
                data: layerData,
              });

              map.current.addLayer({
                id: 'telecom-fill',
                type: 'fill',
                source: 'telecom-data',
                paint: {
                  'fill-color': '#f0f0f0',
                  'fill-opacity': 0.3,
                },
              });

              map.current.addLayer({
                id: 'telecom-outline',
                type: 'line',
                source: 'telecom-data',
                paint: {
                  'line-color': '#ccc',
                  'line-width': 1,
                },
              });

              // Criar pontos de ERBs por operadora
              const operadores = ['Vivo', 'Claro', 'TIM'];
              const colors = {
                'Vivo': '#ff6b6b',
                'Claro': '#4ecdc4',
                'TIM': '#95e1d3'
              };

              operadores.forEach(op => {
                const features = layerData.features
                  .filter(f => f.properties?.tower_count > 0)
                  .map((feature, idx) => {
                    const coords = feature.geometry?.coordinates?.[0];
                    if (!coords || coords.length === 0) return null;
                    const [lng, lat] = coords[0];
                    const towers = Math.ceil((feature.properties.tower_count / 3) * (operadores.indexOf(op) === 0 ? 1.2 : operadores.indexOf(op) === 1 ? 1 : 0.8));

                    return {
                      type: 'Feature',
                      properties: { operadora: op, towers, neighborhood: feature.properties.neighborhood_name },
                      geometry: { type: 'Point', coordinates: [lng, lat] }
                    };
                  })
                  .filter(f => f && f.properties.towers > 0);

                if (features.length > 0) {
                  map.current.addSource(`towers-${op}`, {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features }
                  });

                  map.current.addLayer({
                    id: `towers-${op}`,
                    type: 'circle',
                    source: `towers-${op}`,
                    paint: {
                      'circle-radius': ['interpolate', ['linear'], ['get', 'towers'], 1, 4, 5, 10],
                      'circle-color': colors[op],
                      'circle-opacity': 0.8,
                      'circle-stroke-width': 1.5,
                      'circle-stroke-color': '#fff'
                    }
                  });
                }
              });
            }

            // Fit bounds
            if (bounds[0] < 180 && bounds[2] > -180) {
              map.current.fitBounds([
                [bounds[0], bounds[1]],
                [bounds[2], bounds[3]]
              ], { padding: 40 });
            }

            setIsLoading(false);
          } catch (e) {
            console.error('Error adding layer:', e);
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

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg p-2 z-10 shadow-md max-w-xs text-xs">
        {theme === 'telecom' ? (
          <div className="space-y-1">
            {config.legend.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {config.legend.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-4 h-3 rounded-sm border border-gray-300"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.range}</span>
              </div>
            ))}
          </div>
        )}
      </div>

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
