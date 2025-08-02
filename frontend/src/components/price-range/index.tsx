import { Slider } from 'components/ui/slider';
import { _ } from '@/translates';
import { Label } from 'components/ui/label';

type PriceRangeProps = {
  value: number[];
  min: number;
  max: number;
  step?: number;
  onChange: (range: number[]) => void;
};

export const PriceRange: React.FC<PriceRangeProps> = ({ value, min, max, step = 1, onChange }) => {
  if (!value.length) return null;

  const priceText = _(`Price: {VAL1} - {VAL2} UAH`, { VAL1: value[0], VAL2: value[1] });

  return (
    <div className="flex flex-col gap-2">
      <Label>{priceText}</Label>
      <Slider
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};
