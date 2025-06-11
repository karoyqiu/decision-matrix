import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { createFileRoute } from '@tanstack/react-router';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { Fragment, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ViewFieldCollapsible } from '@/components/view-field-collapsible';
import { useMatrix, useMatrixDispatch } from '@/lib/matrix/context';
import { type View, viewSchema } from '@/lib/matrix/types';

export const Route = createFileRoute('/matrix/views/$viewId/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const { matrix } = useMatrix();
  const dispatch = useMatrixDispatch();
  const { viewId } = Route.useParams();
  const view = matrix.views.find((view) => view.id === viewId);
  const form = useForm<View>({
    resolver: standardSchemaResolver(viewSchema),
    mode: 'onBlur',
    criteriaMode: 'all',
    values: view,
  });
  const fields = useFieldArray({ control: form.control, name: 'fields' });

  const submit = form.handleSubmit(
    (values) => {
      dispatch({ type: 'updateView', view: values });
    },
    (errors) => {
      console.error('Submit field form error', errors);
    },
  );

  useEffect(() => {
    setTimeout(() => form.reset(view), 0);
  }, [viewId]);

  return (
    <ScrollArea className="h-dvh">
      <Form {...form} key={viewId}>
        <form
          className="flex flex-col gap-4 p-4"
          onSubmit={submit}
          onBlur={submit}
          autoComplete="off"
        >
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
            name="dataOrientation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Orientation</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue placeholder={`Select data orientation`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="asColumn">Data show in columns</SelectItem>
                    <SelectItem value="asRow">Data show in rows</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => {
                fields.append(
                  matrix.fields.map((field) => ({
                    ...field,
                    id: crypto.randomUUID(),
                    unit: field.units && field.units[0],
                    formula: `return data['${field.name}'];`,
                  })),
                );
              }}
            >
              <PlusIcon />
              Add all fields
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                form.setValue('fields', []);
              }}
            >
              <TrashIcon />
              Remove all fields
            </Button>
          </div>
          {fields.fields.map((field, index) => (
            <Fragment key={field.id}>
              <ViewFieldCollapsible
                {...{
                  index,
                  total: matrix.fields.length,
                  field,
                  control: form.control,
                  actions: fields,
                }}
              />
              <Separator />
            </Fragment>
          ))}
        </form>
      </Form>
    </ScrollArea>
  );
}
