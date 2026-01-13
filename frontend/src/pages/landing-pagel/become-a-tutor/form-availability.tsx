import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { X } from 'lucide-react';
import AvailabilityTable from 'components/availability-table';
import type { AvailabilityList } from 'components/availability-table/types';
import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from 'components/ui/form';
import { Badge } from 'components/ui/badge';
import { DAY_OF_WEEK } from 'constants/days-of-week';
import Dialog from '@/components/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { _ } from '@/translates';

// Predefined availability format: Early Birds (6:00 - 16:00)
// 'Mon 06:00-16:00', 'Tue 06:00-16:00'
const setEarlyBirds = (): AvailabilityList => {
  const availability: AvailabilityList = [];
  const days = DAY_OF_WEEK['en'];
  days.forEach((day) => {
    availability.push(`${day} 06:00-16:00`);
  });
  return availability;
};

// Predefined availability format: Evening Hunters (14:00 - 22:00)
// 'Mon 14:00-22:00', 'Tue 14:00-22:00'
const setEveningHunters = (): AvailabilityList => {
  const availability: AvailabilityList = [];
  const days = DAY_OF_WEEK['en'];
  days.forEach((day) => {
    availability.push(`${day} 14:00-22:00`);
  });
  return availability;
};

// Predefined availability format: Extended (6:00 - 22:00)
// 'Mon 06:00-22:00', 'Tue 06:00-22:00'
const setExtendedFormat = (): AvailabilityList => {
  const availability: AvailabilityList = [];
  const days = DAY_OF_WEEK['en'];
  days.forEach((day) => {
    availability.push(`${day} 06:00-22:00`);
  });
  return availability;
};

const schema = yup
  .object({
    availability: yup.array().of(yup.string().required()).default([]),
  })
  .required();

export type TutorAvailabilityFormData = yup.InferType<typeof schema>;

type FormExperienceProps = {
  onSubmit: (form: TutorAvailabilityFormData) => void;
  onBack: () => void;
};

const FormAvailability: FC<FormExperienceProps> = ({ onSubmit, onBack }) => {
  const form = useForm<TutorAvailabilityFormData>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault() as TutorAvailabilityFormData,
  });

  const handleSubmit = (data: TutorAvailabilityFormData) => {
    onSubmit(data);
  };

  const availability = form.watch('availability');

  return (
    <section className="w-full max-w-lg bg-surface rounded-xl shadow-2xl p-6 my-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">{_('Set up you availability')}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                {field.value.length ? (
                  <>
                    <FormLabel> {_('Selected time: ')}</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((val) => {
                        return (
                          <Badge key={val}>
                            {val}
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(field.value.filter((fValue) => fValue !== val))
                              }
                              className="hover:text-secondary cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </>
                ) : null}
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      field.onChange(setEarlyBirds());
                    }}
                  >
                    {_('Early Birds Format') + ' (6:00 - 16:00)'}
                  </Button>
                </FormControl>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      field.onChange(setEveningHunters());
                    }}
                  >
                    {_('Evening Hunter Format') + ' (14:00 - 22:00)'}
                  </Button>
                </FormControl>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      field.onChange(setExtendedFormat());
                    }}
                  >
                    {_('Extended Format') + ' (6:00 - 22:00)'}
                  </Button>
                </FormControl>
                <FormControl>
                  <Dialog
                    triggerTitle={_('Set up your own availability')}
                    dialogTitle={_('Set up your own availability')}
                    description={_(
                      'Please use the availability table below to set up your own availability by selecting time slots that work best for you.'
                    )}
                  >
                    <AvailabilityTable step="1h" value={availability} onChange={field.onChange} />
                  </Dialog>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="button" onClick={onBack} variant="outline" className="flex-1">
              <FontAwesomeIcon icon="arrow-left" />
              {_('Verify previous form')}
            </Button>
            <Button type="submit" className="flex-1">
              {_('Lets go to upload avatar')}
              <FontAwesomeIcon icon="arrow-right" />
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default FormAvailability;
