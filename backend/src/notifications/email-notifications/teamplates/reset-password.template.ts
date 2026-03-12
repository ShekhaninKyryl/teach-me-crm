const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "#";
    }
    return url;
  } catch {
    return "#";
  }
};

type ResetPasswordTemplateLocale = {
  subject: string;
  greeting: (userName?: string) => string;
  resetMessage: string;
  ignoreMessage: string;
  regards: string;
  teamName: string;
  ctaLabel: string;
};

const emailTemplates: Record<string, ResetPasswordTemplateLocale> = {
  en: {
    subject: "Password Reset Request",
    greeting: (userName?: string) =>
      userName ? `Hello ${userName},` : "Hello,",
    resetMessage:
      "You have requested to reset your password. Please use the following link to set a new password:",
    ignoreMessage: "If you did not request this, please ignore this email.",
    regards: "Best regards,",
    teamName: "The TeachMe Team",
    ctaLabel: "Reset Password",
  },
  ua: {
    subject: "Запит на скидання пароля",
    greeting: (userName?: string) =>
      userName ? `Вітаємо, ${userName}!` : "Вітаємо!",
    resetMessage:
      "Ви надіслали запит на скидання пароля. Перейдіть за посиланням, щоб встановити новий пароль:",
    ignoreMessage: "Якщо це були не ви, просто проігноруйте цей лист.",
    regards: "З повагою,",
    teamName: "Команда TeachMe",
    ctaLabel: "Скинути пароль",
  },
};

const resolveTemplate = (language: string): ResetPasswordTemplateLocale => {
  return emailTemplates[language] ?? emailTemplates.en;
};

export const buildResetPasswordEmailTemplate = (
  resetPasswordLink: string,
  userName?: string,
  language: string = "en",
) => {
  const template = resolveTemplate(language);

  const safeUserName = userName ? escapeHtml(userName) : undefined;
  const safeResetPasswordLink = sanitizeUrl(resetPasswordLink);

  const text = [
    template.greeting(userName),
    "",
    template.resetMessage,
    resetPasswordLink,
    template.ignoreMessage,
    "",
    template.regards,
    template.teamName,
  ].join("\n");

  const html = `
  <p>${template.greeting(safeUserName)}</p>
  <p>${template.resetMessage}</p>
  <p><a href="${safeResetPasswordLink}">${template.ctaLabel}</a></p>
  <p>${template.ignoreMessage}</p>
  <p>${template.regards}<br>${template.teamName}</p>
  `;

  return {
    subject: template.subject,
    text,
    html,
  };
};
