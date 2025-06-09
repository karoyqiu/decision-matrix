import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { MatrixSidebar } from '@/components/matrix-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useMatrix } from '@/lib/matrix/context';

export const Route = createFileRoute('/matrix')({
  component: RouteComponent,
});

function RouteComponent() {
  const { save } = useMatrix();

  useEffect(() => {
    save();
  }, [save]);

  return (
    <SidebarProvider>
      <MatrixSidebar />
      <main className="flex h-svh w-full flex-col">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
