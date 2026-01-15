const fs = require("fs");
const { execSync } = require("child_process");

const localeFilePath = "src/translates/missed/en/translation.json"; // Adjust to your locale file

// Step 1: Run i18n-unused and capture output
try {
  const output = execSync("npx i18n-unused display-missed", {
    encoding: "utf-8",
  });

  const missingKeys = output.match(/'(.*)'/g).map((v) => v.replace(/'/g, ""));

  console.log("Missing Keys:", missingKeys);

  // Step 2: Read the current locale file
  const localeData = JSON.parse(fs.readFileSync(localeFilePath, "utf-8"));

  // Step 3: Add missing keys to locale file
  missingKeys.forEach((key) => {
    if (!localeData[key]) {
      localeData[key] = ""; // Add the missing key with an empty string or a default value
    }
  });

  // Step 4: Save updated locale file
  fs.writeFileSync(localeFilePath, JSON.stringify(localeData, null, 2));
  console.log("Locale file updated successfully.");
} catch (error) {
  console.error("Error while running the process:", error);
}
