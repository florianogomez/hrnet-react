import employeeRoutes from '../routes';

describe('employeeRoutes', () => {
  it('doit retourner le chemin de la liste', () => {
    expect(employeeRoutes.list).toBe('/employees');
  });

  it('doit retourner le chemin d\'ajout', () => {
    expect(employeeRoutes.add).toBe('/employees/add');
  });

  it('doit retourner le chemin d\'édition pour un id', () => {
    expect(employeeRoutes.edit('123')).toBe('/employees/edit/123');
  });

  it('doit retourner le chemin de vue pour un id', () => {
    expect(employeeRoutes.view('456')).toBe('/employees/view/456');
  });
});
