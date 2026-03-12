import { Separator } from "@radix-ui/themes";
import { useLocation } from "react-router-dom";
import { LanguageButton } from "components/language-switcher/language-button";
import { useAuth } from "@/contexts/auth-context";
import type { AppLanguage } from "@/constants/language";

const LanguageSwitcher = () => {
  const location = useLocation();
  const { setLanguage } = useAuth();

  const currentLanguage = location.pathname.split("/")[1];

  const handleLanguageChange = async (newLng: AppLanguage) => {
    await setLanguage(newLng);
  };

  return (
    <div className="flex gap-2">
      <LanguageButton
        label={"Укр"}
        isActive={currentLanguage === "ua"}
        onClick={() => void handleLanguageChange("ua")}
      />
      <Separator orientation="vertical" />
      <LanguageButton
        label={"En"}
        isActive={currentLanguage === "en"}
        onClick={() => void handleLanguageChange("en")}
      />
    </div>
  );
};

export default LanguageSwitcher;
