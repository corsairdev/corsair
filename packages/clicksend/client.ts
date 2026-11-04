import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';
import { z } from 'zod';

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

// Envelope uses a loose object schema so extra provider fields never break
// parsing; `data` is always re-validated by the endpoint responseSchema below.
const ClickSendEnvelopeSchema = z.looseObject({
	http_code: z.number().optional(),
	response_code: z.union([z.string(), z.number()]).optional(),
	response_msg: z.string().optional(),
	// unknown justification: envelope `data` carries any endpoint payload; it is
	// never returned directly — it is always re-parsed by responseSchema first.
	data: z.unknown().optional(),
});

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
		// Record<string, unknown> justification: request bodies/queries are
		// endpoint-specific JSON built from zod-validated inputs at each call
		// site; unknown keeps arbitrary JSON type-safe without any-casts.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		responseSchema: ZodType<T>;
	},
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

	const { method = 'GET', body, query, responseSchema } = options;

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
		// unknown justification: the HTTP transport returns untyped JSON; it is
		// never consumed directly — ClickSendEnvelopeSchema validates the
		// envelope and responseSchema re-validates `data` before returning.
		const res: unknown = await request<unknown>(config, requestOptions);
		const envelope = ClickSendEnvelopeSchema.parse(res);
		if (envelope.http_code !== undefined && envelope.http_code >= 400) {
			const code =
				envelope.response_code === undefined
					? undefined
					: String(envelope.response_code);
			throw new ClickSendAPIError(
				envelope.response_msg ?? 'ClickSend API error',
				code,
				envelope.http_code,
			);
		}
		if (envelope.data !== undefined) {
			return responseSchema.parse(envelope.data);
		}
		return responseSchema.parse(res);
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
