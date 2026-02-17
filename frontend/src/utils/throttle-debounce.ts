import { FILTER_DEBOUNCE_TIMER } from 'constants/timer';

export const throttle = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let lastCall = 0;
  return function (...args: Parameters<T>): ReturnType<T> | void {
    const now = Date.now();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay = FILTER_DEBOUNCE_TIMER
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
