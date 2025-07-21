
import ApiError from './ApiError';

/**
 * Represents an API error for an unprocessable entity (HTTP 422),
 * typically used to signal data validation errors (e.g., form validation).
 *
 * @class UnprocessableEntityApiError
 * @extends ApiError
 * @example
 * throw new UnprocessableEntityApiError({
 *   username: ["Username is required."],
 *   email: ["Email is invalid."]
 * });
 */
export default class UnprocessableEntityApiError extends ApiError {
  /**
   * Detailed validation errors as a dictionary where each key is a field
   * and each value is an array of error messages for that field.
   * @type {{ [key: string]: string[] }}
   */
  data: { [key: string]: string[] };

  /**
   * Creates a new UnprocessableEntityApiError instance.
   * @param data - Object containing the validation errors to associate with the error.
   */
  constructor(data: { [key: string]: string[] }) {
    super(422, 'Validation Error', 'The provided data is invalid.', data);
    this.data = data;
  }

  /**
   * Compiles validation errors into an array of objects.
   * Each object contains a key representing a field, and its associated value.
   * @returns {Array<{ [key: string]: string }>} Array of errors as field => message objects.
   */
  compileValidationErrors(): Array<{ [key: string]: string }> {
    return Object.entries(this.data)
      .map(([key, errors]) => {
        return {
          [key]: `${errors.join(', ')}`,
        };
      });
  }

  /**
   * Transforms validation errors into an HTML string representing a styled table.
   * @returns {string} An HTML string containing a table listing all validation errors.
   */
  compileValidationErrorsInHtml(): string {
    // Create a table with the validation errors
    const table = document.createElement('table');

    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.borderSpacing = '0';
    table.style.border = '1px solid #ccc';
    table.style.fontSize = '14px';

    const tHead = table.createTHead();
    tHead.insertRow();

    const fieldHeaderCell = tHead.rows[0].insertCell();
    fieldHeaderCell.textContent = 'Field';
    fieldHeaderCell.style.border = '1px solid #ccc';
    fieldHeaderCell.style.padding = '5px';
    fieldHeaderCell.style.textAlign = 'left';
    fieldHeaderCell.style.fontWeight = 'bold';
    fieldHeaderCell.style.minWidth = '200px';

    const errorHeaderCell = tHead.rows[0].insertCell();
    errorHeaderCell.textContent = 'Error';
    errorHeaderCell.style.border = '1px solid #ccc';
    errorHeaderCell.style.padding = '5px';
    errorHeaderCell.style.textAlign = 'left';
    errorHeaderCell.style.fontWeight = 'bold';

    const tBody = table.createTBody();

    this.compileValidationErrors().forEach(error => {
      const key = Object.keys(error)[0];
      const value = error[key];

      const row = tBody.insertRow();

      const fieldCell = row.insertCell();
      fieldCell.textContent = key;
      fieldCell.style.border = '1px solid #ccc';
      fieldCell.style.padding = '5px';

      const errorCell = row.insertCell();
      errorCell.textContent = value;
      errorCell.style.border = '1px solid #ccc';
      errorCell.style.padding = '5px';
    });

    return table.outerHTML;
  }
}

