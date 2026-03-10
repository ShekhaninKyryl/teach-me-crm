export const buildResetPasswordEmailTemplate = (
  resetPasswordLink: string,
  userName?: string,
) => {
  const greeting = userName ? `Hello ${userName},` : "Hello,";
  const subject = "Password Reset Request";

  const text = [
    greeting,
    "",
    "You have requested to reset your password. Please use the following link to set a new password:",
    resetPasswordLink,
    "If you did not request this, please ignore this email.",
    "",
    "Best regards,",
    "The TeachMe Team",
  ].join("\n");

  const html = `
  <p>${greeting}</p>
  <p>You have requested to reset your password. Please use the following link to set a new password:</p>
  <p><a href="${resetPasswordLink}">Reset Password</a></p>
  <p>If you did not request this, please ignore this email.</p>
  <p>Best regards,<br>The TeachMe Team</p>
  `;

  return {
    subject,
    text,
    html,
  };
};
