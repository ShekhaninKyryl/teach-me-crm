import type { FC, ReactNode } from 'react';
import {
  Dialog as RadixDialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { _ } from '@/translates';

interface DialogProps {
  triggerTitle?: string;
  description?: string;
  children: ReactNode;
}

export const Dialog: FC<DialogProps> = ({
  triggerTitle = 'Open dialog',
  description,
  children,
}) => {
  return (
    <RadixDialog>
      <DialogTrigger>
        <Button type="button" variant="link" className="w-full">
          {_(triggerTitle)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl">
        <DialogTitle>{_('Set up your own availability')}</DialogTitle>
        {description ? <DialogDescription>{_(description)}</DialogDescription> : null}
        {children}
      </DialogContent>
    </RadixDialog>
  );
};

export default Dialog;
