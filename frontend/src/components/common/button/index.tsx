import { _ } from 'translates/index.ts';
import { Link, type LinkProps } from 'components/common/link/link';

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
      className="bg-primary text-text py-2 px-4 rounded hover:bg-primary-hover w-full cursor-pointer"
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

type ButtonLinkProps = LinkProps & {
  title: string;
  className?: string;
};

export const ButtonLink = ({ title, to, ...props }: ButtonLinkProps) => {
  return (
    <Link
      to={to}
      className={
        'inline-block px-4 py-2 rounded bg-background-secondary hover:bg-background-secondary-hover transition'
      }
      {...props}
      title={title}
    ></Link>
  );
};

export const SubmitButton = ({ title, disabled = false }: ButtonProps) => {
  return <Button title={title || _('Submit')} type="submit" disabled={disabled} />;
};
