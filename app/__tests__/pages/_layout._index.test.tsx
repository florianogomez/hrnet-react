import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router';
import LayoutIndex from '../../pages/_layout._index';

describe('LayoutIndex', () => {
  it('rend la page d\'accueil ou le composant principal', () => {
    render(
      <MemoryRouter>
        <LayoutIndex />
      </MemoryRouter>
    );
    // Ajoute ici des assertions spécifiques à ta page d'accueil
    // Plusieurs éléments contiennent 'HRNet', on vérifie qu'au moins un est présent
    expect(screen.getAllByText(/hrnet/i).length).toBeGreaterThan(0);
  });
});
