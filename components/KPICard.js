'use client';

export default function KPICard({ title, value, change, icon }) {
  const isPositive = change.startsWith('+');

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
        </span>
        <span className="text-gray-500 text-xs">vs last month</span>
      </div>
    </div>
  );
}
