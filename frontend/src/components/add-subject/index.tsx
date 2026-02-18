import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "components/ui/dialog";
import { _ } from "@/translates";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import subjectApi from "api/subject";
import type { Subject } from "types/subject";
import { type FC, useState } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Link } from "components/common/link/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const schema = yup.object().shape({
  label: yup.string().required("Subject name is required").default(""),
  faIcon: yup.string().optional().default(""),
});

type AddSubjectFormData = yup.InferType<typeof schema>;
type AddSubjectProps = {
  onAdded?: (subject: Subject) => void;
};

export const AddSubject: FC<AddSubjectProps> = ({ onAdded }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<AddSubjectFormData>({
    resolver: yupResolver(schema),
    defaultValues: { label: "", faIcon: "" },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: AddSubjectFormData) => {
    setLoading(true);
    try {
      const newSubject = await subjectApi.addSubject({
        id: data.label.toLowerCase().replace(/\s+/g, "-"),
        label: data.label,
        faIcon: (data.faIcon as IconProp) || undefined,
      });

      onAdded?.(newSubject);
      setOpen(false);
      form.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">{_("Add you own subject")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{_("Add a new subject")}</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(handleSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{_("Subject name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={_("Enter subject name")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faIcon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Link
                      title={_("FontAwesome Icon (optional)")}
                      to="https://fontawesome.com/search?ip=classic&ic=free-collection"
                      target="_blank"
                    />
                  </FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={_("e.g. book, atom, music")}
                        className="flex-1"
                      />
                    </FormControl>

                    <div className="flex items-center justify-center w-10 h-10 border rounded-md bg-muted/30">
                      {field.value ? (
                        <FontAwesomeIcon key={field.value} icon={field.value as IconProp} />
                      ) : (
                        <FontAwesomeIcon icon="minus" className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  {_("Cancel")}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {_("Add")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
