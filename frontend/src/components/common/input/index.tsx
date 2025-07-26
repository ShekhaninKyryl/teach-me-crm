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
      <label className="block text-gray-700 text-sm mb-2">{label}</label>
      <input
        type={type || 'text'}
        {...register}
        className="shadow border rounded w-full py-2 px-3 text-gray-700"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
