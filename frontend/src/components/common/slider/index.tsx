import * as React from 'react';
import { Range } from 'react-range';
import classNames from 'classnames';

type RangeSliderProps = {
  min?: number;
  max?: number;
  step?: number;
  values: number[];
  onChange: (values: number[]) => void;
  className?: string;
};

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  values,
  onChange,
  className,
}) => {
  return (
    <div className={classNames('w-full flex flex-col items-center', className)}>
      <Range
        step={step}
        min={min}
        max={max}
        values={values}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div {...props} className="w-full h-2 bg-background-secondary-hover rounded relative">
            <div
              className="absolute h-2 bg-primary rounded"
              style={{
                left: `${((values[0] - min) / (max - min)) * 100}%`,
                width: `${((values[1] - values[0]) / (max - min)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className="w-8 h-8 border-primary border-2 bg-background-secondary rounded-md flex items-center justify-center text-text text-xs font-bold shadow cursor-pointer"
          >
            {values[index]}
          </div>
        )}
      />
    </div>
  );
};
