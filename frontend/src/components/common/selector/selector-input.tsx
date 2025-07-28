// SelectorInput.tsx
import { useState } from 'react';
import { SelectorBase, type Option } from './selectro-base';
import { X } from 'lucide-react';

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
      renderMain={({ setOpen }) => (
        <div className={`relative  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            disabled={isDisabled}
            className={`w-full ${!isDisabled ? 'bg-background' : 'bg-background-secondary'} border text-text py-2 px-4 rounded ${className}`}
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
          </span>
        </div>
      )}
    />
  );
};
