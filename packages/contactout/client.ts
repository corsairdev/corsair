import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const CONTACTOUT_API_BASE = 'https://api.contactout.com';

// Work-email lookups verify addresses in real time and can take tens of seconds.
const CONTACTOUT_TIMEOUT_MS = 60_000;

export type ContactOutQuery = Record<
	string,
	string | number | boolean | undefined
>;

export class ContactOutAPIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;
	// unknown: error bodies are { status_code, message } but proxies can answer with text.
	readonly body?: unknown;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'ContactOutAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
		}
	}
}

// unknown: error body shape is not guaranteed.
function readMessage(body: unknown): string | undefined {
	if (body && typeof body === 'object' && 'message' in body) {
		const { message } = body as { message: unknown };
		return typeof message === 'string' ? message : undefined;
	}
	return undefined;
}

export async function makeContactOutRequest<T>(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		query?: ContactOutQuery;
		body?: object;
	} = {},
): Promise<T> {
	const { method = 'GET', query, body } = options;

	const config: OpenAPIConfig = {
		BASE: CONTACTOUT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: CONTACTOUT_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			token: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const message = readMessage(error.body);
			throw new ContactOutAPIError(
				message ? `${error.status} ${message}` : error.message,
				error,
			);
		}
		if (error instanceof Error) {
			throw new ContactOutAPIError(error.message, error);
		}
		throw new ContactOutAPIError('Unknown ContactOut API error');
	}
}
