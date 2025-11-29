import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Providers } from './providers';
import StyledComponentsRegistry from '@/lib/registry';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: 'FUGA Music Catalog',
  description: 'Music product catalog management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
