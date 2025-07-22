import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router';
import HorizontalLayout from '../../layouts/HorizontalLayout';

describe('HorizontalLayout', () => {
  it('affiche la navigation horizontale', () => {
    render(
      <MemoryRouter>
        <HorizontalLayout>Contenu principal</HorizontalLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Employés')).toBeInTheDocument();
    expect(screen.getByText('Ajouter')).toBeInTheDocument();
  });

  it('affiche le contenu enfant', () => {
    render(
      <MemoryRouter>
        <HorizontalLayout><div>Contenu enfant</div></HorizontalLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Contenu enfant')).toBeInTheDocument();
  });

  it('utilise FullscreenLoader comme fallback du suspense', () => {
    // On simule un composant enfant qui "suspends"
    const FallbackTest = () => { throw Promise.resolve(); };
    render(
      <MemoryRouter>
        <HorizontalLayout><FallbackTest /></HorizontalLayout>
      </MemoryRouter>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
