# Donnos Dashboard - Portfolio

## Resumo Executivo

O **Donnos Dashboard** é um aplicativo de inteligência territorial profissional desenvolvido em Next.js + React, integrado com Cloudflare Pages. O dashboard apresenta dados socioeconômicos, infraestrutura de telecom e informações de empresas de forma visual e interativa para múltiplos municípios brasileiros.

**Link ao vivo:** https://donnos-dashboard.pages.dev/

---

## 🎯 Funcionalidades Implementadas

### 1. **Seletor de Cidades Dinâmico**
- Dropdown com busca em tempo real
- Auto-seleção da primeira cidade ao carregar
- Suporte para múltiplas cidades (Goianá, Campinas, São Paulo, Belo Horizonte, Anápolis)
- Exibição de população por cidade

### 2. **Dashboard Profissional com Layout IEZ**
- Header sticky com logo e informações de cidade
- Grid responsivo (mobile, tablet, desktop)
- Paleta de cores corporativa com gradientes
- Cards com sombras e efeitos hover

### 3. **Cards de KPI (Key Performance Indicators)**
- **População** - Total de habitantes (Censo 2022)
- **Densidade** - Habitantes por km²
- **Empresas Ativas** - Contagem de CNPJs ativos (Receita Federal)
- **ERBs** - Torres de celular (Anatel SMP 2024)

Cada KPI inclui:
- Ícone visual representativo
- Valor formatado com separador de milhares
- Unidade de medida
- Efeito hover interativo

### 4. **Visualização de Dados Geoespaciais**
- **4 Mapas Temáticos Interativos:**
  1. **Densidade Populacional** - Distribuição de pontos de dados por densidade
  2. **Índice Socioeconômico** - Dados de saúde e indicadores sociais
  3. **Concentração de Empresas** - Localização de empresas ativas
  4. **Infraestrutura de Telecom** - Distribuição de ERBs e torres celulares

- **Tecnologia:** MapLibre GL (mapa vetorial de código aberto)
- **Estilos:** CartoDB Positron (mapa base neutro)
- **Interatividade:** 
  - Hover sobre pontos muda cursor
  - Zoom e pan automáticos baseados em bounds dos dados
  - Cores temáticas por tipo de dado

### 5. **Alternância de Camadas Geográficas**
- **Bairros (Aproximados)** - CNEFE/IBGE 2022, limites estimados
- **Setores (Oficial)** - Setores censitários oficiais IBGE 2022
- Botões com estado ativo/inativo
- Atualiza automaticamente visualização dos mapas

### 6. **Tabelas de Dados Estruturadas**

#### Telefonia Móvel - Acessos e Infraestrutura
| Operadora | Acessos | ERBs |
|-----------|---------|------|
| Vivo | 1.487 | 3 |
| Claro | 1.302 | 3 |
| TIM | 666 | 2 |
| Outras | 63 | 0 |

**Fonte:** Anatel SMP 2024

#### Banda Larga Fixa - Acessos (Anatel SCM)
| Operadora | Acessos Fixos | % Acessos |
|-----------|---------------|-----------|
| Claro | 412 | 41.5% |
| Vivo | 289 | 29.2% |
| Algar Telecom | 148 | 15.1% |
| Oi | 73 | 7.4% |

**Fonte:** Anatel SCM

### 7. **Seção de Market Intelligence**
- Placeholder para análise de mercado futura
- Espaço reservado para insights de negócio

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico
```
Frontend:
  ├─ Next.js 14.2 (React framework)
  ├─ React 18+ (UI components)
  ├─ Tailwind CSS (styling)
  ├─ MapLibre GL (maps)
  └─ Node.js 20 (build)

Backend/Deploy:
  ├─ Cloudflare Pages (hosting)
  ├─ GitHub Actions (CI/CD)
  └─ Wrangler CLI (deployment tool)

Data:
  ├─ JSON static files (GeoJSON, summary data)
  └─ Public folder served via Cloudflare
```

### Estrutura de Pastas
```
donnos-dashboard/
├── app/
│   └── page.js              # Root component com lógica de carregamento
├── components/
│   ├── CityDropdown.js      # Seletor de cidades
│   ├── DashboardLayout.js   # Layout principal
│   └── ThematicMapRenderer.js # Renderizador de mapas
├── public/
│   └── data/
│       ├── cities_generated.json     # Lista de cidades
│       ├── [code]_summary.json       # Dados de KPI
│       └── [code]_geospatial.json    # Dados geográficos
├── .github/workflows/
│   └── deploy.yml           # Pipeline de deployment
├── wrangler.toml            # Config Cloudflare Pages
└── next.config.js           # Config Next.js
```

---

## 📊 Estrutura de Dados

### Summary JSON (por cidade)
```json
{
  "ibge_code": "3550308",
  "nome": "São Paulo",
  "estado": "SP",
  "populacao": 11904961,
  "densidade": 7398.2,
  "empresas_ativas": 214,
  "erbs_anatel": 8,
  "telecom": {
    "operadores": [
      { "name": "Vivo", "acessos_moveis": 1487, "erbs": 3 },
      { "name": "Claro", "acessos_moveis": 1302, "erbs": 3 }
    ],
    "banda_larga": [
      { "name": "Claro", "acessos_fixos": 412, "percent": 41.5 }
    ]
  }
}
```

### Geospatial JSON (GeoJSON)
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-45.199614, -19.566175]
      },
      "properties": {
        "tipo_dados": "empresa",
        "municipio_codigo": "3550308"
      }
    }
  ]
}
```

---

## 🔧 Fluxo de Dados

```
Usuário seleciona cidade
    ↓
app/page.js dispara fetch dual:
  ├─ /data/[code]_summary.json
  └─ /data/[code]_geospatial.json
    ↓
Dados carregam em estado React (useState)
    ↓
DashboardLayout renderiza com os dados
    ↓
ThematicMapRenderer:
  ├─ Acessa geospatial[selectedLayer]
  ├─ Calcula bounds dos pontos
  ├─ Cria mapa MapLibre GL
  ├─ Adiciona camada de círculos
  └─ Renderiza com cores por tema
    ↓
Usuário alterna camada (bairros/setores)
    ├─ selectedLayer state muda
    └─ ThematicMapRenderer se recarrega
```

---

## 🚀 Pipeline de Deployment

### GitHub Actions Workflow
```yaml
Trigger: Push para branch main
    ↓
Setup: Node.js 20, npm dependencies
    ↓
Build: npm run build
    ├─ Next.js compila para /out (static export)
    ├─ Todos os .js/css/json são otimizados
    └─ /public/data/* é copiado para /out
    ↓
Deploy: Wrangler push para Cloudflare Pages
    ├─ Autentica com CLOUDFLARE_API_TOKEN
    ├─ Faz upload de /out para projeto
    └─ Invalidates cache automaticamente
    ↓
Live: https://donnos-dashboard.pages.dev/
```

### Secrets Configurados
- `CLOUDFLARE_API_TOKEN` - Token com permissão "Account → Cloudflare Pages → Edit"
- `WRANGLER_PROJECT_NAME` - donnos-dashboard

---

## 📱 Componentes React

### `app/page.js` - Root Component
**Responsabilidades:**
- Estado global: `selectedCity`, `summary`, `geospatial`, `loading`
- Fetch de dados em useEffect
- Lógica de seleção de cidade
- Loading e empty states

**Dados Carregados:**
- `/data/cities_generated.json` → dropdown
- `/data/{code}_summary.json` → KPIs
- `/data/{code}_geospatial.json` → mapas

### `components/CityDropdown.js`
**Props:**
- `onCitySelect(city)` - Callback ao selecionar
- `selectedCity` - Cidade atual

**Features:**
- Busca com filtro
- Auto-select primeira cidade
- Exibição de população
- Dropdown com scroll

### `components/DashboardLayout.js`
**Props:**
- `city` - Objeto com dados da cidade
- `summary` - Dados de KPI
- `geospatial` - Dados geoespaciais (object com bairros/setores)

**Seções:**
1. Header com info da cidade
2. KPI Grid (4 cards)
3. Layer toggle (Bairros/Setores)
4. Map Grid (2x2 maps)
5. Data tables (2 colunas)
6. Market Intelligence
7. Footer

### `components/ThematicMapRenderer.js`
**Props:**
- `geospatial` - Object { bairros: GeoJSON, setores: GeoJSON }
- `theme` - 'density' | 'socioeconomic' | 'companies' | 'telecom'
- `selectedLayer` - 'bairros' | 'setores'
- `cityCode` - Código IBGE (para referência)

**Lógica:**
- useEffect monitora mudanças de tema/camada
- Limpa e recria mapa a cada mudança
- Calcula bounds automáticos dos pontos
- Renderiza círculos com cores por tema
- Error boundary com mensagens amigáveis

---

## 🎨 Design System

### Paleta de Cores
```
Primary:
  ├─ Blue-600: #2563eb (botões, mapas densidade)
  ├─ Green-600: #16a34a (socioeconômico)
  ├─ Amber-600: #d97706 (empresas)
  └─ Red-600: #dc2626 (telecom)

Backgrounds:
  ├─ Slate-50: #f8fafc (light bg)
  ├─ Slate-100: #f1f5f9 (hover)
  └─ White: #ffffff (cards)

Text:
  ├─ Slate-900: #0f172a (primary text)
  └─ Slate-600: #475569 (secondary text)
```

### Tipografia
- **Headings:** Font-bold, 1.5-3xl
- **Body:** Regular, 14-16px
- **Labels:** Semibold, 12-13px
- **Data:** Monospace para números grandes

### Spacing
- Cards: p-4 (16px)
- Sections: mb-4, py-8 (32px)
- Grid gaps: gap-6 (24px)

### Efeitos
- Hover shadows: `hover:shadow-md`
- Rounded: `rounded-lg` (8px)
- Transitions: `transition-all`, `transition-shadow`
- Gradients: `from-blue-600 to-blue-700`

---

## 🐛 Debug & Logging

### Console Logs Adicionados
```javascript
// app/page.js
console.log('Loaded city data:', { 
  code, hasSummary, hasGeo, geoFeatures 
});

// ThematicMapRenderer.js
console.log('Missing container or geospatial data');
console.error('Map initialization error:', err);
```

### Tratamento de Erros
- Try/catch em fetch e map initialization
- Error states renderizados como UI
- Loading states para UX melhor
- Fallback para dados null

---

## 📈 Cidades Suportadas

| Código | Cidade | Estado | População | Status |
|--------|--------|--------|-----------|--------|
| 3127388 | Goianá | MG | 4.053 | ✅ Completo |
| 3106200 | Belo Horizonte | MG | 2.415.872 | ✅ Dados demo |
| 3509007 | Campinas | SP | 1.223.237 | ✅ Dados placeholder |
| 3550308 | São Paulo | SP | 11.904.961 | ✅ Dados demo |
| 5201405 | Anápolis/Aparecida | GO | 556.021 | ✅ Dados demo |

---

## 🔄 Fluxo de Trabalho Git

### Branches
- `main` - Produção (auto-deploy via Cloudflare Pages)
- `claude/dashboard-redesign-iez` - Desenvolvimento de redesign
- `claude/github-cloudflare-integration-3qajvw` - Integração original

### Commits Principais
```
791c9ee - Merge: integrate dashboard redesign improvements to main
78e390b - refactor: improve map rendering with better error handling
407a311 - feat: populate summary data with telecom operator information
c8818ad - fix: add geospatial data files and update summary structure
c4a36af - fix: refactor map rendering and data structure for dashboard
8b6887f - feat: redesign dashboard to professional IEZ layout
```

---

## ✅ Checklist de Funcionalidades

- [x] Seletor de cidades com dropdown
- [x] KPIs com 4 métricas principais
- [x] 4 mapas temáticos interativos
- [x] Alternância de camadas geográficas
- [x] Tabela de operadores de telecom
- [x] Tabela de banda larga fixa
- [x] Layout responsivo (mobile/tablet/desktop)
- [x] Header sticky com informações
- [x] Loading states
- [x] Error boundaries
- [x] Deployment automático via GitHub Actions
- [x] Data estruturada em JSON
- [x] Integração Cloudflare Pages
- [x] Console logging para debug
- [x] Cores temáticas por indicador
- [x] Formatação de números (toLocaleString)

---

## 🚧 Próximos Passos (Roadmap)

### Fase 2 - Dados Reais
- [ ] Integrar parquet files do Cérebro Brasil
- [ ] Gerar GeoJSON com polígonos de bairros/setores
- [ ] Calcular índices socioeconômicos reais
- [ ] Agregação automática de dados por município

### Fase 3 - Funcionalidades Avançadas
- [ ] Market Intelligence com gráficos
- [ ] Filtros interativos de dados
- [ ] Exportação de relatórios (PDF)
- [ ] Comparação entre cidades
- [ ] Histórico temporal de dados

### Fase 4 - Performance & SEO
- [ ] Lazy loading de mapas
- [ ] Otimização de bundle size
- [ ] Cache de dados estáticos
- [ ] SEO meta tags
- [ ] PWA (Progressive Web App)

---

## 👨‍💻 Detalhes Técnicos

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  output: 'export',  // Static export para Cloudflare Pages
  images: { unoptimized: true },
}
```

### Dependencies Principais
- `next@14.2.35`
- `react@18+`
- `tailwindcss@3`
- `maplibre-gl@3+`

### Build Command
```bash
npm run build
# Output: /out directory com arquivos estáticos
```

---

## 📞 Contacto & Suporte

**Projeto:** Donnos Dashboard - IEZ Territorial Intelligence
**Repositório:** https://github.com/pedrodenucci-ux/donnos-dashboard
**Deploy:** https://donnos-dashboard.pages.dev/
**Email:** denucci@gmail.com

---

**Última atualização:** 26/09/2026
**Status:** ✅ Versão 1.0 em Produção
