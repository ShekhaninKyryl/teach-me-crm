import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import type { Tutor } from "@shared/types/tutor";
import { _ } from "@/translates";
import { Rating } from "components/rating/rating";
import { Separator } from "components/ui/separator";
import { FORMAT_OPTIONS } from "@shared/types/common";

type TutorCardProps = Tutor & {
  top?: boolean;
};

export const TutorCardMini = ({
  name,
  subjects,
  formats,
  rating,
  price,
  location,
  avatar,
  top,
}: TutorCardProps) => {
  const locationText = formats.includes(FORMAT_OPTIONS.Online) ? _("Online") : `${location}`;
  const pricePerHourText = price ? `${price} ${_("₴ per hour")}` : _("No price specified or Free");

  return (
    <Card
      className={classNames(
        "hover:shadow-lg  transition-shadow cursor-pointer flex flex-col justify-between h-full gap-0 py-4",
        top && "shadow-chart-2"
      )}
    >
      <CardHeader className="flex flex-row gap-2">
        <Avatar className="w-16 h-16 rounded-lg">
          <AvatarImage src={avatar} alt={`${name}'s profile`} className="object-cover" />
          <AvatarFallback className="bg-background-secondary rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={["fas", "user"]} style={{ width: "4rem", height: "4rem" }} />
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl text-left font-bold text-text">{name}</CardTitle>
          <Rating rating={rating} color="chart-5" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col justify-between gap-2 grow">
        <div className="flex flex-wrap">
          <p className="text-muted-foreground mr-1">{_("Subjects")}:</p>
          {subjects.map((subject, index) => (
            <div key={subject} className="flex">
              <p key={subject} className="font-bold">
                {subject}
              </p>
              {index !== subjects.length - 1 && <p className="font-bold mr-1">{","}</p>}
            </div>
          ))}
        </div>
        <Separator className="mb-2 font-bold" />
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full font-bold ">
          <p className="text-text">{pricePerHourText}</p>
          <p
            className={classNames(
              "text-right",
              formats.includes(FORMAT_OPTIONS.Online) ? "text-chart-2" : "text-chart-5"
            )}
          >
            {locationText}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
