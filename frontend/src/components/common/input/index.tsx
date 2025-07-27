import type { UseFormRegisterReturn } from 'react-hook-form';

type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
  onChange?: (value: string) => void;
};

export const Input = ({ label, placeholder, type, error, onChange, className }: InputProps) => {
  return (
    <div className={className}>
      <label className="block text-text text-sm">{label}</label>
      <input
        type={type || 'text'}
        placeholder={placeholder}
        className="shadow border rounded w-full py-2 px-4 h-10 text-text"
        onChange={(e) => onChange && onChange(e.target.value)}
      />
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
