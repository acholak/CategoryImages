import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Category Image Generator',
  description: 'Generate on-brand Deliveroo grocery category images.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
