import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { tutors } from "api/mocks/tutors";
import { _ } from "@/translates";

export const UserInfo = () => {
  const { user } = useAuth();
  const name = user?.name || "User";
  const avatar = user?.avatar || tutors[0].avatar;

  // TODO: Fix balance
  //@ts-ignore
  const balance = user?.balance || 0;

  return (
    <div className="flex items-center gap-4 p-4">
      <Avatar className="w-12 h-12">
        <AvatarImage src={avatar} alt={`${name}'s profile`} className="object-cover" />
        <AvatarFallback className="bg-background-secondary flex items-center justify-center">
          <FontAwesomeIcon icon={["fas", "user"]} style={{ width: "4rem", height: "4rem" }} />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-grow flex-wrap w-full">
        <div className="font-bold text-text ">{name}</div>
        <div className="text-text">
          {_("Balance")}: <span className="font-bold">{balance} ₴</span>
        </div>
      </div>
    </div>
  );
};
