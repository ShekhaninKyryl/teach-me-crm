import { escapeHtml } from "./html-escape.util";

type WelcomeTutorTemplateLocale = {
  subject: string;
  greeting: (userName?: string) => string;
  intro: string;
  ctaLabel: string;
  helpText: string;
  regards: string;
  teamName: string;
};

const emailTemplates: Record<string, WelcomeTutorTemplateLocale> = {
  en: {
    subject: "Welcome to TeachMe!",
    greeting: (userName?: string) => (userName ? `Hello ${userName},` : "Hello,"),
    intro: "Your tutor profile has been created successfully. You can now manage students, calendar, and settings in your workspace.",
    ctaLabel: "Open Workspace",
    helpText: "If you have any questions, just reply to this email.",
    regards: "Best regards,",
    teamName: "The TeachMe Team",
  },
  ua: {
    subject: "Ласкаво просимо до TeachMe!",
    greeting: (userName?: string) => (userName ? `Вітаємо, ${userName}!` : "Вітаємо!"),
    intro: "Ваш профіль викладача успішно створено. Тепер ви можете керувати учнями, календарем та налаштуваннями у своєму workspace.",
    ctaLabel: "Відкрити Workspace",
    helpText: "Якщо у вас є запитання, просто дайте відповідь на цей лист.",
    regards: "З повагою,",
    teamName: "Команда TeachMe",
  },
};

const resolveTemplate = (language: string): WelcomeTutorTemplateLocale => {
  return emailTemplates[language] ?? emailTemplates.en;
};

export const buildWelcomeTutorEmailTemplate = (
  workspaceLink: string,
  userName?: string,
  language: string = "en",
) => {
  const template = resolveTemplate(language);

  const text = [
    template.greeting(userName),
    "",
    template.intro,
    workspaceLink,
    template.helpText,
    "",
    template.regards,
    template.teamName,
  ].join("\n");

  const safeUserName = userName !== undefined ? escapeHtml(userName) : undefined;

  const html = `
  <p>${template.greeting(safeUserName)}</p>
  <p>${template.intro}</p>
  <p><a href="${workspaceLink}">${template.ctaLabel}</a></p>
  <p>${template.helpText}</p>
  <p>${template.regards}<br>${template.teamName}</p>
  `;

  return {
    subject: template.subject,
    text,
    html,
  };
};

