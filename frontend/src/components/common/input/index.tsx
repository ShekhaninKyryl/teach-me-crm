import type { UseFormRegisterReturn } from 'react-hook-form';
import { X } from 'lucide-react';

type InputProps = {
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
  onChange?: (value: string) => void;
};

export const Input = ({
  label,
  value = '',
  placeholder,
  type,
  error,
  onChange,
  className,
}: InputProps) => {
  const handleErase = () => {
    onChange?.('');
  };

  return (
    <div className={className}>
      <label className="block text-text text-sm">{label}</label>
      <div className="relative">
        <input
          value={value}
          type={type || 'text'}
          placeholder={placeholder}
          className="shadow border rounded bg-background w-full py-2 px-4 h-10 text-text"
          onChange={(e) => onChange && onChange(e.target.value)}
        />
        <span className="flex gap-1 absolute right-2 top-1/2 transform -translate-y-2">
          {value && (
            <X
              className={'w-4 h-4 cursor-pointer hover:text-error-hover'}
              onClick={(e) => {
                e.stopPropagation();
                handleErase();
              }}
            />
          )}
        </span>
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

type FormInputProps = InputProps & {
  register: UseFormRegisterReturn;
};

export const FormInput = ({ label, type, error, register }: FormInputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-text text-sm">{label}</label>
      <input
        type={type || 'text'}
        {...register}
        className="shadow border rounded w-full py-2 px-3 text-text"
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};
