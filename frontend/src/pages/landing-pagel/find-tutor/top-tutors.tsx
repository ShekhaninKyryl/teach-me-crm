import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import tutorsApi from 'api/tutors';
import { useEffect, useState } from 'react';
import type { Tutor } from 'types/tutor';
import { TOP_TUTOR_SLIDE_TIMER } from 'constants/timer';
import { Label } from 'components/ui/label';
import { _ } from '@/translates';
import { Loading } from 'components/common/loading';
import TutorCardDialog from 'components/tutor-card/tutor-card-dialog';

export type TopTutorsProps = {};

export const TopTutors: React.FC<TopTutorsProps> = ({}) => {
  const [tutors, setTutor] = useState<Tutor[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    tutorsApi
      .searchTutors('')
      .then((res) => setTutor(res))
      .finally(() => setLoading(false));
  }, []);

  if (isLoading) return <Loading />;

  if (!tutors.length) return null;

  return (
    <div>
      <Label className="mb-2">
        <h2 className=" w-full scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {_('Top Tutors')}
        </h2>
      </Label>
      <Carousel
        className="w-full"
        scrollByKeyboard={false}
        plugins={[
          Autoplay({
            delay: TOP_TUTOR_SLIDE_TIMER,
          }),
        ]}
      >
        <CarouselContent className="py-4">
          {tutors.map((tutor: Tutor) => (
            <CarouselItem key={tutor.id} className="md:basis-1/2 lg:basis-1/3">
              <TutorCardDialog tutor={tutor} top={true} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
