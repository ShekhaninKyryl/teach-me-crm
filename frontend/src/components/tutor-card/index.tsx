import type { Tutor } from 'types/tutor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Rating } from 'components/rating/rating';

type TutorCardProps = Tutor & {};

export const TutorCard = ({
  name,
  subjects,
  format,
  rating,
  pricePerHour,
  location,
  profilePictureUrl,
}: TutorCardProps) => {
  return (
    <div className="border border-border rounded p-4 shadow-sm bg-surface hover:shadow-md transition">
      <div className="flex items-center mb-4">
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt={`${name}'s profile`}
            className="w-16 h-16 rounded-full mr-4"
          />
        ) : (
          <FontAwesomeIcon icon={['fas', 'user-circle']} className="w-16 h-16 text-text mr-4" />
        )}
        <div>
          <h2 className="text-xl font-semibold text-text">{name}</h2>
          <Rating rating={rating} showPercentage={true} color="primary" />
        </div>
      </div>
      <p className="text-text-secondary">Subjects: {subjects.join(', ')}</p>
      <p className="text-text-secondary">Format: {format}</p>
      {location && <p className="text-text-secondary">Location: {location}</p>}
      <p className="text-text-secondary">Price per hour: ${pricePerHour}</p>
    </div>
  );
};
