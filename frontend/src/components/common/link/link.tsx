import { Link as RRDLink } from "react-router-dom";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

export type LinkProps = {
  title: string;
  to?: string;
  icon?: IconProp;
  rightIcon?: IconProp;
  isActive?: boolean;
  className?: string;
  target?: string;
  onClick?: () => void;
};

export const Link = ({
  to,
  icon,
  rightIcon,
  isActive,
  title,
  className,
  onClick,
  target,
}: LinkProps) => {
  if (!to && !onClick) return null;
  if (onClick)
    return (
      <button
        className={classNames(
          "cursor-pointer transition-colors duration-200 font-medium rounded hover:underline hover:text-chart-2",
          isActive ? "text-chart-2 font-semibold underline" : "text-text",
          className
        )}
        onClick={onClick}
      >
        <div>
          {icon ? <FontAwesomeIcon icon={icon} className="mr-2" /> : null}
          {title}
        </div>
        {rightIcon ? <FontAwesomeIcon icon={rightIcon} className="ml-2" /> : null}
      </button>
    );

  if (to)
    return (
      <RRDLink
        to={to}
        className={classNames(
          "cursor-pointer transition-colors duration-200 font-medium rounded hover:underline hover:text-chart-2",
          isActive ? "text-chart-2 font-semibold underline" : "text-text",
          className
        )}
        target={target}
        onClick={onClick}
      >
        <div>
          {icon ? <FontAwesomeIcon icon={icon} className="mr-2" /> : null}
          {title}
        </div>
        {rightIcon ? <FontAwesomeIcon icon={rightIcon} className="ml-2" /> : null}
      </RRDLink>
    );
};
