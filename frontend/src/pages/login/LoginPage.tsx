import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { _ } from '../../translates';

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
    console.log('LoginPage', data);
    //TODO: BE request
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96"
      >
        <h2 className="text-2xl mb-6 text-center font-semibold">{_('Login Page')}</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">{_('Email')}</label>
          <input
            type="email"
            {...register('email')}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2">{_('Password')}</label>
          <input
            type="password"
            {...register('password')}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          {_('Login Page')}
        </button>
      </form>
    </div>
  );
};
