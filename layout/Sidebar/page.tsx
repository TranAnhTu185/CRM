// components/Layout/Sidebar.tsx
'use client';

import { Group, Code, ScrollArea, Text } from '@mantine/core';
import {
  IconCalendarClock,
  IconSitemap,
} from '@tabler/icons-react';
import classes from './silderbar.module.css';
import { LinksGroup } from './navLinkGroup/page';
import { UserButton } from '@/app/components/UserButton';

const mockdata = [
  {
    label: 'Thiết kế quy trình',
    icon: IconCalendarClock,
    initiallyOpened: true,
    links: [
      { label: 'Quản lý quy trình', link: '/' },
    ],
  },
  {
    label: 'Lượt chạy quy trình',
    icon: IconSitemap,
    links: [
      { label: 'Danh sách lượt chạy', link: '/' },
      { label: 'Các bước đã thực hiện', link: '/' },
      { label: 'Các bước cần thực hiện', link: '/' },
    ],
  },
];

export function Sidebar() {
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          {/* <Logo style={{ width: 120 }} /> */}
          <Text fw={700} size="lg" c="blue">
            x-flow
          </Text>
          <Code fw={700}>v3.1.2</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
