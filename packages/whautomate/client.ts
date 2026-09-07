import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { WhautomateContext } from './index';

export class WhautomateAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		// error bodies vary per endpoint and arrive as parsed json from
		// corsair/http; a union of those shapes is not maintainable
		public readonly body?: unknown,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'WhautomateAPIError';
	}
}

const WHAUTOMATE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function isWhautomateHostname(hostname: string): boolean {
	return hostname === 'whautomate.com' || hostname.endsWith('.whautomate.com');
}

function isBlockedHostname(hostname: string): boolean {
	const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
	if (
		host === 'localhost' ||
		host.endsWith('.localhost') ||
		host.endsWith('.local') ||
		host.endsWith('.internal') ||
		host === 'metadata.google.internal'
	) {
		return true;
	}
	const mapped = host.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
	if (mapped?.[1]) {
		return isBlockedHostname(mapped[1]);
	}
	if (host.includes(':')) {
		return (
			host === '::1' ||
			host.startsWith('fe8') ||
			host.startsWith('fe9') ||
			host.startsWith('fea') ||
			host.startsWith('feb') ||
			host.startsWith('fc') ||
			host.startsWith('fd')
		);
	}
	const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (!ipv4) {
		return false;
	}
	const a = Number(ipv4[1]);
	const b = Number(ipv4[2]);
	return (
		a === 0 ||
		a === 10 ||
		a === 127 ||
		(a === 169 && b === 254) ||
		(a === 172 && b >= 16 && b <= 31) ||
		(a === 192 && b === 168)
	);
}

export function resolveWhautomateBase(apiHost: string): string {
	let url: URL;
	try {
		url = new URL(apiHost);
	} catch {
		throw new WhautomateAPIError(
			`[whautomate] invalid apiHost: ${apiHost}`,
			'INVALID_API_HOST',
		);
	}

	const hostname = url.hostname.replace(/\.$/, '').toLowerCase();
	if (
		url.protocol !== 'https:' ||
		(url.port !== '' && url.port !== '443') ||
		url.username !== '' ||
		url.password !== '' ||
		!hostname ||
		!isWhautomateHostname(hostname) ||
		isBlockedHostname(hostname)
	) {
		throw new WhautomateAPIError(
			`[whautomate] apiHost must be a public https Whautomate origin: ${hostname || apiHost}`,
			'INVALID_API_HOST',
		);
	}

	const origin = `https://${hostname}`;
	const path = url.pathname.replace(/\/+$/, '');
	if (path === '' || path === '/v1') {
		return `${origin}/v1`;
	}
	if (path.endsWith('/v1')) {
		return `${origin}${path}`;
	}
	return `${origin}${path}/v1`;
}

// provider error payloads are untyped json; a dedicated union is not practical
function apiErrorMessage(body: unknown, fallback: string): string {
	if (typeof body === 'string' && body) {
		return body;
	}
	if (!body || typeof body !== 'object') {
		return fallback;
	}
	// object check above already excluded null; error payloads are
	// untyped json so a dedicated union is not practical
	const record = body as Record<string, unknown>;
	const nested = record.error;
	if (typeof nested === 'string' && nested) {
		return nested;
	}
	if (nested && typeof nested === 'object') {
		const nestedRecord = nested as Record<string, unknown>;
		if (typeof nestedRecord.message === 'string' && nestedRecord.message) {
			return nestedRecord.message;
		}
	}
	if (typeof record.message === 'string' && record.message) {
		return record.message;
	}
	return fallback;
}

export async function resolveApiHost(ctx: WhautomateContext): Promise<string> {
	const fromKeys = await ctx.keys.get_api_host();
	const host = fromKeys ?? ctx.options.apiHost;
	if (!host) {
		throw new WhautomateAPIError(
			'An API host is required for the Whautomate integration (Whautomate account > Settings > API)',
			'MISSING_API_HOST',
		);
	}
	return resolveWhautomateBase(host);
}

export async function makeWhautomateRequest<T>(
	apiHost: string,
	apiKey: string,
	endpoint: string,
	outputSchema: import('zod').ZodType<T>,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// bodies are operation-specific json; the whautomate api validates
		// their shape, so they stay a json bag here
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!apiHost) {
		throw new WhautomateAPIError(
			'An API host is required for the Whautomate integration',
			'MISSING_API_HOST',
		);
	}
	if (!apiKey) {
		throw new WhautomateAPIError(
			'An API key is required for the Whautomate integration (Whautomate account > Settings > API)',
			'MISSING_API_KEY',
		);
	}
	const { method = 'GET', body, query } = options;
	const fullUrl = resolveWhautomateBase(apiHost);

	const rateLimitConfig: RateLimitConfig =
		method === 'GET'
			? WHAUTOMATE_RATE_LIMIT_CONFIG
			: { ...WHAUTOMATE_RATE_LIMIT_CONFIG, enabled: false };

	const config: OpenAPIConfig = {
		BASE: fullUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// official Whautomate REST API authenticates with x-api-key
			// (help.whautomate.com/product-guides/whautomate-rest-api);
			// APPOINTO-TOKEN is not a current auth header
			'x-api-key': apiKey,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig,
		});
		const parseResult = outputSchema.safeParse(response);
		if (!parseResult.success) {
			throw new WhautomateAPIError(
				`Whautomate response for ${endpoint} failed schema validation: ${parseResult.error.message}`,
				'SCHEMA_VALIDATION_FAILED',
				parseResult.error.flatten(),
				undefined,
				undefined,
			);
		}
		return parseResult.data;
	} catch (error) {
		if (error instanceof WhautomateAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw new WhautomateAPIError(
				apiErrorMessage(error.body, error.message),
				String(error.status),
				error.body,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new WhautomateAPIError(error.message);
		}
		throw new WhautomateAPIError('Unknown error');
	}
}
