import { toast } from "sonner";
import { _ } from "@/translates";

type ToastConfig = {
  success?: (result?: any) => void;
  error?: (error?: any) => void;
};

export type ToastMapType<T> = Partial<Record<keyof T, ToastConfig>>;

export const withToast = <T extends object>(api: T, toastMap?: ToastMapType<T>): T => {
  return new Proxy(api, {
    get(target, prop, receiver) {
      const originalMethod = Reflect.get(target, prop, receiver);

      if (typeof originalMethod === "function") {
        return async (...args: any[]) => {
          const config = toastMap?.[prop as keyof T];

          try {
            const result = await originalMethod.apply(target, args);

            if (config?.success) {
              config.success(result);
            }
            return result;
          } catch (error: any) {
            const message = error.response?.data?.message || _("Something went wrong!");
            if (config?.error) {
              config.error(message);
            } else {
              toast.error(`${prop as string} - ${message}`);
            }
            throw error;
          }
        };
      }
      return originalMethod;
    },
  });
};
