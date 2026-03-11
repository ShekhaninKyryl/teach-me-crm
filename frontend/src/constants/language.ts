export const DEFAULT_LANGUAGE = "ua" as const;
export const SUPPORTED_LANGUAGES = ["en", "ua"] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const PREFERRED_LANGUAGE_KEY = "preferredLanguage";

export const isSupportedLanguage = (value: string): value is AppLanguage => {
  return SUPPORTED_LANGUAGES.includes(value as AppLanguage);
};
