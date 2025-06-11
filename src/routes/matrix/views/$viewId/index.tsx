import { createFileRoute } from '@tanstack/react-router';

import { HorizontalDataView } from '@/components/horizontal-data-view';
import { useMatrix } from '@/lib/matrix/context';

export const Route = createFileRoute('/matrix/views/$viewId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { matrix } = useMatrix();
  const { viewId } = Route.useParams();
  const view = matrix.views.find((view) => view.id === viewId);

  if (view?.dataOrientation === 'asRow') {
    return <HorizontalDataView fields={matrix.fields} data={matrix.data} view={view} />;
  }

  return <div>Hello "/matrix/views/$viewId/"!</div>;
}
