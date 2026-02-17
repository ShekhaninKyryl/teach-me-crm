import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "components/ui/dialog";
import { TutorCardMini } from "components/tutor-card/tutor-card-mini";
import type { Tutor } from "types/tutor";
import type { FC } from "react";
import { TutorCard } from "components/tutor-card/index";

type Props = {
  tutor: Tutor;
  top?: boolean;
  preview?: boolean;
};

const TutorCardDialog: FC<Props> = ({ tutor, top, preview }) => {
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <TutorCardMini {...tutor} top={top} />
      </DialogTrigger>
      <DialogTitle className="rt-r-display-none" />
      <DialogContent>
        <TutorCard {...tutor} preview={preview} />
      </DialogContent>
    </Dialog>
  );
};

export default TutorCardDialog;
