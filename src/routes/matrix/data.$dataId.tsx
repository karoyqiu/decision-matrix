import { createFileRoute } from '@tanstack/react-router';

import { useMatrixData } from '@/lib/matrix/context';

export const Route = createFileRoute('/matrix/data/$dataId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { dataId } = Route.useParams();
  const data = useMatrixData(dataId);

  return <div>Hello "/matrix/data/$dataId"!</div>;
}
