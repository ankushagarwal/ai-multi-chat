import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/header';
import { SidebarProvider } from '@/context/SidebarContext';

export const metadata: Metadata = {
  title: 'AI Multi Chat',
  description: 'AI Multi Chat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SidebarProvider>
          <div className="flex flex-col">
            <Header />
            {children}
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
