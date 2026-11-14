import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FeltAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof FeltAPIError) {
		return error.status;
	}
	if (error instanceof ApiError) {
		return error.status;
	}
	return undefined;
}

const WRITE_ACTIONS = new Set([
	'create',
	'update',
	'updateBulk',
	'delete',
	'duplicate',
	'move',
	'upload',
	'refresh',
	'publish',
	'sync',
	'resolve',
	'upsert',
	'upsertGroups',
	'upsertItems',
	'deleteItem',
	'createCredential',
	'updateCredential',
	'deleteCredential',
	'addFromSource',
	'updateStyle',
	'createCustomExport',
	'createEmbedToken',
	'exportImage',
	'createLayout',
	'updateLayout',
	'deleteLayout',
	'createPage',
	'updatePage',
	'deletePage',
	'exportPage',
]);

/**
 * Checks whether an operation is a non-idempotent or mutating write action.
 * Mutating writes must not be automatically retried on 5xx errors to prevent duplicate mutations.
 */
export function isNonIdempotent(operation: string): boolean {
	const action = operation.split('.').pop() ?? '';
	return WRITE_ACTIONS.has(action);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('429') ||
				msg.includes('too many requests') ||
				msg.includes('too_many_requests') ||
				msg.includes('rate limit')
			);
		},
		// Single owner pattern: transport (corsair/http) owns 429 retries and honors Retry-After.
		// Handlers return maxRetries: 0 to prevent multiplicative retry storms.
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_access_token') ||
				msg.includes('forbidden') ||
				msg.includes('over_storage_limit') ||
				msg.includes('over_processing_limit') ||
				msg.includes('over_data_connection_limit')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 400 || status === 422) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('invalid') ||
				msg.includes('422') ||
				msg.includes('unprocessable')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('not_found');
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('500') ||
				msg.includes('502') ||
				msg.includes('503') ||
				msg.includes('504') ||
				msg.includes('server error') ||
				msg.includes('gateway timeout')
			);
		},
		handler: async (_error: Error, context: { operation: string }) => {
			if (isNonIdempotent(context.operation)) {
				return { maxRetries: 0 };
			}
			return { maxRetries: 2 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
