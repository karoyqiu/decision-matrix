import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/matrix/data')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/matrix/data"!</div>;
}
