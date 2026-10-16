import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const AKTA_API_BASE = 'https://api.akta.pro/api';

// News p99 is 17s (docs.akta.pro/getting-started/performance), near the 20s default.
const AKTA_TIMEOUT_MS = 60_000;

export type AktaQuery = Record<string, string | number | boolean | undefined>;

export class AktaAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly retryAfter?: number;
	// unknown: Akta error bodies are JSON objects on known errors and plain text from the edge.
	readonly body?: unknown;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'AktaAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.code = readString(cause.body, 'error');
			const bodyRetry = readNumber(cause.body, 'retry_after_seconds');
			this.retryAfter =
				cause.retryAfter ??
				(bodyRetry !== undefined ? bodyRetry * 1000 : undefined);
		}
	}
}

// unknown: error body shape is not guaranteed.
function readString(body: unknown, key: string): string | undefined {
	if (body && typeof body === 'object' && key in body) {
		const value = (body as Record<string, unknown>)[key];
		return typeof value === 'string' ? value : undefined;
	}
	return undefined;
}

// unknown: error body shape is not guaranteed.
function readNumber(body: unknown, key: string): number | undefined {
	if (body && typeof body === 'object' && key in body) {
		const value = (body as Record<string, unknown>)[key];
		return typeof value === 'number' ? value : undefined;
	}
	return undefined;
}

function describe(error: ApiError): string {
	const detail =
		readString(error.body, 'detail') ?? readString(error.body, 'error');
	return detail ? `${error.status} ${detail}` : error.message;
}

/**
 * Akta answers every route at its trailing-slash form and 307-redirects the
 * bare path, so callers pass paths like `v1/news/`.
 */
export async function makeAktaRequest<T>(
	path: string,
	apiKey: string,
	query: AktaQuery = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: AKTA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: AKTA_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AktaAPIError(describe(error), error);
		}
		if (error instanceof Error) {
			throw new AktaAPIError(error.message, error);
		}
		throw new AktaAPIError('Unknown Akta API error');
	}
}

export function csv(values: readonly string[] | undefined): string | undefined {
	return values && values.length > 0 ? values.join(',') : undefined;
}
