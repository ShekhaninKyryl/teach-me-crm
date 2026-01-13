import type { TutorFormData } from 'pages/landing-pagel/become-a-tutor/index';
import { _ } from '@/translates';
import { Button } from 'components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTutorData, isValidTutorProfile } from 'components/tutor-card/functions';
import type { FC } from 'react';
import TutorCardDialog from '@/components/tutor-card/tutor-card-dialog';

type TutorPreviewProps = {
  value: TutorFormData;
  onBack: () => void;
  onSubmit: () => void;
};

const TutorPreview: FC<TutorPreviewProps> = ({ value, onBack, onSubmit }) => {
  return (
    <section className="w-full max-w-lg bg-surface rounded-xl shadow-2xl p-6 my-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">{_('Preview your profile')}</h2>
      <div className="space-y-6">
        {isValidTutorProfile(value) ? (
          <TutorCardDialog tutor={{ ...getTutorData(value), id: 'new', rating: 5 }} />
        ) : null}

        <div className="flex gap-2">
          <Button type="button" onClick={onBack} variant="outline" className="flex-1">
            <FontAwesomeIcon icon="arrow-left" />
            {_('Preview you results')}
          </Button>
          <Button
            type="submit"
            className="flex-1 text-secondary bg-chart-2 hover:opacity-90"
            onClick={onSubmit}
          >
            {_('Create account')}
            <FontAwesomeIcon icon="arrow-right" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TutorPreview;
