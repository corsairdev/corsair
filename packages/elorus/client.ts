import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ElorusAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ElorusAPIError';
	}
}

export const ELORUS_API_BASE = 'https://api.elorus.com';
const MAX_BINARY_BYTES = 25 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 20_000;

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type ElorusRequestMode = 'json' | 'empty' | 'binary' | 'multipart';

export type ElorusRequestOptions = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path?: Record<string, string | number>;
	// Query shapes vary by route; the operation-specific Zod schema validates them before they reach this client.
	query?: Record<string, unknown>;
	// OpenAPI request bodies have route-specific shapes and are narrowed by each operation's Zod schema.
	body?: unknown;
	form?: Record<string, string | number | boolean | Blob | undefined>;
	organizationId: string;
	demo?: boolean;
	mode: ElorusRequestMode;
};

function routeWithPath(
	route: string,
	path: Record<string, string | number> | undefined,
): string {
	return route.replace(/\{([^}]+)\}/g, (_match, key: string) => {
		const value = path?.[key];
		if (value === undefined) {
			throw new ElorusAPIError('A required Elorus path parameter is missing.');
		}
		return encodeURIComponent(String(value));
	});
}

// Core's ApiError goes through (R8) so its status, retryAfter and provider body reach core and the error handlers.
// It is rebuilt without the sent body, form data and query, which can hold contacts' names, emails and addresses.
// Any other transport rejection can be an arbitrary value and becomes a generic error.
function toElorusError(error: unknown): Error {
	if (error instanceof ApiError) {
		const url = new URL(error.url, ELORUS_API_BASE);
		url.search = '';
		const rebuilt = new ApiError(
			{
				...error.request,
				body: undefined,
				formData: undefined,
				query: undefined,
			},
			{
				url: url.toString(),
				ok: false,
				status: error.status,
				statusText: error.statusText,
				body: error.body,
			},
			error.message,
			{
				retryAfter: error.retryAfter,
				rateLimitReset: error.rateLimitReset,
				rateLimitRemaining: error.rateLimitRemaining,
				rateLimitLimit: error.rateLimitLimit,
			},
		);
		// Same message, so the original stack (headline and frames) carries no sent data.
		if (error.stack) rebuilt.stack = error.stack;
		return rebuilt;
	}
	return new ElorusAPIError('Elorus API request failed.');
}

function parseRetryAfter(response: Response): number | undefined {
	const value = response.headers.get('retry-after');
	if (!value) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const date = Date.parse(value);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

// Binary query values are route-specific and already validated by the operation's Zod schema.
function binaryUrl(
	route: string,
	query: Record<string, unknown> | undefined,
): string {
	const url = new URL(route, ELORUS_API_BASE);
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			for (const item of value) url.searchParams.append(key, String(item));
		} else {
			url.searchParams.append(key, String(value));
		}
	}
	return url.toString();
}

async function requestBinary(
	url: string,
	headers: Record<string, string>,
): Promise<{
	kind: 'binary';
	contentType: string;
	base64: string;
	sizeBytes: number;
}> {
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch {
		throw new ElorusAPIError('Elorus binary request failed or timed out.');
	}

	if (!response.ok) {
		const retryAfter =
			response.status === 429 ? parseRetryAfter(response) : undefined;
		// Best-effort cancellation avoids retaining an error response body.
		await response.body?.cancel().catch(() => undefined);
		throw new ElorusAPIError(
			`Elorus API request failed with status ${response.status}.`,
			response.status,
			retryAfter,
		);
	}

	const contentLength = Number(response.headers.get('content-length'));
	if (Number.isFinite(contentLength) && contentLength > MAX_BINARY_BYTES) {
		await response.body?.cancel().catch(() => undefined);
		throw new ElorusAPIError(
			'Elorus binary response exceeds the 25 MiB limit.',
		);
	}
	if (!response.body) {
		throw new ElorusAPIError('Elorus returned an empty binary response.');
	}

	const reader = response.body.getReader();
	const chunks: Buffer[] = [];
	let sizeBytes = 0;
	// Stream readers may reject with arbitrary runtime values, not only Error objects.
	try {
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			if (chunk.value) {
				sizeBytes += chunk.value.byteLength;
				if (sizeBytes > MAX_BINARY_BYTES) {
					await reader.cancel();
					throw new ElorusAPIError(
						'Elorus binary response exceeds the 25 MiB limit.',
					);
				}
				chunks.push(Buffer.from(chunk.value));
			}
		}
	} catch (error: unknown) {
		if (error instanceof ElorusAPIError) throw error;
		await reader.cancel().catch(() => undefined);
		throw new ElorusAPIError('Elorus binary response could not be read.');
	}

	return {
		kind: 'binary',
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
		base64: Buffer.concat(chunks).toString('base64'),
		sizeBytes,
	};
}

// Provider responses are untrusted until the operation-specific output schema validates them.
export async function makeElorusRequest(
	endpoint: string,
	apiKey: string,
	options: ElorusRequestOptions,
): Promise<unknown> {
	if (!apiKey) throw new AuthMissingError('elorus', 'api_key');
	if (!options.organizationId) throw new AuthMissingError('elorus', 'api_key');
	const route = routeWithPath(endpoint, options.path);
	const headers: Record<string, string> = {
		Authorization: `Token ${apiKey}`,
		'X-Elorus-Organization': options.organizationId,
		Accept:
			options.mode === 'binary'
				? 'application/pdf, application/octet-stream'
				: 'application/json',
	};
	if (options.demo) headers['X-Elorus-Demo'] = '1';
	if (options.mode === 'binary') {
		return requestBinary(binaryUrl(route, options.query), headers);
	}

	const config: OpenAPIConfig = {
		BASE: ELORUS_API_BASE,
		VERSION: '1.2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions =
		options.mode === 'multipart'
			? {
					method: options.method,
					url: route,
					query: options.query,
					formData: options.form,
				}
			: {
					method: options.method,
					url: route,
					body: options.body,
					mediaType:
						options.body === undefined
							? undefined
							: 'application/json; charset=utf-8',
					query: options.query,
				};

	// The transport rejection may be non-Error data; toElorusError keeps ApiError and replaces anything else.
	try {
		// The shared transport returns untrusted provider JSON; operation.ts validates it before returning.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		throw toElorusError(error);
	}
}
