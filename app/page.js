'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import KPICard from '@/components/KPICard';
import ChartCard from '@/components/ChartCard';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Bem-vindo ao Donnos Dashboard</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Revenue"
              value="$124,500"
              change="+12.5%"
              icon="💰"
            />
            <KPICard
              title="Active Users"
              value="8,234"
              change="+5.2%"
              icon="👥"
            />
            <KPICard
              title="Conversions"
              value="1,234"
              change="+3.1%"
              icon="📈"
            />
            <KPICard
              title="Avg. Order Value"
              value="$567"
              change="+8.4%"
              icon="🛒"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Revenue Over Time"
              description="Monthly revenue trend"
            />
            <ChartCard
              title="Geographic Distribution"
              description="Sales by region"
            />
            <ChartCard
              title="Product Performance"
              description="Top performing products"
            />
            <ChartCard
              title="Market Intelligence"
              description="BDI / CDI Analysis"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
