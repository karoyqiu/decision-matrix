import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex h-svh w-full flex-col">
      <Outlet />
    </main>
  );
}
