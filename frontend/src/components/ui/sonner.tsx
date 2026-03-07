import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      richColors={false}
      closeButton
      expand={false}
      visibleToasts={4}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: [
            "group toast",
            "rounded-xl border bg-card text-card-foreground shadow-lg",
            "px-4 py-3",
            "gap-3",
            "data-[mounted=true]:animate-in data-[mounted=true]:slide-in-from-bottom-2",
            "data-[removed=true]:animate-out data-[removed=true]:fade-out-80",
          ].join(" "),

          title: "text-sm font-semibold leading-5",
          description: "text-sm leading-5 text-muted-foreground",

          actionButton: [
            "rounded-lg bg-primary px-3 py-2",
            "text-sm font-medium text-primary-foreground",
            "hover:opacity-90 transition-opacity",
          ].join(" "),

          cancelButton: [
            "rounded-lg bg-muted px-3 py-2",
            "text-sm font-medium text-foreground",
            "hover:bg-muted/80 transition-colors",
          ].join(" "),

          closeButton: [
            "bg-transparent border-0",
            "text-muted-foreground hover:text-foreground",
            "transition-colors",
          ].join(" "),

          success: [
            "!border-emerald-200 dark:!border-emerald-900/60",
            "!bg-card !text-card-foreground",
            "[&_[data-icon]]:text-emerald-600 dark:[&_[data-icon]]:text-emerald-400",
            "border-l-4 border-l-emerald-500",
          ].join(" "),

          error: [
            "!border-red-200 dark:!border-red-900/60",
            "!bg-card !text-card-foreground",
            "[&_[data-icon]]:text-red-600 dark:[&_[data-icon]]:text-red-400",
            "border-l-4 border-l-red-500",
          ].join(" "),

          warning: [
            "!border-amber-200 dark:!border-amber-900/60",
            "!bg-card !text-card-foreground",
            "[&_[data-icon]]:text-amber-600 dark:[&_[data-icon]]:text-amber-400",
            "border-l-4 border-l-amber-500",
          ].join(" "),

          info: [
            "!border-sky-200 dark:!border-sky-900/60",
            "!bg-card !text-card-foreground",
            "[&_[data-icon]]:text-sky-600 dark:[&_[data-icon]]:text-sky-400",
            "border-l-4 border-l-sky-500",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
