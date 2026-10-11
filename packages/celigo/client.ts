import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CeligoAPIError extends Error {
	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'CeligoAPIError';
	}
}

// https://developer.celigo.com/api/getting-started/environments
export type CeligoRegion = 'us' | 'eu' | 'au' | 'ca';

export function celigoBaseUrl(region: CeligoRegion = 'us'): string {
	return region === 'us'
		? 'https://api.integrator.io/v1'
		: `https://api.${region}.integrator.io/v1`;
}

export type CeligoQueryValue = string | number | boolean | string[] | undefined;

export async function makeCeligoRequest(
	path: string,
	apiKey: string,
	options: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		query?: Record<string, CeligoQueryValue>;
		// unknown: bodies are validated endpoint inputs, JSON Patch arrays, or
		// arbitrary state values.
		body?: unknown;
		region?: CeligoRegion;
	},
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: celigoBaseUrl(options.region),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path,
		query: options.query,
		// DELETE /flows/{_id}/{_stepId}/resolved carries a selection body too.
		body: options.body,
		mediaType:
			options.body === undefined
				? undefined
				: 'application/json; charset=utf-8',
	};

	try {
		return await request<unknown>(config, requestOptions);
	} catch (error) {
		// ApiError keeps status and retryAfter for the 429 and 401 handlers.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new CeligoAPIError(error.message, { cause: error });
		}
		throw new CeligoAPIError('Unknown Celigo API error');
	}
}
