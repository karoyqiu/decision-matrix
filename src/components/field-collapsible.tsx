import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { ChevronDownIcon, ChevronRightIcon, DeleteIcon } from 'lucide-react';
import { type Dispatch, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Form,
  FormControl,
  FormDescription,
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

import { Badge } from './ui/badge';

type FieldCollapsibleProps = {
  index: number;
  field: Field;
  dispatch: Dispatch<ActionType>;
};

export function FieldCollapsible(props: FieldCollapsibleProps) {
  'use no memo';
  const { index, field, dispatch } = props;
  const [open, setOpen] = useState(false);
  const form = useForm<Field>({
    resolver: standardSchemaResolver(fieldSchema),
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: field,
  });
  const type = form.watch('type');
  // @ts-expect-error
  const units = useFieldArray<Field>({ control: form.control, name: 'units' });

  const submit = form.handleSubmit(
    (values) => {
      dispatch({ type: 'updateField', index, field: values });
    },
    (errors) => {
      console.error('Submit field form error', errors);
    },
  );

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
          <form onSubmit={submit} onBlur={submit} className="flex flex-col gap-2 pt-2 pl-11">
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
                  <Select
                    disabled={field.disabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          onBlur={field.onBlur}
                          placeholder="Select a verified email to display"
                        />
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
            {(type === 'int' || type === 'float') && (
              <>
                <FormItem>
                  <FormLabel>Units</FormLabel>
                  <FormControl>
                    <Input
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          // @ts-expect-error
                          units.append(input.value);
                          input.value = '';
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
                <div className="flex flex-wrap gap-1">
                  {units.fields.map((unit, index) => (
                    <Badge key={unit.id} variant="secondary">
                      {form.getValues('units')?.at(index)}
                      <Button
                        variant="secondary"
                        className="size-2"
                        onClick={() => units.remove(index)}
                      >
                        <DeleteIcon />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="convert"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Converstion</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Unit converstion formula.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {type === 'float' && (
              <FormField
                control={form.control}
                name="precision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precision</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" inputMode="numeric" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {type === 'money' && (
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Three upper case letters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {(type === 'int' || type === 'float' || type === 'money') && (
              <FormField
                control={form.control}
                name="formula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formula</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  );
}
