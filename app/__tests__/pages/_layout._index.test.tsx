import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router';
import LayoutIndex from '../../pages/_layout._index';

describe('LayoutIndex', () => {
  it('renders the home page or main component', () => {
    render(
      <MemoryRouter>
        <LayoutIndex />
      </MemoryRouter>
    );
    // Add here specific assertions for your home page
    // Several elements contain 'HRNet', check that at least one is present
    expect(screen.getAllByText(/hrnet/i).length).toBeGreaterThan(0);
  });
});
