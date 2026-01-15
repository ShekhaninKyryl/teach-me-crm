import classNames from 'classnames';
import type { FC } from 'react';

type LanguageButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export const LanguageButton: FC<LanguageButtonProps> = ({ label, onClick, isActive }) => {
  return (
    <button
      className={classNames(
        'cursor-pointer',
        isActive ? 'text-chart-2 font-semibold' : 'text-text'
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
