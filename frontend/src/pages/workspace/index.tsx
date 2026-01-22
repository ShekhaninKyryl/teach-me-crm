import type { FC } from 'react';
import { Sidebar } from 'components/sidebar';
import type { LinkProps } from 'components/common/link/link';
import { UserInfo } from 'components/user-info';
import { _ } from '@/translates';

const Workspace: FC = () => {
  const bodyLinks: LinkProps[] = [
    { to: 'students', title: _('Students'), icon: 'users' },
    { to: 'calendar', title: _('Calendar'), icon: 'calendar-days' },
    { to: 'reports', title: _('Reports'), icon: 'chart-line' },
    { to: 'integrations', title: _('Integrations'), icon: 'puzzle-piece' },
  ];

  const footerLinks: LinkProps[] = [{ to: 'settings', title: _('Settings'), icon: 'gear' }];

  return (
    <>
      <Sidebar bodyLinks={bodyLinks} footerLinks={footerLinks} userSection={<UserInfo />} />
      <Sidebar.Content>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted aspect-video rounded-xl" />
          <div className="bg-muted aspect-video rounded-xl" />
          <div className="bg-muted aspect-video rounded-xl" />
        </div>
      </Sidebar.Content>
    </>
  );
};

export default Workspace;
