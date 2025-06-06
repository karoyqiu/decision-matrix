import { createFileRoute } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';

import { FieldCollapsible } from '@/components/field-collapsible';
import { Button } from '@/components/ui/button';
import { useMatrix, useMatrixDispatch } from '@/lib/matrix/context';

export const Route = createFileRoute('/matrix/fields')({
  component: RouteComponent,
});

function RouteComponent() {
  const matrix = useMatrix();
  const dispatch = useMatrixDispatch();

  return (
    <div className="flex flex-col gap-4 p-2">
      {matrix.fields.map((field) => (
        <FieldCollapsible key={field.name} {...{ field, dispatch }} />
      ))}
      <Button onClick={() => dispatch({ type: 'newField' })}>
        <PlusIcon />
        Add a new field
      </Button>
    </div>
  );
}
