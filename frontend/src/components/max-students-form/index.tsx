import * as yup from "yup";
import { FREE_STUDENTS_CAPACITY_LIMIT, UNLIMITED_STUDENTS_CAPACITY_THRESHOLD } from "@/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { FC } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "components/ui/form";
import { _ } from "@/translates";
import { Slider } from "components/ui/slider";
import { PrimaryButton } from "components/common/button";

const schema = yup.object().shape({
  maxStudents: yup
    .number()
    .required()
    .min(FREE_STUDENTS_CAPACITY_LIMIT)
    .max(UNLIMITED_STUDENTS_CAPACITY_THRESHOLD),
});

interface Props {
  maxStudents: number;
  onSubmit: (maxStudents: number) => void;
}

export const MaxStudentsForm: FC<Props> = ({ maxStudents, onSubmit }) => {
  const form = useForm({
    resolver: yupResolver(schema),
    values: {
      maxStudents: maxStudents,
    },
  });

  const isDirty = form.formState.isDirty;

  const handleSubmit = (data: { maxStudents: number }) => {
    onSubmit(data.maxStudents);
    form.reset(data);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="maxStudents"
            render={({ field }) => (
              <FormItem className="flex gap-2">
                <FormLabel className="min-w-xs gap-0">
                  {_("Maximum Number of Students")}:{" "}
                  <span className="font-bold">
                    {field.value === UNLIMITED_STUDENTS_CAPACITY_THRESHOLD
                      ? _("Unlimited")
                      : field.value}
                  </span>
                </FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={FREE_STUDENTS_CAPACITY_LIMIT}
                    max={UNLIMITED_STUDENTS_CAPACITY_THRESHOLD}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end mt-4">
            <PrimaryButton disabled={!isDirty} className="w-xs" title={_("Save")} type="submit" />
          </div>
        </form>
      </Form>
    </div>
  );
};
