import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DadataruAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number | string;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'DadataruAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const DADATARU_SUGGEST_BASE =
	'https://suggestions.dadata.ru/suggestions/api/4_1/rs';
const DADATARU_CLEAN_BASE = 'https://cleaner.dadata.ru/api/v1';
const DADATARU_PROFILE_BASE = 'https://dadata.ru/api/v2';

export async function makeDadataruRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		apiType?: 'suggest' | 'clean' | 'profile';
		secretKey?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		apiType = 'suggest',
		secretKey,
	} = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Token ${apiKey}`,
	};

	if (secretKey) {
		headers['X-Secret'] = secretKey;
	}

	const getBaseUrl = () => {
		if (apiType === 'clean') return DADATARU_CLEAN_BASE;
		if (apiType === 'profile') return DADATARU_PROFILE_BASE;
		return DADATARU_SUGGEST_BASE;
	};

	const config: OpenAPIConfig = {
		BASE: getBaseUrl(),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
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
		if (error instanceof DadataruAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const bodyDetail =
				error.body == null
					? ''
					: typeof error.body === 'string'
						? error.body
						: JSON.stringify(error.body);
			const message = bodyDetail
				? `${error.statusText || 'API Error'}: ${bodyDetail}`
				: error.statusText || 'Unknown API Error';
			throw new DadataruAPIError(message, { cause: error });
		}
		if (error instanceof Error) {
			throw new DadataruAPIError(error.message);
		}
		throw new DadataruAPIError('Unknown error');
	}
}
