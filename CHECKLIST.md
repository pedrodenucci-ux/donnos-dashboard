# 📋 Donnos Dashboard - Setup Checklist

## Fase 1: Local Development ✅

- [ ] Repository cloned from GitHub
- [ ] Node.js 18+ installed
- [ ] Dependencies installed: `npm install`
- [ ] Development server running: `npm run dev`
- [ ] Dashboard accessible at `http://localhost:3000`

## Fase 2: GitHub Repository ✅

- [x] Repository created: `donnos-dashboard`
- [x] Code pushed to main branch
- [x] README.md configured
- [x] .gitignore created
- [x] GitHub Actions workflow ready

## Fase 3: Cloudflare Pages Setup 🚀

### 3.1 Connect Repository
- [ ] Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [ ] Navigate to Pages
- [ ] Click "Connect to Git"
- [ ] Select `donnos-dashboard` repository
- [ ] Authorize GitHub connection

### 3.2 Configure Build
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Node.js version: 18.x
- [ ] Click "Save and Deploy"

### 3.3 Set Environment Variables (if needed)
- [ ] `NODE_ENV` = `production`
- [ ] `NEXT_PUBLIC_API_URL` = (your API endpoint)

## Fase 4: GitHub Secrets (Optional) 🔐

For GitHub Actions deployment:

- [ ] Get `CLOUDFLARE_API_TOKEN` from Cloudflare
- [ ] Get `CLOUDFLARE_ACCOUNT_ID` from Cloudflare
- [ ] Go to GitHub repo → Settings → Secrets
- [ ] Add `CLOUDFLARE_API_TOKEN`
- [ ] Add `CLOUDFLARE_ACCOUNT_ID`

## Fase 5: Custom Domain (Optional) 🌐

- [ ] Add custom domain in Cloudflare Pages settings
- [ ] Domain: `dashboard.donnos.com.br`
- [ ] Update DNS records (if needed)
- [ ] Wait for DNS propagation (up to 24h)

## Verification Checklist ✨

- [ ] Dashboard loads at `https://donnos-dashboard.pages.dev`
- [ ] Sidebar navigation works (toggle)
- [ ] All KPI cards display correctly
- [ ] Chart cards render without errors
- [ ] Responsive design works on mobile
- [ ] No console errors in browser DevTools
- [ ] Build completes successfully
- [ ] Custom domain accessible (if configured)

## Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Install new package
npm install package-name
```

## Important URLs

| Service | URL |
|---------|-----|
| Local Dev | http://localhost:3000 |
| Cloudflare Pages | https://donnos-dashboard.pages.dev |
| Custom Domain | https://dashboard.donnos.com.br |
| GitHub Repo | https://github.com/pedrodenucci-ux/donnos-dashboard |
| Cloudflare Dashboard | https://dash.cloudflare.com/ |

## File Structure

```
donnos-dashboard/
├── app/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── Header.js
│   ├── Sidebar.js
│   ├── KPICard.js
│   └── ChartCard.js
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
├── README.md
├── DEPLOY.md
├── CHECKLIST.md
└── .gitignore
```

## Troubleshooting

### Build Fails
- Check Node.js version: `node --version`
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install && npm run build`

### Pages Shows 404
- Verify build output directory is `.next`
- Check Cloudflare Pages build logs
- Ensure Next.js build completes without errors

### Domain Not Working
- Verify DNS records point to Cloudflare
- Wait for DNS propagation
- Check domain settings in Cloudflare Dashboard

## Next Steps

1. ✅ Complete all checklist items
2. ✅ Share dashboard URL with team
3. ✅ Configure additional features (maps, charts)
4. ✅ Set up monitoring and analytics
5. ✅ Document any custom changes

---

**Dashboard Status**: 🟢 Ready for Deployment

Last Updated: 2026-09-24
