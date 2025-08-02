import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import type { Tutor } from 'types/tutor';
import { FORMAT_OPTIONS } from 'constants/format';
import { _ } from '@/translates';
import { Rating } from 'components/rating/rating';
import { Label } from 'components/ui/label';
import { Badge } from 'components/ui/badge';
import { iconMapper } from 'utils/icon-mapper';

type TutorCardProps = Tutor;

export const TutorCardMini = ({
  name,
  subjects,
  format,
  rating,
  price,
  location,
  profilePictureUrl,
}: TutorCardProps) => {
  const locationText = format === FORMAT_OPTIONS.Online ? _('Online') : `${location}`;
  const pricePerHourText = price ? `${price} ${_('₴ per hour')}` : _('No price specified');

  return (
    <Card className="bg-accent hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Avatar className="w-16 h-16">
          {profilePictureUrl ? (
            <AvatarImage src={profilePictureUrl} alt={`${name}'s profile`} />
          ) : (
            <AvatarFallback className="bg-background-secondary flex items-center justify-center">
              <FontAwesomeIcon
                icon={['fas', 'user-circle']}
                className="text-text"
                style={{ width: '4rem', height: '4rem' }}
              />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle className="text-xl font-semibold text-text">{name}</CardTitle>
          <Rating rating={rating} color="chart-5" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col justify-between gap-2 grow">
        <div className="flex gap-1 flex-wrap">
          <Label>{_('Subjects')}:</Label>
          {subjects.map((subject) => (
            <Badge key={subject}>
              {iconMapper[subject] && (
                <FontAwesomeIcon icon={iconMapper[subject]} className="mr-1" />
              )}
              {subject}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center font-bold">
          <p className="text-text">{pricePerHourText}</p>
          <p
            className={classNames(
              'text-right',
              format === FORMAT_OPTIONS.Online ? 'text-chart-2' : 'text-chart-5'
            )}
          >
            {locationText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
