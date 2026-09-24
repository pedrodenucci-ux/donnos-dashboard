'use client';

export default function KPIGrid({ city }) {
  if (!city) {
    return (
      <div className="text-gray-400 text-center py-8">
        Select a city to view metrics
      </div>
    );
  }

  const kpis = [
    { label: 'População', value: city.population.toLocaleString('pt-BR'), icon: '👥' },
    { label: 'Empresas', value: '342', icon: '🏢' },
    { label: 'Torres Telecom', value: '8', icon: '📡' },
    { label: 'Pontos de Saúde', value: '12', icon: '🏥' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
              <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
            </div>
            <span className="text-2xl">{kpi.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
