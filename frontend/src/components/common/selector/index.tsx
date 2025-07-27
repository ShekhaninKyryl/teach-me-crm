import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

type Option = {
  value: string;
  label: string;
  icon?: IconProp;
};

type SelectorProps = {
  options: Option[];
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string | undefined) => void;
};

export const Selector = ({
  options,
  value,
  placeholder = 'Виберіть...',
  className,
  onChange,
}: SelectorProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={classNames('relative w-full', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full bg-background border text-text py-2 px-4 rounded"
      >
        <span className="flex items-center gap-2">
          {selected?.icon ? <FontAwesomeIcon icon={selected?.icon} className="mr-2" /> : null}
          {selected?.label || placeholder}
        </span>
        <span className="flex gap-1">
          {value && (
            <X
              className="w-4 h-4 hover:text-error-hover"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(undefined);
              }}
            />
          )}
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-background border rounded shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
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
              {option?.icon ? <FontAwesomeIcon icon={option?.icon} className="mr-2" /> : null}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
