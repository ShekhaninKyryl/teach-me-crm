import { Link as RRDLink } from 'react-router-dom';
import classNames from 'classnames';

export type LinkProps = {
  to: string;
  title: string;
  isActive?: boolean;
  className?: string;
};

export const Link = ({ to, isActive, title, className }: LinkProps) => {
  return (
    <RRDLink
      to={to}
      className={classNames(
        `transition-colors duration-200 font-medium px-2 py-1 rounded 
              hover:text-primary-hover hover:underline 
              ${isActive ? 'text-primary font-semibold underline' : 'text-text'}
            `,
        className
      )}
    >
      {title}
    </RRDLink>
  );
};
