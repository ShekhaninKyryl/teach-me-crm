import { _ } from 'translates/index.ts';
import { Link, type LinkProps } from 'components/common/link/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';

type ButtonProps = {
  title: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: IconProp;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export const Button = ({
  title,
  type,
  icon,
  disabled = false,
  iconPosition = 'left',
  className,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={classNames(
        className,
        'py-2 px-4 h-10 rounded',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {iconPosition === 'left' && icon ? <FontAwesomeIcon icon={icon} className="mr-2" /> : null}
      {title}
      {iconPosition === 'right' && icon ? <FontAwesomeIcon icon={icon} className="ml-2" /> : null}
    </button>
  );
};

export const PrimaryButton = ({
  title,
  type = 'button',
  icon,
  iconPosition = 'left',
  disabled = false,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      title={title}
      type={type}
      icon={icon}
      iconPosition={iconPosition}
      disabled={disabled}
      className={classNames(
        ' text-background-secondary transition',
        disabled ? 'bg-primary-disabled' : 'bg-primary hover:bg-primary-hover',
        className
      )}
      onClick={onClick}
    />
  );
};

export const SecondaryButton = ({
  title,
  type = 'button',
  icon,
  iconPosition = 'left',
  disabled = false,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      title={title}
      type={type}
      icon={icon}
      iconPosition={iconPosition}
      disabled={disabled}
      className={classNames(
        ' text-text  transition',
        disabled
          ? 'bg-background-secondary-hover'
          : 'bg-background-secondary hover:bg-background-secondary-hover',
        className
      )}
      onClick={onClick}
    />
  );
};

export const AccentButton = ({
  title,
  type = 'button',
  icon,
  iconPosition = 'left',
  disabled = false,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      title={title}
      type={type}
      icon={icon}
      iconPosition={iconPosition}
      disabled={disabled}
      className={classNames(
        'text-background-secondary transition',
        disabled ? 'bg-accent-disabled' : 'bg-accent hover:bg-accent-hover',
        className
      )}
      onClick={onClick}
    />
  );
};

export const WarningButton = ({
  title,
  type = 'button',
  icon,
  iconPosition = 'left',
  disabled = false,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      title={title}
      type={type}
      icon={icon}
      iconPosition={iconPosition}
      disabled={disabled}
      className={classNames(
        'text-background-secondary transition',
        disabled ? 'bg-warning-disabled' : 'bg-warning hover:bg-warning-hover',
        className
      )}
      onClick={onClick}
    />
  );
};

export const ErrorButton = ({
  title,
  type = 'button',
  icon,
  iconPosition = 'left',
  disabled = false,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      title={title}
      type={type}
      icon={icon}
      iconPosition={iconPosition}
      disabled={disabled}
      className={classNames(
        'text-background-secondary transition',
        disabled ? 'bg-error-disabled' : 'bg-error hover:bg-error-hover',
        className
      )}
      onClick={onClick}
    />
  );
};

export const TransparentButton = ({
  title,
  type = 'button',
  icon,
  iconPosition = 'left',
  disabled = false,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      title={title}
      type={type}
      icon={icon}
      iconPosition={iconPosition}
      disabled={disabled}
      className={classNames(
        'text-text hover:bg-background-secondary-hover transition',
        disabled ? 'bg-background-secondary-hover' : 'bg-transparent',
        className
      )}
      onClick={onClick}
    />
  );
};

type TypedButtonProps = ButtonProps & {
  variant: 'primary' | 'secondary' | 'accent' | 'warning' | 'error' | 'transparent';
};

export const TypedButton = (props: TypedButtonProps) => {
  const { variant, ...restProps } = props;
  switch (variant) {
    case 'primary':
      return <PrimaryButton {...restProps} />;
    case 'secondary':
      return <SecondaryButton {...restProps} />;
    case 'accent':
      return <AccentButton {...restProps} />;
    case 'warning':
      return <WarningButton {...restProps} />;
    case 'error':
      return <ErrorButton {...restProps} />;
    case 'transparent':
      return <TransparentButton {...restProps} />;
    default:
      return null;
  }
};

export const ButtonLink = ({ title, to, ...props }: LinkProps) => {
  return (
    <Link
      to={to}
      className={'inline-block px-4 py-2 rounded transition'}
      title={title}
      {...props}
    ></Link>
  );
};

export const SubmitButton = ({ title, ...props }: ButtonProps) => {
  return <PrimaryButton title={title || _('Submit')} type="submit" {...props} />;
};
