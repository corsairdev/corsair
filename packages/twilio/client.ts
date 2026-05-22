import type { ApiRequestOptions } from 'corsair/http';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class TwilioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'TwilioAPIError';
	}
}

const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';

function encodeFormBody(body: Record<string, unknown>): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			for (const item of value) {
				if (item === undefined || item === null) continue;
				params.append(key, String(item));
			}
			continue;
		}
		params.set(key, String(value));
	}
	return params.toString();
}

export async function makeTwilioRequest<T>(
	endpoint: string,
	accountSid: string,
	authToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const encodedBody =
		body && (method === 'POST' || method === 'PUT' || method === 'PATCH')
			? encodeFormBody(body)
			: undefined;

	const config: OpenAPIConfig = {
		BASE: TWILIO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		USERNAME: accountSid,
		PASSWORD: authToken,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: encodedBody,
		mediaType: 'application/x-www-form-urlencoded',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new TwilioAPIError(error.message);
		}
		throw new TwilioAPIError('Unknown error');
	}
}
