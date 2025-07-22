import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router';
import HRnetLayout from '../../layouts/HRnetLayout';

describe('HRnetLayout', () => {
  it('affiche le layout principal HRNet', () => {
    render(
      <MemoryRouter>
        <HRnetLayout>Contenu HRNet</HRnetLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Contenu HRNet')).toBeInTheDocument();
  });

  // Ajoute ici d'autres tests spécifiques à la structure ou au comportement du layout si besoin
});
