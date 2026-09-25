# Donnos Dashboard — Status Técnico

**Última atualização:** 25/09/2026 (11h UTC)  
**Responsável:** Claude Haiku 4.5

---

## 🟢 Fase 1: Conclusão Parcial

### ✅ Implementado
- **Frontend:** Next.js + MapLibre GL JS + Tailwind CSS
- **Deployment:** Cloudflare Pages (auto-deploy em push para `main` — **funcionando desde hoje**)
- **CI/CD:** GitHub Actions com `wrangler pages deploy`
- **Goianá/MG (IBGE 3127388):**
  - ✅ 4 mapas temáticos com dados reais:
    - **Bairros** (CNEFE/IBGE 2022, ~39 polígonos, limite tracejado)
    - **Setores censitários** (IBGE oficial, ~1.256 setores)
    - **Pontos:** 512 CNPJs ativos geolocalizados + 5 ERBs (Anatel) + 10 estabelecimentos CNES
  - ✅ KPIs dinâmicos (lidos de `3127388_summary.json`)
  - ✅ Toggle entre bairros ↔ setores

### ⚠️ Parcial
- **Outras 5 cidades** (Belo Horizonte, Campinas, São Paulo, Anápolis, Goiânia):
  - ✅ Mapas de pontos com dados de **demonstração** (pontos sintéticos)
  - ❌ Sem dados reais de territórios, empresas, infraestrutura
  - ❌ Sem KPIs dinâmicos (não existem `*_summary.json`)

---

## 🔴 Fase 2: Bloqueadores Removidos, Mas Dados Não Entregues

### Antes (status anterior)
- ❌ Deploy falhava há 21 execuções: token sem permissão + workflow quebrado
- ❌ Esperava polígonos do Cérebro Brasil para desbloquear Fase 2

### Hoje
- ✅ Deploy funcionando
- ✅ Goianá já tem polígonos + pontos reais
- ❌ **Faltam dados reais para as outras 4 cidades**

### Próximos Passos — Fase 2
1. **Cérebro Brasil / Drive:** Confirmar se há polígonos + agregações regionais para:
   - Belo Horizonte (IBGE 3106200)
   - Campinas (IBGE 3509007)
   - São Paulo (IBGE 3550308)
   - Anápolis (IBGE 5201405)
   - Goiânia (IBGE 5208707)

2. **Para cada cidade**, implementar:
   - Bairros/distritos (polígonos)
   - Agregações: densidade, socioeconômico, concentração de empresas, infra telecom
   - Arquivo `*_summary.json` com KPIs dinâmicos

3. **Unificar nomenclatura:** "Goiana" → "Goianá" (evitar confusão com Goiana/PE)

---

## 📊 Estrutura de Dados — Formato Esperado

Para cada cidade `IBGE_CODE`:
```
/public/data/
├── {IBGE_CODE}_summary.json          # KPIs: população, renda, empresas, etc.
├── {IBGE_CODE}_geospatial.json       # Pontos (CNPJs, ERBs, saúde)
├── {IBGE_CODE}_bairros.geojson       # Polígonos: bairros/distritos
├── {IBGE_CODE}_setores.geojson       # Polígonos: setores censitários (opcional)
└── {IBGE_CODE}_market_intelligence.json  # Contexto: PIB, setores produtivos, etc.
```

### Schema `*_summary.json`
```json
{
  "ibge_code": "3127388",
  "nome": "Goianá",
  "estado": "MG",
  "populacao": 17234,
  "densidade": 42.5,
  "indice_socioeconomico": 4.2,
  "empresas_ativas": 512,
  "erbs_anatel": 5,
  "estabelecimentos_cnes": 10,
  "fontes": ["IBGE", "Anatel", "CNES"],
  "camadas": {
    "bairros": { "label": "Bairros (CNEFE 2022)", "arquivo": "..." },
    "setores": { "label": "Setores Censitários", "arquivo": "..." }
  }
}
```

---

## 🚀 Deploy & Ambiente

- **Live:** https://donnos-dashboard.pages.dev
- **Base branch:** `main` (Cloudflare Pages, production)
- **Workflow:** `.github/workflows/deploy.yml` (push → build → deploy automático)
- **Secrets (GitHub):**
  - `CLOUDFLARE_API_TOKEN` (permissão: Account → Cloudflare Pages → Edit)
  - `CLOUDFLARE_ACCOUNT_ID` (c4d391d65c90bbe6898129c0b6dd6e41)

---

## 📋 Checklist — Próximas Ações

- [ ] Confirmar disponibilidade de dados reais (Cérebro Brasil / Drive)
- [ ] Padronizar nomenclatura das cidades (Goiana → Goianá)
- [ ] Implementar pipeline de ingestão de dados por cidade
- [ ] Gerar `*_summary.json` para as 4 cidades restantes
- [ ] Validar geojson com `tippecanoe` ou `mapshaper`
- [ ] Testar mapas coropléticos nas 5 cidades
- [ ] Deploy e validação no Cloudflare Pages

