import React from 'react';
import { render } from '@testing-library/react';
import EmployeeDataTable from '../../components/EmployeeDataTable';

describe('EmployeeDataTable', () => {
  it('renders without crashing', () => {
    render(<EmployeeDataTable employees={[]} />);
  });

  it('displays employee rows', () => {
    const employees = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '',
        startDate: '',
        department: 'Sales',
        street: '',
        city: 'Paris',
        state: 'FR',
        zipCode: '75000',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '',
        startDate: '',
        department: 'HR',
        street: '',
        city: 'Lyon',
        state: 'FR',
        zipCode: '69000',
      },
    ];
    const { getByText } = render(<EmployeeDataTable employees={employees} />);
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Jane Smith')).toBeInTheDocument();
    expect(getByText('Sales')).toBeInTheDocument();
    expect(getByText('HR')).toBeInTheDocument();
  });
});
