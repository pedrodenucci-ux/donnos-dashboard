# Deployment Guide

## Cloudflare Pages Deployment

This dashboard is configured for automatic deployment to Cloudflare Pages.

### Prerequisites

1. GitHub repository with this code
2. Cloudflare account
3. Domain (optional, but recommended)

### Setup Steps

#### 1. Connect Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Pages"
3. Click "Connect to Git"
4. Authorize GitHub and select the `donnos-dashboard` repository
5. Click "Begin setup"

#### 2. Configure Build Settings

**Build configuration:**
```
Build command: npm run build
Build output directory: .next
Node.js version: 18.x
```

**Environment variables:**
```
NODE_ENV=production
```

#### 3. Set Custom Domain (Optional)

1. In Cloudflare Pages dashboard, go to your project
2. Click "Custom domains"
3. Add `dashboard.donnos.com.br`
4. Update DNS records in your domain provider

#### 4. GitHub Actions (Optional)

For additional control over deployments, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: donnos-dashboard
          directory: .next
```

### Environment Variables Setup

#### Cloudflare Pages

Set these in your project settings:

- `NODE_ENV`: `production`
- `NEXT_PUBLIC_API_URL`: Your API endpoint
- `NEXT_PUBLIC_API_KEY`: Your API key (if needed)

#### GitHub Secrets (for GitHub Actions)

1. Go to repository Settings → Secrets → New repository secret
2. Add:
   - `CLOUDFLARE_API_TOKEN`: Get from Cloudflare Dashboard
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

### Deployment URLs

- **Automatic**: `https://donnos-dashboard.pages.dev`
- **Custom Domain**: `https://dashboard.donnos.com.br`

### Troubleshooting

**Build fails with "Module not found"**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

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
