import type { UseFormRegisterReturn } from 'react-hook-form';

type InputProps = {
  label: string;
  register: UseFormRegisterReturn;
  type?: string;
  error?: string;
};

export const Input = ({ label, type, error, register }: InputProps) => {
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
