import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class BoxAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BoxAPIError';
	}
}

const BOX_API_BASE = 'https://api.box.com/2.0';
const BOX_UPLOAD_BASE = 'https://upload.box.com/api/2.0';

const BOX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeBoxRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown: Box API request bodies vary in shape per endpoint; callers provide their own typed objects
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;

	const config: OpenAPIConfig = {
		BASE: BOX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		headers,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: BOX_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new BoxAPIError(error.message);
		}
		throw new BoxAPIError('Unknown error');
	}
}

export async function makeBoxUploadRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		// unknown: upload attributes vary per file type and are serialised to JSON; callers provide their own typed object
		attributes: Record<string, unknown>;
		content: string | Uint8Array;
		fileName: string;
	},
): Promise<T> {
	const { attributes, content, fileName } = options;

	const blob =
		typeof content === 'string'
			? new Blob([content], { type: 'application/octet-stream' })
			: new Blob([new Uint8Array(content)]);

	const formData = new FormData();
	formData.append('attributes', JSON.stringify(attributes));
	formData.append('file', blob, fileName);

	const response = await fetch(`${BOX_UPLOAD_BASE}/${endpoint}`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${accessToken}` },
		body: formData,
	});

	if (!response.ok) {
		const text = await response.text();
		throw new BoxAPIError(
			`Generic Error: status: ${response.status}; status text: ${response.statusText}; body: "${text}"`,
		);
	}

	// any: fetch().json() returns Promise<any>; T is asserted by the caller at the call site
	return response.json() as Promise<T>;
}
