import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';
import type { z } from 'zod';

export class PdfcoAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'PdfcoAPIError';
	}
}

/**
 * Official PDF.co API host. All endpoint paths below include the `/v1` prefix.
 *
 * @see https://developer.pdf.co/api
 */
export const PDFCO_API_BASE = 'https://api.pdf.co';

export const PDFCO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

// Recursive JSON-compatible value used for POST bodies. Every PDF.co
// parameter (strings, numbers, booleans, string arrays, annotation/image
// objects, profiles maps) is representable without `unknown` or `any`.
export type PdfcoBodyValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| PdfcoBodyValue[]
	| { [key: string]: PdfcoBodyValue };

export type PdfcoBody = { [key: string]: PdfcoBodyValue };

export type PdfcoQueryValue = string | number | boolean | undefined;

// Every PDF.co JSON response carries this envelope. Constraining the generic
// to it lets the client surface API-level failures (`error: true`) as
// thrown errors instead of silently returning them as data.
export type PdfcoEnvelope = {
	error?: boolean;
	message?: string;
};

export type PdfcoRequestOptions<T extends PdfcoEnvelope> = {
	schema: z.ZodType<T>;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: PdfcoBody;
	query?: Record<string, PdfcoQueryValue>;
};

function buildConfig(apiKey: string): OpenAPIConfig {
	return {
		BASE: PDFCO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		},
	};
}

export async function makePdfcoRequest<T extends PdfcoEnvelope>(
	endpoint: string,
	apiKey: string,
	options: PdfcoRequestOptions<T>,
): Promise<T> {
	const { schema, method = 'POST', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	// JUSTIFY unknown: raw JSON from the HTTP layer; it is never used
	// directly and is validated by the endpoint's zod output schema below.
	const raw = await request<unknown>(buildConfig(apiKey), requestOptions, {
		rateLimitConfig: PDFCO_RATE_LIMIT_CONFIG,
	});
	const parsed = schema.parse(raw);
	if (parsed.error === true) {
		throw new PdfcoAPIError(parsed.message ?? 'PDF.co request failed');
	}
	return parsed;
}
