import type { FORMAT_OPTIONS } from 'constants/format';

export type Format = (typeof FORMAT_OPTIONS)[keyof typeof FORMAT_OPTIONS];
