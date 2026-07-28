import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { DigitalOceanMethod } from './endpoints/routes';

export class DigitalOceanAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'DigitalOceanAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

const DIGITALOCEAN_API_BASE = 'https://api.digitalocean.com/v2';

export type DigitalOceanRequestOptions = {
	method?: DigitalOceanMethod;
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
};

export async function makeDigitalOceanRequest<T>(
	endpoint: string,
	apiKey: string,
	options: DigitalOceanRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	const config: OpenAPIConfig = {
		BASE: DIGITALOCEAN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...headers,
		},
	};

	const hasBody =
		body !== undefined && !['GET', 'HEAD', 'OPTIONS'].includes(method);
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DigitalOceanAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new DigitalOceanAPIError(error.message, { cause: error });
		}
		throw new DigitalOceanAPIError('Unknown error');
	}
}
