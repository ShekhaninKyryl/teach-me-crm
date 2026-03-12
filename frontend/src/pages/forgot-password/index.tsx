import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitButton } from "components/common/button";
import { _ } from "@/translates";
import { Logo } from "components/logo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import userApi from "@/api/user";

const forgotPasswordSchema = yup.object({
  email: yup.string().email(_("Invalid email")).required("Email is required"),
});

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const [isSent, setIsSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await userApi.forgotPassword(data.email);
      setIsSent(true);
    } catch {
      // error is already shown via toast in the API layer
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-background shadow-md rounded px-8 pt-6 pb-8 w-96"
        >
          <div className="flex flex-col items-center">
            <Logo className="w-20 h-20 hover:text-chart-2 transition" />
          </div>

          <div className="flex gap-2 flex-col mt-4 mb-6">
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">
                    {_("Email")}
                    <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSent ? (
              <p className="text-sm text-muted-foreground">
                {_("If this email exists, password reset instructions have been sent.")}
              </p>
            ) : null}
          </div>

          <SubmitButton title={_("Send reset link")} className="w-full" />
        </form>
      </Form>
    </div>
  );
};
