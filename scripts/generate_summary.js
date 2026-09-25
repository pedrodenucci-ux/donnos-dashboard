/**
 * Generate *_summary.json templates from existing *_geospatial.json files
 * Counts feature types and creates placeholder KPI structures
 */

const fs = require('fs');
const path = require('path');

const CITIES = [
  { code: '3106200', name: 'Belo Horizonte', state: 'MG' },
  { code: '3550308', name: 'São Paulo', state: 'SP' },
  { code: '5201405', name: 'Anápolis', state: 'GO' },
  { code: '5208707', name: 'Goiânia', state: 'GO' },
];

function generateSummary(city) {
  const dataDir = path.join(__dirname, '../public/data');
  const geoFile = path.join(dataDir, `${city.code}_geospatial.json`);
  
  if (!fs.existsSync(geoFile)) {
    console.log(`⚠️  ${city.name}: ${geoFile} not found`);
    return;
  }

  let geo;
  try {
    geo = JSON.parse(fs.readFileSync(geoFile, 'utf8'));
  } catch (e) {
    console.error(`❌ ${city.name}: failed to parse geospatial JSON`, e.message);
    return;
  }

  // Count features by type
  const features = Array.isArray(geo) ? geo : (geo.features || []);
  const counts = {
    empresa: 0,
    saude: 0,
    torre_celular: 0,
    total: features.length,
  };

  features.forEach(f => {
    const props = f.properties || {};
    const tipo = props.tipo_dados || props.tipo || 'unknown';
    if (counts.hasOwnProperty(tipo)) counts[tipo]++;
  });

  // Generate summary structure
  const summary = {
    ibge_code: city.code,
    nome: city.name,
    estado: city.state,
    
    // Placeholder metrics — replace with real data from Cérebro Brasil
    populacao: null,  // TODO: IBGE Census data
    densidade: null,  // TODO: population / area_km²
    indice_socioeconomico: null,  // TODO: Cérebro Brasil index
    
    // Derived from geospatial.json
    empresas_ativas: counts.empresa,
    estabelecimentos_cnes: counts.saude,
    erbs_anatel: counts.torre_celular,
    total_features: counts.total,
    
    fontes: [
      'IBGE',
      'Anatel',
      'CNES',
      'Cérebro Brasil (pending)',
    ],
    
    camadas: {
      bairros: {
        label: 'Bairros / Distritos',
        arquivo: `${city.code}_bairros.geojson`,
        status: 'pending',  // pending | ready
      },
      setores: {
        label: 'Setores Censitários (IBGE)',
        arquivo: `${city.code}_setores.geojson`,
        status: 'pending',
      },
    },
  };

  const outFile = path.join(dataDir, `${city.code}_summary.json`);
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2));
  console.log(`✅ ${city.name}: ${path.basename(outFile)} generated`);
}

CITIES.forEach(generateSummary);
