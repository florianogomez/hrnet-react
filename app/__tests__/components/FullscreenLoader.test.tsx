import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { FullscreenLoader } from '~/components/FullscreenLoader';

describe('FullscreenLoader', () => {
  it('displays the loader in fullscreen', () => {
    render(<FullscreenLoader />);
    expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
  });
});
