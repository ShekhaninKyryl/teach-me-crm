import classNames from 'classnames';

type LoadingProps = {
  size?: number;
  color?: string;
};

export const Loading = ({ size = 8, color = 'primary' }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={classNames(
          'animate-spin rounded-full border-t-2 border-b-2 border-solid',
          `border-${color}`,
          `w-${size} h-${size}`
        )}
      ></div>
    </div>
  );
};
