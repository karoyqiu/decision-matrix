import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { open, save } from '@tauri-apps/plugin-dialog';
import { FilePlus2Icon, FolderOpenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useMatrix } from '@/lib/matrix/context';

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { create, load } = useMatrix();
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
            await create(path);
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
            try {
              await load(path);
              navigate({ to: '/matrix/fields' });
            } catch (e) {
              console.error('Failed to open', e);
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
