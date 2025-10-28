import React from 'react';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Header } from '@/components/layout/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <MainSidebar />
      </Sidebar>
      <SidebarInset>
        <Header />
        <div className="p-4 sm:p-6 lg:p-8 animate-content-show">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
