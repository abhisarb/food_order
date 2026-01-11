import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from '@/lib/apollo-client';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Antigravity FO - Food Ordering',
  description: 'Premium Food Ordering Experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}>
        <ApolloWrapper>
          <AuthProvider>
            <CartProvider>
              <main className="min-h-screen">
                {children}
              </main>
            </CartProvider>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
