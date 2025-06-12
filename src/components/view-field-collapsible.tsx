import { ArrowDownIcon, ArrowUpIcon, ChevronRightIcon, CopyIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { type Control, type UseFieldArrayReturn } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { InputBox } from '@/components/input-box';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
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
import { type View, type ViewField } from '@/lib/matrix/types';
import { cn } from '@/lib/utils';

type ViewFieldCollapsibleProps = {
  index: number;
  total: number;
  field: ViewField;
  control: Control<View>;
  actions: UseFieldArrayReturn<View, 'fields'>;
};

export function ViewFieldCollapsible(props: ViewFieldCollapsibleProps) {
  'use no memo';
  const { index, total, field, control, actions } = props;
  const [open, setOpen] = useState(false);
  const type = field.type;

  return (
    <Collapsible key={field.name} open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <ChevronRightIcon className={cn(open && 'rotate-90', 'transition-transform')} />
          </Button>
        </CollapsibleTrigger>
        <span className="grow">{field.name}</span>
        {index > 0 && (
          <Button variant="ghost" size="icon" onClick={() => actions.move(index, index - 1)}>
            <ArrowUpIcon />
          </Button>
        )}
        {index < total - 1 && (
          <Button variant="ghost" size="icon" onClick={() => actions.move(index, index + 1)}>
            <ArrowDownIcon />
          </Button>
        )}
        <InputBox
          title="Duplicate Field"
          description="Input the name of the new field:"
          onInput={(name) => {
            if (name) {
              actions.append({ ...field, name });
            }
          }}
        >
          <Button variant="ghost" size="icon">
            <CopyIcon />
          </Button>
        </InputBox>
        <Button variant="destructive" size="icon" onClick={() => actions.remove(index)}>
          <TrashIcon />
        </Button>
      </div>
      <CollapsibleContent>
        <div className="flex flex-col gap-4 pt-2 pl-11">
          <FormField
            control={control}
            name={`fields.${index}.name`}
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
            control={control}
            name={`fields.${index}.type`}
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
                      <SelectValue onBlur={field.onBlur} placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="int">Integer</SelectItem>
                    <SelectItem value="float">Float</SelectItem>
                    <SelectItem value="money">Money</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === 'float' && (
            <FormField
              control={control}
              name={`fields.${index}.precision`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precision</FormLabel>
                  <FormControl>
                    <NumericFormat
                      customInput={Input}
                      name={field.name}
                      getInputRef={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      onValueChange={(values) => field.onChange(values.floatValue)}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {type === 'money' && (
            <FormField
              control={control}
              name={`fields.${index}.currency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue="CNY" />
                  </FormControl>
                  <FormDescription>Three uppercase letters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {(type === 'int' || type === 'float') && (
            <FormField
              control={control}
              name={`fields.${index}.unit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={control}
            name={`fields.${index}.formula`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formula</FormLabel>
                <FormControl>
                  <Input className="font-mono" {...field} required />
                </FormControl>
                <FormDescription>
                  <code>{`(data: Data) => string | number | UnitValue`}</code>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {(type === 'int' || type === 'float' || type === 'money') && (
            <FormField
              control={control}
              name={`fields.${index}.colorScales`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Use color scales</FormLabel>
                  <Select
                    disabled={field.disabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue onBlur={field.onBlur} placeholder="Select color scale" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="lowerBetter">The lower the better</SelectItem>
                      <SelectItem value="higherBetter">The heigher the better</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
