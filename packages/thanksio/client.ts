import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const THANKSIO_API_BASE = 'https://api.thanks.io/api/v2';
const IMAGE_TIMEOUT_MS = 20_000;

const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// Corsair's JSON transport converts non-JSON responses to text; PNGs need a binary-safe path.
// The PNG comes back base64-encoded so it survives JSON transports (MCP, the HTTP call route).
export async function makeThanksIoImageRequest(
	key: string,
	query: Record<string, string | number | undefined>,
): Promise<{ contentType: string; base64: string }> {
	if (!key?.trim()) throw new AuthMissingError('thanksio', 'api_key');
	const url = new URL(`${THANKSIO_API_BASE}/build/image-template`);
	for (const [name, value] of Object.entries(query))
		if (value !== undefined) url.searchParams.set(name, String(value));
	// Core's request deadline does not cover this direct fetch; the signal also
	// bounds the body read below.
	const response = await fetch(url, {
		method: 'GET',
		headers: { Authorization: `Bearer ${key}` },
		signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS),
	});
	if (!response.ok) {
		const contentType = response.headers.get('content-type') ?? '';
		const body = contentType.toLowerCase().includes('json')
			? await response.json().catch(() => undefined)
			: await response.text().catch(() => undefined);
		const retryAfter = response.headers.get('retry-after');
		// Same error type as core's request(), so the 429 handler and core's
		// management route read status, body and retryAfter the usual way.
		throw new ApiError(
			{ method: 'GET', url: '/build/image-template', query },
			{
				url: url.toString(),
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body,
			},
			`Thanks.io returned ${response.status}`,
			{
				retryAfter:
					retryAfter && /^\d+$/.test(retryAfter)
						? Number(retryAfter) * 1000
						: undefined,
			},
		);
	}
	const bytes = Buffer.from(await response.arrayBuffer());
	return {
		contentType: response.headers.get('content-type') ?? 'image/png',
		base64: bytes.toString('base64'),
	};
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
	// The shared HTTP client cannot know the endpoint-specific response schema;
	// keep its result unknown until the caller validates it. Core's ApiError
	// passes through unchanged (plugin rules R8).
	return request<unknown>(config, options, { rateLimitConfig });
}
