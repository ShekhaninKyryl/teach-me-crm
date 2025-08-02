export const _ = (key: string, replace?: Record<string, string | number>): string => {
  if (replace) {
    Object.keys(replace).forEach((k) => {
      const value = replace[k];
      key = key.replace(`{${k}}`, String(value));
    });
  }

  return key;
};
