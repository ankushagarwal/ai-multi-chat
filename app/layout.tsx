import type { Metadata } from 'next';
import './globals.css';

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
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
