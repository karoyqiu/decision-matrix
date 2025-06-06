import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { type Dispatch, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ActionType } from '@/lib/matrix/context';
import { type Field, fieldSchema } from '@/lib/matrix/types';

type FieldCollapsibleProps = {
  index: number;
  field: Field;
  dispatch: Dispatch<ActionType>;
};

export function FieldCollapsible(props: FieldCollapsibleProps) {
  const { index, field, dispatch } = props;
  const [open, setOpen] = useState(false);
  const form = useForm<Field>({
    resolver: standardSchemaResolver(fieldSchema),
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: field,
  });

  const submit = form.handleSubmit((values) => {
    dispatch({ type: 'updateField', index, field: values });
  }, console.error);

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
        <Form {...form}>
          <form onSubmit={submit} onBlur={submit} className="space-y-2 pt-2 pl-11">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoFocus required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="int">Integer</SelectItem>
                      <SelectItem value="float">Float</SelectItem>
                      <SelectItem value="money">Money</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  );
}
