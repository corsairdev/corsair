import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class WhatsAppAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'WhatsAppAPIError';
	}
}

const WHATSAPP_API_BASE = 'https://graph.facebook.com/v23.0';

export async function makeWhatsAppRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: WHATSAPP_API_BASE,
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
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (
			error &&
			typeof error === 'object' &&
			'body' in error &&
			error.body &&
			typeof error.body === 'object'
		) {
			const body = error.body as {
				error?: { message?: string; code?: string | number; type?: string };
			};
			if (body.error) {
				throw new WhatsAppAPIError(
					body.error.message ?? 'WhatsApp API request failed',
					body.error.code ? String(body.error.code) : body.error.type,
				);
			}
		}

		if (error instanceof Error) {
			throw new WhatsAppAPIError(error.message);
		}
		throw new WhatsAppAPIError('Unknown error');
	}
}
