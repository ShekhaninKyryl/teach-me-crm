// SelectorInput.tsx
import { useState } from 'react';
import { SelectorBase, type Option } from './selectro-base';
import { X } from 'lucide-react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SelectorInputProps = {
  options: Option[];
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string | undefined) => void;
};

export const SelectorInput = ({
  options,
  value,
  placeholder,
  className,
  onChange,
}: SelectorInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const handleErase = () => {
    setInputValue('');
    onChange?.(undefined);
  };

  const isDisabled = !options.length;

  return (
    <SelectorBase
      options={options}
      value={value}
      filter={inputValue}
      onChange={onChange}
      renderMain={({ setOpen, open }) => (
        <div className={`relative  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            type="text"
            value={inputValue}
            placeholder={placeholder}
            disabled={isDisabled}
            className={classNames(
              !isDisabled
                ? 'bg-background cursor-pointer'
                : 'bg-background-secondary cursor-not-allowed',
              'border text-text py-2 px-4 rounded w-full',
              className
            )}
            onFocus={() => setOpen(true)}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <span className="flex gap-1 absolute right-2 top-1/2 transform -translate-y-2">
            {inputValue && (
              <X
                className={`w-4 h-4 ${isDisabled ? '' : 'hover:text-error-hover'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleErase();
                }}
              />
            )}
            <FontAwesomeIcon
              icon="chevron-down"
              className="w-4 h-4 hover:text-text-secondary"
              onClick={() => setOpen(!open)}
            />
          </span>
        </div>
      )}
    />
  );
};
