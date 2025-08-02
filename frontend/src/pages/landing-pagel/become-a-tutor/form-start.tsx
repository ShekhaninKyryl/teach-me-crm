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

const schema = yup.object().shape({
  name: yup.string().required(_('Full Name is required')),
  email: yup.string().email(_('Invalid email')).required(_('Email is required')),
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
    <section className="w-full max-w-lg bg-surface rounded-xl shadow-lg p-6 my-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">{_('Create Your Tutor Account')}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name={'name'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{_('Full Name')}</FormLabel>
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
                <FormLabel>{_('Email')}</FormLabel>
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

          <Button type="submit" className="mt-2 w-full">
            {_('Tell about your experience')}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default FormStart;
