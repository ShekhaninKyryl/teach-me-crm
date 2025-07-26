import { _ } from 'translates/index.ts';

type ButtonProps = {
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({ title, type, disabled = false, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full cursor-pointer"
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export const SubmitButton = ({ title, disabled = false }: ButtonProps) => {
  return <Button title={title || _('Submit')} type="submit" disabled={disabled} />;
};
