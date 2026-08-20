import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class AblyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly statusCode?: number,
	) {
		super(message);
		this.name = 'AblyAPIError';
	}
}

const ABLY_API_BASE = 'https://rest.ably.io';

/**
 * Makes an authenticated request to the Ably REST API.
 *
 * Ably server-side API keys use HTTP Basic authentication. The complete
 * Ably API key is encoded as the Basic-auth credential.
 */
export async function makeAblyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ABLY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
		},
	};

	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			const apiError = error as {
				status?: number;
				body?: {
					error?: {
						message?: string;
						code?: number | string;
						statusCode?: number;
					};
				};
			};

			const ablyError = apiError.body?.error;

			throw new AblyAPIError(
				ablyError?.message ?? error.message,
				ablyError?.code === undefined ? undefined : String(ablyError.code),
				ablyError?.statusCode ?? apiError.status,
			);
		}

		throw new AblyAPIError('Unknown Ably API error');
	}
}
