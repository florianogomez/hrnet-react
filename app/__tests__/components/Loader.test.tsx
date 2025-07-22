import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Loader from '../../components/Loader';

describe('Loader', () => {
  it('displays the loader', () => {
    render(<Loader />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
