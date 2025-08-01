import type { Tutor } from 'types/tutor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Rating } from 'components/rating/rating';
import { _ } from 'translates/index';
import classNames from 'classnames';
import { FORMAT_OPTIONS } from 'constants/format';

type TutorCardProps = Tutor & {};

export const TutorCardMini = ({
  name,
  subjects,
  format,
  rating,
  price,
  location,
  profilePictureUrl,
}: TutorCardProps) => {
  const subjectsText =
    subjects.length > 0 ? `${_('Subjects')}: ${subjects.join(', ')}` : _('No subjects listed');
  const locationText = format === 'online' ? _('Online') : `${location}`;
  const pricePerHourText = price ? `${price} ${_('₴ per hour')}` : _('No price specified');

  return (
    <div
      className="bg-surface hover:bg-background-secondary p-4 rounded-lg shadow-md
    hover:shadow-lg transition-shadow h-full flex
    flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="flex items-center mb-4">
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
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
        <p className="text-text text-lg">{subjectsText}</p>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center font-bold">
          <p className="text-text text-lg">{pricePerHourText}</p>
          <p
            className={classNames(
              'text-lg font-medium text-right',
              format === FORMAT_OPTIONS.Online ? 'text-accent' : 'text-warning'
            )}
          >
            {locationText}
          </p>
        </div>
      </div>
    </div>
  );
};
