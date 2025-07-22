import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { FullscreenLoader } from '~/components/FullscreenLoader';

describe('FullscreenLoader', () => {
  it('affiche le loader en plein écran', () => {
    render(<FullscreenLoader />);
    expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
  });
});
