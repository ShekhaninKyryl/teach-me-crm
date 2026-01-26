import { Clock, XCircle, CheckCircle2, ArrowRightFromLine, Coins } from 'lucide-react';
import { EventStatus, type EventStatusType } from 'types/event';

export const StatusIcon = ({ status }: { status: EventStatusType }) => {
  const className = 'w-5 h-5';

  switch (status) {
    case EventStatus.Pending:
      return <Clock className={className} />;

    case EventStatus.Rescheduled:
      return <ArrowRightFromLine className={className} />;

    case EventStatus.Cancelled:
      return <XCircle className={className} />;

    case EventStatus.Completed:
      return <CheckCircle2 className={className} />;

    case EventStatus.Paid:
      return <Coins className={className} />;

    default:
      return null;
  }
};
