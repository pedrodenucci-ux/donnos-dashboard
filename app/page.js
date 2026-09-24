'use client';

import { useEffect, useState } from 'react';
import ThematicMapRenderer from '@/components/ThematicMapRenderer';
import ChoroplethMap from '@/components/ChoroplethMap';
import CityDropdown from '@/components/CityDropdown';
import KPIGrid from '@/components/KPIGrid';

const THEME_KEYS = ['densidade', 'socioeconômico', 'empresas', 'telecom'];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [layer, setLayer] = useState('bairros');
  const [summary, setSummary] = useState(null);

  const real = Boolean(selectedCity?.has_real_data);
  const code = selectedCity?.ibge_code;

  useEffect(() => {
    setSummary(null);
    if (!real) return;
    fetch(`/data/${code}_summary.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [code, real]);

  const geojsonUrl = code ? `/data/${code}_geospatial.json` : `/data/5208707_geospatial.json`;
  const layerInfo = summary?.camadas?.[layer];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Donnos Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">
                IEZ Territorial Intelligence
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 max-w-sm">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Select City
              </label>
              <CityDropdown
                onCitySelect={setSelectedCity}
                selectedCity={selectedCity}
              />
            </div>
            {selectedCity && (
              <div className="text-sm">
                <span className="font-semibold text-gray-900">
                  {selectedCity.name}, {selectedCity.state}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {selectedCity?.demo && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Dados de demonstração.</strong> Os pontos e indicadores desta cidade são sintéticos
            (não vêm de fonte oficial) e não devem ser apresentados a clientes.
          </div>
        )}

        {/* KPI Grid */}
        <section className="mb-8">
          <KPIGrid city={selectedCity} summary={summary} />
        </section>

        {/* Thematic Maps Grid */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Socioeconomic Indicators & Infrastructure
            </h2>
            {real && (
              <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5 text-sm">
                {[['bairros', 'Bairros (aproximados)'], ['setores', 'Setores IBGE (oficial)']].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setLayer(k)}
                    className={`px-3 py-1.5 rounded-md ${layer === k ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {real && layerInfo && (
            <p className="text-xs text-gray-500 mb-3">
              {layerInfo.nota}
              {layer === 'bairros' && layerInfo.concordancia_cnpj != null &&
                ` Validação: ${Math.round(layerInfo.concordancia_cnpj * 100)}% das empresas caem no bairro que declaram à Receita.`}
              {' '}Limites tracejados = estimados.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEME_KEYS.map((theme) => (
              <div key={theme} className="h-96">
                {!selectedCity ? (
                  <div className="w-full h-full rounded-lg border border-gray-200 bg-gray-100" />
                ) : real ? (
                  <ChoroplethMap
                    polygonsUrl={`/data/${code}_${layer}.geojson`}
                    pointsUrl={`/data/${code}_pontos.geojson`}
                    theme={theme}
                  />
                ) : (
                  <ThematicMapRenderer
                    geojsonUrl={geojsonUrl}
                    theme={theme}
                    cityName={selectedCity?.name || 'Brazil'}
                  />
                )}
              </div>
            ))}
          </div>

          {real && summary && (
            <p className="text-xs text-gray-500 mt-3">
              <strong>Índice socioeconômico:</strong> {summary.indice_socioeconomico}.
              {' '}<strong>Fontes:</strong> {summary.fontes.join(' · ')}.
            </p>
          )}
        </section>

        {/* Data Tables */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Market Intelligence
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500 text-center py-8">
              {selectedCity
                ? `Market data for ${selectedCity.name} coming soon...`
                : 'Select a city to view market intelligence data'}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-gray-500 text-sm text-center">
            Donnos Dashboard © 2026 — IEZ Territorial Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
