import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata: Metadata = {
  title: 'Thesis AI | Market Insight In Seconds',
  description:
    'Thesis turns market noise into clear investment insight in seconds. AI-powered research for serious retail investors.',
  icons: {
    icon: '/branding/icon dark&light mode - Thesis AI.png',
    shortcut: '/branding/icon dark&light mode - Thesis AI.png',
    apple: '/branding/icon dark&light mode - Thesis AI.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://thesisai.app',
    title: 'Thesis AI | Market Insight In Seconds',
    description:
      'Thesis turns market noise into clear investment insight in seconds. AI-powered research for serious retail investors.',
    siteName: 'Thesis AI',
    images: [
      {
        url: '/branding/Light mode-Thesis AI Logo - transparent.png',
        width: 1200,
        height: 630,
        alt: 'Thesis AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thesis AI | Market Insight In Seconds',
    description:
      'Thesis turns market noise into clear investment insight in seconds. AI-powered research for serious retail investors.',
    images: ['/branding/Light mode-Thesis AI Logo - transparent.png'],
  },
  metadataBase: new URL('https://thesisai.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
