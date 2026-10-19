import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class OctenAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'OctenAPIError';
	}
}

export const OCTEN_API_BASE = 'https://api.octen.ai';

export type OctenRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Bodies are endpoint-specific JSON that the zod input schemas already
	// validated, so the shared transport stays generic over a JSON record.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	/** Values used to fill `{name}` segments in the endpoint path. */
	path?: Record<string, string>;
	/**
	 * Octen's search, extract and embedding endpoints wrap their payload in
	 * `{ code, msg, data, request_id }`; the Answer and generation endpoints
	 * return the resource directly. Defaults to true.
	 */
	envelope?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

/**
 * Validates the shared Octen envelope and returns its `data` payload. Octen can
 * report a business error with HTTP 200 and a non-zero `code`, so an envelope
 * error is thrown as an ApiError whose `status` mirrors `code`; the
 * status-based handlers in error-handlers.ts then classify it (401/403 → auth,
 * 429 → rate limit, 400/422 → bad request) instead of the caller receiving a
 * silently "successful" envelope.
 */
function unwrapOctenEnvelope(
	value: unknown,
	requestOptions: ApiRequestOptions,
): unknown {
	if (!isRecord(value)) {
		throw new OctenAPIError('Octen returned a non-object response body');
	}

	const code = value.code;
	if (typeof code !== 'number') {
		throw new OctenAPIError('Octen response is missing the numeric code field');
	}

	if (code !== 0) {
		const message =
			typeof value.msg === 'string' && value.msg.length > 0
				? value.msg
				: `Octen request failed with code ${code}`;
		throw new ApiError(
			requestOptions,
			{
				url: requestOptions.url,
				ok: false,
				status: code,
				statusText: message,
				body: value,
			},
			message,
		);
	}

	return value.data;
}

/**
 * Issues one Octen request and returns its JSON body. For enveloped endpoints
 * this is the unwrapped `data` payload. The return type is `unknown` because
 * Octen responses are unbounded wire JSON: the caller narrows them with the
 * endpoint's zod output schema.
 */
export async function makeOctenRequest(
	endpoint: string,
	apiKey: string,
	options: OctenRequestOptions = {},
): Promise<unknown> {
	const { method = 'GET', body, query, path, envelope = true } = options;

	// An empty key means no credentials are configured (the keyBuilder resolves
	// that case to ''). Fail fast with Corsair's missing-auth error instead of
	// sending a keyless request.
	if (apiKey.length === 0) {
		throw new AuthMissingError('octen', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: OCTEN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Octen authenticates with the key in the `x-api-key` header. TOKEN is
		// deliberately left unset: request.ts would turn it into
		// `Authorization: Bearer <key>`, which Octen only accepts as an
		// alternative to the header used here.
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	// ApiError carries status and retryAfter, which error-handlers.ts needs, so
	// transport errors are propagated untouched.
	const response = await request<unknown>(config, requestOptions);

	if (!envelope) {
		return response;
	}

	return unwrapOctenEnvelope(response, requestOptions);
}
