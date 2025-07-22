
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import EmployeesAddView from '../../views/EmployeesAddView';

describe('EmployeesAddView', () => {
  it('doit afficher le formulaire d\'ajout d\'employé', () => {
    const { container } = render(
      <MemoryRouter>
        <EmployeesAddView />
      </MemoryRouter>
    );
    // Vérifie la présence d'un champ ou bouton clé
    expect(container.innerHTML).toMatch(/ajout|add|employé|employee/i);
  });
});
