'use client';

import Link from 'next/link';

export default function Sidebar({ isOpen }) {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', href: '/', active: true },
    { icon: '📈', label: 'Analytics', href: '/analytics' },
    { icon: '🗺️', label: 'Geographic', href: '/geographic' },
    { icon: '💡', label: 'Market Intelligence', href: '/intelligence' },
    { icon: '📋', label: 'Reports', href: '/reports' },
    { icon: '⚙️', label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col border-r border-gray-800`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-center">
            <div className="text-2xl font-bold">📊</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>
            {isOpen && (
              <div className="text-xs">
                <p className="font-medium">Pedro</p>
                <p className="text-gray-400">Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
