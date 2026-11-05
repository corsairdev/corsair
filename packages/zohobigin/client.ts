import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class ZohoBiginAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ZohoBiginAPIError';
	}
}

const ZOHOBIGIN_API_BASE = 'https://www.zohoapis.com/bigin/v1';

export type ZohoBiginRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// unknown: request JSON varies by Bigin module/operation; Zod parses at callers.
	body?: unknown;
	// unknown: multipart field values are file-or-string and endpoint-specific.
	formData?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
	mediaType?: string;
	baseUrl?: string;
};

/**
 * Callers pass `unknown` for T: Bigin JSON varies by module and is narrowed by
 * each endpoint's Zod schema before return.
 */
export async function makeZohoBiginRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ZohoBiginRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		formData,
		query,
		headers,
		mediaType,
		baseUrl,
	} = options;

	const defaultHeaders: Record<string, string> = {
		Authorization: `Zoho-oauthtoken ${apiKey}`,
		...headers,
	};

	if (!formData && !defaultHeaders['Content-Type']) {
		defaultHeaders['Content-Type'] = 'application/json';
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? ZOHOBIGIN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: defaultHeaders,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		formData,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: formData
			? undefined
			: (mediaType ?? 'application/json; charset=utf-8'),
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new ZohoBiginAPIError('Unknown error');
	}
}
