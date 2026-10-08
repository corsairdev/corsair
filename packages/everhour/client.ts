import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class EverhourAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		// The provider error body has no fixed shape; narrow before use.
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'EverhourAPIError';
	}
}

const EVERHOUR_API_BASE = 'https://api.everhour.com';

// Record<string, unknown> holds JSON-safe query/body maps; values are
// narrowed per endpoint before sending.
function compactRecord(
	record?: Record<string, unknown>,
): Record<string, unknown> | undefined {
	if (!record) return undefined;
	// Filtered copy keeps JSON-safe values without claiming their types.
	const compact: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(record)) {
		if (value !== undefined) compact[key] = value;
	}
	return Object.keys(compact).length > 0 ? compact : undefined;
}

export async function makeEverhourRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// JSON-safe request maps; each endpoint passes its typed input fields.
		body?: Record<string, unknown>;
		// JSON-safe query maps; each endpoint passes its typed query fields.
		query?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: EVERHOUR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-Api-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? compactRecord(body)
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? compactRecord(query) : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
		// `unknown` is required for catch clauses; narrowed with instanceof below.
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new EverhourAPIError(error.message);
		}
		throw new EverhourAPIError('Unknown error');
	}
}
