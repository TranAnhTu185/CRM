// components/Layout/Header.tsx
'use client';

import { Group, Text, Button, Box, useMantineTheme, Container, Burger, Menu, UnstyledButton, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconHeart, IconLogout, IconMessage, IconPlayerPause, IconSettings, IconStar, IconSwitchHorizontal, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './HeaderTabs.module.css';
import cx from 'clsx';

const user = {
  name: 'Jane Spoonfighter',
  email: 'janspoon@fighter.dev',
  image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
};

export function Header() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  return (

    <div className={classes.header}>
      <div className={classes.mainSection}>
        <Group justify="space-between">
          {/* <MantineLogo size={28} /> */}
          <Text fw={700} size="lg" c="blue">
            x-flow
          </Text>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group gap={7}>
                  <Avatar src={user.image} alt={user.name} radius="xl" size={24} />
                  {/* <IconChevronDown size={12} stroke={1.5} /> */}
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconHeart size={16} color={theme.colors.red[6]} stroke={1.5} />}
              >
                Liked posts
              </Menu.Item>
              <Menu.Item
                leftSection={<IconStar size={16} color={theme.colors.yellow[6]} stroke={1.5} />}
              >
                Saved posts
              </Menu.Item>
              <Menu.Item
                leftSection={<IconMessage size={16} color={theme.colors.blue[6]} stroke={1.5} />}
              >
                Your comments
              </Menu.Item>

              <Menu.Label>Settings</Menu.Label>
              <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                Account settings
              </Menu.Item>
              <Menu.Item leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}>
                Change account
              </Menu.Item>
              <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>Logout</Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item leftSection={<IconPlayerPause size={16} stroke={1.5} />}>
                Pause subscription
              </Menu.Item>
              <Menu.Item color="red" leftSection={<IconTrash size={16} stroke={1.5} />}>
                Delete account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </div>
    // <Box
    //   h={55}
    //   px="md"
    //   style={{
    //     borderBottom: '1px solid var(--mantine-color-gray-3)',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //   }}
    // >
    //   {/* Logo + Title */}
    //   <Group>
    //     <Text fw={700} size="lg" c="blue">
    //       x-flow
    //     </Text>
    //     <Text c="dimmed">Dashboard</Text>
    //   </Group>

    //   {/* Actions */}
    //   <Group>
    //     <Button size="xs" variant="light">
    //       Nâng cấp
    //     </Button>
    //     <IconBell />
    //     <IconSettings />
    //     <IconUser />
    //   </Group>
    // </Box>
  );
}
