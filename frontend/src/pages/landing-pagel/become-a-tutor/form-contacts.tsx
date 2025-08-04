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
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { faViber, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const schema = yup.object().shape({
  phone: yup.string().default(''),
  viber: yup.string().default(''),
  telegram: yup.string().default(''),
  whatsapp: yup.string().default(''),
});

export type TutorContactsFormData = yup.InferType<typeof schema>;

type FormStartProps = {
  onSubmit: (form: TutorContactsFormData) => void;
  onBack: () => void;
};

const FormContacts: FC<FormStartProps> = ({ onSubmit, onBack }) => {
  const form = useForm<TutorContactsFormData>({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault() as TutorContactsFormData,
  });

  const handleSubmit = (data: TutorContactsFormData) => {
    onSubmit(data);
  };

  const phoneNumber = form.watch('phone');

  return (
    <section className="w-full max-w-lg bg-surface rounded-xl shadow-2xl p-6 my-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {_('Add you contact information')}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <FontAwesomeIcon icon="phone" />
                  {_('Phone')}
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+380..." />
                </FormControl>
                <FormDescription>{_('Enter your phone number.')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="viber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <FontAwesomeIcon icon={faViber} />
                  {_('Viber')}
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center gap-2">
                    <Input {...field} placeholder="Phone or group invite" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FontAwesomeIcon
                          className="absolute right-2"
                          icon="paste"
                          onClick={() => field.onChange(phoneNumber)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{_('Copy/Past Phone number')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <FontAwesomeIcon icon={faTelegram} />
                  {_('Telegram')}
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center gap-2">
                    <Input {...field} placeholder="Phone or group invite" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FontAwesomeIcon
                          className="absolute right-2"
                          icon="paste"
                          onClick={() => field.onChange(phoneNumber)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{_('Copy/Past Phone number')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <FontAwesomeIcon icon={faWhatsapp} />
                  {_('WhatsApp')}
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center gap-2">
                    <Input {...field} placeholder="Phone or group invite" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FontAwesomeIcon
                          className="absolute right-2"
                          icon="paste"
                          onClick={() => field.onChange(phoneNumber)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{_('Copy/Past Phone number')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="button" onClick={onBack} variant="outline" className="flex-1">
              <FontAwesomeIcon icon="arrow-left" />
              {_('Verify previous form')}
            </Button>
            <Button type="submit" className="flex-1">
              {_('Set up your availability')}
              <FontAwesomeIcon icon="arrow-right" />
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default FormContacts;
