import { _ } from '@/translates';
import { useLocation } from 'react-router-dom';
import { ButtonLink } from 'components/common/button';
import { Logo } from 'components/logo';
import type { LinkProps } from 'components/common/link/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from 'components/ui/navigation-menu';

const navLinks: LinkProps[] = [
  { to: 'find-tutor', title: _('Find tutor'), icon: 'search' },
  { to: 'become-tutor', title: _('Become a tutor'), icon: 'book' },
  { to: 'about', title: _('About us'), icon: 'question' },
];

const rightNavLinks: LinkProps[] = [{ to: 'login', title: _('Login'), icon: 'sign-in-alt' }];

export const Header = () => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between px-4 w-full">
      <div className="flex items-center gap-4">
        <Logo />
        <div className="text-xl font-bold">TeachMe</div>
      </div>

      {/* Навігація */}
      <NavigationMenu>
        <NavigationMenuList className="gap-4">
          {navLinks.map(({ title, to, icon }) => (
            <NavigationMenuItem key={to}>
              <ButtonLink
                key={to}
                to={to}
                icon={icon}
                isActive={location.pathname === `/${to}`}
                title={title}
              />
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Праві навігаційні посилання */}
      <div className="flex items-center gap-4">
        {rightNavLinks.map(({ title, to, icon }) => (
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
