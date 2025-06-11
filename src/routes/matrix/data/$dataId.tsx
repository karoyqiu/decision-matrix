import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { createFileRoute } from '@tanstack/react-router';
import { formatISO } from 'date-fns';
import { TrashIcon } from 'lucide-react';
import { useEffect } from 'react';
import { type Control, type ControllerRenderProps, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

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
import { useMatrix, useMatrixDispatch } from '@/lib/matrix/context';
import { type Data, type Field, type UnitValue, dataSchema } from '@/lib/matrix/types';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/matrix/data/$dataId')({
  component: RouteComponent,
});

function RouteComponent() {
  'use no memo';
  const { matrix } = useMatrix();
  const dispatch = useMatrixDispatch();
  const { dataId } = Route.useParams();
  const data = matrix.data.find((data) => data.id === dataId);
  const form = useForm<Data>({
    resolver: standardSchemaResolver(dataSchema),
    mode: 'onBlur',
    criteriaMode: 'all',
    values: data,
  });

  const submit = form.handleSubmit(
    (values) => {
      dispatch({ type: 'updateData', data: values });
    },
    (errors) => {
      console.error('Submit field form error', errors);
    },
  );

  useEffect(() => {
    setTimeout(() => form.reset(data), 0);
  }, [dataId]);

  return (
    <ScrollArea className="h-dvh">
      <Form {...form} key={1}>
        <form
          className="flex flex-col gap-4 p-4"
          onSubmit={submit}
          onBlur={submit}
          autoComplete="off"
        >
          {matrix.fields.map((field) => (
            <DataField key={field.id} control={form.control} field={field} />
          ))}
        </form>
      </Form>
      <Button
        className="m-4"
        variant="destructive"
        onClick={() => dispatch({ type: 'deleteData', dataId })}
      >
        <TrashIcon />
        Delete
      </Button>
    </ScrollArea>
  );
}

type DataFieldProps = {
  control: Control<Data, any, Data>;
  field: Field;
};

function DataField(props: DataFieldProps) {
  const { control, field } = props;

  return (
    <FormField
      control={control}
      name={field.id}
      render={({ field: data }) => (
        <FormItem>
          <FormLabel>{field.name}</FormLabel>
          <DataFieldInput {...{ field, data }} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type DataFieldInputProps = {
  field: Field;
  data: ControllerRenderProps<Data, string>;
};

function DataFieldInput(props: DataFieldInputProps) {
  const { field, data } = props;

  switch (field.type) {
    case 'date': {
      const value = data.value ? formatISO(data.value as number, { representation: 'date' }) : '';
      return (
        <FormControl>
          <Input
            className="w-40"
            {...data}
            value={value}
            onChange={(e) => {
              data.onChange(e.currentTarget.valueAsNumber);
            }}
            type="date"
            required={field.primary}
          />
        </FormControl>
      );
    }

    case 'list':
      return (
        <Select onValueChange={data.onChange} value={(data.value as string) ?? ''}>
          <FormControl>
            <SelectTrigger ref={data.ref} className="w-40">
              <SelectValue placeholder={`Select a ${field.name}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {field.values &&
              field.values.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      );

    case 'int':
    case 'float':
    case 'money':
      return <NumericField {...props} />;

    default:
      return (
        <FormControl>
          <Input {...data} value={(data.value as string) ?? ''} required={field.primary} />
        </FormControl>
      );
  }
}

function NumericField(props: DataFieldInputProps) {
  const { field, data } = props;
  const value = data.value as UnitValue | undefined;
  let precision = 0;
  let units: string[] = [];

  switch (field.type) {
    case 'int':
    case 'float':
      if (field.units) {
        units = field.units;
      }

      if (field.type === 'float') {
        precision = field.precision ?? 2;
      }
      break;

    case 'money':
      units = [field.currency ?? 'CNY'];
      precision = 2;
      break;

    default:
      return null;
  }

  const updateValue = (change: Partial<UnitValue>) => {
    const newValue = { value: 0, unit: units[0], ...value, ...change };
    data.onChange(newValue);
  };

  const numeric = (
    <FormControl>
      <NumericFormat
        className={cn(units.length > 0 && 'rounded-e-none border-e-0', 'w-40 text-end font-mono')}
        getInputRef={data.ref}
        customInput={Input}
        required={field.primary}
        decimalScale={precision}
        value={value?.value ?? ''}
        onValueChange={(values) => updateValue({ value: values.floatValue })}
        onBlur={data.onBlur}
        name={data.name}
        disabled={data.disabled}
      />
    </FormControl>
  );

  if (units.length > 0) {
    return (
      <div className="flex">
        {numeric}
        <Select onValueChange={(unit) => updateValue({ unit })} value={value?.unit ?? units[0]}>
          <FormControl>
            <SelectTrigger className="rounded-s-none">
              <SelectValue placeholder={'Select a unit'} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {units.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return numeric;
}
