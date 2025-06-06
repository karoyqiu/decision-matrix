import { createFileRoute } from '@tanstack/react-router';
import { FilePlus2Icon, FolderOpenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_app/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <Button size="lg">
        <FilePlus2Icon />
        Create a new decision matrix
      </Button>
      <Button size="lg">
        <FolderOpenIcon />
        Open an existing decision matrix
      </Button>
    </div>
  );
}
