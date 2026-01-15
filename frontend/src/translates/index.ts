import i18next from './i18n';

export const _ = (key: string, replace?: Record<string, string | number>): string => {
  let translatedKey = i18next.t(key) || key;

  if (replace) {
    Object.keys(replace).forEach((k) => {
      const value = replace[k];
      translatedKey = translatedKey.replace(`{${k}}`, String(value));
    });
  }

  return translatedKey;
};
