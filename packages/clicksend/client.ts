import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ClickSendAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'ClickSendAPIError';
	}
}

const CLICKSEND_API_BASE = 'https://rest.clicksend.com/v3';

export type ClickSendEnvelope<T> = {
	http_code?: number;
	response_code?: string;
	response_msg?: string;
	data?: T;
};

export async function getClickSendCredentials(ctx: {
	options?: { username?: string; apiKey?: string };
	keys?: { get_username?: () => Promise<string | null | undefined> };
	key?: string;
}): Promise<{ username: string; apiKey: string }> {
	const keyStr = ctx.key ?? '';
	let username = ctx.options?.username?.trim();
	if (!username && ctx.keys?.get_username) {
		const fetched = await ctx.keys.get_username();
		if (fetched) {
			username = fetched.trim();
		}
	}
	if (!username && keyStr.includes(':')) {
		username = keyStr.split(':')[0]?.trim();
	}
	username = username ?? '';

	let apiKey = ctx.options?.apiKey?.trim();
	if (!apiKey) {
		apiKey = (keyStr.includes(':') ? keyStr.split(':')[1] : keyStr)?.trim();
	}
	return { username, apiKey: apiKey ?? '' };
}

export async function makeClickSendRequest<T>(
	endpoint: string,
	username: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	// Guard against missing credentials
	if (!username || !apiKey) {
		throw new ClickSendAPIError(
			'Missing ClickSend credentials: both username and apiKey are required.',
			'MISSING_CREDENTIALS',
			401,
		);
	}

	// Guard against HTTP Header Injection (CRLF injection)
	if (/[\r\n]/.test(username) || /[\r\n]/.test(apiKey)) {
		throw new ClickSendAPIError(
			'Invalid credentials: username and apiKey must not contain newline characters.',
			'INVALID_CREDENTIALS_FORMAT',
			400,
		);
	}

	const { method = 'GET', body, query } = options;

	const basicAuth = Buffer.from(`${username}:${apiKey}`).toString('base64');

	const config: OpenAPIConfig = {
		BASE: CLICKSEND_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: `Basic ${basicAuth}`,
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint.slice(1) : endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const res = await request<ClickSendEnvelope<T> | T>(config, requestOptions);
		if (res && typeof res === 'object') {
			const envelope = res as ClickSendEnvelope<T>;
			if (envelope.http_code !== undefined && envelope.http_code >= 400) {
				throw new ClickSendAPIError(
					envelope.response_msg || 'ClickSend API error',
					envelope.response_code,
					envelope.http_code,
				);
			}
			if (envelope.data !== undefined) {
				return envelope.data;
			}
		}
		return res as T;
	} catch (error) {
		if (error instanceof ApiError || error instanceof ClickSendAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ClickSendAPIError(error.message);
		}
		throw new ClickSendAPIError('Unknown error occurred');
	}
}
