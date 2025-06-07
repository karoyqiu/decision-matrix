import { createFileRoute } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { useDebounceCallback } from 'usehooks-ts';

import { FieldCollapsible } from '@/components/field-collapsible';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type ActionType, useMatrix, useMatrixDispatch } from '@/lib/matrix/context';

export const Route = createFileRoute('/matrix/fields')({
  component: RouteComponent,
});

function RouteComponent() {
  const { matrix, save } = useMatrix();
  const dispatch = useMatrixDispatch();
  const saveLater = useDebounceCallback(save, 1000, { maxWait: 1000 * 60 });

  const dispatchAndSave = (action: ActionType) => {
    dispatch(action);
    saveLater();
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      {matrix.fields.map((field, index) => (
        <Fragment key={field.id}>
          <FieldCollapsible
            {...{ index, total: matrix.fields.length, field, dispatch: dispatchAndSave }}
          />
          <Separator />
        </Fragment>
      ))}
      <Button onClick={() => dispatchAndSave({ type: 'newField' })}>
        <PlusIcon />
        Add a new field
      </Button>
    </div>
  );
}
