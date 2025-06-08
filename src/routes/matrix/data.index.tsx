import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useMatrixDispatch } from '@/lib/matrix/context';

export const Route = createFileRoute('/matrix/data/')({
  component: RouteComponent,
});

function RouteComponent() {
  const dispatch = useMatrixDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <Button
        size="lg"
        onClick={async () => {
          const dataId = crypto.randomUUID();
          dispatch({ type: 'addData', dataId });
          await navigate({ to: '/matrix/data/$dataId', params: { dataId } });
        }}
      >
        <PlusIcon />
        Add data
      </Button>
    </div>
  );
}
