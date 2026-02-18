import type { ReactNode } from "react";
import { useAppearance } from "@/contexts/appearance-context";
import { Theme } from "@radix-ui/themes";

const ThemeWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { appearance } = useAppearance();

  return (
    <Theme className="overflow-clip" appearance={appearance}>
      {children}
    </Theme>
  );
};

export default ThemeWrapper;
