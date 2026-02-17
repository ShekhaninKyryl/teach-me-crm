import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { _ } from "@/translates";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import * as yup from "yup";
import { type FC, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Format } from "types/common";
import { FORMAT_OPTIONS } from "constants/format";
import { Checkbox } from "components/ui/checkbox";
import { Label } from "components/ui/label";
import { Badge } from "components/ui/badge";
import { X } from "lucide-react";
import { Loading } from "components/common/loading";
import { SelectorInput } from "components/common/selector/selector-input";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Tooltip, TooltipContent, TooltipTrigger } from "components/ui/tooltip";
import { Textarea } from "components/ui/textarea";
import subjectApi from "api/subject";
import type { Subject } from "types/subject";
import type { Tutor } from "types/tutor";
import { faTelegram, faViber, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { AvatarField } from "components/avatar-field";
import Dialog from "components/dialog";
import AvailabilityTable from "components/availability-table";
import { PrimaryButton } from "components/common/button";
import { getTutorData } from "components/tutor-card/functions";
import TutorCardDialog from "components/tutor-card/tutor-card-dialog";

const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  bio: yup.string().default(""),
  format: yup
    .array()
    .of(
      yup
        .mixed<Format>()
        .oneOf(Object.values(FORMAT_OPTIONS) as Format[], "Format must be Online or Offline")
        .required()
    )
    .min(1, "Select at least one format")
    .required("Format is required")
    .default([]),
  location: yup
    .string()
    .when("format", {
      is: (formats: Format[]) => formats?.includes(FORMAT_OPTIONS.Offline),
      then: (schema) => schema.required("Location is required for offline format"),
      otherwise: (schema) => schema.optional(),
    })
    .default(""),
  subjects: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one subject")
    .required()
    .default([]),
  price: yup.number().required().min(0).default(0),
  phone: yup.string().default(""),
  viber: yup.string().default(""),
  telegram: yup.string().default(""),
  whatsapp: yup.string().default(""),
  availability: yup.array().of(yup.string().required()).default([]),
  avatar: yup.string().default(""),

  currentPassword: yup
    .string()
    .when("password", {
      is: (password: string) => password && password.length > 0,
      then: (schema) => schema.required("Current password is required to set a new password"),
      otherwise: (schema) => schema.optional(),
    })
    .default(""),
  password: yup
    .string()
    .test("len", "Password must be at least 8 characters", (val) => {
      if (!val) return true;
      return val.length >= 8;
    })
    .default(""),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .default(""),
});

export type TutorFormData = yup.InferType<typeof schema>;

type TutorEditFormProps = {
  tutorData: Tutor;
  onSubmit: (form: TutorFormData) => void;
};

export const TutorEditForm: FC<TutorEditFormProps> = ({ tutorData, onSubmit }) => {
  const form = useForm<TutorFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...tutorData,
    },
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubjectsLoading, setSubjectsLoading] = useState(false);

  useEffect(() => {
    setSubjectsLoading(true);
    subjectApi
      .getSubjects()
      .then((res) => setSubjects(res))
      .finally(() => setSubjectsLoading(false));
  }, []);

  const selectedSubjects = form.watch("subjects");
  const filteredSubjects = useMemo(
    () => subjects.filter((s) => !selectedSubjects.includes(s.id)),
    [selectedSubjects, subjects]
  );

  const selectedFormats = form.watch("format");
  const isOfflineSelected = selectedFormats.includes(FORMAT_OPTIONS.Offline);

  const phoneNumber = form.watch("phone");
  const availability = form.watch("availability");

  const { isSubmitting, isValidating, isDirty } = form.formState;
  const isDisabled = isSubmitting || isValidating || !isDirty;

  const handleSubmit = (data: TutorFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="col-span-1 gap-2 grid content-start">
            <h3 className="text-xl font-bold col-span-full border-b-1">
              {_("Profile Information")}
            </h3>
            <FormField
              name={"avatar"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">{_("Avatar")}</FormLabel>
                  <FormControl>
                    <AvatarField initialImage={field.value} onImageChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">{_("Full Name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={_("Enter a Full Name")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">{_("Email")}</FormLabel>
                  <FormControl>
                    <Input disabled {...field} type="email" placeholder={_("Enter an Email")} />
                  </FormControl>
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
                    <Textarea {...field} placeholder={_("Share your experience")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-0">{_("Format")}</FormLabel>
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
                              field.onChange(
                                field.value?.filter((v?: Format) => v !== option) || []
                              );
                            }
                          }}
                        />
                        <Label>{_(option)}</Label>
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
                    <FormLabel className="gap-0">{_("Location")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={_("Enter your location")} />
                    </FormControl>
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
                      const subj = subjects.find((o) => o.id === val);
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
                      <div className="flex gap-2">
                        <SelectorInput
                          options={filteredSubjects.map((subject) => ({
                            value: subject.id,
                            label: subject.label,
                            icon: (subject.faIcon as IconProp) || (subject.icon as IconProp),
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
                        <Button type="button">{_("Add you own subject")}</Button>
                      </div>
                    )}
                  </FormControl>

                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {_("Selected time: ")}</FormLabel>
                  {field.value.length ? (
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((val) => {
                        return (
                          <Badge key={val}>
                            {val}
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
                  ) : null}
                  <FormControl>
                    <Dialog
                      triggerTitle={_("Set up your own availability")}
                      dialogTitle={_("Availability")}
                      description={_(
                        "Please use the availability table below to set up your own availability by selecting time slots that work best for you."
                      )}
                    >
                      <AvailabilityTable step="1h" value={availability} onChange={field.onChange} />
                    </Dialog>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="col-span-1 gap-2 grid content-start">
              <h3 className="text-xl font-bold col-span-full border-b-1">
                {_("Contact Information")}
              </h3>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FontAwesomeIcon icon="phone" />
                      {_("Phone")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+380..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FontAwesomeIcon icon={faTelegram} />
                      {_("Telegram")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center gap-2">
                        <Input {...field} placeholder={_("Add link to your account")} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="viber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FontAwesomeIcon icon={faViber} />
                      {_("Viber")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center gap-2">
                        <Input {...field} placeholder={_("Add phone or group invite")} />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FontAwesomeIcon
                              className="absolute right-2"
                              icon="paste"
                              onClick={() => field.onChange(phoneNumber)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{_("Copy/Past Phone number")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FontAwesomeIcon icon={faWhatsapp} />
                      {_("WhatsApp")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center gap-2">
                        <Input {...field} placeholder={_("Add phone or group invite")} />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FontAwesomeIcon
                              className="absolute right-2"
                              icon="paste"
                              onClick={() => field.onChange(phoneNumber)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{_("Copy/Past Phone number")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1 gap-2 grid content-start">
              <h3 className="text-xl font-bold col-span-full border-b-1">{_("Change Password")}</h3>
              <FormField
                control={form.control}
                name={"currentPassword"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-0">{_("Current Password")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
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
                    <FormLabel className="gap-0">{_("New Password")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"passwordConfirmation"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-0">{_("Confirm Password")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1 gap-2 grid content-start">
              <h3 className="text-xl font-bold col-span-full border-b-1">
                {_("Preview your results")}
              </h3>
              <TutorCardDialog
                tutor={{ ...getTutorData(form.getValues()), id: "new", rating: 5 }}
                preview={true}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <PrimaryButton className="w-xs" type="submit" title={_("Save")} disabled={isDisabled} />
        </div>
      </form>
    </Form>
  );
};
