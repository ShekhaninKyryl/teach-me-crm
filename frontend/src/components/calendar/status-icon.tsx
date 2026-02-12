import { EventStatus, type EventStatusType } from 'types/event';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const StatusIcon = ({ status }: { status: EventStatusType }) => {
  const size = 'lg';

  switch (status) {
    case EventStatus.Pending:
      return <FontAwesomeIcon size={size} icon={['fas', 'clock']} />;

    case EventStatus.Rescheduled:
      return <FontAwesomeIcon size={size} icon={'arrow-alt-circle-right'} />;

    case EventStatus.Cancelled:
      return <FontAwesomeIcon size={size} icon={'cancel'} />;

    case EventStatus.Completed:
      return <FontAwesomeIcon size={size} icon={'check-circle'} />;

    case EventStatus.Paid:
      return <FontAwesomeIcon size={size} icon={'coins'} />;

    default:
      return null;
  }
};
