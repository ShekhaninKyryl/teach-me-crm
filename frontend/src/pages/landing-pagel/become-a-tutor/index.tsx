import { type FC, useState } from "react";
import { HowItWorks } from "pages/landing-pagel/become-a-tutor/hot-it-works";
import FormStart, { type TutorStartFormData } from "pages/landing-pagel/become-a-tutor/form-start";
import { Carousel, CarouselContent, CarouselItem } from "components/ui/carousel";
import FormExperience, {
  type TutorExperienceFormData,
} from "pages/landing-pagel/become-a-tutor/form-experience";
import { type CarouselApi } from "@/components/ui/carousel";
import FormContacts, {
  type TutorContactsFormData,
} from "pages/landing-pagel/become-a-tutor/form-contacts";
import FormAvailability, {
  type TutorAvailabilityFormData,
} from "pages/landing-pagel/become-a-tutor/form-availability";
import FormAvatar, { type TutorAvatarData } from "pages/landing-pagel/become-a-tutor/form-avatar";
import TutorPreview from "pages/landing-pagel/become-a-tutor/tutor-preview";
import tutorsApi from "api/tutors";
import { useTranslation } from "react-i18next";
import { isSupportedLanguage } from "@/constants/language";

export type TutorFormData = Partial<
  TutorStartFormData &
    TutorExperienceFormData &
    TutorContactsFormData &
    TutorAvailabilityFormData &
    TutorAvatarData
>;

const BecomeATutor: FC = ({}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [tutorData, setTutorData] = useState<TutorFormData>({});
  const { i18n } = useTranslation();

  const handleSubmit = (data: TutorFormData) => {
    if (api) api.scrollNext();
    setTutorData({ ...tutorData, ...data });
  };

  const handleGoBack = () => {
    if (api) api.scrollPrev();
  };

  const handleCreateAccount = async () => {
    try {
      const { passwordConfirmation: _passwordConfirmation, ...rest } = tutorData;
      await tutorsApi.createTutorProfile({
        ...rest,
        language: isSupportedLanguage(i18n.language) ? i18n.language : undefined,
      });
      window.location.href = `/${i18n.language}/workspace`;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      <HowItWorks />

      <Carousel
        className="w-full"
        opts={{
          align: "center",
          loop: false,
          watchDrag: false,
        }}
        scrollByKeyboard={false}
        setApi={setApi}
      >
        <CarouselContent>
          <CarouselItem className="flex justify-center items-center">
            <FormStart onSubmit={handleSubmit} />
          </CarouselItem>
          <CarouselItem className="flex justify-center items-center">
            <FormExperience onSubmit={handleSubmit} onBack={handleGoBack} />
          </CarouselItem>
          <CarouselItem className="flex justify-center items-center">
            <FormContacts onSubmit={handleSubmit} onBack={handleGoBack} />
          </CarouselItem>
          <CarouselItem className="flex justify-center items-center">
            <FormAvailability onSubmit={handleSubmit} onBack={handleGoBack} />
          </CarouselItem>
          <CarouselItem className="flex justify-center items-center">
            <FormAvatar onSubmit={handleSubmit} onBack={handleGoBack} />
          </CarouselItem>
          <CarouselItem className="flex justify-center items-center">
            <TutorPreview value={tutorData} onSubmit={handleCreateAccount} onBack={handleGoBack} />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BecomeATutor;
