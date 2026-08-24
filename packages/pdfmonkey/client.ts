import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class Api2PdfAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// API error bodies vary by endpoint; unknown forces callers to narrow before use.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'Api2PdfAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const API2PDF_API_BASE = 'https://api.pdfmonkey.io';

export type PdfMonkeyRequestOptions = {
	apiKey?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Endpoint payloads differ per operation; Record keeps the client generic.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function buildConfig(apiKey?: string, isWrite = false): OpenAPIConfig {
	return {
		BASE: API2PDF_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
			...(isWrite ? { 'Content-Type': 'application/json' } : {}),
		},
	};
}

// Catch values are untyped at runtime; unknown forces narrowing to ApiError/Error
// before rethrowing as Api2PdfAPIError.
async function handleRequestError(error: unknown): Promise<never> {
	if (error instanceof Api2PdfAPIError) {
		throw error;
	}
	if (error instanceof ApiError) {
		throw new Api2PdfAPIError(error.message, error.status, {
			cause: error,
		});
	}
	if (error instanceof Error) {
		throw new Api2PdfAPIError(error.message, undefined, { cause: error });
	}
	throw new Api2PdfAPIError('Unknown error');
}

/**
 * Performs a request to the PDFMonkey REST API.
 *
 * Auth: API key via the `Authorization` header using `Bearer <secret_key>`.
 * The `/status` health check does not require authentication.
 */
export async function makePdfMonkeyRequest<T>(
	endpoint: string,
	options: PdfMonkeyRequestOptions = {},
): Promise<T> {
	const { apiKey, method = 'GET', body, query = {} } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config = buildConfig(apiKey, isWrite);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		return handleRequestError(error);
	}
}

/** Plain-text health check (returns e.g. "OK"). */
export async function makePdfMonkeyTextRequest(
	endpoint: string,
	options: Pick<PdfMonkeyRequestOptions, 'apiKey' | 'method' | 'query'> = {},
): Promise<string> {
	const { apiKey, method = 'GET', query = {} } = options;
	const config = buildConfig(apiKey);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
	};

	try {
		const response = await request<string>(config, requestOptions);
		return typeof response === 'string' ? response : String(response);
	} catch (error) {
		return handleRequestError(error);
	}
}

export function assertApi2PdfSuccess<
	// Error field shape varies by endpoint (string | object | null); unknown forces
	// callers to narrow before reading it.
	T extends { Success?: boolean; Error?: unknown },
>(response: T): T {
	if (response.Success === false) {
		const message =
			typeof response.Error === 'string'
				? response.Error
				: 'API2PDF request failed';
		throw new Api2PdfAPIError(message);
	}
	return response;
}

// Endpoint payloads differ per operation; Record keeps the client generic across
// chrome/pdfsharp/libreoffice field sets without a union of every wire shape.
export function buildPostPayload(
	fields: Record<string, unknown>,
	options?: {
		inline?: boolean;
		fileName?: string;
		// Headless Chrome options bag is open-ended upstream.
		chromeOptions?: Record<string, unknown>;
	},
): Record<string, unknown> {
	const payload: Record<string, unknown> = {
		inline: options?.inline ?? true,
		...fields,
	};

	if (options?.fileName) {
		payload.fileName = options.fileName;
	}

	if (options?.chromeOptions) {
		payload.options = options.chromeOptions;
	}

	return payload;
}
