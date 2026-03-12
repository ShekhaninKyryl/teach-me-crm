import { Button } from "components/ui/button";
import { _ } from "@/translates";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import * as yup from "yup";
import { type FC, useEffect, useMemo, useState } from "react";
import { type Format, FORMAT_OPTIONS } from "@shared/types/common";
import { Checkbox } from "components/ui/checkbox";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Input } from "components/ui/input";
import type { Subject } from "types/subject";
import { SelectorInput } from "components/common/selector/selector-input";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import subjectApi from "api/subject";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { X } from "lucide-react";
import { Badge } from "components/ui/badge";
import { Loading } from "components/common/loading";
import { Tooltip, TooltipContent, TooltipTrigger } from "components/ui/tooltip";

// Helper function to convert format value to translation key
const getFormatTranslationKey = (format: Format): string => {
  return format === "online" ? "Online" : format === "offline" ? "Offline" : format;
};

const schema = yup
  .object({
    bio: yup.string().default(""),

    formats: yup
      .array()
      .of(
        yup
          .mixed<Format>()
          .oneOf(Object.values(FORMAT_OPTIONS) as Format[], "Format must be Online or Offline")
          .required()
      )
      .min(1, "Select at least one format") // щоб масив не був пустий
      .required("Format is required")
      .default([]),

    location: yup
      .string()
      .when("formats", {
        is: (formats: Format[]) => formats?.includes(FORMAT_OPTIONS.Offline),
        then: (schema) => schema.required("Location is required for offline format"),
        otherwise: (schema) => schema.optional(),
      })
      .default(""),

    subjects: yup.array().of(yup.string().required()).required().default([]),

    price: yup.number().required().min(0).default(0),
  })
  .required();

export type TutorExperienceFormData = yup.InferType<typeof schema>;

type FormExperienceProps = {
  onSubmit: (form: TutorExperienceFormData) => void;
  onBack: () => void;
};

const FormExperience: FC<FormExperienceProps> = ({ onSubmit, onBack }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubjectsLoading, setSubjectsLoading] = useState(false);
  const form = useForm<TutorExperienceFormData>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault() as TutorExperienceFormData,
  });

  useEffect(() => {
    setSubjectsLoading(true);
    subjectApi
      .getSubjects()
      .then((res) => setSubjects(res as Subject[]))
      .finally(() => setSubjectsLoading(false));
  }, []);
  const selectedSubjects = form.watch("subjects");
  const filteredSubjects = useMemo(
    () => subjects.filter((s) => !selectedSubjects.includes(s.label)),
    [selectedSubjects, subjects]
  );

  const selectedFormats = form.watch("formats");

  const isOfflineSelected = selectedFormats.includes(FORMAT_OPTIONS.Offline);

  const handleSubmit = (data: TutorExperienceFormData) => {
    onSubmit(data);
  };

  return (
    <section className="w-full max-w-lg bg-surface rounded-xl shadow-2xl p-6 my-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">{_("Share your experience")}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="formats"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-0">
                  {_("Format")}
                  <span>*</span>
                </FormLabel>
                <div className="flex gap-4 mt-2">
                  {Object.values(FORMAT_OPTIONS).map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <Checkbox
                        title={option}
                        checked={field.value?.includes(option)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value || []), option]);
                          } else {
                            field.onChange(field.value?.filter((v?: Format) => v !== option) || []);
                          }
                        }}
                      />
                      <Label>{_(getFormatTranslationKey(option))}</Label>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {isOfflineSelected && (
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">
                    {_("Location")}
                    <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={_("Enter your location")} />
                  </FormControl>
                  <FormDescription>{_("Provide your city")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="subjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-0">{_("Subjects")}</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((val) => {
                    const subj = subjects.find((o) => o.label === val);
                    return (
                      <Badge key={subj?.id}>
                        {subj?.faIcon && <FontAwesomeIcon icon={subj.faIcon} className="mr-1" />}
                        {subj?.label}
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(field.value.filter((fValue) => fValue !== val))
                          }
                          className="hover:text-secondary cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>

                <FormControl>
                  {isSubjectsLoading ? (
                    <Loading />
                  ) : (
                    <div className="flex items-center gap-2">
                      <SelectorInput
                        options={filteredSubjects.map((subject) => ({
                          value: subject.label,
                          label: subject.label,
                          icon: subject.faIcon as IconProp,
                        }))}
                        placeholder={_("Select subject")}
                        value={undefined}
                        onChange={(val) => {
                          if (!val) return;
                          if (!field.value.includes(val)) {
                            field.onChange([...field.value, val]);
                          }
                        }}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FontAwesomeIcon
                            className="cursor-pointer"
                            size="lg"
                            icon="question-circle"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{_("create_subject.tooltip")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </FormControl>

                <FormMessage />
                <FormDescription>{_("You can select multiple subjects")}</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-0">{_("Price per hour")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>{_("Enter your hourly rate in UAH")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"bio"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{_("Biography")}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  {_(
                    "Describe your experience, also describe here details of you work, applicable methods and any other information what can help a student makes a correct chosen"
                  )}
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="button" onClick={onBack} variant="outline" className="flex-1">
              <FontAwesomeIcon icon="arrow-left" />
              {_("Verify previous form")}
            </Button>
            <Button type="submit" className="flex-1">
              {_("Let's go to contact information")}
              <FontAwesomeIcon icon="arrow-right" />
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default FormExperience;
