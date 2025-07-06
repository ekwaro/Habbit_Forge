import { NavLink, Stack } from '@mantine/core';
import {
  IconGauge, IconUserCircle, IconCategory, IconQuote,
  IconBulb, IconChartBar
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

function SidebarNav() {
  const location = useLocation();

  const links = [
    { icon: IconGauge, label: 'Dashboard', path: '/admin' },
    { icon: IconUserCircle, label: 'Admin Profile', path: '/admin/profile' },
    { icon: IconCategory, label: 'Habit Categories', path: '/admin/categories' },
    { icon: IconQuote, label: 'Motivational Quotes', path: '/admin/quotes' },
    { icon: IconBulb, label: 'Habit Tips', path: '/admin/tips' },
    { icon: IconChartBar, label: 'Analytics Section', path: '/admin/analytics' },
  ];

  const items = links.map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <NavLink
        key={item.label}
        component={Link}
        to={item.path}
        label={
          <span style={{ fontSize: '1.15rem', fontWeight: 700, marginLeft: 14, color: isActive ? '#5f3dc4' : undefined }}>{item.label}</span>
        }
        leftSection={<item.icon size="1.7rem" stroke={2} color={isActive ? '#845ef7' : undefined} />}
        active={isActive}
        variant="filled"
        style={{
          paddingTop: 14,
          paddingBottom: 14,
          borderLeft: isActive ? '4px solid #845ef7' : '4px solid transparent',
          background: isActive ? '#d0bfff' : undefined,
          borderRadius: 8,
          marginBottom: 6,
          fontWeight: 700,
          fontSize: '1.15rem',
          transition: 'background 0.2s, border-color 0.2s',
        }}
      />
    );
  });

  return (
    <Stack>
      {items}
    </Stack>
  );
}

export default SidebarNav;