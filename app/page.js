'use client';

import { useState } from 'react';
import ThematicMapRenderer from '@/components/ThematicMapRenderer';
import ChoroplethRenderer from '@/components/ChoroplethRenderer';
import CityDropdown from '@/components/CityDropdown';
import KPIGrid from '@/components/KPIGrid';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const geojsonUrl = selectedCity
    ? `/data/${selectedCity.ibge_code}_geospatial.json`
    : `/data/5208707_geospatial.json`;

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
                onCitySelect={handleCitySelect}
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
        {/* KPI Grid */}
        <section className="mb-8">
          <KPIGrid city={selectedCity} />
        </section>

        {/* Thematic Maps Grid */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Socioeconomic Indicators & Infrastructure
          </h2>
          {selectedCity?.ibge_code === '3127388' ? (
            <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
              <ChoroplethRenderer
                cityCode={selectedCity.ibge_code}
                cityName={selectedCity.name}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-96">
                <ThematicMapRenderer
                  geojsonUrl={geojsonUrl}
                  theme="densidade"
                  cityName={selectedCity?.name || 'Brazil'}
                />
              </div>
              <div className="h-96">
                <ThematicMapRenderer
                  geojsonUrl={geojsonUrl}
                  theme="socioeconômico"
                  cityName={selectedCity?.name || 'Brazil'}
                />
              </div>
              <div className="h-96">
                <ThematicMapRenderer
                  geojsonUrl={geojsonUrl}
                  theme="empresas"
                  cityName={selectedCity?.name || 'Brazil'}
                />
              </div>
              <div className="h-96">
                <ThematicMapRenderer
                  geojsonUrl={geojsonUrl}
                  theme="telecom"
                  cityName={selectedCity?.name || 'Brazil'}
                />
              </div>
            </div>
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
