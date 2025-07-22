import { render } from '@testing-library/react';
import AppProvidersWrapper from '~/components/wrappers/AppProvidersWrapper';

describe('AppProvidersWrapper', () => {
  beforeEach(() => {
    // Clean up DOM and localStorage before each test
    document.documentElement.lang = '';
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    delete (window as any).__HRNET_VERSION__;
  });

  it('renders children', () => {
    const { getByText } = render(
      <AppProvidersWrapper>
        <div>Child content</div>
      </AppProvidersWrapper>
    );
    expect(getByText('Child content')).toBeInTheDocument();
  });

  it('initializes the document language to fr', () => {
    render(
      <AppProvidersWrapper>
        <div />
      </AppProvidersWrapper>
    );
    expect(document.documentElement.lang).toBe('fr');
  });

  it('applies the theme saved in localStorage', () => {
    localStorage.setItem('hrnet-theme', 'dark');
    render(
      <AppProvidersWrapper>
        <div />
      </AppProvidersWrapper>
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('sets the application version on window', () => {
    render(
      <AppProvidersWrapper>
        <div />
      </AppProvidersWrapper>
    );
    expect((window as any).__HRNET_VERSION__).toBe('1.0.0');
  });
});
