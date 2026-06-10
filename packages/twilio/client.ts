import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TwilioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'TwilioAPIError';
	}
}

const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';

export async function makeTwilioRequest<T>(
	endpoint: string,
	accountSid: string,
	authToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString(
		'base64',
	);

	const config: OpenAPIConfig = {
		BASE: TWILIO_API_BASE,
		VERSION: '2010-04-01',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: `Basic ${basicAuth}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/x-www-form-urlencoded',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new TwilioAPIError(error.message);
		}
		throw new TwilioAPIError('Unknown error');
	}
}
