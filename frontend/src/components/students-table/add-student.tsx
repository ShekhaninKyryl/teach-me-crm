import { type FC, useState } from "react";
import { Flex } from "@radix-ui/themes";
import { PrimaryButton, TransparentButton } from "components/common/button";
import { _ } from "@/translates";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import * as yup from "yup";
import emailApi from "api/email";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "components/ui/input";
import type { User } from "@shared/types/user";
import user from "@/api/user";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";
import { v4 as uuidv4 } from "uuid";

const schema = yup.object().shape({
  email: yup
    .string()
    .default("")
    .email("Invalid email")
    .test("email-exists", "Email not found", (value, context) => {
      const v = (value ?? "").trim();
      if (!v) return true;

      return emailApi
        .checkEmailExists(v)
        .then((response) => {
          if (response) return true;
          return context.createError({ message: "Email not found" });
        })
        .catch((error) => {
          return context.createError({
            message: error.message,
          });
        });
    }),
  name: yup
    .string()
    .default("")
    .when("email", {
      is: (val: string) => !val || val.trim() === "",
      then: (schema) => schema.required("Name is required when email is not provided"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export type AddStudentFormData = yup.InferType<typeof schema>;

interface AddStudentProps {
  onChange: (student: User) => void;
}

export const AddStudent: FC<AddStudentProps> = ({ onChange }) => {
  const form = useForm<AddStudentFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const [open, setOpen] = useState(false);

  const handleIsOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    form.reset();
  };

  const handleSubmit = async (studentData: AddStudentFormData) => {
    const emailTrimmed = (studentData.email ?? "").trim();
    if (!emailTrimmed) {
      onChange({
        id: "new-" + uuidv4(),
        email: "",
        name: studentData.name,
      });
      handleIsOpen(false);
      return;
    }

    const foundStudent = await user.getUserByEmail(studentData.email);
    onChange({
      id: foundStudent.id,
      email: foundStudent.email,
      name: foundStudent.name,
    });
    handleIsOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={handleIsOpen}>
      <DialogTrigger>
        <TransparentButton
          title={_("Add Student")}
          icon="plus"
          className="cursor-pointer w-md"
          onClick={() => handleIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{_("Add Student")}</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="">
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">{_("Email")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center mt-4">{_("or")}</div>
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">{_("Name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Flex gap="3" mt="4" justify="center" className="mt-4">
              <PrimaryButton
                disabled={form.formState.isSubmitting}
                title={_("Add")}
                type="submit"
                className="w-full"
              />
            </Flex>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
