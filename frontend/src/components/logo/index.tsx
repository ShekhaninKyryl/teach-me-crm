import type { FC } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import OwlIcon from 'assets/icons/owl-illustrations-2.svg?react';

type LogoProps = {
  className?: string;
};

export const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <Link to="/">
      <OwlIcon className={classNames('h-12 w-12', className)} />
    </Link>
  );
};
