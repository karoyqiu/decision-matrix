import { Outlet, createFileRoute } from '@tanstack/react-router';

import { MatrixSidebar } from '@/components/matrix-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const Route = createFileRoute('/matrix')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <MatrixSidebar />
      <main className="flex h-svh w-full flex-col">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
