/**
 * Erreur pour les entités non traitables (HTTP 422)
 */
import ApiError from './ApiError';

export default class UnprocessableEntityApiError extends ApiError {
  constructor(message = 'UnprocessableEntityApiError', data = {}, axiosError?: any) {
    super(422, 'Unprocessable Entity', message, data, axiosError);
  }
}
