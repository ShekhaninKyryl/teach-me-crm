import { X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

type ChicletProps = {
  label: string;
  onClose?: () => void;
  icon?: IconProp;
  className?: string;
};

export const Chiclet: React.FC<ChicletProps> = ({ icon, label, className, onClose }) => {
  return (
    <span
      className={`flex items-center gap-2 bg-accent-hover px-3 py-1 rounded w-fit ${className}`}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      <span className="text-text">{label}</span>
      {onClose && (
        <button onClick={onClose} className="text-text hover:text-text-secondary cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      )}
    </span>
  );
};
