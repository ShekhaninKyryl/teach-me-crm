import { _ } from 'translates/index';
import { useLocation } from 'react-router-dom';
import { ButtonLink } from 'components/common/button';
import { Logo } from 'components/logo';

const navLinks = [
  { to: 'find-tutor', title: _('Find tutor') },
  { to: 'become-tutor', title: _('Become a tutor') },
  { to: 'about', title: _('About us') },
  { to: 'login', title: _('Log in') },
];

export const Header = () => {
  const location = useLocation();

  console.log(location);

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center space-x-2">
        <Logo />
        <h1 className="text-xl font-bold">{_('Teach-Me')}</h1>
      </div>
      <div className="flex space-x-4">
        {navLinks.map((link) => (
          <ButtonLink
            key={link.to}
            to={link.to}
            isActive={location.pathname === `/${link.to}`}
            title={link.title}
          />
        ))}
      </div>
    </div>
  );
};
