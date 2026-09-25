'use client';

import { useEffect, useState } from 'react';
import CityDropdown from '@/components/CityDropdown';
import DashboardLayout from '@/components/DashboardLayout';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [summary, setSummary] = useState(null);
  const [geospatial, setGeospatial] = useState(null);
  const [loading, setLoading] = useState(false);

  const code = selectedCity?.ibge_code;

  // Load summary and geospatial data when city changes
  useEffect(() => {
    setSummary(null);
    setGeospatial(null);
    if (!code) return;

    setLoading(true);
    Promise.all([
      fetch(`/data/${code}_summary.json`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/data/${code}_geospatial.json`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([summary, geo]) => {
        setSummary(summary);
        setGeospatial(geo);
      })
      .catch(() => {
        setSummary(null);
        setGeospatial(null);
      })
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sticky Header with City Selector */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Donnos Dashboard</h1>
              <p className="text-sm text-slate-600">IEZ Territorial Intelligence</p>
            </div>
            <div className="flex-1 max-w-xs">
              <CityDropdown
                onCitySelect={setSelectedCity}
                selectedCity={selectedCity}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {!selectedCity ? (
        <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-lg text-slate-600 mb-2">Selecione uma cidade acima</p>
            <p className="text-sm text-slate-500">para visualizar dados territoriais</p>
          </div>
        </main>
      ) : loading ? (
        <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600">Carregando dados...</p>
          </div>
        </main>
      ) : (
        <DashboardLayout city={selectedCity} summary={summary} geospatial={geospatial} />
      )}
    </div>
  );
}
