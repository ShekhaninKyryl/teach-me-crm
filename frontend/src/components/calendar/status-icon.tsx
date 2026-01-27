import { XCircle, Check, ArrowRightFromLine, Coins } from 'lucide-react';
import { EventStatus, type EventStatusType } from 'types/event';

export const StatusIcon = ({ status }: { status: EventStatusType }) => {
  const className = 'w-5 h-5';

  switch (status) {
    case EventStatus.Rescheduled:
      return <ArrowRightFromLine className={className} />;

    case EventStatus.Cancelled:
      return <XCircle className={className} />;

    case EventStatus.Completed:
      return <Check className={className} />;

    case EventStatus.Paid:
      return <Coins className={className} />;

    default:
      return null;
  }
};
