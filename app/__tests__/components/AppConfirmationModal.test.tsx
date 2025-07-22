import { render } from '@testing-library/react';
import {  screen, fireEvent } from '@testing-library/dom';
import { AppConfirmationModal } from '~/components/AppConfirmationModal';

describe('AppConfirmationModal', () => {
  it('affiche le titre et le message', () => {
    render(
      <AppConfirmationModal isOpen={true} title="Titre" content="Message" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('appelle onConfirm lors du clic sur le bouton de confirmation', () => {
    const onConfirm = jest.fn();
    render(
      <AppConfirmationModal isOpen={true} title="Titre" content="Message" onConfirm={onConfirm} onCancel={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /confirmer|oui|ok/i }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('appelle onCancel lors du clic sur le bouton d\'annulation', () => {
    const onCancel = jest.fn();
    render(
      <AppConfirmationModal isOpen={true} title="Titre" content="Message" onConfirm={jest.fn()} onCancel={onCancel} />
    );
    fireEvent.click(screen.getByRole('button', { name: /annuler|non/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('n\'affiche rien si open est false', () => {
    const { container } = render(
      <AppConfirmationModal title="Titre" content="Message" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
