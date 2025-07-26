import { _ } from 'translates/index.ts';
import { Link, type LinkProps } from 'components/common/link/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

type ButtonProps = {
  title: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: IconProp;
  disabled?: boolean;
  onClick?: () => void;
};

export const Button = ({ title, type, icon, disabled = false, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      className="bg-primary text-text py-2 px-4 rounded hover:bg-primary-hover w-full cursor-pointer"
      disabled={disabled}
      onClick={onClick}
    >
      {icon ? <FontAwesomeIcon icon={icon} className="mr-2" /> : null}
      {title}
    </button>
  );
};

export const ButtonLink = ({ title, to, ...props }: LinkProps) => {
  return (
    <Link
      to={to}
      className={
        'inline-block px-4 py-2 rounded bg-background-secondary hover:bg-background-secondary-hover transition'
      }
      title={title}
      {...props}
    ></Link>
  );
};

export const SubmitButton = ({ title, ...props }: ButtonProps) => {
  return <Button title={title || _('Submit')} type="submit" {...props} />;
};
