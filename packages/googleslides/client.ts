import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';
import type { BatchUpdateResponse, Presentation, ProviderJson } from './types';

export const SLIDES_API_BASE = 'https://slides.googleapis.com/v1';
export const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

/**
 * Retrying belongs to error-handlers.ts, so the transport must not retry too.
 * Left at its default, corsair/http retries a 429 three times under the
 * handler's four, which measured as 20 requests for one call: the transport's
 * own one second delay also replaced the documented fallback.
 *
 * The object is complete on purpose. request.ts uses
 * `requestOptions?.rateLimitConfig || DEFAULT_RATE_LIMIT_CONFIG`, so this
 * replaces the defaults wholesale: an object without `headerNames` throws a
 * TypeError on the first 429, and one without `enabled` skips the block and
 * never reads Retry-After.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type GoogleSlidesRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: ProviderJson;
	/**
	 * Query parameters. Dotted names (`thumbnailProperties.mimeType`) are passed
	 * as literal keys: corsair/http renders a nested object as `key[sub]`, which
	 * Google ignores, so a nested query object would be silently dropped.
	 */
	query?: Record<string, string | number | boolean | undefined>;
	/** Milliseconds before the request aborts. Exports and thumbnails run long. */
	timeout?: number;
};

async function googleApiRequest<T>(
	base: string,
	endpoint: string,
	credentials: string,
	options: GoogleSlidesRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, timeout } = options;

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: credentials,
		HEADERS: {
			'Content-Type': 'application/json',
		},
		...(timeout === undefined ? {} : { TIMEOUT: timeout }),
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: RATE_LIMIT_CONFIG,
	});
}

function isUnauthorizedError(error: Error): boolean {
	return 'status' in error && (error as { status?: number }).status === 401;
}

type AuthContext = { key: string; _refreshAuth?: () => Promise<string> };

/**
 * One-shot 401 retry. Google access tokens live for an hour, and a batch job
 * that starts before expiry can hit 401 mid-run; the keyBuilder attaches
 * `_refreshAuth` so the retry can mint a fresh token instead of failing.
 */
async function withAuthRetry<T>(
	ctx: AuthContext,
	call: (token: string) => Promise<T>,
): Promise<T> {
	try {
		return await call(ctx.key);
	} catch (error) {
		if (
			error instanceof Error &&
			isUnauthorizedError(error) &&
			ctx._refreshAuth
		) {
			const freshToken = await ctx._refreshAuth();
			return await call(freshToken);
		}
		throw error;
	}
}

export async function makeSlidesRequest<T>(
	endpoint: string,
	ctx: AuthContext,
	options: GoogleSlidesRequestOptions = {},
): Promise<T> {
	return withAuthRetry(ctx, (token) =>
		googleApiRequest<T>(SLIDES_API_BASE, endpoint, token, options),
	);
}

export async function makeDriveRequest<T>(
	endpoint: string,
	ctx: AuthContext,
	options: GoogleSlidesRequestOptions = {},
): Promise<T> {
	return withAuthRetry(ctx, (token) =>
		googleApiRequest<T>(DRIVE_API_BASE, endpoint, token, options),
	);
}

/** Applies one atomic batch. Every request is validated before any is applied. */
export async function runBatchUpdate(
	ctx: AuthContext,
	presentationId: string,
	requests: ProviderJson[],
	writeControl?: ProviderJson,
): Promise<BatchUpdateResponse> {
	return makeSlidesRequest<BatchUpdateResponse>(
		`/presentations/${encodeURIComponent(presentationId)}:batchUpdate`,
		ctx,
		{
			method: 'POST',
			body: writeControl ? { requests, writeControl } : { requests },
		},
	);
}

/**
 * Bytes come back from Drive as raw content, so they cannot go through the
 * JSON helper. Normalise both the fetch and the body read through one error
 * type: a dropped connection would otherwise escape as a raw error that
 * SERVER_ERROR never matches.
 */
export async function fetchDriveBytes(
	ctx: AuthContext,
	path: string,
	options: { accept: string; timeout?: number },
): Promise<{ buffer: Buffer; contentType: string }> {
	const doFetch = async (token: string) => {
		const response = await fetch(`${DRIVE_API_BASE}${path}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: options.accept,
			},
			signal: AbortSignal.timeout(options.timeout ?? 120_000),
		});
		return response;
	};

	let response: Response;
	try {
		response = await doFetch(ctx.key);
		if (response.status === 401 && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			response = await doFetch(freshToken);
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new GoogleSlidesExportError(`Drive request failed: ${message}`);
	}

	if (!response.ok) {
		const body = await response.text().catch(() => '');
		throw new GoogleSlidesExportError(
			`Drive export failed with ${response.status}: ${body}`,
			response.status,
		);
	}

	let buffer: Buffer;
	try {
		buffer = Buffer.from(await response.arrayBuffer());
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new GoogleSlidesExportError(`Drive body read failed: ${message}`);
	}

	return {
		buffer,
		contentType: response.headers.get('content-type') ?? options.accept,
	};
}

export class GoogleSlidesExportError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'GoogleSlidesExportError';
	}
}

/** Presentation URLs are derived; the API only returns the id. */
export function presentationUrl(presentationId: string): string {
	return `https://docs.google.com/presentation/d/${presentationId}/edit`;
}

export type { Presentation };
