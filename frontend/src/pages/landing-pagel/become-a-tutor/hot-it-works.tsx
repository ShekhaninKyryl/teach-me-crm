import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { TOP_TUTOR_SLIDE_TIMER } from 'constants/timer';

export const HowItWorks = () => {
  return (
    <div className="w-full">
      <div className="shadow-lg mx-10">
        <Carousel
          plugins={[
            Autoplay({
              delay: TOP_TUTOR_SLIDE_TIMER,
            }),
          ]}
          scrollByKeyboard
        >
          <CarouselContent>
            <CarouselItem>
              <div className=" rounded-xl flex flex-col items-center justify-center h-100 bg-primary text-accent text-xl">
                Easily find students and grow your income
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className=" rounded-xl flex flex-col items-center justify-center h-100 bg-primary text-accent text-xl">
                Manage your schedule in one place
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className=" rounded-xl flex flex-col items-center justify-center h-100 bg-primary text-accent text-xl">
                Secure payments and fast withdrawals
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
