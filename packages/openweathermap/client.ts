import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class OpenWeatherMapAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error; retryAfter?: number; body?: unknown },
	) {
		super(message, options);
		this.name = 'OpenWeatherMapAPIError';

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
	}
}

export const OPENWEATHERMAP_ONE_CALL_3_BASE =
	'https://api.openweathermap.org/data/3.0';
export const OPENWEATHERMAP_DATA_25_BASE =
	'https://api.openweathermap.org/data/2.5';
export const OPENWEATHERMAP_GEO_BASE = 'https://api.openweathermap.org/geo/1.0';
export const OPENWEATHERMAP_MAPS_2_BASE =
	'https://maps.openweathermap.org/maps/2.0';

export type OpenWeatherMapApi = 'oneCall3' | 'data25' | 'geo' | 'maps2';

export function baseUrlFor(api: OpenWeatherMapApi): string {
	switch (api) {
		case 'data25':
			return OPENWEATHERMAP_DATA_25_BASE;
		case 'geo':
			return OPENWEATHERMAP_GEO_BASE;
		case 'maps2':
			return OPENWEATHERMAP_MAPS_2_BASE;
		default:
			return OPENWEATHERMAP_ONE_CALL_3_BASE;
	}
}

export function compactBody(
	body: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
	if (!body) return undefined;
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export function compactQuery(
	query: Record<string, string | number | boolean | undefined> | undefined,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export type OpenWeatherMapRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	api?: OpenWeatherMapApi;
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
	responseType?: 'json' | 'binary' | 'empty';
	headers?: Record<string, string>;
};

const REQUEST_TIMEOUT_MS = 20_000;

function bufferToBase64(buffer: ArrayBuffer): string {
	return Buffer.from(buffer).toString('base64');
}

async function fetchBinaryResponse(
	url: string,
	options: {
		method: string;
		headers: Record<string, string>;
		body?: string;
	},
): Promise<{ contentType: string; buffer: ArrayBuffer }> {
	const response = await fetch(url, {
		method: options.method,
		headers: options.headers,
		body: options.body,
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	if (!response.ok) {
		const raw = await response.text();
		let body: unknown = raw;
		try {
			body = JSON.parse(raw);
		} catch {
			body = raw;
		}
		const retryAfterHeader = response.headers.get('Retry-After');
		const retryAfterSeconds = retryAfterHeader
			? Number(retryAfterHeader)
			: Number.NaN;
		throw new OpenWeatherMapAPIError(
			typeof body === 'object' && body !== null && 'message' in body
				? String((body as { message: unknown }).message)
				: `HTTP ${response.status}: ${response.statusText}`,
			response.status,
			{
				body,
				retryAfter: Number.isFinite(retryAfterSeconds)
					? retryAfterSeconds * 1000
					: undefined,
			},
		);
	}

	const contentTypeHeader = response.headers.get('Content-Type');
	const contentType =
		contentTypeHeader?.split(';')[0]?.trim().toLowerCase() ?? '';
	if (contentType !== 'image/png') {
		throw new OpenWeatherMapAPIError(
			`Expected image/png tile, received ${contentType || 'missing'}`,
			response.status,
		);
	}
	return { contentType, buffer: await response.arrayBuffer() };
}

/**
 * Performs a request to the OpenWeatherMap API.
 *
 * Auth: API key passed as the `appid` query parameter.
 */
export async function makeOpenWeatherMapRequest<T>(
	endpoint: string,
	apiKey: string,
	options: OpenWeatherMapRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		api = 'oneCall3',
		body,
		query = {},
		responseType = 'json',
		headers: extraHeaders,
	} = options;

	const queryWithAuth: Record<string, string | number | boolean | undefined> = {
		...query,
		appid: apiKey,
	};

	const config: OpenAPIConfig = {
		BASE: baseUrlFor(api),
		VERSION: api === 'oneCall3' ? '3.0' : '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			...extraHeaders,
		},
	};

	const urlPath = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	if (responseType === 'binary') {
		const baseUrl = config.BASE.endsWith('/')
			? config.BASE.slice(0, -1)
			: config.BASE;
		const compacted = compactQuery(queryWithAuth);
		const queryParts: string[] = [];
		if (compacted) {
			for (const [key, value] of Object.entries(compacted)) {
				queryParts.push(
					`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
				);
			}
		}
		const url =
			queryParts.length > 0
				? `${baseUrl}/${urlPath}?${queryParts.join('&')}`
				: `${baseUrl}/${urlPath}`;

		try {
			const serializedBody =
				method === 'POST' || method === 'PUT'
					? body === undefined
						? undefined
						: JSON.stringify(
								Array.isArray(body)
									? body
									: compactBody(body as Record<string, unknown>),
							)
					: undefined;
			const { contentType, buffer } = await fetchBinaryResponse(url, {
				method,
				headers: {
					Accept: 'image/png',
					'Content-Type': 'application/json',
					...extraHeaders,
				},
				body: serializedBody,
			});
			return {
				contentType,
				dataBase64: bufferToBase64(buffer),
			} as T;
		} catch (error) {
			if (error instanceof OpenWeatherMapAPIError) throw error;
			if (error instanceof Error) {
				throw new OpenWeatherMapAPIError(error.message, undefined, {
					cause: error,
				});
			}
			throw new OpenWeatherMapAPIError('Unknown error');
		}
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: urlPath,
		query: compactQuery(queryWithAuth),
		body:
			method === 'POST' || method === 'PUT'
				? Array.isArray(body)
					? body
					: compactBody(body as Record<string, unknown>)
				: undefined,
		mediaType: 'application/json',
	};

	try {
		const response = await request<T | undefined>(config, requestOptions);

		if (
			responseType === 'empty' ||
			(response === undefined && method !== 'GET')
		) {
			return { success: true } as T;
		}

		return response as T;
	} catch (error) {
		if (error instanceof ApiError) {
			if (responseType === 'empty' && error.status === 204) {
				return { success: true } as T;
			}
			throw new OpenWeatherMapAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new OpenWeatherMapAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new OpenWeatherMapAPIError('Unknown error');
	}
}
