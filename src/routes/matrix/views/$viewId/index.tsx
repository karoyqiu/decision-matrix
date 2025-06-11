import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/matrix/views/$viewId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/matrix/views/$viewId/"!</div>;
}
