import { Button } from "components/ui/button";
import { _ } from "@/translates";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "components/ui/form";
import * as yup from "yup";
import { useState, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AvatarField } from "components/avatar-field";

const schema = yup.object().shape({
  avatar: yup.string().default(""),
});

export type TutorAvatarData = yup.InferType<typeof schema>;

type FormStartProps = {
  onSubmit: (form: TutorAvatarData) => void;
  onBack: () => void;
};

const FormAvatar: FC<FormStartProps> = ({ onSubmit, onBack }) => {
  const form = useForm<TutorAvatarData>({
    resolver: yupResolver(schema),
  });
  const [imageSrc, setImageSrc] = useState<string>();

  const handleImageChange = (image: string) => {
    setImageSrc(image);
    form.setValue("avatar", image);
  };

  const handleSubmit = (data: TutorAvatarData) => {
    onSubmit(data);
  };

  return (
    <section className="w-full max-w-lg bg-surface rounded-xl shadow-2xl p-6 my-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">{_("Upload your image")}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <AvatarField initialImage={imageSrc} onImageChange={handleImageChange} />
          <div className="flex gap-2">
            <Button type="button" onClick={onBack} variant="outline" className="flex-1">
              <FontAwesomeIcon icon="arrow-left" />
              {_("Verify previous form")}
            </Button>
            <Button type="submit" className="flex-1">
              {_("Preview you results")}
              <FontAwesomeIcon icon="arrow-right" />
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default FormAvatar;
