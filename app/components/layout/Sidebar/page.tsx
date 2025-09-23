// components/Layout/Sidebar.tsx
'use client';

import { NavLink, Stack, Text, ScrollArea, Box } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconSettings,
  IconUser,
  IconList,
} from '@tabler/icons-react';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Box w="100%" p="sm" className='!h-[100vh] max-h-[calc(100vh-76px)]'>
      <ScrollArea h="100%">
        <Stack gap="xs">
          <Text fw={600} size="sm" c="dimmed">
            Thiết kế quy trình
          </Text>
          <NavLink
            component={Link}
            href="/processes"
            label="Quản lý quy trình"
            leftSection={<IconList size={16} />}
            active={pathname === '/processes'}
          />
          <NavLink
            component={Link}
            href="/runs"
            label="Lượt chạy quy trình"
            leftSection={<IconList size={16} />}
            active={pathname === '/runs'}
          />

          <Text fw={600} size="sm" c="dimmed" mt="md">
            Cấu hình
          </Text>
          <NavLink
            component={Link}
            href="/users"
            label="Người dùng"
            leftSection={<IconUser size={16} />}
            active={pathname === '/users'}
          />
          <NavLink
            component={Link}
            href="/settings"
            label="Cài đặt"
            leftSection={<IconSettings size={16} />}
            active={pathname === '/settings'}
          />
        </Stack>
      </ScrollArea>
    </Box>
  );
}
