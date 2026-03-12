import { FORMAT_OPTIONS, type Format } from "@shared/types/common";

export const getFormatTranslationKey = (format: Format): string => {
  return format === FORMAT_OPTIONS.Online
    ? "Online"
    : format === FORMAT_OPTIONS.Offline
      ? "Offline"
      : format;
};
