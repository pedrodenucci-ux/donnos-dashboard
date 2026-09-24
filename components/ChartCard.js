'use client';

export default function ChartCard({ title, description }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>

      {/* Placeholder Chart */}
      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-500 text-sm">Chart will be rendered here</p>
          <p className="text-gray-400 text-xs mt-1">Data integration ready</p>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-500 text-xs">Peak</p>
          <p className="text-lg font-bold text-gray-900 mt-1">$89.5K</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs">Average</p>
          <p className="text-lg font-bold text-gray-900 mt-1">$54.2K</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs">Growth</p>
          <p className="text-lg font-bold text-green-600 mt-1">+12.5%</p>
        </div>
      </div>
    </div>
  );
}
