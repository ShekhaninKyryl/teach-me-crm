import type { Tutor } from 'types/tutor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Rating } from 'components/rating/rating';
import { _ } from '@/translates';

type TutorCardProps = Tutor & {};

export const TutorCard = ({
  name,
  subjects,
  format,
  rating,
  price,
  location,
  avatar,
}: TutorCardProps) => {
  const subjectsText =
    subjects.length > 0 ? `${_('Subjects')}: ${subjects.join(', ')}` : _('No subjects listed');
  const formatText = format ? `${_('Format')}: ${format}` : _('No format specified');
  const locationText = location ? `${_('Location')}: ${location}` : _('No location specified');
  const pricePerHourText = price ? `${_('Price per hour')}: ${price}` : _('No price specified');

  return (
    <div className="bg-surface p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
      <div className="flex items-center mb-4">
        {avatar ? (
          <img
            src={avatar}
            alt={`${name}'s profile`}
            className="w-16 h-16 rounded-full mr-4 object-cover"
          />
        ) : (
          <FontAwesomeIcon
            icon={['fas', 'user-circle']}
            className="text-text mr-4"
            style={{ width: '4rem', height: '4rem' }}
          />
        )}
        <div className="relative">
          <h2 className="text-xl font-semibold text-text">{name}</h2>
          <Rating rating={rating} color="primary" />
        </div>
      </div>
      <div>
        <p className="text-text text-lg font-bold">{pricePerHourText}</p>
        <p className="text-text text-lg">{subjectsText}</p>
        <p className="text-text text-lg">{formatText}</p>
        {location && <p className="text-text text-lg">{locationText}</p>}
      </div>
    </div>
  );
};
