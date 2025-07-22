import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import PageTitle from '../../components/PageTitle';
import { MemoryRouter } from 'react-router-dom';

describe('PageTitle', () => {
  beforeEach(() => {
    document.title = '';
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    // Add meta tags needed for SEO tests
    document.head.innerHTML = `
      <meta name="title" content="" />
      <meta name="description" content="" />
      <meta property="og:title" content="" />
      <meta property="og:description" content="" />
      <meta name="twitter:title" content="" />
      <meta name="twitter:description" content="" />
    `;
  });

  it('displays the title', () => {
    render(
      <MemoryRouter>
        <PageTitle title="My page" />
      </MemoryRouter>
    );
    // Target the main h4 (level 4)
    const headings = screen.getAllByText('My page');
    // There must be at least one h4 with this text
    expect(headings.some(el => el.tagName === 'H4')).toBe(true);
  });

  it('displays the subtitle and breadcrumb', () => {
    render(
      <MemoryRouter>
        <PageTitle title="My page" subTitle="Subtitle" subTitleRoute="/subtitle" />
      </MemoryRouter>
    );
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBeGreaterThan(1);
  });

  it('updates the document.title', () => {
    render(
      <MemoryRouter>
        <PageTitle title="SEO Title" />
      </MemoryRouter>
    );
    expect(document.title).toBe('SEO Title - HRNet');
  });

  it('updates the SEO meta tags', () => {
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
