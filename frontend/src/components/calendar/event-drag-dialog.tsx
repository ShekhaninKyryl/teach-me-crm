import { type FC, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "components/ui/dialog";
import type { Event } from "@shared/types/event";
import { DragEventVariant, type DragEventVariantType } from "components/calendar/type";
import { Button } from "components/ui/button";
import { _ } from "@/translates";
import { Blockquote } from "@radix-ui/themes";

type Props = {
  open: boolean;
  selectedEvent?: Event;
  timeRange: {
    start: Date;
    end: Date;
  };

  onCancel: () => void;
  onSubmit: ({
    variant,
    event,
    oldEvent,
  }: {
    variant: DragEventVariantType;
    event: Event;
    oldEvent: Event;
  }) => void;
};

export const EventDragDialog: FC<Props> = ({
  open,
  selectedEvent,
  timeRange,
  onCancel,
  onSubmit,
}) => {
  const handleSubmit = (variant: DragEventVariantType) => {
    if (!selectedEvent) return;
    onSubmit({ variant, event: { ...selectedEvent, timeRange }, oldEvent: { ...selectedEvent } });
  };

  useEffect(() => {
    if (!selectedEvent?.studentId) onCancel();
  }, [selectedEvent]);

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogTitle>{_("Select move option")}</DialogTitle>
        <div>
          {Object.values(DragEventVariant).map((v) => (
            <Blockquote className="text-justify">{_(`${v}-description`)}</Blockquote>
          ))}
        </div>
        <div className="flex justify-between gap-2">
          {Object.values(DragEventVariant).map((v) => (
            <Button className="cursor-pointer flex-1" onClick={() => handleSubmit(v)}>
              {_(v)}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
