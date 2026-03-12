const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
} as const;

export const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (char) => HTML_ESCAPE_MAP[char as keyof typeof HTML_ESCAPE_MAP] ?? char,
  );
