import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router';
import HorizontalNavigation from '~/components/layout/HorizontalNavigation';

describe('HorizontalNavigation', () => {
  const menuItems = [
    { id: 'home', label: 'Home', path: '/', icon: 'bi bi-house' },
    { id: 'employees', label: 'Employees', path: '/employees', icon: 'bi bi-people' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ];

  it('displays the HRNet logo', () => {
    render(
      <MemoryRouter>
        <HorizontalNavigation menuItems={menuItems} />
      </MemoryRouter>
    );
    expect(screen.getByText('HRNet')).toBeInTheDocument();
  });

  it('displays all menu items', () => {
    render(
      <MemoryRouter>
        <HorizontalNavigation menuItems={menuItems} />
      </MemoryRouter>
    );
    menuItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('displays icons if present', () => {
    render(
      <MemoryRouter>
        <HorizontalNavigation menuItems={menuItems} />
      </MemoryRouter>
    );
    expect(document.querySelector('.bi.bi-house')).toBeInTheDocument();
    expect(document.querySelector('.bi.bi-people')).toBeInTheDocument();
  });

  it('highlights the active link', () => {
    render(
      <MemoryRouter initialEntries={['/employees']}>
        <HorizontalNavigation menuItems={menuItems} />
      </MemoryRouter>
    );
    const activeLink = screen.getByText('Employees');
    expect(activeLink).toHaveClass('bg-primary');
    expect(activeLink).toHaveClass('text-white');
  });
});
