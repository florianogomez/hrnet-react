import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { LayoutProvider, useLayoutContext } from '../../context/LayoutContext';

function TestComponent() {
  const { isMenuOpen, toggleMenu } = useLayoutContext();
  return (
    <>
      <span data-testid="menu-state">{isMenuOpen ? 'open' : 'closed'}</span>
      <button onClick={toggleMenu}>Toggle</button>
    </>
  );
}

describe('LayoutContext', () => {
  it('fournit la valeur initiale isMenuOpen à false', () => {
    render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    );
    expect(screen.getByTestId('menu-state').textContent).toBe('closed');
  });

  it('toggleMenu inverse la valeur de isMenuOpen', () => {
    render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    );
    const button = screen.getByText('Toggle');
    fireEvent.click(button);
    expect(screen.getByTestId('menu-state').textContent).toBe('open');
    fireEvent.click(button);
    expect(screen.getByTestId('menu-state').textContent).toBe('closed');
  });

  it('lance une erreur si useLayoutContext est utilisé hors provider', () => {
    // Suppression du message d'erreur React attendu dans la console
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const Broken = () => {
      useLayoutContext();
      return null;
    };
    expect(() => render(<Broken />)).toThrow('useLayoutContext must be used within a LayoutProvider');
    spy.mockRestore();
  });
});
