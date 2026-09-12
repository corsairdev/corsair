import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Base URL for the FinerWorks API. The host is versioned (`v2`) while the
 * routes themselves are versioned independently (`/v3/...`), which is why the
 * version segment is part of each endpoint path rather than of the base.
 * https://v2.api.finerworks.com/Documentation
 */
export const FINERWORKS_API_BASE = 'https://v2.api.finerworks.com';

/**
 * FinerWorks authenticates every request with a pair of keys sent as headers:
 * `web_api_key` identifies the account and `app_key` identifies the calling
 * application. Both are required — sending only one, or reusing a single value
 * for both, is rejected with `Missing or unauthorized api credentials`.
 * https://v2.api.finerworks.com/Help/Api/GET-v3-test_my_credentials
 */
export type FinerWorksCredentials = {
	webApiKey: string;
	appKey: string;
};

export class FinerWorksAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'FinerWorksAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

export type FinerWorksMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type FinerWorksRequestOptions = {
	method?: FinerWorksMethod;
	body?: unknown;
	query?: Record<string, unknown>;
};

/**
 * FinerWorks reports credential and validation failures as HTTP 400 with an
 * ASP.NET `ModelState` map rather than as 401, so the message that matters is
 * nested inside the body. Flatten it to a single line so `error-handlers.ts`
 * can classify it and so agents get an actionable message.
 */
function extractErrorMessage(error: ApiError): string {
	const body = error.body;
	if (!body || typeof body !== 'object') return error.message;

	const record = body as Record<string, unknown>;
	const parts: string[] = [];

	if (typeof record.Message === 'string') parts.push(record.Message);

	const modelState = record.ModelState;
	if (modelState && typeof modelState === 'object') {
		for (const value of Object.values(modelState as Record<string, unknown>)) {
			if (Array.isArray(value)) {
				parts.push(...value.filter((v): v is string => typeof v === 'string'));
			}
		}
	}

	// Some routes answer with the plain `{ "message": ... }` shape instead.
	if (parts.length === 0 && typeof record.message === 'string') {
		parts.push(record.message);
	}

	return parts.length > 0 ? parts.join(' — ') : error.message;
}

/**
 * Issues a request against the FinerWorks v3 API.
 *
 * Callers pass `unknown` for `T` and hand the result straight to the
 * endpoint's Zod output schema. That is deliberate: the API is not described
 * by a machine-readable spec, so asserting a compile-time shape here would be
 * an unchecked claim about the wire format. Parsing at the boundary instead
 * makes the response shape a runtime guarantee rather than an assumption.
 */
export async function makeFinerWorksRequest<T>(
	endpoint: string,
	credentials: FinerWorksCredentials,
	options: FinerWorksRequestOptions = {},
): Promise<T> {
	const { method = 'POST', body, query } = options;
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const config: OpenAPIConfig = {
		BASE: FINERWORKS_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			web_api_key: credentials.webApiKey,
			app_key: credentials.appKey,
		},
	};

	// FinerWorks accepts a JSON body on every verb it exposes, including the
	// DELETE and GET routes that take filters, so the body is not gated on the
	// method the way it is for most REST APIs.
	const requestOptions: ApiRequestOptions = {
		method,
		url: cleanEndpoint,
		body,
		query,
		mediaType: 'application/json',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new FinerWorksAPIError(extractErrorMessage(error), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new FinerWorksAPIError(error.message, { cause: error });
		}
		throw new FinerWorksAPIError('Unknown FinerWorks API error');
	}
}
