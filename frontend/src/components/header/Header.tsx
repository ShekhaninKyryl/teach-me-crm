import { _ } from "@/translates";
import { useLocation, useMatch } from "react-router-dom";
import { ButtonLink } from "components/common/button";
import { Logo } from "components/logo";
import type { LinkProps } from "components/common/link/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "components/ui/navigation-menu";
import LanguageSwitcher from "components/language-switcher";
import { useAuth } from "@/contexts/auth-context";
import { AppearanceToggle } from "components/appearance-toggle";

export const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { page } = useMatch({ path: `/:lng/:page`, end: false })?.params || {};
  const isActive = (pagePath: string) => page === pagePath;

  const navLinks: LinkProps[] = [
    { to: "find-tutor", title: _("Find tutor"), icon: "search" },
    user
      ? { to: "workspace", title: _("Workspace"), icon: "briefcase" }
      : { to: "become-tutor", title: _("Become a tutor"), icon: "book" },
    {
      to: "about",
      title: _("About us"),
      icon: "circle-question",
      rightIcon: "triangle-exclamation",
    },
  ];

  const rightNavLinks: LinkProps[] = user
    ? [{ title: _("Logout"), icon: "sign-out-alt", onClick: logout }]
    : [{ to: "login", title: _("Login"), icon: "sign-in-alt" }];

  return (
    <div className="flex items-center justify-between px-4 w-full">
      <div className="flex items-center gap-4">
        <Logo className="hover:text-chart-2 transition" />
        <div className="text-xl font-bold">TeachMe</div>
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <AppearanceToggle />
        </div>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="gap-4">
          {navLinks.map(({ title, to, icon, rightIcon }) => (
            <NavigationMenuItem key={to}>
              <ButtonLink
                key={to}
                to={to}
                icon={icon}
                rightIcon={rightIcon}
                isActive={isActive(to ?? "")}
                title={title}
              />
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-4">
        {rightNavLinks.map(({ title, to, icon, onClick }) => (
          <ButtonLink
            key={to}
            to={to}
            icon={icon}
            isActive={location.pathname === `/${to}`}
            title={title}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};
