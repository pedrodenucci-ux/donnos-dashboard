'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Escala sequencial alinhada ao slide IEZ 02 (azul-escuro → laranja)
const RAMP = ['#16384A', '#2E5A6B', '#7A6A5A', '#C9683F', '#FF6B35'];
const NO_DATA = '#d1d5db';
const POINT_COLORS = { empresa: '#1d4ed8', torre_celular: '#dc2626', saude: '#059669' };

export const THEMES = {
  densidade: {
    title: 'Densidade populacional',
    icon: '👥',
    property: 'population_density',
    format: (v) => `${Math.round(v).toLocaleString('pt-BR')} hab/km²`,
    points: [],
  },
  socioeconômico: {
    title: 'Índice socioeconômico (0–100)',
    icon: '📊',
    property: 'socioeconomic_index',
    format: (v) => v.toFixed(1),
    points: ['saude'],
  },
  empresas: {
    title: 'Empresas ativas (CNPJ)',
    icon: '🏢',
    property: 'enterprise_count',
    format: (v) => `${v} empresas`,
    points: ['empresa'],
  },
  telecom: {
    title: 'Infraestrutura telecom (ERBs)',
    icon: '📡',
    property: 'tower_count',
    format: (v) => `${v} ERBs`,
    points: ['torre_celular'],
  },
};

const fmtPct = (v) => (v == null ? 'n/d' : `${(v * 100).toFixed(1)}%`);
const fmtBRL = (v) => (v == null ? 'n/d' : `R$ ${Math.round(v).toLocaleString('pt-BR')}`);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function bbox(features) {
  const b = [180, 90, -180, -90];
  const walk = (c) => {
    if (typeof c[0] === 'number') {
      b[0] = Math.min(b[0], c[0]); b[1] = Math.min(b[1], c[1]);
      b[2] = Math.max(b[2], c[0]); b[3] = Math.max(b[3], c[1]);
    } else c.forEach(walk);
  };
  features.forEach((f) => walk(f.geometry.coordinates));
  return b;
}

// Quebras por quantis (5 classes). Com poucos valores distintos (ex.: 0, 1, 2 ERBs),
// cada valor vira uma classe. Devolve limites estritamente crescentes para o 'step'.
function breaks(values) {
  const v = values.filter((x) => x != null && Number.isFinite(x)).sort((a, b) => a - b);
  const uniq = [...new Set(v)];
  if (uniq.length <= 1) return [];
  if (uniq.length <= RAMP.length) return uniq.slice(1);
  const q = [0.2, 0.4, 0.6, 0.8].map((p) => v[Math.min(v.length - 1, Math.floor(p * v.length))]);
  return [...new Set(q)].filter((x) => x > v[0]);
}

function colorExpr(property, br) {
  const value = ['coalesce', ['to-number', ['get', property], -1], -1];
  // espalha as cores disponíveis pela quantidade de classes
  const pick = (i, n) => RAMP[Math.round((i * (RAMP.length - 1)) / Math.max(n - 1, 1))];
  const n = br.length + 1;
  const step = ['step', value, pick(0, n)];
  br.forEach((b, i) => step.push(b, pick(i + 1, n)));
  return ['case', ['<', value, 0], NO_DATA, br.length ? step : RAMP[RAMP.length - 1]];
}

export default function ChoroplethMap({ polygonsUrl, pointsUrl, theme }) {
  const container = useRef(null);
  const map = useRef(null);
  const [legend, setLegend] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const cfg = THEMES[theme];

  useEffect(() => {
    if (!container.current) return undefined;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [polys, pts] = await Promise.all([
          fetch(polygonsUrl).then((r) => { if (!r.ok) throw new Error(`Falha ao carregar ${polygonsUrl}`); return r.json(); }),
          cfg.points.length ? fetch(pointsUrl).then((r) => (r.ok ? r.json() : null)) : Promise.resolve(null),
        ]);
        if (cancelled) return;

        const values = polys.features.map((f) => f.properties[cfg.property]);
        const color = colorExpr(cfg.property, breaks(values));
        const min = Math.min(...values.filter((x) => x != null));
        const max = Math.max(...values.filter((x) => x != null));
        setLegend({ min, max });

        // abre enquadrado na área urbana (a zona rural fica visível ao afastar o zoom)
        const urban = polys.features.filter((f) => f.properties.urbano === true);
        const b = bbox(urban.length ? urban : polys.features);
        map.current = new maplibregl.Map({
          container: container.current,
          style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
          bounds: [[b[0], b[1]], [b[2], b[3]]],
          fitBoundsOptions: { padding: 20 },
        });
        map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

        map.current.on('load', () => {
          if (!map.current) return;
          map.current.addSource('polys', { type: 'geojson', data: polys });
          map.current.addLayer({
            id: 'polys-fill', type: 'fill', source: 'polys',
            paint: { 'fill-color': color, 'fill-opacity': 0.75 },
          });
          // limite oficial contínuo; limite estimado tracejado (dasharray não aceita expressão por feição)
          const isAprox = ['boolean', ['get', 'aproximado'], false];
          map.current.addLayer({
            id: 'polys-line', type: 'line', source: 'polys', filter: ['!', isAprox],
            paint: { 'line-color': '#0B1F2A', 'line-width': 1 },
          });
          map.current.addLayer({
            id: 'polys-line-aprox', type: 'line', source: 'polys', filter: isAprox,
            paint: { 'line-color': '#0B1F2A', 'line-width': 1, 'line-dasharray': [2, 2] },
          });

          if (pts) {
            const data = { type: 'FeatureCollection', features: pts.features.filter((f) => cfg.points.includes(f.properties.tipo_dados)) };
            map.current.addSource('pts', { type: 'geojson', data });
            map.current.addLayer({
              id: 'pts', type: 'circle', source: 'pts',
              paint: {
                'circle-radius': ['match', ['get', 'tipo_dados'], 'empresa', 3, 6],
                'circle-color': ['match', ['get', 'tipo_dados'], 'empresa', POINT_COLORS.empresa,
                  'torre_celular', POINT_COLORS.torre_celular, POINT_COLORS.saude],
                'circle-stroke-width': 1, 'circle-stroke-color': '#fff', 'circle-opacity': 0.9,
              },
            });
            map.current.on('click', 'pts', (e) => {
              const p = e.features[0].properties;
              new maplibregl.Popup({ closeButton: false })
                .setLngLat(e.lngLat)
                .setHTML(`<div style="font-size:12px"><strong>${esc(p.nome)}</strong><br/>${esc(p.detalhe)}</div>`)
                .addTo(map.current);
            });
          }

          map.current.on('click', 'polys-fill', (e) => {
            // clique num ponto abre o popup do ponto, não o do polígono
            if (pts && map.current.queryRenderedFeatures(e.point, { layers: ['pts'] }).length) return;
            const p = e.features[0].properties;
            const v = p[cfg.property];
            const aprox = p.aproximado === true || p.aproximado === 'true';
            new maplibregl.Popup({ maxWidth: '280px' })
              .setLngLat(e.lngLat)
              .setHTML(`<div style="font-size:12px;line-height:1.45">
                <strong style="font-size:13px">${esc(p.neighborhood_name)}</strong>
                ${aprox ? '<span style="margin-left:4px;padding:1px 5px;border-radius:4px;background:#fef3c7;color:#92400e;font-size:10px">limite estimado</span>' : ''}
                <div style="margin:4px 0 6px;font-size:14px"><b>${v == null ? 'sem dado' : esc(cfg.format(Number(v)))}</b></div>
                População${aprox ? ' (est.)' : ''}: ${Number(p.population).toLocaleString('pt-BR')}<br/>
                Renda média do responsável: ${fmtBRL(p.income_mean_brl)}<br/>
                Alfabetização 15+: ${fmtPct(p.literacy_rate)} · Esgoto em rede: ${fmtPct(p.sewer_network_rate)}<br/>
                Empresas: ${p.enterprise_count} · ERBs: ${p.tower_count} · Saúde: ${p.health_facility_count}
              </div>`)
              .addTo(map.current);
          });
          ['polys-fill', 'pts'].forEach((id) => {
            if (!map.current.getLayer(id)) return;
            map.current.on('mouseenter', id, () => { map.current.getCanvas().style.cursor = 'pointer'; });
            map.current.on('mouseleave', id, () => { map.current.getCanvas().style.cursor = ''; });
          });
          setLoading(false);
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar o mapa');
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (map.current) { map.current.remove(); map.current = null; }
    };
  }, [polygonsUrl, pointsUrl, theme, cfg]);

  return (
    <div className="w-full h-full relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex flex-col">
      <div className="bg-white/95 px-3 py-2 border-b border-gray-200 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm text-gray-900">{cfg.icon} {cfg.title}</h3>
        {legend && Number.isFinite(legend.min) && (
          <div className="flex items-center gap-1 text-[10px] text-gray-600">
            <span>{cfg.format(legend.min)}</span>
            <span className="flex">{RAMP.map((c) => <span key={c} style={{ background: c }} className="w-3 h-2.5" />)}</span>
            <span>{cfg.format(legend.max)}</span>
          </div>
        )}
      </div>
      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20 text-gray-600 text-sm">Carregando...</div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-20 text-red-600 text-xs p-2 text-center">{error}</div>
        )}
        {/* estilo inline: a classe .maplibregl-map força position: relative e zeraria a altura */}
        <div ref={container} style={{ position: 'absolute', inset: 0 }} />
      </div>
    </div>
  );
}
