import React from 'react';
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import EmployeeForm from '../../components/EmployeeForm';

describe('EmployeeForm', () => {
  it('renders all required fields', () => {
    render(<EmployeeForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data', () => {
    const handleSubmit = jest.fn();
    render(<EmployeeForm onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: '75000' } });
    fireEvent.click(screen.getByRole('button', { name: /Enregistrer|Save/i }));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('disables fields when processing', () => {
    render(<EmployeeForm onSubmit={jest.fn()} processing />);
    expect(screen.getByLabelText(/First Name/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /Enregistrer|Save/i })).toBeDisabled();
  });
});
