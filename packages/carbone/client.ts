import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CarboneAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// unknown: Carbone error JSON is not a stable schema across versions.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			// unknown: provider error/response JSON has no single stable schema
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(message, options);
		this.name = 'CarboneAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			return;
		}

		this.status = options?.status;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
	}
}

export const CARBONE_API_BASE = 'https://api.carbone.io';
export const CARBONE_API_VERSION = '5';

export type CarboneRequestOptions = {
	apiKey?: string;
	version?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// unknown: template/render payloads differ by operation; validated upstream.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
	responseType?: 'json' | 'binary';
};

function parseRetryAfterHeader(value: string | null): number | undefined {
	if (!value) return undefined;

	const seconds = Number(value);
	if (Number.isFinite(seconds)) {
		return Math.max(0, Math.round(seconds * 1000));
	}

	const retryAt = Date.parse(value);
	if (Number.isNaN(retryAt)) {
		return undefined;
	}

	return Math.max(0, retryAt - Date.now());
}

function buildConfig(
	apiKey?: string,
	version = CARBONE_API_VERSION,
	customHeaders: Record<string, string> = {},
): OpenAPIConfig {
	return {
		BASE: CARBONE_API_BASE,
		VERSION: `${version}.0.0`,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'carbone-version': version,
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
			...customHeaders,
		},
	};
}

// unknown: request() throws ApiError or a generic Error; both are rewrapped.
async function handleRequestError(error: unknown): Promise<never> {
	if (error instanceof ApiError) {
		throw new CarboneAPIError(error.message, error.status, {
			cause: error,
		});
	}
	if (error instanceof Error) {
		throw new CarboneAPIError(error.message, undefined, { cause: error });
	}
	throw new CarboneAPIError('Unknown Carbone API error');
}

export async function makeCarboneRequest<T>(
	endpoint: string,
	options: CarboneRequestOptions = {},
): Promise<T> {
	const {
		apiKey,
		version = CARBONE_API_VERSION,
		method = 'GET',
		body,
		query = {},
		headers = {},
		responseType = 'json',
	} = options;
	const isWrite =
		method === 'POST' ||
		method === 'PUT' ||
		method === 'PATCH' ||
		method === 'DELETE';

	const config = buildConfig(apiKey, version, {
		...(isWrite && body ? { 'Content-Type': 'application/json' } : {}),
		...headers,
	});

	if (responseType === 'binary') {
		const requestHeaders: Record<string, string> = {
			'carbone-version': version,
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
			...headers,
		};

		const url = new URL(endpoint, `${CARBONE_API_BASE}/`);
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) {
				url.searchParams.set(key, String(value));
			}
		}

		const response = await fetch(url.toString(), {
			method,
			headers: requestHeaders,
			body: isWrite && body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			throw new CarboneAPIError(
				response.statusText || response.status.toString(),
				response.status,
				{
					status: response.status,
					statusText: response.statusText,
					retryAfter: parseRetryAfterHeader(
						response.headers.get('retry-after'),
					),
				},
			);
		}

		return Buffer.from(await response.arrayBuffer()) as T;
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite && body ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		return handleRequestError(error);
	}
}

export function assertCarboneSuccess<T>(response: T): T {
	if (
		typeof response === 'object' &&
		response !== null &&
		'success' in response
	) {
		const res = response as {
			success?: boolean;
			// unknown: catch/error boundary accepts any thrown value
			error?: unknown;
			message?: string;
		};
		if (res.success === false) {
			const message =
				typeof res.error === 'string'
					? res.error
					: typeof res.message === 'string'
						? res.message
						: 'Carbone API request returned failure';
			throw new CarboneAPIError(message);
		}
	}
	return response;
}
