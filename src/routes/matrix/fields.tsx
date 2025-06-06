import { createFileRoute } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';

import { FieldCollapsible } from '@/components/field-collapsible';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type ActionType, useMatrix, useMatrixDispatch } from '@/lib/matrix/context';

export const Route = createFileRoute('/matrix/fields')({
  component: RouteComponent,
});

function RouteComponent() {
  const { matrix } = useMatrix();
  const dispatch = useMatrixDispatch();
  const saveLater = useDebounceCallback(
    () => {
      dispatch({ type: 'save' });
    },
    1000,
    { maxWait: 1000 * 60 },
  );

  const dispatchAndSave = (action: ActionType) => {
    dispatch(action);
    saveLater();
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      {matrix.fields.map((field, index) => (
        <>
          <FieldCollapsible key={field.name} {...{ index, field, dispatch: dispatchAndSave }} />
          <Separator />
        </>
      ))}
      <Button onClick={() => dispatchAndSave({ type: 'newField' })}>
        <PlusIcon />
        Add a new field
      </Button>
    </div>
  );
}
