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

export type TwilioCredentials = {
	accountSid: string;
	authToken: string;
};

/**
 * Split a stored Twilio key into its Account SID and Auth Token parts.
 *
 * Keys are stored as `accountSid:authToken`, but the token itself may
 * contain colons. Only split on the first colon so the full token is
 * preserved. A key without a colon is treated as a plain token.
 */
export function parseTwilioCredentials(key: string): TwilioCredentials {
	const separator = key.indexOf(':');
	if (separator === -1) {
		return { accountSid: key, authToken: key };
	}
	return {
		accountSid: key.slice(0, separator),
		authToken: key.slice(separator + 1),
	};
}

/**
 * Send an authenticated request to the Twilio REST API.
 *
 * Auth uses HTTP Basic with `base64(accountSid:authToken)`.
 */
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
