import { createFileRoute } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';

import { FieldCollapsible } from '@/components/field-collapsible';
import { InputBox } from '@/components/input-box';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMatrix, useMatrixDispatch } from '@/lib/matrix/context';

export const Route = createFileRoute('/matrix/fields')({
  component: RouteComponent,
});

function RouteComponent() {
  const { matrix } = useMatrix();
  const dispatch = useMatrixDispatch();

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-4 p-2">
        {matrix.fields.map((field, index) => (
          <Fragment key={field.id}>
            <FieldCollapsible {...{ index, total: matrix.fields.length, field, dispatch }} />
            <Separator />
          </Fragment>
        ))}
        <InputBox
          title="Add Field"
          description="Input the name of the new field:"
          onInput={(name) => {
            if (name) {
              dispatch({ type: 'addField', field: { id: '', name, type: 'text' } });
            }
          }}
        >
          <Button>
            <PlusIcon />
            Add a new field
          </Button>
        </InputBox>
      </div>
    </ScrollArea>
  );
}
