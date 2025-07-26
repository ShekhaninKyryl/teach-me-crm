import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/common/input';
import { SubmitButton } from 'components/common/button';
import { _ } from 'translates';
import userApi from 'api/user';

const loginSchema = yup.object({
  email: yup.string().email(_('Invalid email')).required(_('Email is required')),
  password: yup
    .string()
    .min(8, _('Length must be at leat 8 symbols'))
    .required(_('Password is required')),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    userApi.login({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-background shadow-md rounded px-8 pt-6 pb-8 w-96"
      >
        <h2 className="text-2xl mb-6 text-center font-semibold text-text">{_('Login Page')}</h2>

        <Input
          label={_('Email')}
          error={errors.email?.message}
          type={'email'}
          register={register('email')}
        />
        <Input
          label={_('Password')}
          error={errors.password?.message}
          type={'password'}
          register={register('password')}
        />
        <SubmitButton title={_('Login')} />
      </form>
    </div>
  );
};
