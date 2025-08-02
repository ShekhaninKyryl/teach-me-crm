import { type FC, useState } from 'react';
import { HowItWorks } from 'pages/landing-pagel/become-a-tutor/hot-it-works';
import FormStart, { type TutorStartFormData } from 'pages/landing-pagel/become-a-tutor/form-start';
import { Carousel, CarouselContent, CarouselItem } from 'components/ui/carousel';
import FormExperience from 'pages/landing-pagel/become-a-tutor/form-experience';
import { type CarouselApi } from '@/components/ui/carousel';

type TutorFormData = TutorStartFormData;

const BecomeATutor: FC = ({}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [tutorData, setTutorData] = useState<TutorFormData>();

  const handleSubmitStart = (data: TutorStartFormData) => {
    if (api) api.scrollNext();
    setTutorData(data);
  };

  console.log(tutorData);

  return (
    <div className="flex-1 flex flex-col">
      <HowItWorks />

      <div className="my-20">
        <Carousel
          opts={{
            align: 'center',
            loop: false,
            watchDrag: false,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            <CarouselItem className="flex justify-center items-center">
              <FormStart onSubmit={handleSubmitStart} />
            </CarouselItem>
            <CarouselItem className="flex justify-center items-center">
              <FormExperience onSubmit={(data) => {}} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default BecomeATutor;
