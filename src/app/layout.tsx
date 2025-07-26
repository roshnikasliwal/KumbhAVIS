import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LayoutClient } from './layout-client';
import { RouteProvider } from '@/lib/route-context';

export const metadata: Metadata = {
  title: 'KumbhAVIS Agent',
  description: 'Crowd Management for Kumbh Mela using GenAI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <RouteProvider>
          <LayoutClient>
            {children}
          </LayoutClient>
        </RouteProvider>
        <Toaster />
      </body>
    </html>
  );
}
