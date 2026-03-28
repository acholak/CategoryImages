import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Category Image Generator',
  description: 'Generate on-brand Deliveroo grocery category images.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-neutral-100 sticky top-0 z-10">
          <div className="max-w-[1160px] mx-auto px-6 h-14 flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-900">Category Images</span>
            <nav className="flex items-center gap-1">
              <a href="/generate" className="text-sm text-neutral-500 hover:text-neutral-900 px-3 py-1.5 rounded-md hover:bg-neutral-50 transition-colors">
                Generate
              </a>
              <a href="/history" className="text-sm text-neutral-500 hover:text-neutral-900 px-3 py-1.5 rounded-md hover:bg-neutral-50 transition-colors">
                History
              </a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
