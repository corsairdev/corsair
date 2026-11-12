import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { BinaryArtifact, GenerationJob } from './endpoints/types';
import { GenerationJobSchema } from './endpoints/types';

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
 * returns JSON job responses, including completed jobs for `async: false`;
 * v1 generation routes return raw files. The sync transport also accepts raw
 * v2 file responses because the provider's endpoint pages conflict with its
 * API overview on that detail. See https://cloudlayer.io/docs/api-overview/.
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

/** Bound long-running v1 and synchronous v2 renders without hanging forever. */
export const CLOUDLAYER_SYNC_TIMEOUT_MS = 120_000;

// Let Corsair's endpoint error handler own 429 retries for every transport.
// Keep header extraction enabled with zero transport retries so the handler
// still receives Cloudlayer's Retry-After value instead of a fixed delay.
const CLOUDLAYER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

function parseRetryAfterMs(value: string | null): number | undefined {
	if (value === null) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const date = Date.parse(value);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

// `unknown` because provider JSON is untrusted until runtime-checked here.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because request payloads are arbitrary JSON values traversed
// recursively; each branch narrows the value before reading it.
function collectRequestStrings(value: unknown, strings: Set<string>): void {
	if (typeof value === 'string') {
		if (value.length >= 8) strings.add(value);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) collectRequestStrings(item, strings);
		return;
	}
	if (isRecord(value)) {
		for (const item of Object.values(value))
			collectRequestStrings(item, strings);
	}
}

function sanitizeProviderMessage(
	message: string,
	apiKey: string,
	options: CloudlayerSyncRequestOptions,
): string {
	const privateValues = new Set<string>();
	if (apiKey.length >= 4) privateValues.add(apiKey);
	collectRequestStrings(options.body, privateValues);
	collectRequestStrings(options.query, privateValues);

	return [...privateValues]
		.sort((left, right) => right.length - left.length)
		.reduce(
			(safeMessage, value) => safeMessage.split(value).join('[REDACTED]'),
			message,
		);
}

async function readProviderError(
	response: Response,
	apiKey: string,
	options: CloudlayerSyncRequestOptions,
): Promise<{ body?: Record<string, unknown>; message?: string }> {
	// `unknown` because response.json() returns untrusted data; isRecord
	// narrows it before any field is read.
	let parsed: unknown;
	try {
		parsed = await response.json();
	} catch {
		return {};
	}
	if (!isRecord(parsed)) return {};

	const messageValue = [parsed.message, parsed.error, parsed.detail].find(
		(value): value is string => typeof value === 'string',
	);
	const message =
		messageValue === undefined
			? undefined
			: sanitizeProviderMessage(messageValue, apiKey, options);
	const body: Record<string, unknown> = {};
	if (typeof parsed.statusCode === 'number')
		body.statusCode = parsed.statusCode;
	if (parsed.status === 'error') body.status = parsed.status;
	if (message !== undefined) body.message = message;

	return {
		...(Object.keys(body).length > 0 ? { body } : {}),
		...(message === undefined ? {} : { message }),
	};
}

type CloudlayerSyncRequestOptions = {
	method: 'GET' | 'POST';
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
	apiVersion?: 'v1' | 'v2';
};

/**
 * Fetch a synchronous generation response with a bounded long-render timeout.
 * V2 JSON responses are validated as completed jobs; v1 raw bytes (and any raw
 * v2 response) are base64-encoded before entering Corsair's JSON-shaped result.
 */
export async function makeCloudlayerSyncRequest(
	endpoint: string,
	apiKey: string,
	options: CloudlayerSyncRequestOptions,
): Promise<BinaryArtifact | GenerationJob> {
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
		signal: AbortSignal.timeout(CLOUDLAYER_SYNC_TIMEOUT_MS),
	});

	if (!response.ok) {
		const retryAfterMs = parseRetryAfterMs(response.headers.get('Retry-After'));
		const providerError = await readProviderError(response, apiKey, options);
		throw new ApiError(
			{ method: options.method, url: endpoint },
			{
				url: `${base}${endpoint}`,
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body: providerError.body,
			},
			providerError.message ||
				response.statusText ||
				`Cloudlayer request failed (${response.status})`,
			retryAfterMs === undefined ? undefined : { retryAfter: retryAfterMs },
		);
	}

	const contentType = response.headers.get('Content-Type') ?? '';
	if (
		apiVersion === 'v2' &&
		(contentType.toLowerCase().includes('application/json') ||
			contentType.toLowerCase().includes('+json'))
	) {
		// `unknown` because response.json() returns untrusted data; the Zod
		// schema below performs the narrowing.
		const body: unknown = await response.json();
		return GenerationJobSchema.parse(body);
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
		return await request<T>(config, requestOptions, {
			rateLimitConfig: CLOUDLAYER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new CloudlayerAPIError('Unknown error');
	}
}
