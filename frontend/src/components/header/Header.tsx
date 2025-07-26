import { _ } from 'translates/index';
import { useLocation } from 'react-router-dom';
import { ButtonLink } from 'components/common/button';
import { Logo } from 'components/logo';
import type { LinkProps } from 'components/common/link/link';

const navLinks: LinkProps[] = [
  { to: 'find-tutor', title: _('Find tutor'), icon: 'search' },
  { to: 'become-tutor', title: _('Become a tutor'), icon: 'book' },
  { to: 'about', title: _('About us'), icon: 'question' },
  { to: 'login', title: _('Sign in'), icon: 'sign-in-alt' },
];

export const Header = () => {
  const location = useLocation();

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center space-x-2">
        <Logo />
        <h1 className="text-xl font-bold">{_('TeachMe')}</h1>
      </div>
      <div className="flex space-x-4">
        {navLinks.map(({ title, to, icon }) => (
          <ButtonLink
            key={to}
            to={to}
            icon={icon}
            isActive={location.pathname === `/${to}`}
            title={title}
          />
        ))}
      </div>
    </div>
  );
};
