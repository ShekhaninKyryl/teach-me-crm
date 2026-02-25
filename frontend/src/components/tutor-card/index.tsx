import type { Tutor } from "@shared/types/tutor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Rating } from "components/rating/rating";
import { _ } from "@/translates";
import { CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import classNames from "classnames";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Separator } from "components/ui/separator";
import { DataList } from "@radix-ui/themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import AvailabilityTable from "../availability-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "components/ui/tooltip";
import { FORMAT_OPTIONS } from "@shared/types/common";
import { useAuth } from "@/contexts/auth-context";

type TutorCardProps = Tutor & {
  preview?: boolean;
};

export const TutorCard = ({
  name,
  subjects,
  format,
  rating,
  price,
  location,
  avatar,
  bio,
  phone,
  viber,
  telegram,
  whatsapp,
  availability,
  preview,
}: TutorCardProps) => {
  const { user } = useAuth();
  const pricePerHourText = price ? `${price} ${_("₴ per hour")}` : _("No price specified or Free");

  return (
    <div>
      <CardHeader className="flex flex-row gap-2">
        <Avatar className="w-24 h-24 rounded-lg">
          <AvatarImage src={avatar} alt={`${name}'s profile`} className="object-cover" />
          <AvatarFallback className="bg-background-secondary rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={["fas", "user"]} style={{ width: "4rem", height: "4rem" }} />
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-bold text-text">{name}</CardTitle>
          <Rating rating={rating} color="chart-5" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col justify-between gap-2 grow">
        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="106px">{_("Subjects")}:</DataList.Label>
            <DataList.Value>
              <p className="font-bold">{subjects.join(", ")}</p>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="106px">{_("Format")}:</DataList.Label>
            <DataList.Value>
              {format.map((value, index) => (
                <span key={value} className="font-bold">
                  <span
                    className={classNames(
                      value.includes(FORMAT_OPTIONS.Online) ? "text-chart-2" : "text-chart-5"
                    )}
                  >
                    {value.includes(FORMAT_OPTIONS.Online) ? _("Online") : `${location}`}
                  </span>
                  {index !== format.length - 1 && <span className="font-bold mr-1">{","}</span>}
                </span>
              ))}
            </DataList.Value>
          </DataList.Item>
          {bio && (
            <DataList.Item>
              <DataList.Label minWidth="106px">{_("Biography")}:</DataList.Label>
              <DataList.Value>
                <p className="text-justify whitespace-break-spaces leading-5">{bio}</p>
              </DataList.Value>
            </DataList.Item>
          )}
        </DataList.Root>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="106px">{_("Phone")}:</DataList.Label>
            <DataList.Value>
              <p className="font-bold">{phone || _("Not provided")}</p>
            </DataList.Value>
          </DataList.Item>
          {telegram && (
            <DataList.Item>
              <DataList.Label minWidth="106px">{_("Telegram")}:</DataList.Label>
              <DataList.Value>
                <a
                  href={`https://t.me/${telegram}`}
                  target="_blank"
                  className="transition-colors duration-200 font-bold rounded
              hover:underline hover:text-chart-2"
                >
                  {telegram}
                </a>
              </DataList.Value>
            </DataList.Item>
          )}
          {viber && (
            <DataList.Item>
              <DataList.Label minWidth="106px">{_("Viber")}:</DataList.Label>
              <DataList.Value>
                <a
                  target="_blank"
                  className="transition-colors duration-200 font-bold rounded
              hover:underline hover:text-chart-2"
                >
                  {viber}
                </a>
              </DataList.Value>
            </DataList.Item>
          )}
          {whatsapp && (
            <DataList.Item>
              <DataList.Label minWidth="106px">{_("WhatsApp")}:</DataList.Label>
              <DataList.Value>
                <a
                  target="_blank"
                  className="transition-colors duration-200 font-bold rounded
              hover:underline hover:text-chart-2"
                >
                  {whatsapp}
                </a>
              </DataList.Value>
            </DataList.Item>
          )}
        </DataList.Root>
        <Separator className="mb-2 font-bold" />
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full font-bold ">
          <p className="text-text">{pricePerHourText}</p>
          <div className="gap-2 flex items-center">
            <Dialog>
              <DialogTrigger>
                <Tooltip>
                  <TooltipTrigger>
                    <FontAwesomeIcon
                      icon="calendar"
                      className="hover:text-chart-2 cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{_("See availability")}</p>
                  </TooltipContent>
                </Tooltip>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl lg:max-w-5xl">
                <DialogTitle>{_(`{NAME} Availability`, { NAME: name })}</DialogTitle>
                <DialogDescription />
                <AvailabilityTable step="1h" value={availability} />
              </DialogContent>
            </Dialog>

            {!preview ||
              (!user && (
                <Tooltip>
                  <TooltipTrigger>
                    <FontAwesomeIcon icon="comment" className="hover:text-chart-2 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{_("Send a message")}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
          </div>
        </div>
      </CardFooter>
    </div>
  );
};
