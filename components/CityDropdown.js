'use client';

import { useEffect, useState } from 'react';

export default function CityDropdown({ onCitySelect, selectedCity }) {
  const [cities, setCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch('/data/cities_generated.json');
        const data = await response.json();
        const cityList = data.cities || [];
        setCities(cityList);
        if (cityList.length > 0) {
          onCitySelect(cityList[0]);
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCities();
  }, [onCitySelect]);

  const filteredCities = cities.filter((city) =>
    `${city.name} ${city.state}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isLoading ? (
          'Loading cities...'
        ) : selectedCity ? (
          <span>
            {selectedCity.name}, {selectedCity.state}
          </span>
        ) : (
          'Select a city'
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-full">
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
          />
          <div className="max-h-64 overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city.ibge_code}
                  onClick={() => {
                    onCitySelect(city);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 focus:outline-none border-0"
                >
                  <div className="font-medium text-sm">
                    {city.name}, {city.state}
                  </div>
                  <div className="text-xs text-gray-500">
                    Pop: {city.population.toLocaleString()}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No cities found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
