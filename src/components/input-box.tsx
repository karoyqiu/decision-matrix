import { DialogDescription } from '@radix-ui/react-dialog';
import { CheckIcon } from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from './ui/button';
import { Input } from './ui/input';

type InputBoxProps = {
  title: string;
  description?: string;
  onInput: (value?: string) => void;
  children?: ReactNode;
};

export function InputBox(props: InputBoxProps) {
  const { title, description, onInput, children } = props;
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (value && input.current) {
          input.current.value = '';
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Input
          ref={input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onInput(e.currentTarget.value);
              setOpen(false);
            }
          }}
        />
        <DialogFooter>
          <Button
            onClick={() => {
              onInput(input.current?.value);
              setOpen(false);
            }}
          >
            <CheckIcon />
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
