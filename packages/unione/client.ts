import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class UnioneAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;
	public readonly unioneCode?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error; retryAfter?: number; body?: unknown },
	) {
		super(message, options);
		this.name = 'UnioneAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		} else if (code !== undefined) {
			this.status = code;
			this.retryAfter = options?.retryAfter;
			this.body = options?.body;
		}

		if (
			options?.body !== null &&
			typeof options?.body === 'object' &&
			'code' in options.body &&
			typeof (options.body as { code: unknown }).code === 'number'
		) {
			this.unioneCode = (options.body as { code: number }).code;
		}
	}
}

export const UNIONE_API_BASE = 'https://api.unione.io/en/transactional/api/v1';

/**
 * Redacts an email address for event logs (`logEventFromContext` persists its
 * payload to `corsair_events`) - keeps the first character and the domain so a
 * suppression or send stays traceable, without storing the full address.
 */
export function redactEmail(email: string): string {
	const atIndex = email.indexOf('@');
	if (atIndex <= 0) return '***';
	return `${email[0]}***${email.slice(atIndex)}`;
}

export function compactBody(
	body: Record<string, unknown> | undefined,
): Record<string, unknown> {
	if (!body) return {};
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

export type UnioneRequestOptions = {
	body?: Record<string, unknown>;
};

/**
 * Performs a request to the UniOne transactional Web API.
 *
 * All methods are HTTPS POST JSON. UniOne authenticates with the `X-API-KEY`
 * header and documents no bearer scheme, so the key is sent once, in that
 * header only - `TOKEN` is deliberately unset to keep the credential off the
 * `Authorization` header, where UniOne would ignore it anyway.
 */
export async function makeUnioneRequest<T>(
	endpoint: string,
	apiKey: string,
	options: UnioneRequestOptions = {},
): Promise<T> {
	const urlPath = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const config: OpenAPIConfig = {
		BASE: UNIONE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-API-KEY': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: urlPath,
		body: compactBody(options.body),
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const body = error.body;
			const message =
				typeof body === 'object' &&
				body !== null &&
				'message' in body &&
				typeof (body as { message: unknown }).message === 'string'
					? (body as { message: string }).message
					: error.message;
			throw new UnioneAPIError(message, error.status, {
				cause: error,
				body,
			});
		}
		if (error instanceof Error) {
			throw new UnioneAPIError(error.message, undefined, { cause: error });
		}
		throw new UnioneAPIError('Unknown error');
	}
}

export async function mapPool<T, R>(
	items: T[],
	concurrency: number,
	fn: (item: T) => Promise<R>,
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let next = 0;

	async function worker(): Promise<void> {
		while (next < items.length) {
			const index = next;
			next += 1;
			results[index] = await fn(items[index] as T);
		}
	}

	const workers = Math.min(Math.max(concurrency, 1), items.length);
	if (workers === 0) return [];
	await Promise.all(Array.from({ length: workers }, () => worker()));
	return results;
}
