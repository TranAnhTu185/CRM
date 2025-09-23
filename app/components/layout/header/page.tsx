// components/Layout/Header.tsx
'use client';

import { Group, Text, Button, Box } from '@mantine/core';
import { IconBell, IconSettings, IconUser } from '@tabler/icons-react';

export function Header() {
  return (
    <Box
      h={60}
      px="md"
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo + Title */}
      <Group>
        <Text fw={700} size="lg" c="blue">
          Cogover
        </Text>
        <Text c="dimmed">Dashboard</Text>
      </Group>

      {/* Actions */}
      <Group>
        <Button size="xs" variant="light">
          Nâng cấp
        </Button>
        <IconBell />
        <IconSettings />
        <IconUser />
      </Group>
    </Box>
  );
}
