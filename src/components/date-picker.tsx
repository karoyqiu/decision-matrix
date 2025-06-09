import type { ClassValue } from 'clsx';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { Ref } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DatePickerProps = {
  ref?: Ref<HTMLButtonElement>;
  className?: ClassValue;
  value: Date;
  onChange: (value: Date) => void;
};

export function DatePicker(props: DatePickerProps) {
  const { ref, className, value, onChange } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          data-empty={!value}
          className={cn(
            'data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal',
            className,
          )}
        >
          <CalendarIcon />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" required selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
