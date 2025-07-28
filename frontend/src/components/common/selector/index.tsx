import { ChevronDown, X } from 'lucide-react';
import { SelectorBase, type Option } from 'components/common/selector/selectro-base';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SelectorProps = {
  options: Option[];
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string | undefined) => void;
};

export const Selector = ({ options, value, placeholder, className, onChange }: SelectorProps) => {
  const selected = options.find((opt) => opt.value === value);

  return (
    <SelectorBase
      options={options}
      value={value}
      onChange={onChange}
      renderMain={({ open, setOpen }) => (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex items-center justify-between w-full bg-background hover:bg-surface border text-text py-2 px-4 rounded cursor-pointer ${className}`}
        >
          {selected?.label ? (
            <span className="flex items-center gap-2">
              {selected?.icon && <FontAwesomeIcon icon={selected.icon} className="mr-2" />}
              {selected?.label}
            </span>
          ) : (
            <span className="text-text-secondary">{placeholder}</span>
          )}
          <span className="flex gap-1">
            {value && (
              <X
                className="w-4 h-4 hover:text-error-hover"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.(undefined);
                }}
              />
            )}
            <ChevronDown className="w-4 h-4" />
          </span>
        </button>
      )}
    />
  );
};
