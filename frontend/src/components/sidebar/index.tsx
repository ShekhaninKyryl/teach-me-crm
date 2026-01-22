import { type ReactNode } from 'react';
import {
  Sidebar as SidebarSchad,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from 'components/ui/sidebar';
import classNames from 'classnames';
import { ButtonLink } from 'components/common/button';
import type { LinkProps } from 'components/common/link/link';
import { Separator } from '@radix-ui/themes';

type SidebarProps = {
  bodyLinks?: LinkProps[];
  footerLinks?: LinkProps[];
  userSection?: ReactNode;
};

const Sidebar = ({ bodyLinks, footerLinks, userSection }: SidebarProps) => {
  return (
    <SidebarSchad className="top-(--header-height) h-[calc(100svh-var(--header-height))]! w-(--sidebar-width) border-t">
      {userSection ?? <SidebarHeader>{userSection}</SidebarHeader>}
      <Separator size="4" />

      <SidebarContent>
        <SidebarGroup>
          {bodyLinks?.map(({ to, icon, title }) => (
            <ButtonLink key={to} to={to} icon={icon} title={title} />
          )) ?? null}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {footerLinks?.map(({ to, icon, title }) => (
          <ButtonLink key={to} to={to} icon={icon} title={title} />
        )) ?? null}
      </SidebarFooter>

      <SidebarFooter className="bg-sidebar-foreground text-sidebar">
        <div className="text-sm text-center w-full">© 2026 TeachMe</div>
      </SidebarFooter>
    </SidebarSchad>
  );
};

const Content = ({ children }: { children: ReactNode }) => {
  const { open } = useSidebar();

  return (
    <div
      className={classNames(
        open
          ? 'left-(--sidebar-width) w-[calc(100svw-var(--sidebar-width))]'
          : 'left-0 w-[calc(100svw)]',
        'relative transition-[left,width] duration-200 ease-linear'
      )}
    >
      {children}
    </div>
  );
};

Sidebar.Content = Content;

export { Sidebar };
