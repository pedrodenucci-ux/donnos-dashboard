# Deployment Guide

## Cloudflare Pages Deployment

This dashboard is configured for automatic deployment to Cloudflare Pages.

### Prerequisites

1. GitHub repository with this code
2. Cloudflare account
3. Domain (optional, but recommended)

### Setup Steps

O deploy é feito pelo GitHub Actions (`.github/workflows/deploy.yml`) com
`wrangler pages deploy`. O projeto Pages `donnos-dashboard` é do tipo
"Direct Upload" — não conecte o repositório pelo "Connect to Git" do Cloudflare,
senão os dois mecanismos brigam.

#### 1. Build

```
Build command: npm run build
Build output directory: out   (next.config.js usa output: 'export')
Node.js version: 20
```

#### 2. Criar o API token no Cloudflare

1. https://dash.cloudflare.com/profile/api-tokens → **Create Token** → **Create Custom Token**
2. Permissions: **Account → Cloudflare Pages → Edit**
3. Account Resources: **Include → a conta onde está o projeto `donnos-dashboard`**
4. Crie e copie o token (aparece só uma vez)

#### 3. Secrets no GitHub

Repository → Settings → Secrets and variables → Actions → New repository secret:

- `CLOUDFLARE_API_TOKEN`: o token do passo 2
- `CLOUDFLARE_ACCOUNT_ID`: o ID da conta (aparece na URL do dashboard,
  `dash.cloudflare.com/<ACCOUNT_ID>/...`)

Depois, rode o workflow em Actions → "Deploy to Cloudflare Pages" → **Run workflow**.

#### 4. Custom Domain (opcional)

1. No projeto Pages, vá em "Custom domains"
2. Adicione `dashboard.donnos.com.br`

### Deployment URLs

- **Automatic**: `https://donnos-dashboard.pages.dev`
- **Custom Domain**: `https://dashboard.donnos.com.br`

### Troubleshooting

**Build fails with "Module not found"**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**`Authentication error [code: 10000]` no passo de deploy**
- O token não tem a permissão "Cloudflare Pages: Edit", ou é de outra conta que não a de `CLOUDFLARE_ACCOUNT_ID`
- Recrie o token (passo 2) e atualize o secret

**Pages shows 404**
- Check build output directory in settings
- Verify Next.js build completes successfully

**Custom domain not working**
- Ensure DNS is pointing to Cloudflare nameservers
- Wait up to 24 hours for propagation
- Check domain settings in Cloudflare dashboard

### Rollback

To rollback to a previous deployment:

1. Go to Cloudflare Pages dashboard
2. Find your project → Deployments
3. Select previous deployment
4. Click "Rollback"

### Monitoring

Monitor your deployment at:
- **Cloudflare Dashboard**: Analytics → Pages
- **GitHub**: Actions tab for build logs

---

**Need help?** Check:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
