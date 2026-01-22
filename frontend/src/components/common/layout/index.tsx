import type { ReactNode } from 'react';
import { SidebarProvider } from 'components/ui/sidebar';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return <div className="flex flex-col bg-background text-text">{children}</div>;
};

const Header = ({ children }: LayoutProps) => (
  <header className="shadow-md py-4 px-6 sticky top-0 z-10 bg-sidebar text-text h-(--header-height) flex items-center">
    {children}
  </header>
);

const Body = ({ children }: LayoutProps) => (
  <SidebarProvider className="flex flex-col">
    <main className="flex-grow bg-background text-text">{children}</main>
  </SidebarProvider>
);

const Footer = ({ children }: LayoutProps) => (
  <footer className="text-sm text-center py-6 px-4 bg-muted text-text">{children}</footer>
);

Layout.Header = Header;
Layout.Body = Body;
Layout.Footer = Footer;

export { Layout };
