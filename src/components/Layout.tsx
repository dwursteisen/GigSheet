import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] grid-cols-[56px_1fr] no-print">
      <Header />
      <Sidebar />
      <main className="overflow-auto p-4 bg-console-bg">
        {children}
      </main>
      <Footer />
    </div>
  );
}
