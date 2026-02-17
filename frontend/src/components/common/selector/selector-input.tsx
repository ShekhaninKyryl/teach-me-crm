import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { _ } from "@/translates";

interface Option {
  value: string;
  label: string;
  icon?: IconProp;
}

interface SelectorInputProps {
  options: Option[];
  value?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}

export function SelectorInput({ options, value, placeholder, onChange }: SelectorInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [popoverWidth, setPopoverWidth] = React.useState<number | undefined>(undefined);

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? undefined : currentValue;
    onChange?.(newValue || "");
    setOpen(false);
  };

  // Встановлюємо ширину поповеру = ширині тригера
  React.useEffect(() => {
    if (triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, [open]); // оновлюємо при відкритті

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedOption ? selectedOption.label : placeholder}
            <div className="flex items-center gap-1">
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align="start" style={{ width: popoverWidth ?? "auto" }}>
          <Command>
            <CommandInput
              placeholder={_("Search")}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>{_("Not found")}</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
                  .map((opt) => (
                    <CommandItem key={opt.value} onSelect={() => handleSelect(opt.value)}>
                      {opt.icon && <FontAwesomeIcon icon={opt.icon} className="mr-2" />}
                      {opt.label}
                      {value === opt.value && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
