import type { FC } from "react";
import { useAppearance } from "@/contexts/appearance-context";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@radix-ui/themes";

const MotionIconButton = motion.create(IconButton);

export const AppearanceToggle: FC = () => {
  const { toggleAppearance, appearance } = useAppearance();
  const isDark = appearance === "dark";

  return (
    <MotionIconButton
      variant="ghost"
      onClick={toggleAppearance}
      animate={{
        color: !isDark ? "var(--amber-9)" : "var(--indigo-9)",
      }}
      style={{
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "transparent",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={appearance}
          initial={{ y: 20, x: -10, rotate: -90, opacity: 0 }}
          animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -20, x: 10, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ display: "flex" }}
        >
          {!isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.div>
      </AnimatePresence>
    </MotionIconButton>
  );
};
