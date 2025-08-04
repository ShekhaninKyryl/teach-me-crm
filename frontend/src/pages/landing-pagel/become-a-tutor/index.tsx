import { type FC, useState } from 'react';
import { HowItWorks } from 'pages/landing-pagel/become-a-tutor/hot-it-works';
import FormStart, { type TutorStartFormData } from 'pages/landing-pagel/become-a-tutor/form-start';
import { Carousel, CarouselContent, CarouselItem } from 'components/ui/carousel';
import FormExperience, {
  type TutorExperienceFormData,
} from 'pages/landing-pagel/become-a-tutor/form-experience';
import { type CarouselApi } from '@/components/ui/carousel';
import FormContacts, {
  type TutorContactsFormData,
} from 'pages/landing-pagel/become-a-tutor/form-contacts';

type TutorFormData = Partial<TutorStartFormData | TutorExperienceFormData | TutorContactsFormData>;

const BecomeATutor: FC = ({}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [tutorData, setTutorData] = useState<TutorFormData>({});

  const handleSubmit = (data: TutorFormData) => {
    if (api) api.scrollNext();
    setTutorData({ ...tutorData, ...data });
  };

  const handleGoBack = () => {
    if (api) api.scrollPrev();
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      <HowItWorks />

      <Carousel
        className="w-full"
        opts={{
          align: 'center',
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
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BecomeATutor;
