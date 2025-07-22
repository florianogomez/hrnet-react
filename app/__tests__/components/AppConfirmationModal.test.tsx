import { render } from '@testing-library/react';
import {  screen, fireEvent } from '@testing-library/dom';
import { AppConfirmationModal } from '~/components/AppConfirmationModal';

describe('AppConfirmationModal', () => {
  it('displays the title and message', () => {
    render(
      <AppConfirmationModal isOpen={true} title="Title" content="Message" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('calls onConfirm when clicking the confirm button', () => {
    const onConfirm = jest.fn();
    render(
      <AppConfirmationModal isOpen={true} title="Title" content="Message" onConfirm={onConfirm} onCancel={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /confirm|yes|ok/i }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when clicking the cancel button', () => {
    const onCancel = jest.fn();
    render(
      <AppConfirmationModal isOpen={true} title="Title" content="Message" onConfirm={jest.fn()} onCancel={onCancel} />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel|no/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders nothing if open is false', () => {
    const { container } = render(
      <AppConfirmationModal title="Title" content="Message" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
