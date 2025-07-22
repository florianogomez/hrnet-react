/**
 * Utility component to render children only on the client side.
 * Prevents SSR/CSR hydration mismatches for dynamic components.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children to render client-side only.
 * @returns {JSX.Element | null} The rendered children or null on server.
 */
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);
	return mounted ? <>{children}</> : null;
};

/**
 * Utility to convert a JS Date to a local YYYY-MM-DD string (not UTC).
 * @param {Date | null} date - The date to convert.
 * @returns {string} The formatted date string or empty string if invalid.
 */
function toLocalDateString(date: Date | null): string {
	if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}
import Select from "react-select";
import React from "react";
import type { EmployeeCreateApiPayloadInterface } from "../interfaces/EmployeeCreateApiPayloadInterface";
import { createLogger } from "~/utils/logger";
import { HrnetDatePicker } from "@florianogomez/hrnet-datepicker";
import { statesData } from "../data/employeeData";

import "@florianogomez/hrnet-datepicker/dist/hrnet-datepicker.css";

const logger = createLogger("EmployeeForm");

/**
 * Props for the EmployeeForm component.
 * @interface EmployeeFormProps
 * @property {Partial<EmployeeCreateApiPayloadInterface>} [initialValues] - Initial values for the form fields.
 * @property {(data: EmployeeCreateApiPayloadInterface) => Promise<void> | void} onSubmit - Callback when the form is submitted.
 * @property {(data: Partial<EmployeeCreateApiPayloadInterface>) => void} [onChange] - Callback when form data changes.
 * @property {string} [submitLabel] - Label for the submit button.
 * @property {() => void} [onCancel] - Callback when the cancel button is clicked.
 * @property {boolean} [processing] - Whether the form is in a processing/loading state.
 * @property {string} [employeeId] - The ID of the employee being edited (if any).
 * @property {boolean} [isEditing] - Whether the form is in edit mode.
 */
export interface EmployeeFormProps {
	initialValues?: Partial<EmployeeCreateApiPayloadInterface>;
	onSubmit: (data: EmployeeCreateApiPayloadInterface) => Promise<void> | void;
	onChange?: (data: Partial<EmployeeCreateApiPayloadInterface>) => void;
	submitLabel?: string;
	onCancel?: () => void;
	processing?: boolean;
	employeeId?: string;
	isEditing?: boolean;
}


/**
 * EmployeeForm component for creating or editing an employee.
 * Handles personal, professional, and address information with validation and client-only dynamic fields.
 * @param {EmployeeFormProps} props - The component props.
 * @returns {JSX.Element} The rendered employee form.
 */
export const EmployeeForm: React.FC<EmployeeFormProps> = ({
   initialValues = {},
   onSubmit,
   onChange,
   submitLabel = "Save",
   onCancel,
   processing = false,
   employeeId,
   isEditing = false,
}) => {
	/**
	 * Default values for the form fields, merged with initial values.
	 */
	const defaultValues: EmployeeCreateApiPayloadInterface = {
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		startDate: "",
		department: "Sales",
		street: "",
		city: "",
		state: "AL",
		zipCode: "",
		...initialValues,
	};

	/**
	 * State for the form data.
	 */
	const [formData, setFormData] = React.useState<EmployeeCreateApiPayloadInterface>(defaultValues);

	/**
	 * Effect to call onChange callback when form data changes.
	 */
	React.useEffect(() => {
		if (onChange) {
			onChange(formData);
		}
	}, [formData, onChange]);

	/**
	 * Handle input changes for text and select fields.
	 * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The input change event.
	 */
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	/**
	 * Handle form submission.
	 * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
	 */
	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			logger.info("Employee form submit:", { firstName: formData.firstName, isEditing });
			await onSubmit(formData);
		} catch (error) {
			logger.error("Error submitting employee form:", error);
		}
	};

	/**
	 * Handle cancel action. Calls onCancel or resets the form.
	 */
	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		} else {
			setFormData(defaultValues);
		}
	};

	/**
	 * Department options for the select field.
	 */
	const departmentOptions = ["Sales", "Marketing", "Engineering", "Human Resources", "Legal"];

	/**
	 * react-select options for department.
	 */
	const departmentSelectOptions = departmentOptions.map((dept) => ({ value: dept, label: dept }));

	/**
	 * US state options for the select field.
	 */
	const stateOptions = statesData.map((state) => ({
		value: state.abbreviation,
		label: state.name,
	}));


	/**
	 * react-select options for US states.
	 */
	const stateSelectOptions = stateOptions.map((state) => ({
		value: state.value,
		label: state.label,
	}));

   return (
	  <div className="card">
		 <div className="card-header">
			<div className="row align-items-center">
			   <div className="col">
				  <h4 className="card-title mb-0">
					 {isEditing ? "Edit employee" : "New employee"}
				  </h4>
			   </div>
			   <div className="col-auto">
				  <button
					 type="button"
					 className="btn btn-light"
					 onClick={handleCancel}
					 disabled={processing}
				  >
					 ✕
				  </button>
			   </div>
			</div>
		 </div>
		 <div className="card-body">
			<form onSubmit={handleFormSubmit}>
			   <div className="row g-3">
				  {/* Personal Information */}
				  <div className="col-12">
					 <h5 className="text-muted">Personal Information</h5>
				  </div>

						<div className="col-md-6">
							<label htmlFor="firstName" className="form-label">
								First Name <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="firstName"
								name="firstName"
								value={formData.firstName}
								onChange={handleInputChange}
								required
								disabled={processing}
							/>
						</div>

						<div className="col-md-6">
							<label htmlFor="lastName" className="form-label">
								Last Name <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="lastName"
								name="lastName"
								value={formData.lastName}
								onChange={handleInputChange}
								required
								disabled={processing}
							/>
						</div>

						<div className="col-md-6">
							<ClientOnly>
								<HrnetDatePicker
									label="Date of Birth"
									name="dateOfBirth"
									required
									value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
									onChange={(value) =>
										setFormData((prev) => ({
											...prev,
											dateOfBirth: toLocalDateString(value),
										}))
									}
									disabled={processing}
									placeholder="Select a date"
									locale="fr"
								/>
							</ClientOnly>
						</div>

						<div className="col-md-6">
							<ClientOnly>
								<HrnetDatePicker
									label="Start Date"
									name="startDate"
									required
									value={formData.startDate ? new Date(formData.startDate) : null}
									onChange={(value) =>
										setFormData((prev) => ({
											...prev,
											startDate: toLocalDateString(value),
										}))
									}
									disabled={processing}
									placeholder="Select a date"
									locale="fr"
								/>
							</ClientOnly>
						</div>

				  {/* Professional Information */}
				  <div className="col-12 mt-4">
					 <h5 className="text-muted">Professional Information</h5>
				  </div>

						<div className="col-md-6">
							<label htmlFor="department" className="form-label">
								Department <span className="text-danger">*</span>
							</label>
							<ClientOnly>
								<Select
									inputId="department"
									name="department"
									options={departmentSelectOptions}
									value={departmentSelectOptions.find((opt) => opt.value === formData.department)}
									onChange={(option) =>
										setFormData((prev) => ({ ...prev, department: option ? option.value : "" }))
									}
									isDisabled={processing}
									placeholder="Select department"
									required
								/>
							</ClientOnly>
						</div>

				  {/* Address */}
				  <div className="col-12 mt-4">
					 <h5 className="text-muted">Address</h5>
				  </div>

						<div className="col-12">
							<label htmlFor="street" className="form-label">
								Street <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="street"
								name="street"
								value={formData.street}
								onChange={handleInputChange}
								required
								disabled={processing}
							/>
						</div>

						<div className="col-md-4">
							<label htmlFor="city" className="form-label">
								City <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="city"
								name="city"
								value={formData.city}
								onChange={handleInputChange}
								required
								disabled={processing}
							/>
						</div>

						<div className="col-md-4">
							<label htmlFor="state" className="form-label">
								State <span className="text-danger">*</span>
							</label>
							<ClientOnly>
								<Select
									inputId="state"
									name="state"
									options={stateSelectOptions}
									value={stateSelectOptions.find((opt) => opt.value === formData.state)}
									onChange={(option) =>
										setFormData((prev) => ({ ...prev, state: option ? option.value : "" }))
									}
									isDisabled={processing}
									placeholder="Select state"
									required
								/>
							</ClientOnly>
						</div>

						<div className="col-md-4">
							<label htmlFor="zipCode" className="form-label">
								Zip Code <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="zipCode"
								name="zipCode"
								value={formData.zipCode}
								onChange={handleInputChange}
								required
								disabled={processing}
							/>
						</div>

						{/* Actions */}
						<div className="col-12 mt-4">
							<div className="d-flex gap-2 justify-content-end">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={handleCancel}
									disabled={processing}
								>
									Cancel
								</button>
								<button type="submit" className="btn btn-primary" disabled={processing}>
									{processing && (
										<span className="spinner-border spinner-border-sm me-2" role="status">
											<span className="visually-hidden">Loading...</span>
										</span>
									)}
									{submitLabel}
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EmployeeForm;
