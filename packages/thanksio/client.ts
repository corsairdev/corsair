import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const THANKSIO_API_BASE = 'https://api.thanks.io/api/v2';

const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class ThanksIoAPIError extends Error {
	status?: number;
	// Error bodies can be arbitrary JSON or text, so no narrower shape is reliable.
	body?: unknown;
	retryAfter?: number;
	readonly method: string;

	constructor(message: string, cause: Error, method: string) {
		super(message, { cause });
		this.name = 'ThanksIoAPIError';
		this.method = method;
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
		}
	}
}

// Corsair's JSON transport converts non-JSON responses to text; PNGs need a binary-safe path.
export async function makeThanksIoImageRequest(
	key: string,
	query: Record<string, string | number | undefined>,
): Promise<Blob> {
	if (!key?.trim()) throw new AuthMissingError('thanksio', 'api_key');
	const url = new URL(`${THANKSIO_API_BASE}/build/image-template`);
	for (const [name, value] of Object.entries(query))
		if (value !== undefined) url.searchParams.set(name, String(value));
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: { Authorization: `Bearer ${key}` },
		});
	} catch (error) {
		const cause = error instanceof Error ? error : new Error(String(error));
		throw new ThanksIoAPIError(cause.message, cause, 'GET');
	}
	if (!response.ok) {
		const contentType = response.headers.get('content-type') ?? '';
		const body = contentType.toLowerCase().includes('json')
			? await response.json().catch(() => undefined)
			: await response.text().catch(() => undefined);
		const failure = new ThanksIoAPIError(
			`Thanks.io returned ${response.status}`,
			new Error(response.statusText),
			'GET',
		);
		failure.status = response.status;
		failure.body = body;
		const retryAfter = response.headers.get('retry-after');
		if (retryAfter && /^\d+$/.test(retryAfter))
			failure.retryAfter = Number(retryAfter) * 1000;
		throw failure;
	}
	return response.blob();
}

export type ThanksIoRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// The shared transport accepts different validated bodies for each operation;
	// a single narrower shape would exclude valid endpoint-specific payloads.
	body?: unknown;
};

// Responses vary by operation and are untrusted until the endpoint's output schema
// parses them; assigning one narrower transport return type would be unsound.
export async function makeThanksIoRequest(
	key: string,
	spec: ThanksIoRequest,
): Promise<unknown> {
	if (!key?.trim()) throw new AuthMissingError('thanksio', 'api_key');
	const config: OpenAPIConfig = {
		BASE: THANKSIO_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Authorization: `Bearer ${key}` },
	};
	const options: ApiRequestOptions = {
		method: spec.method,
		url: spec.path,
		query: spec.query,
		body: spec.body,
		mediaType: spec.body === undefined ? undefined : 'application/json',
	};
	try {
		// The shared HTTP client cannot know the endpoint-specific response schema;
		// keep its result unknown until the caller validates it.
		return await request<unknown>(config, options, { rateLimitConfig });
	} catch (error) {
		throw new ThanksIoAPIError(
			error instanceof Error ? error.message : 'Unknown Thanks.io error',
			error instanceof Error ? error : new Error(String(error)),
			spec.method,
		);
	}
}
