import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ScaleAiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ScaleAiAPIError';
	}
}

/**
 * Scale AI REST API base. Only `v1` is supported by Scale.
 * https://api-reference.scale.com/docs/api-reference/introduction-to-scale-api
 */
const SCALEAI_API_BASE = 'https://api.scale.com/v1';

function encodeBase64(value: string): string {
	if (typeof btoa === 'function') {
		return btoa(value);
	}
	return Buffer.from(value, 'utf-8').toString('base64');
}

/**
 * Scale authenticates with HTTP Basic Auth: the API key is the username and the
 * password is left blank (`<apiKey>:`).
 * https://api-reference.scale.com/docs/api-reference/authentication
 */
function buildAuthorizationHeader(apiKey: string): string {
	return `Basic ${encodeBase64(`${apiKey}:`)}`;
}

export type ScaleAiRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<
		string,
		string | number | boolean | Array<string | number> | undefined
	>;
	formData?: Record<string, unknown>;
};

/** Reject traversal segments and encode caller-supplied path pieces. */
export function encodeScalePathSegment(value: string): string {
	if (value === '.' || value === '..' || value.length === 0) {
		throw new ScaleAiAPIError('Invalid path segment');
	}
	return encodeURIComponent(value);
}

export async function makeScaleAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ScaleAiRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, formData } = options;

	const config: OpenAPIConfig = {
		BASE: SCALEAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: buildAuthorizationHeader(apiKey),
		},
	};

	const hasBody = body !== undefined && method !== 'GET';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body: formData ? undefined : hasBody ? body : undefined,
		formData,
		mediaType: formData
			? undefined
			: hasBody
				? 'application/json; charset=utf-8'
				: undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve ApiError so the plugin error handlers can inspect `status`
		// and `retryAfter` (rate limiting, auth failures, conflicts, …).
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ScaleAiAPIError(error.message);
		}
		throw new ScaleAiAPIError('Unknown error');
	}
}
