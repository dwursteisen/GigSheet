import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] grid-cols-[56px_1fr] print:block print:h-auto">
      <Header />
      <Sidebar />
      <main className="overflow-auto p-4 bg-console-bg print:overflow-visible print:p-0 print:bg-white">
        {children}
      </main>
      <Footer />
    </div>
  );
}
