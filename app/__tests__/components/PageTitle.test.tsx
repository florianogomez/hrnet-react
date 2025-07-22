import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import PageTitle from '../../components/PageTitle';
import { MemoryRouter } from 'react-router-dom';

describe('PageTitle', () => {
  beforeEach(() => {
    document.title = '';
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    // Ajout des balises meta nécessaires pour les tests SEO
    document.head.innerHTML = `
      <meta name="title" content="" />
      <meta name="description" content="" />
      <meta property="og:title" content="" />
      <meta property="og:description" content="" />
      <meta name="twitter:title" content="" />
      <meta name="twitter:description" content="" />
    `;
  });

  it('affiche le titre', () => {
    render(
      <MemoryRouter>
        <PageTitle title="Ma page" />
      </MemoryRouter>
    );
    // On cible le h4 principal (niveau 4)
    const headings = screen.getAllByText('Ma page');
    // Il doit y avoir au moins un h4 avec ce texte
    expect(headings.some(el => el.tagName === 'H4')).toBe(true);
  });

  it('affiche le sous-titre et le fil d\'Ariane', () => {
    render(
      <MemoryRouter>
        <PageTitle title="Ma page" subTitle="Sous-titre" subTitleRoute="/sous-titre" />
      </MemoryRouter>
    );
    expect(screen.getByText('Sous-titre')).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBeGreaterThan(1);
  });

  it('met à jour le document.title', () => {
    render(
      <MemoryRouter>
        <PageTitle title="Titre SEO" />
      </MemoryRouter>
    );
    expect(document.title).toBe('Titre SEO - HRNet');
  });

  it('met à jour les balises meta SEO', () => {
    render(
      <MemoryRouter>
        <PageTitle title="SEO" description="Desc" />
      </MemoryRouter>
    );
    expect(document.querySelector('meta[name="title"]')?.getAttribute('content')).toBe('SEO');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Desc');
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('SEO');
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('Desc');
    expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe('SEO');
    expect(document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toBe('Desc');
  });
});
