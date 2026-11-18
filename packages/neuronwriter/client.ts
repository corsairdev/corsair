import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NEURONWRITER_API_BASE =
	'https://app.neuronwriter.com/neuron-api/0.5/writer';

// Core's request() retries a 429 three times with backoff and honours a
// Retry-After header if a proxy sends one, so the 429 handler in
// error-handlers.ts does not retry again. NEURONwriter documents none.
const NEURONWRITER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 3,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Every method is a POST to `{base}/{method}`, and the key goes in the
 * `X-API-KEY` header. The body is JSON; the docs' Python examples send
 * `json.dumps(...)` as a body, so JSON is what the endpoint reads.
 *
 * Errors are thin: a 401 is `{ "error": "Invalid or inactive API key." }`, and
 * the auth check runs before routing, so a bad key hides whether a method name
 * exists. A successful call answers the payload directly, with no envelope.
 */
export class NeuronwriterAPIError extends Error {
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NeuronwriterAPIError';
		this.method = options.method;
	}
}

/**
 * Rebuilds NEURONwriter's HTTP error as a core `ApiError`, so its status and
 * Retry-After reach core and the error handlers (R8).
 *
 * The sent body is dropped: an import or evaluate call carries the whole
 * article and its URL. The provider's `{ error }` text survives, sliced to a
 * sane length because a 500 can be an HTML page.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const detail = readString(asRecord(error.body), 'error');
	return new ApiError(
		{ ...request, url: request.url.split('?')[0] ?? request.url },
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: detail === undefined ? undefined : { error: detail },
		},
		describeNeuronwriterError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// unknown: the record is an untyped error body; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: see NeuronwriterAPIError.
export function describeNeuronwriterError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text =
		readString(asRecord(body), 'error') ??
		// A 500 from the platform can be an HTML page.
		(typeof body === 'string' && body.length > 0
			? body.slice(0, 200)
			: undefined) ??
		fallback;
	const label = status === undefined ? '' : `NEURONwriter ${status}: `;
	return `${label}${text}`;
}

export type NeuronwriterRequest = {
	/** The method name, e.g. `list-projects`. */
	method: string;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeNeuronwriterRequest(
	apiKey: string,
	{ method, body }: NeuronwriterRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NEURONWRITER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'X-API-KEY': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/${method}`,
		body: body ?? {},
		mediaType: 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NEURONWRITER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new NeuronwriterAPIError(error.message, { cause: error, method });
		}
		throw new NeuronwriterAPIError('Unknown NEURONwriter error', { method });
	}
}
