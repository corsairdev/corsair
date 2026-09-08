import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class OcrWebServiceAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			body?: unknown;
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);

		this.name = 'OcrWebServiceAPIError';
		this.body = options?.body;

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const OCRWEBSERVICE_API_BASE = 'https://www.ocrwebservice.com';

const OCRWEBSERVICE_TIMEOUT_MS = 60_000;

/**
 * Corsair stores OCR Web Service credentials as one API-key value:
 * `username:licenseCode`.
 */
export function parseCredentials(apiKey: string): {
	username: string;
	licenseCode: string;
} {
	const separator = apiKey.indexOf(':');

	if (separator <= 0 || separator === apiKey.length - 1) {
		throw new OcrWebServiceAPIError(
			'OCR Web Service credentials must use the format username:licenseCode',
		);
	}

	return {
		username: apiKey.slice(0, separator),
		licenseCode: apiKey.slice(separator + 1),
	};
}

function buildConfig(
	apiKey: string,
	useBasicAuth: boolean,
	accept: string,
): OpenAPIConfig {
	const { username, licenseCode } = parseCredentials(apiKey);

	return {
		BASE: OCRWEBSERVICE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: OCRWEBSERVICE_TIMEOUT_MS,
		TOKEN: undefined,
		USERNAME: useBasicAuth ? username : undefined,
		PASSWORD: useBasicAuth ? licenseCode : undefined,
		HEADERS: {
			Accept: accept,
		},
	};
}

function normalizeBody(
	body: unknown,
	mediaType?: string,
): { body?: unknown; mediaType?: string } {
	if (body instanceof Blob) {
		return {
			body,
			mediaType: mediaType ?? (body.type || 'application/octet-stream'),
		};
	}

	return { body, mediaType };
}

export async function makeOcrWebServiceRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, string | number | boolean | undefined>;
		body?: unknown;
		mediaType?: string;
		basicAuth?: boolean;
		accept?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		query,
		basicAuth = true,
		accept = 'application/json',
	} = options;
	const { body, mediaType } = normalizeBody(options.body, options.mediaType);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body,
		mediaType,
	};

	try {
		return await request<T>(
			buildConfig(apiKey, basicAuth, accept),
			requestOptions,
		);
	} catch (error) {
		if (error instanceof Error) {
			throw new OcrWebServiceAPIError(error.message, { cause: error });
		}

		throw new OcrWebServiceAPIError('Unknown OCR Web Service API error');
	}
}

export async function makeOcrWebServicePostRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
		body?: unknown;
		mediaType?: string;
	} = {},
): Promise<T> {
	return makeOcrWebServiceRequest<T>(endpoint, apiKey, {
		method: 'POST',
		...options,
	});
}

export async function makeOcrWebServiceGetRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
		basicAuth?: boolean;
	} = {},
): Promise<T> {
	return makeOcrWebServiceRequest<T>(endpoint, apiKey, {
		method: 'GET',
		...options,
	});
}
