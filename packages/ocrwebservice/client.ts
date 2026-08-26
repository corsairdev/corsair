import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class OcrWebServiceAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;

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
		}
	}
}

export const OCRWEBSERVICE_API_BASE = 'https://www.ocrwebservice.com';

const OCRWEBSERVICE_TIMEOUT_MS = 60_000;

/**
 * Corsair stores the OCR Web Service credentials as one API-key value.
 *
 * Expected format:
 *
 *     username:licenseCode
 *
 * OCR Web Service itself uses HTTP Basic Authentication with the
 * username and license code.
 */
function parseCredentials(apiKey: string): {
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

/**
 * Creates a Basic authentication value.
 *
 * OCR Web Service expects:
 *
 *     Authorization: Basic base64(username:licenseCode)
 */
function createBasicAuthHeader(apiKey: string): string {
	const { username, licenseCode } = parseCredentials(apiKey);

	const credentials = `${username}:${licenseCode}`;

	const encoded =
		typeof globalThis.btoa === 'function'
			? globalThis.btoa(credentials)
			: Buffer.from(credentials, 'utf8').toString('base64');

	return `Basic ${encoded}`;
}

function buildConfig(apiKey: string): OpenAPIConfig {
	return {
		BASE: OCRWEBSERVICE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: OCRWEBSERVICE_TIMEOUT_MS,

		// Do NOT use TOKEN here.
		// OCR Web Service does not use Bearer authentication.
		TOKEN: undefined,

		HEADERS: {
			Accept: 'application/json',
			Authorization: createBasicAuthHeader(apiKey),
		},
	};
}

export async function makeOcrWebServicePostRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const config = buildConfig(apiKey);

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: endpoint,
		query: options.query,
		formData: options.formData,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new OcrWebServiceAPIError(error.message, {
				cause: error,
			});
		}

		throw new OcrWebServiceAPIError('Unknown OCR Web Service API error');
	}
}

export async function makeOcrWebServiceGetRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const config = buildConfig(apiKey);

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: options.query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new OcrWebServiceAPIError(error.message, {
				cause: error,
			});
		}

		throw new OcrWebServiceAPIError('Unknown OCR Web Service API error');
	}
}
