import { Layout } from 'components/common/layout';
import { Header } from 'components/header/Header';
import { Outlet } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Body>
        <Outlet />
      </Layout.Body>
      <Layout.Footer>some footer</Layout.Footer>
    </Layout>
  );
};
