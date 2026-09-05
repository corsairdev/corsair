import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Official host and version from the Certifier quickstart.
 * https://developers.certifier.io/docs/api-reference/quickstart
 */
export const CERTIFIER_API_BASE = 'https://api.certifier.io/v1';
export const CERTIFIER_VERSION = '2022-10-26';

export class CertifierAPIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;

	constructor(
		message: string,
		options: { status?: number; retryAfter?: number } = {},
	) {
		super(message);
		this.name = 'CertifierAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
	}
}

export async function makeCertifierRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const token = apiKey.trim();
	if (!token) {
		throw new AuthMissingError('certifier', 'api_key');
	}

	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CERTIFIER_API_BASE,
		VERSION: CERTIFIER_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {
			'Content-Type': 'application/json',
			'Certifier-Version': CERTIFIER_VERSION,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof CertifierAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new CertifierAPIError(error.message);
		}
		throw new CertifierAPIError('Unknown error');
	}
}
