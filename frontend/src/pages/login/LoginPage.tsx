import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitButton } from "components/common/button";
import { _ } from "@/translates";
import { Logo } from "components/logo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { useAuth } from "@/contexts/auth-context";

const loginSchema = yup.object({
  email: yup.string().email(_("Invalid email")).required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export const LoginPage = () => {
  const { login } = useAuth();
  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data.email, data.password);
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">
                    {_("Password")}
                    <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton title={_("Login")} className="w-full" />
        </form>
      </Form>
    </div>
  );
};
