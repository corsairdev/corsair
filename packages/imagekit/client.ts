import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const IMAGEKIT_API_BASE = 'https://api.imagekit.io';
// Upload is served from its own origin; api.imagekit.io answers 404 there.
export const IMAGEKIT_UPLOAD_BASE = 'https://upload.imagekit.io';

// An upload can carry several megabytes of base64 data, so corsair/http's 20
// second default is tight.
const IMAGEKIT_TIMEOUT_MS = 120_000;

// error-handlers.ts owns retries, so the transport makes one attempt. Core
// parses x-ratelimit-reset as an epoch timestamp, but ImageKit sends a
// duration in milliseconds there, so no header is read here.
const IMAGEKIT_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {},
};

/**
 * ImageKit error bodies come in two shapes:
 *
 * - `{ message, help? }` on most endpoints
 * - `{ reason, message }` on copy, move, rename and folder endpoints, where
 *   reason is a machine-readable slug like SOURCE_FILE_MISSING
 */
export class ImageKitAPIError extends Error {
	readonly status?: number;
	/** Machine-readable slug when ImageKit sent one, e.g. FILE_MISSING. */
	readonly code?: string;
	// unknown: error bodies are usually one of the two shapes above, but a
	// proxy can answer with HTML or text.
	readonly body?: unknown;
	/**
	 * Milliseconds from a Retry-After header. ImageKit documents no such
	 * header (its X-RateLimit-Reset is a duration in milliseconds, which
	 * core cannot parse), so this is set only when a cause carried one.
	 */
	readonly retryAfter?: number;
	/** True when retrying the failed request cannot repeat its effect. */
	readonly replaySafe?: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			replaySafe?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ImageKitAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.code = readString(asRecord(this.body), 'reason');
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
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

export function describeImageKitError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text = readString(record, 'message') ?? fallback;
	const reason = readString(record, 'reason');
	const help = readString(record, 'help');
	const label = [status, reason].filter((part) => part !== undefined).join(' ');
	const summary = label ? `ImageKit ${label}: ${text}` : text;
	return help ? `${summary} (${help})` : summary;
}

export type ImageKitQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type ImageKitRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: ImageKitQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Multipart fields for the upload endpoint; values are strings or arrays that core repeats. */
	formData?: Record<string, string | string[]>;
	/** Marks reads whose 5xx failure can be retried without repeating an effect. */
	replaySafe?: boolean;
	/** Sends the request to upload.imagekit.io instead of api.imagekit.io. */
	uploadOrigin?: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Auth is HTTP Basic with the private key as username and an empty password:
// `Basic base64(key + ':')`. corsair/http's USERNAME/PASSWORD config needs a
// non-empty password, so the header is built here instead.
function authHeader(apiKey: string): string {
	return `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
}

// A signed URL's ik-s signature opens a private file until it expires.
// metadata.getByUrl sends one in the query and cache.purge in the body, and
// core's ApiError keeps both on url and request, where error logs would pick
// them up. Matches the plain, encoded and double-encoded `=`; the value may
// itself be percent-encoded, and ends at a plain, encoded or double-encoded
// `&` or `#`.
const SIGNATURE =
	/(ik-s(?:=|%3D|%253D))(?:[^&#%\s"']|%(?!2[36]|252[36])[0-9a-f]{2})+/gi;

// An upload's `file` field is the file itself (base64 or binary text) or a
// URL to fetch it from; neither belongs in an error.
function withoutFileContents(
	formData: Record<string, string | string[]> | undefined,
): Record<string, string | string[]> | undefined {
	if (!formData || formData.file === undefined) return formData;
	return { ...formData, file: '[omitted]' };
}

// unknown: request query, body and form values are any JSON-like shape.
function redactSignatures(value: unknown): unknown {
	if (typeof value === 'string') {
		return value.replace(SIGNATURE, '$1[REDACTED]');
	}
	if (Array.isArray(value)) {
		return value.map(redactSignatures);
	}
	// Plain objects only: a Blob or FormData passes through untouched.
	if (
		value !== null &&
		typeof value === 'object' &&
		Object.getPrototypeOf(value) === Object.prototype
	) {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [key, redactSignatures(item)]),
		);
	}
	return value;
}

function withoutSignatures(error: ApiError): ApiError {
	const { request } = error;
	return Object.assign(error, {
		url: redactSignatures(error.url) as string,
		request: {
			...request,
			url: redactSignatures(request.url) as string,
			query: redactSignatures(request.query) as typeof request.query,
			body: redactSignatures(request.body),
			formData: redactSignatures(
				withoutFileContents(request.formData),
			) as typeof request.formData,
		},
	});
}

// unknown: callers parse the body with the endpoint's zod output schema. It
// is undefined for the bodyless answers: 204 on delete file and folder delete.
export async function makeImageKitRequest(
	apiKey: string,
	{
		path,
		query,
		body,
		formData,
		method,
		replaySafe,
		uploadOrigin,
	}: ImageKitRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: uploadOrigin ? IMAGEKIT_UPLOAD_BASE : IMAGEKIT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: IMAGEKIT_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			Authorization: authHeader(apiKey),
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
			rateLimitConfig: IMAGEKIT_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		// Rethrow first: the generic catch below would otherwise re-wrap this
		// error and drop body and status.
		if (error instanceof ImageKitAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw new ImageKitAPIError(
				describeImageKitError(error.status, error.body, error.message),
				{ cause: withoutSignatures(error), replaySafe },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ImageKitAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				replaySafe,
			});
		}
		// A non-Error rejection (a string or plain object from a polyfill)
		// still deserves its value in the message.
		throw new ImageKitAPIError(`Unknown ImageKit error: ${String(error)}`, {
			replaySafe,
		});
	}
}
