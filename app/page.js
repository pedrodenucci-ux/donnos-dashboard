'use client';

import { useState } from 'react';
import MapRenderer from '@/components/MapRenderer';
import CityDropdown from '@/components/CityDropdown';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const geojsonUrl = selectedCity
    ? `/data/${selectedCity.ibge_code}_geospatial.json`
    : `/data/5208707_geospatial.json`;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Donnos Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">
                IEZ Territorial Intelligence
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Select City
              </label>
              <CityDropdown
                onCitySelect={handleCitySelect}
                selectedCity={selectedCity}
              />
            </div>
            {selectedCity && (
              <div className="text-sm text-gray-300">
                <span className="font-medium">
                  {selectedCity.name}, {selectedCity.state}
                </span>
                <span className="ml-2 text-gray-400">
                  ({selectedCity.population.toLocaleString()} inhabitants)
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <MapRenderer
          geojsonUrl={geojsonUrl}
          cityName={selectedCity?.name || 'Brazil'}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-sm py-3 px-4 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <p>
            {selectedCity ? (
              <>
                <strong>{selectedCity.name}, {selectedCity.state}</strong> •{' '}
                {selectedCity.population.toLocaleString()} inhabitants • Last
                updated: {new Date().toLocaleDateString('pt-BR')}
              </>
            ) : (
              'Select a city to view territorial intelligence data'
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
