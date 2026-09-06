import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class CannyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'CannyAPIError';
	}
}

const CANNY_API_BASE = 'https://canny.io/api/v1';

export async function makeCannyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'POST';
		body?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { body = {} } = options;

	const config: OpenAPIConfig = {
		BASE: CANNY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const formattedEndpoint = endpoint.startsWith('/')
		? endpoint
		: `/${endpoint}`;

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: formattedEndpoint,
		body: {
			apiKey,
			...body,
		},
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new CannyAPIError(error.message);
		}
		throw new CannyAPIError('Unknown error');
	}
}
