import { NavLink, Stack } from '@mantine/core';
import {
  IconGauge, IconUserCircle, IconCategory, IconQuote,
  IconBulb, IconChartBar
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation

function SidebarNav() {
  const location = useLocation(); // Get current route location

  const links = [
    { icon: IconGauge, label: 'Dashboard', path: '/admin' }, // Default dashboard
    { icon: IconUserCircle, label: 'Admin Profile', path: '/admin/profile' },
    { icon: IconCategory, label: 'Habit Categories', path: '/admin/categories' },
    { icon: IconQuote, label: 'Motivational Quotes', path: '/admin/quotes' },
    { icon: IconBulb, label: 'Habit Tips', path: '/admin/tips' },
    { icon: IconChartBar, label: 'Analytics Section', path: '/admin/analytics' },
  ];

  const items = links.map((item) => (
    <NavLink
      key={item.label}
      component={Link} // Use React Router's Link component
      to={item.path}
      label={item.label}
      leftSection={<item.icon size="1rem" stroke={1.5} />}
      active={location.pathname === item.path} // Highlight active link
      variant="filled"
    />
  ));

  return (
    <Stack>
      {items}
    </Stack>
  );
}

export default SidebarNav;