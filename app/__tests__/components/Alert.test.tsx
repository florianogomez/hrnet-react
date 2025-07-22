import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import Alert from '../../components/Alert';
import { AlertVariantEnum } from '../../enums/AlertVariantEnum';

describe('Alert', () => {

  it('displays the child content', () => {
    render(<Alert>Alert message</Alert>);
    // Uses a regexp to match the text even if there are spaces or tags around
    expect(screen.getByText(/Alert message/i)).toBeInTheDocument();
  });

  it('uses the default PRIMARY variant', () => {
    render(<Alert>Test</Alert>);
    const alertDiv = screen.getByText('Test').closest('div');
    expect(alertDiv).toHaveClass('alert-primary');
  });

  it('uses the variant passed as props', () => {
    render(<Alert variant={AlertVariantEnum.SUCCESS}>Success</Alert>);
    const alertDiv = screen.getByText('Success').closest('div');
    expect(alertDiv).toHaveClass('alert-success');
  });

  it('shows the close button if dismissible', () => {
    render(<Alert dismissible>Closable</Alert>);
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('does not show the close button if not dismissible', () => {
    render(<Alert>Not closable</Alert>);
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
  });

  it('calls onDismiss when clicking the close button', () => {
    const onDismiss = jest.fn();
    render(<Alert dismissible onDismiss={onDismiss}>Closable</Alert>);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
