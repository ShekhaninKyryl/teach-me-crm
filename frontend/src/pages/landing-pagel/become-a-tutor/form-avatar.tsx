import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { _ } from '@/translates';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'components/ui/form';
import * as yup from 'yup';
import { useState, useRef, type FC, type ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CameraIcon } from 'lucide-react';

const schema = yup.object().shape({
  avatar: yup.string().default(''),
});

export type TutorAvatarData = yup.InferType<typeof schema>;

type FormStartProps = {
  onSubmit: (form: TutorAvatarData) => void;
  onBack: () => void;
};

const FormAvatar: FC<FormStartProps> = ({ onSubmit, onBack }) => {
  const form = useForm<TutorAvatarData>({
    resolver: yupResolver(schema),
  });
  const [imageSrc, setImageSrc] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const stringImage = reader.result as string;
        setImageSrc(stringImage);
        form.setValue('avatar', stringImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImageSrc(undefined);
    form.setValue('avatar', '');
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (data: TutorAvatarData) => {
    onSubmit(data);
  };

  return (
    <section className="w-full max-w-lg bg-surface rounded-xl shadow-2xl p-6 my-12">
      <h2 className="text-2xl font-semibold mb-4 text-center">{_('Upload you image')}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <div className="relative w-32 h-32 mx-auto">
            {imageSrc ? (
              <FontAwesomeIcon
                icon="trash"
                className="absolute cursor-pointer bottom-0 right-0 hover:text-destructive"
                onClick={handleClearImage}
              />
            ) : null}
            <Avatar className="w-32 h-32 mx-auto cursor-pointer" onClick={triggerFileUpload}>
              <AvatarImage className="object-cover" src={imageSrc} alt="User Avatar" />
              <AvatarFallback delayMs={600}>
                {imageSrc ? null : <CameraIcon width={24} height={24} />}{' '}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={onBack} variant="outline" className="flex-1">
              <FontAwesomeIcon icon="arrow-left" />
              {_('Verify previous form')}
            </Button>
            <Button type="submit" className="flex-1">
              {_('Preview you results')}
              <FontAwesomeIcon icon="arrow-right" />
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default FormAvatar;
