import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitButton } from "components/common/button";
import { _ } from "@/translates";
import { Logo } from "components/logo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import userApi from "@/api/user";

const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, _("Password must be at least 8 characters"))
    .required(_("Password is required")),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], _("Passwords must match"))
    .required(_("Password confirmation is required")),
});

type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [isReset, setIsReset] = useState(false);
  const token = searchParams.get("token")?.trim() || "";

  const form = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }

    await userApi.resetPassword({
      token,
      newPassword: data.newPassword,
    });
    setIsReset(true);
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
            <h1 className="text-center text-lg font-semibold">{_("Reset password")}</h1>

            {token ? null : (
              <p className="text-sm text-destructive">
                {_("Reset token is missing or invalid. Please use the link from your email.")}
              </p>
            )}

            <FormField
              control={form.control}
              name={"newPassword"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">
                    {_("New Password")}
                    <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"confirmPassword"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">
                    {_("Confirm Password")}
                    <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isReset ? (
              <p className="text-sm text-muted-foreground">
                {_("Password reset successfully. You can now log in.")}
              </p>
            ) : null}

            <Link to="../login" className="text-sm text-chart-2 hover:underline self-end">
              {_("Back to login")}
            </Link>
          </div>

          <SubmitButton
            title={_("Set new password")}
            className="w-full"
            disabled={!token || isReset}
          />
        </form>
      </Form>
    </div>
  );
};
