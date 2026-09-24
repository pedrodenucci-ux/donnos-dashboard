# Donnos Dashboard

Professional data analytics dashboard for market intelligence and geographic analysis.

## Features

- 📊 **Dashboard** - Real-time KPI monitoring
- 📈 **Analytics** - Detailed performance metrics
- 🗺️ **Geographic Analysis** - Map-based data visualization
- 💡 **Market Intelligence** - BDI/CDI analysis
- 📋 **Reports** - Comprehensive reporting suite
- ⚙️ **Settings** - Customizable configuration

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Language**: JavaScript/React
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/pedrodenucci-ux/donnos-dashboard.git
cd donnos-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
donnos-dashboard/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage/Dashboard
│   ├── globals.css        # Global styles
│   └── ...                # Other pages
├── components/
│   ├── Header.js          # Header component
│   ├── Sidebar.js         # Sidebar navigation
│   ├── KPICard.js         # KPI card component
│   ├── ChartCard.js       # Chart card component
│   └── ...                # Other components
├── public/                # Static assets
├── package.json           # Dependencies
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

## Deployment

### Cloudflare Pages

The dashboard is configured for automatic deployment to Cloudflare Pages:

1. Push to the `main` branch on GitHub
2. Cloudflare will automatically build and deploy
3. Access at `https://donnos-dashboard.pages.dev`

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Contributing

Contributions are welcome! Please ensure:
- Code follows the existing style
- All tests pass
- Changes are well documented

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ by Donnos Consultoria
