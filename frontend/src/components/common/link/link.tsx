import { Link as RRDLink } from 'react-router-dom';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export type LinkProps = {
  title: string;
  to?: string;
  icon?: IconProp;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
};

export const Link = ({ to, icon, isActive, title, className, onClick }: LinkProps) => {
  if (!to && !onClick) return null;
  if (onClick)
    return (
      <button
        className={classNames(
          'cursor-pointer transition-colors duration-200 font-medium rounded hover:underline hover:text-chart-2',
          isActive ? 'text-chart-2 font-semibold underline' : 'text-text',
          className
        )}
        onClick={onClick}
      >
        {icon ? <FontAwesomeIcon icon={icon} className="mr-2" /> : null}
        {title}
      </button>
    );

  if (to)
    return (
      <RRDLink
        to={to}
        className={classNames(
          'cursor-pointer transition-colors duration-200 font-medium rounded hover:underline hover:text-chart-2',
          isActive ? 'text-chart-2 font-semibold underline' : 'text-text',
          className
        )}
        onClick={onClick}
      >
        {icon ? <FontAwesomeIcon icon={icon} className="mr-2" /> : null}
        {title}
      </RRDLink>
    );
};
