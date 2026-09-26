'use client';

import React, { useState } from 'react';
import ThematicMapRenderer from './ThematicMapRenderer';

export default function DashboardLayout({ city, summary, geospatial }) {
  const [selectedLayer, setSelectedLayer] = useState('bairros');

  if (!city || !summary || !geospatial) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500">Carregando dados...</p>
      </div>
    );
  }

  const mapThemes = [
    { id: 'density', title: '1. DENSIDADE POPULACIONAL', subtitle: 'Habitantes por km² (Censo 2022 – Setor Censitário)' },
    { id: 'socioeconomic', title: '2. ÍNDICE SOCIOECONÔMICO (ISE)', subtitle: 'Composto de: renda, escolaridade, domicílios e infraestrutura (Censo 2022 – Setor Censitário)' },
    { id: 'companies', title: '3. CONCENTRAÇÃO DE EMPRESAS', subtitle: 'Empresas ativas (Receita Federal, 2024)' },
    { id: 'telecom', title: '4. INFRAESTRUTURA DE TELECOM', subtitle: 'ERBs (Anatel SMP, 2024) e acessos de banda larga fixa (Anatel SCM, 2024)' },
  ];

  const telecomTotal = summary.telecom?.operadores?.reduce((a, b) => a + b.acessos_moveis, 0) || 0;
  const bandaLargaTotal = summary.telecom?.banda_larga?.reduce((a, b) => a + b.acessos_fixos, 0) || 0;

  return (
    <div className="w-full bg-white">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-5xl font-bold tracking-tight">{city.name.toUpperCase()} ({city.state.toUpperCase()})</h1>
              <h2 className="text-2xl font-semibold text-blue-300 mt-3">INDICADORES SOCIOECONÔMICOS E INFRAESTRUTURA</h2>
              <p className="text-sm text-gray-300 mt-3 font-medium">POPULAÇÃO • RENDA • EMPRESAS • TELECOM • OPORTUNIDADES</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-5 w-56 text-center flex-shrink-0">
              <p className="text-blue-300 font-bold text-sm">DADOS QUE REVELAM</p>
              <p className="text-white font-bold text-base mt-2">OPORTUNIDADES.</p>
              <p className="text-gray-300 text-xs mt-3">INTELIGÊNCIA QUE GERA AÇÃO.</p>
            </div>
          </div>

          {/* Layer Toggle */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setSelectedLayer('bairros')}
              className={`px-5 py-2.5 rounded font-semibold text-sm transition-all ${
                selectedLayer === 'bairros'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
              }`}
            >
              Bairros (aproximados)
            </button>
            <button
              onClick={() => setSelectedLayer('setores')}
              className={`px-5 py-2.5 rounded font-semibold text-sm transition-all ${
                selectedLayer === 'setores'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
              }`}
            >
              Setores (oficial)
            </button>
          </div>
        </div>
      </div>

      {/* MAPS SECTION - 2x2 GRID */}
      <div className="bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mapThemes.map((theme) => (
              <div key={theme.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
                  <h3 className="font-bold text-base">{theme.title}</h3>
                  <p className="text-xs text-gray-300 mt-1.5">{theme.subtitle}</p>
                </div>
                <div className="h-72 bg-gray-100 flex items-center justify-center">
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
        </div>
      </div>

      {/* PROFILE SECTION */}
      <div className="bg-white px-6 py-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">PERFIL DO MUNICÍPIO</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Population */}
            <div className="border-l-4 border-blue-600 pl-4">
              <div className="text-3xl font-bold text-slate-900">
                {summary.populacao?.toLocaleString('pt-BR') || '—'}
              </div>
              <p className="text-sm text-slate-600 mt-1">habitantes (2022)</p>
              {summary.densidade && <p className="text-xs text-slate-500 mt-2">{summary.densidade.toFixed(1)} hab/km²</p>}
            </div>

            {/* Enterprises */}
            <div className="border-l-4 border-amber-600 pl-4">
              <div className="text-3xl font-bold text-slate-900">
                {summary.empresas_ativas?.toLocaleString('pt-BR') || '—'}
              </div>
              <p className="text-sm text-slate-600 mt-1">empresas ativas (2024)</p>
              <p className="text-xs text-slate-500 mt-2">Receita Federal</p>
            </div>

            {/* Health */}
            <div className="border-l-4 border-red-600 pl-4">
              <div className="text-3xl font-bold text-slate-900">
                {summary.estabelecimentos_cnes || '—'}
              </div>
              <p className="text-sm text-slate-600 mt-1">estabelecimentos de saúde</p>
              <p className="text-xs text-slate-500 mt-2">CNES/MS</p>
            </div>

            {/* ERBs */}
            <div className="border-l-4 border-purple-600 pl-4">
              <div className="text-3xl font-bold text-slate-900">
                {summary.erbs_anatel || '—'}
              </div>
              <p className="text-sm text-slate-600 mt-1">ERBs (SMP)</p>
              <p className="text-xs text-slate-500 mt-2">estações de telefonia</p>
            </div>

            {/* 4G */}
            <div className="border-l-4 border-indigo-600 pl-4">
              <div className="text-3xl font-bold text-slate-900">
                4G
              </div>
              <p className="text-sm text-slate-600 mt-1">presente</p>
              <p className="text-xs text-slate-500 mt-2">área urbana</p>
            </div>

            {/* 5G */}
            <div className="border-l-4 border-rose-600 pl-4">
              <div className="text-3xl font-bold text-slate-900">
                5G
              </div>
              <p className="text-sm text-slate-600 mt-1">não identificado</p>
              <p className="text-xs text-slate-500 mt-2">Anatel (2024)</p>
            </div>
          </div>
        </div>
      </div>

      {/* DATA TABLES SECTION */}
      <div className="bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Telefonia Móvel */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
                <h3 className="font-bold text-sm">TELEFONIA MÓVEL – ACESSOS E INFRAESTRUTURA (ANATEL SMP)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700 text-xs">Operadora</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-700 text-xs">Acessos móveis</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-700 text-xs">% Acessos</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-700 text-xs">ERBs</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-700 text-xs">% ERBs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.telecom?.operadores?.map((op, idx) => {
                      const pctAccess = (op.acessos_moveis / telecomTotal * 100).toFixed(1);
                      const totalErbs = summary.telecom?.operadores?.reduce((a, b) => a + (b.erbs || 0), 0) || 1;
                      const pctErbs = ((op.erbs || 0) / totalErbs * 100).toFixed(1);
                      return (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{op.name}</td>
                          <td className="text-center px-4 py-3 text-slate-700">{op.acessos_moveis?.toLocaleString()}</td>
                          <td className="text-center px-4 py-3">
                            <div className="w-16 h-4 bg-gradient-to-r from-purple-200 to-purple-500 rounded mx-auto" style={{width: `${pctAccess}%`}}></div>
                            <span className="text-slate-700 text-xs font-semibold">{pctAccess}%</span>
                          </td>
                          <td className="text-center px-4 py-3 text-slate-700">{op.erbs || '0'}</td>
                          <td className="text-center px-4 py-3 text-slate-700 font-semibold">{pctErbs}%</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-3 text-slate-900">Total</td>
                      <td className="text-center px-4 py-3 text-slate-900">{telecomTotal.toLocaleString()}</td>
                      <td className="text-center px-4 py-3 text-slate-900">100%</td>
                      <td className="text-center px-4 py-3 text-slate-900">
                        {summary.telecom?.operadores?.reduce((a, b) => a + (b.erbs || 0), 0) || '—'}
                      </td>
                      <td className="text-center px-4 py-3 text-slate-900">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Banda Larga Fixa */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
                <h3 className="font-bold text-sm">BANDA LARGA FIXA – ACESSOS (ANATEL SCM)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700 text-xs">Operadora</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-700 text-xs">Acessos fixos</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-700 text-xs">% Acessos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.telecom?.banda_larga?.map((op, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{op.name}</td>
                        <td className="text-center px-4 py-3 text-slate-700">{op.acessos_fixos?.toLocaleString()}</td>
                        <td className="text-center px-4 py-3">
                          <div className="w-16 h-4 bg-gradient-to-r from-orange-200 to-orange-500 rounded mx-auto" style={{width: `${op.percent}%`}}></div>
                          <span className="text-orange-600 font-semibold text-xs">{op.percent}%</span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-3 text-slate-900">Total</td>
                      <td className="text-center px-4 py-3 text-slate-900">{bandaLargaTotal.toLocaleString()}</td>
                      <td className="text-center px-4 py-3 text-slate-900">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK METRICS */}
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-slate-900">{telecomTotal.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-slate-600 mt-1">acessos móveis</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-slate-900">{summary.erbs_anatel || '—'}</p>
              <p className="text-xs text-slate-600 mt-1">ERBs (SMP)</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-slate-900">4G</p>
              <p className="text-xs text-slate-600 mt-1">presente</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-slate-900">5G</p>
              <p className="text-xs text-slate-600 mt-1">não identificado</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-slate-900">{bandaLargaTotal.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-slate-600 mt-1">acessos fixos</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-slate-900">{summary.telecom?.banda_larga?.length || '—'}</p>
              <p className="text-xs text-slate-600 mt-1">operadoras (SCM)</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-lg font-bold">{city.name.toUpperCase()} ({city.state.toUpperCase()})</h3>
              <p className="text-xs text-gray-400 mt-2">TERRITÓRIO • PESSOAS • MERCADO • OPORTUNIDADES</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-3">Fontes: IBGE (Censo 2022) | Receita Federal (CNPJs, 2024) | CAGED (2024) | CNES (2024) | Anatel SMP (2024) | Anatel SCM (2024)</p>
              <p className="text-sm font-bold text-blue-400">DO DADO À AÇÃO.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
