import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import Alert from '../../components/Alert';
import { AlertVariantEnum } from '../../enums/AlertVariantEnum';

describe('Alert', () => {
  it('affiche le contenu enfant', () => {
    render(<Alert>Message d'alerte</Alert>);
    // Utilise une regexp pour matcher le texte même s'il y a des espaces ou balises autour
    expect(screen.getByText(/Message d'alerte/i)).toBeInTheDocument();
  });

  it('utilise la variante par défaut PRIMARY', () => {
    render(<Alert>Test</Alert>);
    const alertDiv = screen.getByText('Test').closest('div');
    expect(alertDiv).toHaveClass('alert-primary');
  });

  it('utilise la variante passée en props', () => {
    render(<Alert variant={AlertVariantEnum.SUCCESS}>Succès</Alert>);
    const alertDiv = screen.getByText('Succès').closest('div');
    expect(alertDiv).toHaveClass('alert-success');
  });

  it('affiche le bouton de fermeture si dismissible', () => {
    render(<Alert dismissible>Fermable</Alert>);
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('n\'affiche pas le bouton de fermeture si non dismissible', () => {
    render(<Alert>Non fermable</Alert>);
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
  });

  it('appelle onDismiss lors du clic sur le bouton de fermeture', () => {
    const onDismiss = jest.fn();
    render(<Alert dismissible onDismiss={onDismiss}>Fermable</Alert>);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
