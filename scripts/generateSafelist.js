const fs = require("fs");

const colors = [];

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
