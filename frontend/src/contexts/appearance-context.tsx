import React, { createContext, useContext, useState, useEffect } from "react";

type Appearance = "light" | "dark" | "inherit";

interface AppearanceContextType {
  appearance: Appearance;
  setAppearance: (value: Appearance) => void;
  toggleAppearance: () => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const AppearanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [appearance, setAppearance] = useState<Appearance>(() => {
    return (localStorage.getItem("appearance") as Appearance) || "dark";
  });

  useEffect(() => {
    localStorage.setItem("appearance", appearance);
  }, [appearance]);

  const toggleAppearance = () => {
    setAppearance((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance, toggleAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("useAppearance must be used within AppearanceProvider");
  return context;
};
