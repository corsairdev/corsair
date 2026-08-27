import type { DatarobotQueryValue } from './utils';

export class DatarobotAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'DatarobotAPIError';
		this.status = options?.status;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
	}
}

export const DEFAULT_DATAROBOT_ORIGIN = 'https://app.datarobot.com';

function resolveOrigin(raw?: string): string {
	const value = (raw ?? DEFAULT_DATAROBOT_ORIGIN).trim();
	if (!value) {
		return DEFAULT_DATAROBOT_ORIGIN;
	}
	const withScheme = value.includes('://') ? value : `https://${value}`;
	try {
		return new URL(withScheme).origin;
	} catch {
		return DEFAULT_DATAROBOT_ORIGIN;
	}
}

function buildRequestUrl(
	origin: string,
	endpoint: string,
	query?: Record<string, DatarobotQueryValue>,
): string {
	// Paths are interpolated in the plugin (`buildDatarobotPath`) so this
	// never feeds `{...}` templates into corsair/http's path regex.
	if (endpoint.includes('{')) {
		throw new DatarobotAPIError('Unresolved DataRobot path parameter');
	}
	const url = new URL(endpoint, `${origin}/`);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) {
				continue;
			}
			url.searchParams.append(key, String(value));
		}
	}
	return url.toString();
}

export async function makeDatarobotRequest<T>(
	endpoint: string,
	keyOrCtx:
		| string
		| {
				key: string;
				options?: { baseUrl?: string; host?: string };
		  },
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, DatarobotQueryValue>;
	} = {},
): Promise<T> {
	const apiKey = typeof keyOrCtx === 'string' ? keyOrCtx : keyOrCtx.key;
	if (!apiKey?.trim()) {
		throw new DatarobotAPIError('DataRobot API key is missing');
	}

	const ctxBase =
		typeof keyOrCtx === 'object'
			? keyOrCtx.options?.baseUrl || keyOrCtx.options?.host
			: undefined;

	const { method = 'GET', body, query } = options;
	const origin = resolveOrigin(ctxBase);
	const url = buildRequestUrl(origin, endpoint, query);
	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`,
	};
	const payload =
		method === 'POST' || method === 'PUT' || method === 'PATCH'
			? body
			: undefined;
	if (payload !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	let response: Response;
	try {
		response = await fetch(url, {
			method,
			headers,
			body: payload === undefined ? undefined : JSON.stringify(payload),
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new DatarobotAPIError(error.message, { cause: error });
		}
		throw new DatarobotAPIError('Unknown DataRobot error');
	}

	const text = await response.text();
	let parsed: unknown;
	if (text.length > 0) {
		try {
			parsed = JSON.parse(text) as unknown;
		} catch {
			parsed = text;
		}
	}

	if (!response.ok) {
		const retryAfterRaw = response.headers.get('retry-after');
		const retryAfter = retryAfterRaw ? Number(retryAfterRaw) : undefined;
		throw new DatarobotAPIError(
			response.statusText || `HTTP ${response.status}`,
			{
				status: response.status,
				statusText: response.statusText,
				body: parsed,
				retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
			},
		);
	}

	return parsed as T;
}
