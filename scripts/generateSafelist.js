const fs = require("fs");

const colors = [
  "primary",
  "primary-hover",
  "primary-disabled",
  "accent",
  "accent-hover",
  "accent-disabled",
  "error",
  "error-hover",
  "error-disabled",
  "warning",
  "warning-hover",
  "warning-disabled",
  "background",
  "surface",
  "background-secondary",
  "background-secondary-hover",
  "text",
  "text-secondary",
  "border",
];

const prefixes = ["text", "bg", "border"];

const safelist = [];

colors.forEach((color) => {
  const isBackgroundOnly =
    color.startsWith("background") || color === "surface";
  const isDisabled = color.includes("disabled");
  const isHoverColor = color.includes("hover");

  prefixes.forEach((prefix) => {
    // Правило: для background/surface немає text-*
    if (isBackgroundOnly && prefix === "text") return;

    // Додаємо базовий клас
    safelist.push(`${prefix}-${color}`);

    // Додаємо hover: тільки якщо це базовий колір (не disabled і не hover)
    if (!isDisabled && !isHoverColor && !isBackgroundOnly) {
      safelist.push(`hover:${prefix}-${color}`);
    }
  });
});

// Запис у JSON-файл
fs.writeFileSync(
  "../frontend/safelist.json",
  JSON.stringify(safelist, null, 2),
  "utf8",
);

console.log(
  `✅ Safelist згенеровано! ${safelist.length} класів записано у safelist.json`,
);
