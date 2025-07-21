/**
 * Central entry point for all custom API-related errors.
 *
 * This module re-exports the various error classes used in the application.
 * It allows for easier imports in other modules via:
 * `import { NotFoundApiError } from '@/api/errors'`
 *
 * @module ApiErrors
 */

import ApiError from './ApiError'
import ForbiddenApiError from './ForbiddenApiError'
import InternalServerApiError from './InternalServerApiError'
import NotFoundApiError from './NotFoundApiError'
import UnauthorizedApiError from './UnauthorizedApiError'
import UnprocessableEntityApiError from './UnprocessableEntityApiError'
import GeneralApiError from './GeneralApiError';
import ConflictApiError from './ConflictApiError'

export {
	ApiError,
	ForbiddenApiError,
	InternalServerApiError,
	NotFoundApiError,
	UnauthorizedApiError,
	UnprocessableEntityApiError,
	GeneralApiError,
	ConflictApiError,
};
