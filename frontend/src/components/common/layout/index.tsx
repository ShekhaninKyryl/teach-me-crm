import type { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return <div className="min-h-screen flex flex-col bg-background text-text">{children}</div>;
};

const Header = ({ children }: LayoutProps) => (
  <header className=" shadow-md py-4 px-6 sticky top-0 z-10 bg-background-secondary text-text">
    {children}
  </header>
);

const Body = ({ children }: LayoutProps) => (
  <main className="flex-grow px-4 py-8 md:px-8 bg-background text-text">{children}</main>
);

const Footer = ({ children }: LayoutProps) => (
  <footer className=" text-sm text-center py-6 px-4 bg-background-secondary text-text-secondary">
    {children}
  </footer>
);

Layout.Header = Header;
Layout.Body = Body;
Layout.Footer = Footer;

export { Layout };
