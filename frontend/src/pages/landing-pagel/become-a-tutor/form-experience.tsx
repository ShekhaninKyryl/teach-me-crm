import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { _ } from '@/translates';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import * as yup from 'yup';
import type { FC } from 'react';
import { FORMAT_OPTIONS } from 'constants/format';

const schema = yup
  .object({
    bio: yup.string().required(),
    format: yup.mixed<'online' | 'offline'>().oneOf(['online', 'offline']).required(),
    subjects: yup
      .array()
      .of(yup.string().required())
      .min(1, _('Select at least one subject'))
      .required(),
    location: yup.string().required(),
    price: yup.number().required().min(0),
  })
  .required();

export type TutorExperienceFormData = yup.InferType<typeof schema>;

type FormExperienceProps = {
  onSubmit: (form: TutorExperienceFormData) => void;
};

const FormExperience: FC<FormExperienceProps> = ({ onSubmit }) => {
  const form = useForm<TutorExperienceFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      bio: '',
      format: FORMAT_OPTIONS.Online,
      subjects: [],
      location: '',
      price: 0,
    },
  });

  const handleSubmit = (data: TutorExperienceFormData) => {
    onSubmit(data);
  };

  return (
    <section className="w-full max-w-lg bg-surface rounded-xl shadow-lg p-6 my-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">{_('Create Your Tutor Account')}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name={'bio'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{_('Biography')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  {_(
                    'Describe your experience, also describe here details of you work, applicable methods and any other information what can help a student makes a correct chosen'
                  )}
                </FormDescription>
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2 w-full">
            {_("Let's go to contacts and availability")}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default FormExperience;
