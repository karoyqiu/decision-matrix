import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { type Dispatch, useState } from 'react';

import type { ActionType } from '@/lib/matrix/context';
import type { Field } from '@/lib/matrix/types';

import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

type FieldCollapsibleProps = {
  field: Field;
  dispatch: Dispatch<ActionType>;
};

export function FieldCollapsible(props: FieldCollapsibleProps) {
  const { field, dispatch } = props;
  const [open, setOpen] = useState(false);

  return (
    <Collapsible key={field.name} open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </Button>
        </CollapsibleTrigger>
        {field.name}
      </div>
      <CollapsibleContent>
        Yes. Free to use for personal and commercial projects. No attribution required.
      </CollapsibleContent>
    </Collapsible>
  );
}
