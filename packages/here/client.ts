import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HereAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'HereAPIError';
	}
}

export const HERE_HOSTS = {
	geocode: 'https://geocode.search.hereapi.com',
	revgeocode: 'https://revgeocode.search.hereapi.com',
	autosuggest: 'https://autosuggest.search.hereapi.com',
	autocomplete: 'https://autocomplete.search.hereapi.com',
	browse: 'https://browse.search.hereapi.com',
	discover: 'https://discover.search.hereapi.com',
	lookup: 'https://lookup.search.hereapi.com',
	router: 'https://router.hereapi.com',
	isoline: 'https://isoline.router.hereapi.com',
	matrix: 'https://matrix.router.hereapi.com',
	weather: 'https://weather.hereapi.com',
	traffic: 'https://data.traffic.hereapi.com',
	transit: 'https://transit.hereapi.com',
	wps: 'https://wps.hereapi.com',
	image: 'https://image.maps.hereapi.com',
} as const;

export type HereHost = (typeof HERE_HOSTS)[keyof typeof HERE_HOSTS];

function retryAfterMs(error: ApiError): number | undefined {
	return error.retryAfter;
}

function wrapError(error: unknown): never {
	if (error instanceof HereAPIError) throw error;
	if (error instanceof ApiError) {
		throw new HereAPIError(
			error.message,
			error.status,
			undefined,
			retryAfterMs(error),
		);
	}
	throw new HereAPIError(
		error instanceof Error ? error.message : 'Unknown HERE API error',
	);
}

export async function makeHereRequest<T>(
	baseUrl: HereHost,
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, unknown>;
		body?: unknown;
	} = {},
): Promise<T> {
	const { method = 'GET', query, body } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: { ...query, apiKey },
		body: method === 'POST' ? body : undefined,
		mediaType:
			method === 'POST' ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		wrapError(error);
	}
}

export async function makeHereImageRequest(
	endpoint: string,
	apiKey: string,
	query: Record<string, string | number | undefined> = {},
): Promise<{ contentType: string; imageBase64: string }> {
	const url = new URL(endpoint, HERE_HOSTS.image);
	url.searchParams.set('apiKey', apiKey);
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}

	const response = await fetch(url);
	if (response.status === 429) {
		const raw = response.headers.get('retry-after');
		const seconds = raw ? Number(raw) : NaN;
		await response.body?.cancel();
		throw new HereAPIError(
			'HERE API rate limit exceeded',
			429,
			undefined,
			Number.isFinite(seconds) ? seconds * 1000 : undefined,
		);
	}

	if (!response.ok) {
		const text = await response.text();
		throw new HereAPIError(
			text || `HERE map image request failed (${response.status})`,
			response.status,
		);
	}

	const contentType = response.headers.get('content-type') ?? 'image/png';
	const imageBase64 = Buffer.from(await response.arrayBuffer()).toString(
		'base64',
	);
	return { contentType, imageBase64 };
}
