export const FORMAT_OPTIONS = {
  Online: "online",
  Offline: "offline",
} as const;

export type Format = (typeof FORMAT_OPTIONS)[keyof typeof FORMAT_OPTIONS];
