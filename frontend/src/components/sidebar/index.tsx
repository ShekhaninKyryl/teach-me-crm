import { type ReactNode } from "react";
import {
  Sidebar as SidebarSchad,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "components/ui/sidebar";
import classNames from "classnames";
import { ButtonLink } from "components/common/button";
import type { LinkProps } from "components/common/link/link";
import { Separator } from "@radix-ui/themes";
import { useMatch } from "react-router-dom";

type SidebarProps = {
  bodyLinks?: LinkProps[];
  footerLinks?: LinkProps[];
  pathToDetectActivePage?: string;
  userSection?: ReactNode;
};

const Sidebar = ({ bodyLinks, footerLinks, userSection, pathToDetectActivePage }: SidebarProps) => {
  const { page } = useMatch({ path: pathToDetectActivePage ?? "", end: false })?.params || {};
  const isActive = (pagePath: string) => page === pagePath;

  return (
    <SidebarSchad className="top-(--header-height) h-[calc(100svh-var(--header-height))]! w-(--sidebar-width) border-t">
      {userSection ?? <SidebarHeader>{userSection}</SidebarHeader>}
      <Separator size="4" />

      <SidebarContent>
        <SidebarGroup>
          {bodyLinks?.map(({ to, icon, title, rightIcon }) => (
            <ButtonLink
              key={to}
              to={to}
              icon={icon}
              rightIcon={rightIcon}
              title={title}
              isActive={isActive(to ?? "")}
            />
          )) ?? null}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {footerLinks?.map(({ to, icon, rightIcon, title }) => (
          <ButtonLink
            key={to}
            to={to}
            icon={icon}
            rightIcon={rightIcon}
            title={title}
            isActive={isActive(to ?? "")}
          />
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
          ? "left-(--sidebar-width) w-[calc(100svw-var(--sidebar-width))]"
          : "left-0 w-[calc(100svw)]",
        "relative transition-[left,width] duration-200 ease-linear",
        "p-8"
      )}
    >
      {children}
    </div>
  );
};

Sidebar.Content = Content;

export { Sidebar };
