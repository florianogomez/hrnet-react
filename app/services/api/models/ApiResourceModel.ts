/**
 * Base model class for API resources.
 * Provides common functionality for managing resource data and timestamps.
 *
 * @class ApiResourceModel
 * @example
 * class EmployeeModel extends ApiResourceModel {
 *   constructor(data: EmployeeInterface) {
 *     super(data);
 *     this.firstName = data.firstName;
 *     this.lastName = data.lastName;
 *   }
 * }
 */
export class ApiResourceModel implements ApiResourceInterface {
	id: ApiResourceInterface["id"]; // Unique identifier for the resource
	created_at: ApiResourceInterface["created_at"];
	updated_at: ApiResourceInterface["updated_at"];
	deleted_at?: ApiResourceInterface["deleted_at"]; // Optional field for soft deletion
	created_by?: ApiResourceInterface["created_by"]; // Optional field for tracking who created the resource
	updated_by?: ApiResourceInterface["updated_by"]; // Optional field for tracking who last updated the resource
	deleted_by?: ApiResourceInterface["deleted_by"]; // Optional field for tracking who deleted the resource

	/**
	 * Creates a new ApiResourceModel instance.
	 * @param data - Partial resource data to initialize the model
	 */
	constructor(data: Partial<ApiResourceInterface>) {
		this.id = data.id || "";
		this.created_at = data.created_at;
		this.updated_at = data.updated_at;
		this.deleted_at = data.deleted_at;
		this.created_by = data.created_by;
		this.updated_by = data.updated_by;
		this.deleted_by = data.deleted_by;
	}

	/**
	 * Returns the resource data as an interface object.
	 * @returns ApiResourceInterface representation of the model
	 */
	get interface(): ApiResourceInterface {
		return {
			id: this.id,
			created_at: this.created_at,
			updated_at: this.updated_at,
			deleted_at: this.deleted_at,
			created_by: this.created_by,
			updated_by: this.updated_by,
			deleted_by: this.deleted_by
		};
	}

	/**
	 * Returns the resource data as a JSON string.
	 * @returns JSON string representation of the model
	 */
	get json(): string {
		return JSON.stringify(this.interface);
	}

	/**
	 * Returns a formatted creation date.
	 * @returns Formatted creation date string or empty string if not available
	 */
	get createdAtFormatted(): string {
		if (!this.created_at) return "";
		return new Date(this.created_at).toLocaleDateString();
	}

	/**
	 * Returns a formatted update date.
	 * @returns Formatted update date string or empty string if not available
	 */
	get updatedAtFormatted(): string {
		if (!this.updated_at) return "";
		return new Date(this.updated_at).toLocaleDateString();
	}

	/**
	 * Checks if the resource has been soft deleted.
	 * @returns True if the resource is deleted, false otherwise
	 */
	get isDeleted(): boolean {
		return Boolean(this.deleted_at);
	}
}
