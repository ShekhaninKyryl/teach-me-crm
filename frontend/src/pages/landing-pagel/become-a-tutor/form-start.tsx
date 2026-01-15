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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const schema = yup.object().shape({
  name: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

export type TutorStartFormData = yup.InferType<typeof schema>;

type FormStartProps = {
  onSubmit: (form: TutorStartFormData) => void;
};

const FormStart: FC<FormStartProps> = ({ onSubmit }) => {
  const form = useForm<TutorStartFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const handleSubmit = (data: TutorStartFormData) => {
    onSubmit(data);
  };

  return (
    <section className="w-full max-w-lg bg-surface rounded-xl shadow-2xl p-6 my-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">{_('Create Your Tutor Account')}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name={'name'}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-0">
                  {_('Full Name')}
                  <span>*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>{_('This is your public display name.')}</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={'email'}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-0">
                  {_('Email')}
                  <span>*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  {_(
                    'Please use a valid email, via this email you can restore access to your account'
                  )}
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {_('Tell about your experience')}
              <FontAwesomeIcon icon="arrow-right" />
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default FormStart;
