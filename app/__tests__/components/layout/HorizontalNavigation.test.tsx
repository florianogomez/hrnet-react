import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router';
import HorizontalNavigation from '~/components/layout/HorizontalNavigation';

describe('HorizontalNavigation', () => {
  const menuItems = [
    { id: 'home', label: 'Accueil', path: '/', icon: 'bi bi-house' },
    { id: 'employees', label: 'Employés', path: '/employees', icon: 'bi bi-people' },
    { id: 'settings', label: 'Paramètres', path: '/settings' },
  ];

  it('affiche le logo HRNet', () => {
    render(
      <MemoryRouter>
        <HorizontalNavigation menuItems={menuItems} />
      </MemoryRouter>
    );
    expect(screen.getByText('HRNet')).toBeInTheDocument();
  });

  it('affiche tous les éléments du menu', () => {
    render(
      <MemoryRouter>
        <HorizontalNavigation menuItems={menuItems} />
      </MemoryRouter>
    );
    menuItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('affiche les icônes si présentes', () => {
    render(
      <MemoryRouter>
        <HorizontalNavigation menuItems={menuItems} />
      </MemoryRouter>
    );
    expect(document.querySelector('.bi.bi-house')).toBeInTheDocument();
    expect(document.querySelector('.bi.bi-people')).toBeInTheDocument();
  });

  it('met en surbrillance le lien actif', () => {
    render(
      <MemoryRouter initialEntries={['/employees']}>
        <HorizontalNavigation menuItems={menuItems} />
      </MemoryRouter>
    );
    const activeLink = screen.getByText('Employés');
    expect(activeLink).toHaveClass('bg-primary');
    expect(activeLink).toHaveClass('text-white');
  });
});
