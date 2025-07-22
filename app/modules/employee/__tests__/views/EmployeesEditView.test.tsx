
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import EmployeesEditView from '../../views/EmployeesEditView';

describe('EmployeesEditView', () => {
  it('doit afficher le formulaire d\'édition d\'employé', () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/employees/edit/1"]}>
        <EmployeesEditView />
      </MemoryRouter>
    );
    // Vérifie la présence d'un champ ou bouton clé
    expect(container.innerHTML).toMatch(/édition|edit|employé|employee/i);
  });
});
