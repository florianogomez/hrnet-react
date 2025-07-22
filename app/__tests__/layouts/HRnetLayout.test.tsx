import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router';
import HRnetLayout from '../../layouts/HRnetLayout';

describe('HRnetLayout', () => {
  it('displays the main HRNet layout', () => {
    render(
      <MemoryRouter>
        <HRnetLayout>HRNet content</HRnetLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('HRNet content')).toBeInTheDocument();
  });

  // Add here other tests specific to the structure or behavior of the layout if needed
});
