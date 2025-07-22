import { render } from '@testing-library/react';
import AppProvidersWrapper from '~/components/wrappers/AppProvidersWrapper';

describe('AppProvidersWrapper', () => {
  beforeEach(() => {
    // Nettoyage du DOM et du localStorage avant chaque test
    document.documentElement.lang = '';
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    delete (window as any).__HRNET_VERSION__;
  });

  it('render les enfants', () => {
    const { getByText } = render(
      <AppProvidersWrapper>
        <div>Contenu enfant</div>
      </AppProvidersWrapper>
    );
    expect(getByText('Contenu enfant')).toBeInTheDocument();
  });

  it('initialise la langue du document à fr', () => {
    render(
      <AppProvidersWrapper>
        <div />
      </AppProvidersWrapper>
    );
    expect(document.documentElement.lang).toBe('fr');
  });

  it('applique le thème sauvegardé dans le localStorage', () => {
    localStorage.setItem('hrnet-theme', 'dark');
    render(
      <AppProvidersWrapper>
        <div />
      </AppProvidersWrapper>
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('définit la version de l\'application sur window', () => {
    render(
      <AppProvidersWrapper>
        <div />
      </AppProvidersWrapper>
    );
    expect((window as any).__HRNET_VERSION__).toBe('1.0.0');
  });
});
