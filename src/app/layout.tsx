import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AppProvider } from '@/context/app-context';

export const metadata: Metadata = {
  title: 'BudgetWise',
  description: 'Smart budgeting for a brighter financial future.',
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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider storageKey="budgetwise-theme">
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
