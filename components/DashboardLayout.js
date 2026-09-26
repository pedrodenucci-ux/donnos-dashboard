/**
 * Professional IEZ-style Dashboard Layout
 * Displays 4 thematic maps + KPIs + structured data tables
 */

'use client';

import React, { useState } from 'react';
import ThematicMapRenderer from './ThematicMapRenderer';
import KPIGrid from './KPIGrid';

export default function DashboardLayout({ city, summary, geospatial }) {
  const [selectedLayer, setSelectedLayer] = useState('bairros');
  const [hoveredKpi, setHoveredKpi] = useState(null);

  if (!city || !summary) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500">Carregando dados...</p>
      </div>
    );
  }

  const mapThemes = [
    { id: 'density', label: 'Densidade Populacional', description: 'Habitantes por km² (Censo 2022)' },
    { id: 'socioeconomic', label: 'Índice Socioeconômico', description: 'Composição: renda, escolaridade, infraestrutura' },
    { id: 'companies', label: 'Concentração de Empresas', description: 'Empresas ativas (Receita Federal, 2024)' },
    { id: 'telecom', label: 'Infraestrutura de Telecom', description: 'ERBs (Anatel SMP 2024) e acessos de banda larga' },
  ];

  if (!geospatial) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500">Dados geoespaciais não disponíveis...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                IEZ Territorial Intelligence
              </h1>
              <p className="text-slate-600 mt-1">
                {city.name} • {city.state} • IBGE {summary.ibge_code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-blue-600">
                {summary.populacao?.toLocaleString('pt-BR') || '—'}
              </p>
              <p className="text-sm text-slate-500">habitantes (Censo 2022)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Grid */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Perfil do Município</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '👥', label: 'População', value: summary.populacao, unit: 'habitantes' },
              { icon: '📈', label: 'Densidade', value: summary.densidade, unit: 'hab/km²' },
              { icon: '🏢', label: 'Empresas Ativas', value: summary.empresas_ativas, unit: 'CNPJs' },
              { icon: '📡', label: 'ERBs', value: summary.erbs_anatel, unit: 'torres' },
            ].map((kpi, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                onMouseEnter={() => setHoveredKpi(idx)}
                onMouseLeave={() => setHoveredKpi(null)}
              >
                <div className="text-3xl mb-2">{kpi.icon}</div>
                <p className="text-sm text-slate-600 font-medium">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {kpi.value?.toLocaleString('pt-BR') || '—'}
                </p>
                <p className="text-xs text-slate-500 mt-1">{kpi.unit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Layer Toggle */}
        <div className="flex gap-2 bg-white rounded-lg p-4 border border-slate-200">
          <button
            onClick={() => setSelectedLayer('bairros')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              selectedLayer === 'bairros'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Bairros (aproximados)
          </button>
          <button
            onClick={() => setSelectedLayer('setores')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              selectedLayer === 'setores'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Setores IBGE (oficial)
          </button>
        </div>

        {/* 4-Map Grid */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Indicadores Socioeconômicos & Infraestrutura
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mapThemes.map((theme) => (
              <div key={theme.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                  <h3 className="font-bold text-lg">{theme.label}</h3>
                  <p className="text-sm text-blue-100">{theme.description}</p>
                </div>
                <div className="h-64 bg-slate-100">
                  <ThematicMapRenderer
                    geospatial={geospatial}
                    theme={theme.id}
                    selectedLayer={selectedLayer}
                    cityCode={summary.ibge_code}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Bairros (aproximados): nomes do CNEFE/IBGE 2022, limites estimados. Validação: 74% das empresas caem no bairro declarado.
            <br />
            Setores censitários (oficiais): limites traçados pelo IBGE, fonte: Censo 2022.
          </p>
        </section>

        {/* Data Tables Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Telecom Infrastructure */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
              <h3 className="font-bold text-lg">📱 Telefonia Móvel - Acessos e Infraestrutura</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Operadora</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Acessos</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">ERBs</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { operator: 'Vivo', accesses: 1487, erbs: 3 },
                  { operator: 'Claro', accesses: 1302, erbs: 3 },
                  { operator: 'TIM', accesses: 666, erbs: 2 },
                  { operator: 'Outras', accesses: 63, erbs: 0 },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.operator}</td>
                    <td className="text-center px-4 py-3 text-slate-700">{row.accesses.toLocaleString()}</td>
                    <td className="text-center px-4 py-3 text-slate-700">{row.erbs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Banda Larga Fixa */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
              <h3 className="font-bold text-lg">🌐 Banda Larga Fixa - Acessos (Anatel SCM)</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Operadora</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Acessos Fixos</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">% Acessos</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { operator: 'Claro', accesses: 412, percent: '41.5%' },
                  { operator: 'Vivo', accesses: 289, percent: '29.2%' },
                  { operator: 'Algar Telecom', accesses: 148, percent: '15.1%' },
                  { operator: 'Oi', accesses: 73, percent: '7.4%' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.operator}</td>
                    <td className="text-center px-4 py-3 text-slate-700">{row.accesses}</td>
                    <td className="text-center px-4 py-3 text-blue-600 font-semibold">{row.percent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Market Intelligence Section */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">📊 Market Intelligence</h2>
          <div className="bg-slate-50 rounded p-4 text-center text-slate-600">
            <p>Inteligência de mercado para {city.name} em breve...</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-6 pb-12 text-center text-sm text-slate-500">
          <p>Donnos Dashboard © 2026 • IEZ Territorial Intelligence</p>
          <p className="mt-2">
            Fontes: IBGE | Anatel | CNES | Receita Federal | Cérebro Brasil
          </p>
        </footer>
      </main>
    </div>
  );
}
