import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const COMMCARE_API_BASE = 'https://www.commcarehq.org';

// No rate limits or 429s are documented for the CommCare APIs, so there is
// no rate-limit strategy to encode here.
const COMMCARE_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {},
};

/** Connection details every request needs; the key comes from the key builder. */
export type CommCareAuth = {
	/** CommCare project (HQ domain), e.g. `my-project`. */
	domain: string;
	/** CommCare username the API key belongs to, e.g. `me@example.commcarehq.org`. */
	username: string;
	apiKey: string;
};

/**
 * CommCare error bodies are not prominently documented; observed and
 * documented fields are `message` and `error`.
 */
export class CommCareAPIError extends Error {
	readonly status?: number;
	// unknown: error bodies are not documented beyond message fields; a
	// proxy can answer with HTML or text.
	readonly body?: unknown;
	readonly method?: string;
	/** True when retrying the failed request cannot repeat its effect. */
	readonly replaySafe?: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			replaySafe?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'CommCareAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.replaySafe = options.replaySafe ?? false;
	}
}

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function describeCommCareError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'message') ?? readString(record, 'error') ?? fallback;
	const label = status === undefined ? '' : `CommCare ${status}`;
	return label ? `${label}: ${text}` : text;
}

export type CommCareQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type CommCareFormData = Record<string, string>;

export type CommCareRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: CommCareQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Multipart fields (the OpenRosa form submission); string values only. */
	formData?: Record<string, string>;
	/** Marks reads whose 5xx failure can be retried without repeating an effect. */
	replaySafe?: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeCommCareRequest(
	auth: CommCareAuth,
	{ method, path, query, body, formData, replaySafe }: CommCareRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: COMMCARE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// CommCare API-key auth is a custom scheme (`ApiKey user:key`), not
		// Basic or Bearer, so the header is built here.
		HEADERS: {
			Accept: 'application/json',
			Authorization: `ApiKey ${auth.username}:${auth.apiKey}`,
		},
	};

	const mediaType = formData
		? 'multipart/form-data'
		: body === undefined
			? undefined
			: 'application/json';

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		formData,
		mediaType,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: COMMCARE_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		// Rethrow first: the generic catch below would otherwise re-wrap
		// this error and drop body and status.
		if (error instanceof CommCareAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw new CommCareAPIError(
				describeCommCareError(error.status, error.body, error.message),
				{ cause: error, replaySafe },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new CommCareAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				replaySafe,
			});
		}
		throw new CommCareAPIError(`Unknown CommCare error: ${String(error)}`, {
			replaySafe,
		});
	}
}
