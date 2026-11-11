import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CloudlayerAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'CloudlayerAPIError';
	}
}

/**
 * cloudlayer.io serves resources from versioned base URLs. V2 generation
 * defaults to JSON job responses; synchronous v1 and v2 responses use the
 * plugin-local binary transport so raw bytes are returned as base64 artifacts.
 * Documented at https://cloudlayer.io/docs/api-overview/ ("Base URL").
 */
export const CLOUDLAYER_API_BASE = 'https://api.cloudlayer.io/v2';

/** V1 is used by synchronous generation routes and the documented legacy jobs list. */
export const CLOUDLAYER_API_V1_BASE = 'https://api.cloudlayer.io/v1';

/**
 * Every documented endpoint sends the account API key as `X-API-Key`; there is
 * no bearer-token or OAuth variant for the REST API
 * (https://cloudlayer.io/docs/api-overview/#authentication).
 */
export const CLOUDLAYER_API_KEY_HEADER = 'X-API-Key';

type CloudlayerBinaryRequestOptions = {
	method: 'GET' | 'POST';
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
	apiVersion?: 'v1' | 'v2';
};

function parseRetryAfterMs(value: string | null): number | undefined {
	if (value === null) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const date = Date.parse(value);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

/**
 * Fetch a synchronous generation response as bytes. `corsair/http` returns
 * non-JSON responses as text, so this plugin-local path base64-encodes the
 * artifact before it enters the JSON-shaped Corsair operation result.
 */
export async function makeCloudlayerBinaryRequest(
	endpoint: string,
	apiKey: string,
	options: CloudlayerBinaryRequestOptions,
): Promise<{ kind: 'binary'; contentType: string; base64: string }> {
	if (apiKey.length === 0) {
		throw new AuthMissingError('cloudlayer', 'api_key');
	}

	const apiVersion = options.apiVersion ?? 'v2';
	const base =
		apiVersion === 'v1' ? CLOUDLAYER_API_V1_BASE : CLOUDLAYER_API_BASE;
	const url = new URL(`${base}${endpoint}`);
	for (const [key, value] of Object.entries(options.query ?? {})) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}

	const response = await fetch(url, {
		method: options.method,
		headers: {
			...(options.body === undefined
				? {}
				: { 'Content-Type': 'application/json' }),
			[CLOUDLAYER_API_KEY_HEADER]: apiKey,
		},
		body: options.body === undefined ? undefined : JSON.stringify(options.body),
		credentials: 'omit',
		signal: AbortSignal.timeout(20_000),
	});

	if (!response.ok) {
		const retryAfterMs = parseRetryAfterMs(response.headers.get('Retry-After'));
		throw new ApiError(
			{ method: options.method, url: endpoint },
			{
				url: `${base}${endpoint}`,
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body: undefined,
			},
			response.statusText || `Cloudlayer request failed (${response.status})`,
			retryAfterMs === undefined ? undefined : { retryAfter: retryAfterMs },
		);
	}

	const bytes = Buffer.from(await response.arrayBuffer());
	return {
		kind: 'binary',
		contentType:
			response.headers.get('Content-Type') ?? 'application/octet-stream',
		base64: bytes.toString('base64'),
	};
}

export async function makeCloudlayerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Endpoint schemas validate these JSON objects before they reach transport.
		body?: object;
		// Form parts are endpoint-specific and validated before reaching transport.
		formData?: Record<string, string | Blob>;
		query?: Record<string, string | number | boolean | undefined>;
		apiVersion?: 'v1' | 'v2';
	} = {},
): Promise<T> {
	const { method = 'GET', body, formData, query, apiVersion = 'v2' } = options;

	// An empty key means no credentials are configured; every cloudlayer.io
	// endpoint requires one (a keyless request is documented to answer 401),
	// so fail fast with Corsair's missing-auth error instead of sending it.
	if (apiKey.length === 0) {
		throw new AuthMissingError('cloudlayer', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: apiVersion === 'v1' ? CLOUDLAYER_API_V1_BASE : CLOUDLAYER_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			...(formData === undefined ? { 'Content-Type': 'application/json' } : {}),
			[CLOUDLAYER_API_KEY_HEADER]: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		...(formData === undefined
			? {
					body:
						method === 'POST' || method === 'PUT' || method === 'PATCH'
							? body
							: undefined,
					mediaType: 'application/json; charset=utf-8',
				}
			: { formData }),
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new CloudlayerAPIError('Unknown error');
	}
}
