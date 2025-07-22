import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router';
import HorizontalLayout from '../../layouts/HorizontalLayout';

describe('HorizontalLayout', () => {
  it('displays the horizontal navigation', () => {
    render(
      <MemoryRouter>
        <HorizontalLayout>Main content</HorizontalLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('displays the child content', () => {
    render(
      <MemoryRouter>
        <HorizontalLayout><div>Child content</div></HorizontalLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('uses FullscreenLoader as the suspense fallback', () => {
    // Simulate a child component that "suspends"
    const FallbackTest = () => { throw Promise.resolve(); };
    render(
      <MemoryRouter>
        <HorizontalLayout><FallbackTest /></HorizontalLayout>
      </MemoryRouter>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
