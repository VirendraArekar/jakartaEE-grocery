import type { Metadata } from 'next';
import '@/styles/globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'FreshCart Grocery Store | Spring Boot + MS SQL + Redis',
  description: 'Enterprise grocery e-commerce app demonstrating Spring Boot, MS SQL Server, Redis Cache, Docker, Kubernetes, and Jakarta EE revision points.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <CartDrawer />
          <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-500">
            <p>FreshCart Grocery Store &copy; 2026. Built with Spring Boot 3, MS SQL Server, Redis, Next.js, and Kubernetes.</p>
            <p className="mt-1 text-gray-400">Jakarta EE 10 / CDI Scopes / JPA 3.1 / Bean Validation revision project.</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}

