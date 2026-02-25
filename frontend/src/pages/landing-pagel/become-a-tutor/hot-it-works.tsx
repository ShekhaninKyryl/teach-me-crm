import Autoplay from "embla-carousel-autoplay";
import { useMemo, useRef, useState } from "react";
import { CalendarDays, ChartArea, UsersRound, User, Gem, Notebook } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { _ } from "@/translates";

const TOP_TUTOR_SLIDE_TIMER = 3500;

type Slide = {
  title: string;
  description: string[];
  Icon: React.ComponentType<{ className?: string }>;
  imageSrc?: string; // UI screenshot
  imageAlt?: string;
};

export const HowItWorks = () => {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Find students faster",
        description: [
          "Get discovered by learners in your city or online",
          "Showcase subjects, formats, and pricing clearly",
          "Get more requests with a strong profile",
        ],
        Icon: User,
        imageSrc: "/find-tutors.png",
        imageAlt: "Tutor search results UI",
      },
      {
        title: "Control your students",
        description: [
          "Accept or decline requests with ease",
          "Communicate directly with students",
          "Build relationships and trust",
        ],
        Icon: UsersRound,
        imageSrc: "/students.png",
        imageAlt: "Students management UI",
      },
      {
        title: "Schedule in one place",
        description: [
          "Create and manage your lesson calendar",
          "Change lesson status and details with a click",
          "Find free time slots and avoid double bookings",
        ],
        Icon: CalendarDays,
        imageSrc: "/calendar.png",
        imageAlt: "Schedule UI",
      },
      {
        title: "Analyze and grow",
        description: [
          "Track requests and lesson activity",
          "Monitor earnings and performance",
          "Make smarter decisions with analytics",
        ],
        Icon: ChartArea,
        imageSrc: "/wip.png",
        imageAlt: "Work in progress - analytics UI coming soon",
      },
      {
        title: "Integrations that help you",
        description: [
          "Telegram bot notifications",
          "Instant alerts about new students and bookings",
          "Don’t miss important updates",
        ],
        Icon: Gem,
        imageSrc: "/wip.png",
        imageAlt: "Work in progress - integrations UI coming soon",
      },
      {
        title: "Manage your assets",
        description: [
          "Upload teaching materials",
          "Organize by subject and level",
          "Reuse content across students",
        ],
        Icon: Notebook,
        imageSrc: "/wip.png",
        imageAlt: "Work in progress - asset management UI coming soon",
      },
    ],
    []
  );

  const autoplay = useRef(
    Autoplay({
      delay: TOP_TUTOR_SLIDE_TIMER,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  const [active, setActive] = useState(0);

  return (
    <div className="w-full px-4 pt-4">
      <div className="mx-auto">
        <div className="rounded-md border border-border/60 bg-card shadow-lg">
          <Carousel
            plugins={[autoplay.current]}
            scrollByKeyboard
            setApi={(api) => {
              if (!api) return;
              const update = () => setActive(api.selectedScrollSnap());
              update();
              api.on("select", update);
            }}
          >
            <CarouselContent className="px-6">
              {slides.map(({ title, description, Icon, imageSrc, imageAlt }, idx) => (
                <CarouselItem key={idx}>
                  <div className="px-5 py-5 sm:px-7 sm:py-6">
                    <div className="grid gap-4 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_720px]">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="text-base sm:text-lg font-semibold text-foreground">
                            {_(title)}
                          </div>
                        </div>

                        <ul className="mt-3 list-disc pl-5 text-sm sm:text-base text-muted-foreground">
                          {description.map((item, i) => (
                            <li key={i} className="leading-snug">
                              {_(item)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {imageSrc ? (
                        <div className="overflow-hidden rounded-md border border-border/60 bg-muted/20 shadow-sm">
                          <img
                            src={imageSrc}
                            alt={imageAlt ?? title}
                            className="w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105 h-[300px] lg:h-[460px]"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="hidden md:block" />
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-3" />
            <CarouselNext className="right-3" />
          </Carousel>

          <div className="flex items-center justify-center gap-2 pb-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                className={[
                  "h-2 rounded-full transition-all",
                  idx === active
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
