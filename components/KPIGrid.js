'use client';

export default function KPIGrid({ city, summary }) {
  if (!city) {
    return (
      <div className="text-gray-400 text-center py-8">
        Select a city to view metrics
      </div>
    );
  }

  const k = summary?.kpis;
  const fmt = (v) => (v == null ? '—' : v.toLocaleString('pt-BR'));
  const kpis = [
    { label: k ? 'População (Censo 2022)' : 'População', value: fmt(k?.populacao ?? city.population), icon: '👥' },
    {
      label: 'Empresas ativas (CNPJ)',
      value: fmt(k?.empresas_ativas),
      sub: k ? `${fmt(k.empresas_no_mapa)} localizadas no mapa` : null,
      icon: '🏢',
    },
    { label: 'ERBs (Anatel)', value: fmt(k?.erbs), icon: '📡' },
    { label: 'Estabelecimentos de saúde (CNES)', value: fmt(k?.saude), icon: '🏥' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
              <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
              {kpi.sub && <p className="text-[11px] text-gray-500 mt-0.5">{kpi.sub}</p>}
            </div>
            <span className="text-2xl">{kpi.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
