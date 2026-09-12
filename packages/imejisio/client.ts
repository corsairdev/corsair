import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Custom error class for failures originating from Imejis.io APIs.
 */
export class ImejisioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'ImejisioAPIError';
	}
}

/**
 * Base URL for the Imejis.io management REST API.
 */
export const IMEJISIO_API_BASE = 'https://api.imejis.io';

/**
 * Base URL for the Imejis.io image and PDF render service.
 */
export const IMEJISIO_RENDER_BASE = 'https://render.imejis.io/v1';

/**
 * Request timeout in milliseconds for Imejis HTTP requests.
 */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Safely invokes an asynchronous stored key getter, suppressing missing DEK errors.
 *
 * @param getter - Async callback returning the stored key string.
 * @returns The resolved key or undefined if not found or inaccessible.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined> | undefined,
): Promise<string | undefined> {
	try {
		const value = await getter?.();
		return value ?? undefined;
	} catch {
		return undefined;
	}
}

/**
 * Dispatches an HTTP request to the Imejis.io management API (/designs/v2).
 *
 * @template T - Expected JSON response shape.
 * @param endpoint - API path relative to the base URL.
 * @param apiKey - Bearer API key for authorization.
 * @param options - Request options including method, body, and query parameters.
 * @returns The parsed JSON response.
 */
export async function makeImejisioRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: IMEJISIO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ImejisioAPIError(error.message);
		}
		throw new ImejisioAPIError('Unknown error');
	}
}

/**
 * Options for rendering an Imejis design template via the render service.
 */
export type ImejisioRenderOptions = {
	format?: 'png' | 'jpeg' | 'webp' | 'pdf';
	quality?: number;
	delivery?: 'stream' | 'hosted' | 'signed';
	expiresIn?: number;
	overrides?: Record<string, unknown>;
};

/**
 * Dispatches a POST render request to the Imejis render service (https://render.imejis.io/v1/{design_id}).
 * Normalizes binary stream responses to base64 or returns hosted/signed JSON responses.
 *
 * @template T - Expected normalized response shape.
 * @param designId - The unique design render code.
 * @param renderKey - The DMA API key required by the render service.
 * @param options - Render options including format, quality, delivery, expiresIn, and overrides.
 * @returns The normalized response object ready for Zod validation.
 */
export async function makeImejisioRenderRequest<T>(
	designId: string,
	renderKey: string,
	options: ImejisioRenderOptions = {},
): Promise<T> {
	const format = options.format ?? 'jpeg';
	const delivery = options.delivery ?? 'stream';

	const url = new URL(
		`${IMEJISIO_RENDER_BASE}/${encodeURIComponent(designId)}`,
	);
	url.searchParams.set('format', format);
	url.searchParams.set('delivery', delivery);

	if (options.quality !== undefined) {
		url.searchParams.set('quality', String(options.quality));
	}
	if (options.expiresIn !== undefined) {
		url.searchParams.set('expiresIn', String(options.expiresIn));
	}

	const headers: Record<string, string> = {
		'dma-api-key': renderKey,
		'Content-Type': 'application/json',
	};

	const body = JSON.stringify(options.overrides ?? {});

	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method: 'POST',
			headers,
			body,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (err) {
		if (err instanceof Error) {
			throw new ImejisioAPIError(
				`Failed to connect to Imejis render service: ${err.message}`,
			);
		}
		throw new ImejisioAPIError('Failed to connect to Imejis render service');
	}

	if (!response.ok) {
		const rawText = await response.text();
		let message = `Imejis render request failed with status ${response.status}`;
		try {
			const parsed = JSON.parse(rawText);
			if (
				parsed &&
				typeof parsed === 'object' &&
				typeof parsed.message === 'string'
			) {
				message = parsed.message;
			}
		} catch {
			if (rawText.trim().length > 0) {
				message = rawText.trim();
			}
		}
		throw new ImejisioAPIError(message, undefined, response.status);
	}

	const contentTypeHeader = response.headers.get('content-type') || '';
	const isJson =
		delivery === 'hosted' ||
		delivery === 'signed' ||
		contentTypeHeader.toLowerCase().includes('application/json');

	if (isJson) {
		const json = (await response.json()) as Record<string, unknown>;
		return {
			...json,
			delivery,
		} as unknown as T;
	}

	const arrayBuffer = await response.arrayBuffer();
	const base64 = Buffer.from(arrayBuffer).toString('base64');
	const firstPart = contentTypeHeader.split(';')[0];
	const contentType =
		(firstPart ? firstPart.trim() : '') ||
		(format === 'pdf' ? 'application/pdf' : `image/${format}`);

	return {
		delivery: 'stream',
		format,
		contentType,
		base64,
	} as unknown as T;
}
