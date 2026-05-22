import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Alam Express - Premium Logistics Platform',
    template: '%s | Alam Express',
  },
  description: 'Enterprise-grade logistics and fleet management platform inspired by Apple design. Professional driver management and real-time tracking across Saudi Arabia.',
  keywords: ['logistics', 'fleet management', 'Saudi Arabia', 'driver platform', 'transport', 'delivery'],
  authors: [{ name: 'Alam Express', url: 'https://alamexpress.com' }],
  creator: 'Alam Express',
  publisher: 'Alam Express',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: ['en_US'],
    url: 'https://alamexpress.com',
    siteName: 'Alam Express',
    title: 'Alam Express - Premium Logistics Platform',
    description: 'Enterprise-grade logistics and fleet management platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Alam Express Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alam Express - Premium Logistics Platform',
    description: 'Enterprise-grade logistics and fleet management platform',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${ibmPlexSansArabic.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
