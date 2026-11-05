import type { OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export class QdrantAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'QdrantAPIError';
	}
}

// Plain http would send the key in cleartext, so it is only allowed for
// loopback hosts.
const LOOPBACK_HOSTS = [/^localhost$/, /^127(\.\d+){3}$/, /^\[::1\]$/];
// Private addresses and cluster-internal names (`qdrant`, `*.svc.cluster.local`)
// are also allowed over http, but only for a URL the developer pinned in the
// plugin options. A URL stored for an account is set by whoever connects it,
// and on a hosted runtime it must not reach the host's private network.
const PRIVATE_HOSTS = [
	/^10(\.\d+){3}$/,
	/^192\.168(\.\d+){2}$/,
	/^172\.(1[6-9]|2\d|3[01])(\.\d+){2}$/,
	/^\[f[cd][0-9a-f:]*\]$/,
	/^[a-z0-9-]+$/,
	/\.(local|internal|localhost)$/,
];

// Never taken from endpoint input, so an agent can't send the key elsewhere.
export function normalizeQdrantBaseUrl(
	baseUrl: string | undefined,
	{ allowPrivateHttp = false }: { allowPrivateHttp?: boolean } = {},
): string {
	if (!baseUrl) {
		throw new QdrantAPIError(
			'A Qdrant base URL is required. Set `baseUrl` in the plugin options or store `base_url` for the account.',
			'MISSING_BASE_URL',
		);
	}
	const url = URL.canParse(baseUrl) ? new URL(baseUrl) : undefined;
	if (
		!url ||
		(url.protocol !== 'https:' && url.protocol !== 'http:') ||
		url.username ||
		url.password ||
		url.search ||
		url.hash
	) {
		throw new QdrantAPIError(
			'Qdrant base URL must be an http(s) URL without credentials, query or fragment, e.g. https://xyz.cloud.qdrant.io:6333',
			'INVALID_BASE_URL',
		);
	}
	const httpHosts = allowPrivateHttp
		? [...LOOPBACK_HOSTS, ...PRIVATE_HOSTS]
		: LOOPBACK_HOSTS;
	if (
		url.protocol === 'http:' &&
		!httpHosts.some((host) => host.test(url.hostname))
	) {
		throw new QdrantAPIError(
			allowPrivateHttp
				? `Use https for ${url.hostname}: http is only allowed for localhost and private hosts`
				: `Use https for ${url.hostname}: a stored base_url may use http only for localhost. For a private host, pin it with the plugin's baseUrl option`,
			'INSECURE_BASE_URL',
		);
	}
	return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
}

// Keeps the transport's error (status, rate-limit fields, stack) and replaces
// its generic message with Qdrant's reason from `{ status: { error } }`.
function withQdrantReason(error: ApiError): ApiError {
	const reason = error.body?.status?.error;
	if (typeof reason === 'string' && reason) {
		error.stack = error.stack?.replace(error.message, reason);
		error.message = reason;
	}
	return error;
}

export async function makeQdrantRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		baseUrl: string | undefined;
		/** True only for a URL pinned in the plugin options, not one stored for an account. */
		allowPrivateHttp?: boolean;
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean>;
		/** Seconds Qdrant may take server-side; the client waits a little longer. */
		timeout?: number;
		schema: ZodType<T>;
	},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: normalizeQdrantBaseUrl(options.baseUrl, {
			allowPrivateHttp: options.allowPrivateHttp,
		}),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Not TOKEN: the transport would turn it into a Bearer header.
		HEADERS: apiKey ? { 'api-key': apiKey } : {},
		// The transport's 20s default would abort waits on large writes and
		// snapshots that Qdrant still completes.
		TIMEOUT: (options.timeout ? options.timeout + 5 : 300) * 1000,
	};

	let response: { result?: unknown } | undefined;
	try {
		response = await request(config, {
			method: options.method,
			url: endpoint,
			body: options.body,
			mediaType: 'application/json; charset=utf-8',
			query: options.query,
		});
	} catch (error) {
		throw error instanceof ApiError ? withQdrantReason(error) : error;
	}

	const parsed = options.schema.safeParse(response?.result);
	if (!parsed.success) {
		throw new QdrantAPIError(
			`Unexpected Qdrant response for ${endpoint}: ${parsed.error.message}`,
			'INVALID_RESPONSE',
		);
	}
	return parsed.data;
}
