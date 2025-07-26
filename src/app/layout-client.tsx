'use client'

import * as React from 'react';
import type { Role } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/kumbhview/app-header';
import { MainNav } from '@/components/kumbhview/main-nav';

export function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [role, setRole] = React.useState<Role>('Administrator');
  return (
     <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <MainNav />
        </Sidebar>
        <SidebarInset className="flex flex-col">
           <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <AppHeader role={role} setRole={setRole} />
          </div>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
