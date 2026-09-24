import './globals.css';

export const metadata = {
  title: 'Donnos Dashboard',
  description: 'Professional data analytics dashboard for market intelligence and geographic analysis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
