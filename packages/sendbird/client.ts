import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export class SendbirdAPIError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly retryAfter?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'SendbirdAPIError';
	}
}

const appId = z
	.string()
	.regex(
		/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/,
		'Invalid Sendbird application ID',
	);
const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeSendbirdRequest(
	applicationId: string,
	apiKey: string,
	path: string,
	options: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		query?: Record<string, unknown>;
		body?: unknown;
	},
): Promise<unknown> {
	if (!apiKey?.trim()) throw new AuthMissingError('sendbird', 'api_key');
	const id = appId.parse(applicationId);
	const config: OpenAPIConfig = {
		BASE: `https://api-${id}.sendbird.com/v3`,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { 'Api-Token': apiKey },
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path,
		query: options.query,
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	try {
		const result = await request<unknown>(config, requestOptions, {
			rateLimitConfig,
		});
		// Empty non-JSON 200 responses are returned by the shared transport as ''.
		return options.method === 'DELETE' && result === '' ? undefined : result;
	} catch (error) {
		if (error instanceof ApiError)
			throw new SendbirdAPIError(
				error.message,
				error.status,
				error.retryAfter,
				error.body,
			);
		throw error;
	}
}
