import { Dialog, DialogContent, DialogTitle } from "components/ui/dialog";
import { type FC, useEffect } from "react";
import { _, _safe } from "@/translates";
import { type Event, EventStatus, type EventStatusType } from "@shared/types/event";
import type { User } from "@shared/types/user";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { v4 as uuidv4 } from "uuid";
import { Button } from "components/ui/button";
import { SelectorInput } from "components/common/selector/selector-input";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { DateTimePicker } from "components/date-time-picker";
import { getLocalizedLessonTitle } from "components/calendar/functions";

const schema = yup.object().shape({
  studentId: yup.string().required("Student is required"),
  title: yup.string().required("Title is required"),
  description: yup.string().default(""),
  weekly: yup.boolean().default(false),
  timeRange: yup.object().shape({
    start: yup.date().required("Start time is required"),
    end: yup
      .date()
      .required("End time is required")
      .min(yup.ref("start"), "End time must be after start time")
      .test(
        "is-not-equal",
        "End time cannot be exactly the same as start time",
        (value, context) => {
          const { start } = context.parent;
          return !value || !start || value.getTime() !== start.getTime();
        }
      )
      .test(
        "min-range",
        "Between start and end time must be at least 30 minutes",
        (value, context) => {
          const { start } = context.parent;
          if (!value || !start) return true;
          const diff = (value.getTime() - start.getTime()) / (1000 * 60);
          return diff >= 30;
        }
      ),
  }),
  status: yup
    .mixed<EventStatusType>()
    .oneOf(Object.values(EventStatus))
    .required("Status is required"),
  price: yup
    .string()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .when("status", {
      is: EventStatus.Paid,
      then: (schema) => schema.required("Price is required when lesson is paid"),
      otherwise: (schema) => schema.optional().nullable(),
    })
    .default(""),
});

export type EventFormData = yup.InferType<typeof schema>;

interface Props {
  open: boolean;
  tutorId: string;
  selectedEvent?: Event;
  students: User[];
  timeRange?: {
    start: Date;
    end: Date;
  };
  onSubmit: (event: Event) => void;
  onCancel: () => void;
}

export const EventDialog: FC<Props> = ({
  open,
  tutorId,
  selectedEvent,
  students,
  timeRange,
  onSubmit,
  onCancel,
}) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...selectedEvent,
      price: selectedEvent?.price?.toString(),
      timeRange: {
        start: new Date(selectedEvent?.timeRange?.start || timeRange?.start || ""),
        end: new Date(selectedEvent?.timeRange?.end || timeRange?.end || ""),
      },
      status: selectedEvent?.status || EventStatus.Pending,
    },
  });

  const isNew = !selectedEvent;
  const isPaidStatus = form.watch("status") === EventStatus.Paid;
  const studentId = form.watch("studentId");
  const title = form.watch("title");

  useEffect(() => {
    if (studentId && !title) {
      const selectedStudent = students.find((s) => s.id === studentId);
      form.setValue("title", getLocalizedLessonTitle(selectedStudent?.name));
    }
  }, [studentId]);

  const handleSubmit = (data: EventFormData) => {
    const event: Event = {
      ...data,
      price: data.price ? +data.price : undefined,
      id: selectedEvent?.id || uuidv4(),
      tutorId,
    };

    form.reset();
    onSubmit(event);
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogTitle>{isNew ? _("Create a New Lesson") : _("Update Lesson")}</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name={"studentId"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">{_("Student")}</FormLabel>
                  <FormControl>
                    <SelectorInput
                      placeholder={_("Select a student")}
                      options={students.map((s) => ({
                        value: s.id,
                        label: s.name,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"title"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">{_("Title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={_("Name your event")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"description"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">{_("Description")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={_("Add additional information")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{_("Lesson date")}</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      startDate={field.value.start}
                      endDate={field.value.end}
                      errors={{
                        start: form.formState.errors.timeRange?.start?.message,
                        end: form.formState.errors.timeRange?.end?.message,
                      }}
                      onChange={([start, end]) => {
                        field.onChange({ start, end });
                      }}
                    />
                  </FormControl>
                  <FormMessage>
                    {_safe(
                      form.formState.errors.timeRange?.end?.message ||
                        form.formState.errors.timeRange?.start?.message ||
                        form.formState.errors.timeRange?.message
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{_("Lessons Status")}</FormLabel>
                  <FormControl>
                    <SelectorInput
                      placeholder={_("Change a lesson`s status")}
                      options={Object.values(EventStatus).map((s) => ({
                        value: s,
                        label: _(s),
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isPaidStatus && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{_("Price")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={_("Enter price for the lesson")}
                        {...field}
                        disabled={form.watch("status") !== EventStatus.Paid}
                      />
                    </FormControl>
                    <FormMessage>{form.formState.errors.price?.message}</FormMessage>
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer">
                {isNew ? _("Create") : _("Update")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
