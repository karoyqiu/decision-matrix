import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { open, save } from '@tauri-apps/plugin-dialog';
import { FilePlus2Icon, FolderOpenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { emptyMatrix, useMatrixDispatch } from '@/lib/matrix/context';
import { load, save as saveMatrix } from '@/lib/matrix/file';

export const Route = createFileRoute('/_app/')({
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
          const path = await save({
            title: 'Create Decision Matrix',
            filters: [
              {
                name: 'Decision Matrix',
                extensions: ['json', 'ejson', 'dmtrx'],
              },
            ],
          });

          if (path) {
            await saveMatrix(emptyMatrix, path);
            dispatch({ type: 'create' });
            navigate({ to: '/matrix/fields' });
          }
        }}
      >
        <FilePlus2Icon />
        Create a new decision matrix
      </Button>
      <Button
        size="lg"
        onClick={async () => {
          const path = await open({
            filters: [
              {
                name: 'Decision Matrix',
                extensions: ['json', 'ejson', 'dmtrx'],
              },
            ],
          });

          if (path) {
            const result = await load(path);

            if (result.success) {
              dispatch({ type: 'open', data: result.data });
            } else {
              console.error('Failed to open', result.error);
            }
          }
        }}
      >
        <FolderOpenIcon />
        Open an existing decision matrix
      </Button>
    </div>
  );
}
