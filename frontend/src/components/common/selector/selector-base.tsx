import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { _ } from '@/translates';

export type Option = {
  value: string;
  label: string;
  icon?: IconProp;
};

export type SelectorBaseProps = {
  options: Option[];
  value?: string;
  filter?: string;
  onChange?: (value: string | undefined) => void;
  renderMain: (props: { open: boolean; setOpen: (v: boolean) => void }) => React.ReactNode;
};

export const SelectorBase = ({
  options,
  value,
  filter,
  onChange,
  renderMain,
}: SelectorBaseProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredOptions = filter
    ? options.filter((opt) => opt.label.toLowerCase().includes(filter.toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative w-full">
      {renderMain({ open, setOpen })}
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-background border rounded shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 && (
            <li className="px-4 py-2 bg-surface text-text-muted">{_('No options found')}</li>
          )}
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange?.(option.value);
                setOpen(false);
              }}
              className={classNames(
                'cursor-pointer px-4 py-2 hover:bg-primary-hover flex items-center gap-2',
                value === option.value && 'bg-primary font-medium'
              )}
            >
              {option.icon && <FontAwesomeIcon icon={option.icon} className="mr-2" />}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
