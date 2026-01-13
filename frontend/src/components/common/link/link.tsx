import { Link as RRDLink } from 'react-router-dom';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export type LinkProps = {
  title: string;
  to: string;
  icon?: IconProp;
  isActive?: boolean;
  className?: string;
};

export const Link = ({ to, icon, isActive, title, className }: LinkProps) => {
  return (
    <RRDLink
      to={to}
      className={classNames(
        `transition-colors duration-200 font-medium rounded 
              hover:underline hover:text-chart-2
              ${isActive ? 'text-chart-2 font-semibold underline' : 'text-text'}
            `,
        className
      )}
    >
      {icon ? <FontAwesomeIcon icon={icon} className="mr-2" /> : null}
      {title}
    </RRDLink>
  );
};
