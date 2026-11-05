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

// Loopback, private addresses and cluster-internal names (`qdrant`,
// `*.svc.cluster.local`). A URL the developer pinned with the `baseUrl` option
// may use plain http for these; elsewhere http would send the key in cleartext.
const PINNED_HTTP_HOSTS = [
	/^localhost$/,
	/^127(\.\d+){3}$/,
	/^\[::1\]$/,
	/^10(\.\d+){3}$/,
	/^192\.168(\.\d+){2}$/,
	/^172\.(1[6-9]|2\d|3[01])(\.\d+){2}$/,
	/^\[f[cd][0-9a-f:]*\]$/,
	/^[a-z0-9-]+$/,
	/\.(local|internal|localhost)$/,
];

// Names that only resolve inside a network: localhost, single-label names
// and the .local/.internal/.localhost suffixes.
const INTERNAL_NAMES = [
	/^localhost$/,
	/^[a-z0-9-]+$/,
	/\.(local|internal|localhost)$/,
];

// IP literals in loopback, private, CGNAT, link-local (cloud metadata),
// benchmark, multicast and reserved ranges. `new URL` has already rewritten
// other IPv4 spellings (2130706433, 0x7f.1) to dotted decimal.
function isInternalIpLiteral(host: string): boolean {
	const v4 = host.match(/^(\d+)\.(\d+)\.\d+\.\d+$/);
	if (v4) {
		const a = Number(v4[1]);
		const b = Number(v4[2]);
		return (
			a === 0 ||
			a === 10 ||
			a === 127 ||
			(a === 100 && b >= 64 && b <= 127) ||
			(a === 169 && b === 254) ||
			(a === 172 && b >= 16 && b <= 31) ||
			(a === 192 && b === 168) ||
			(a === 198 && (b === 18 || b === 19)) ||
			a >= 224
		);
	}
	if (!host.startsWith('[')) return false;
	const v6 = host.slice(1, -1);
	// ::, ::1, unique-local fc00::/7, link-local fe80::/10, and IPv4-mapped ::ffff:…
	return (
		v6 === '::' ||
		v6 === '::1' ||
		/^f[cd]/.test(v6) ||
		/^fe[89ab]/.test(v6) ||
		v6.startsWith('::ffff:')
	);
}

/**
 * Checks the cluster URL. It is never taken from endpoint input, so an agent
 * can't send the key elsewhere.
 *
 * `pinned` is true only for the `baseUrl` plugin option, which the developer
 * sets in code. A `base_url` stored for an account is set by whoever connects
 * the account, and on a hosted runtime it must not reach the host's own
 * network, so it must use https and a public host. The host check covers names
 * and IP literals; it does not resolve DNS, so a public name that resolves to
 * a private address is not caught here.
 */
export function normalizeQdrantBaseUrl(
	baseUrl: string | undefined,
	{ pinned = false }: { pinned?: boolean } = {},
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
	const host = url.hostname.replace(/\.$/, '');
	if (pinned) {
		if (
			url.protocol === 'http:' &&
			!PINNED_HTTP_HOSTS.some((pattern) => pattern.test(host))
		) {
			throw new QdrantAPIError(
				`Use https for ${host}: http is only allowed for localhost and private hosts`,
				'INSECURE_BASE_URL',
			);
		}
	} else {
		if (url.protocol !== 'https:') {
			throw new QdrantAPIError(
				`A stored base_url must use https. For a local or private cluster over http, pin it with the plugin's baseUrl option`,
				'INSECURE_BASE_URL',
			);
		}
		if (
			isInternalIpLiteral(host) ||
			INTERNAL_NAMES.some((pattern) => pattern.test(host))
		) {
			throw new QdrantAPIError(
				`A stored base_url must point to a public host, not ${host}. For a local or private cluster, pin it with the plugin's baseUrl option`,
				'PRIVATE_BASE_URL',
			);
		}
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
		pinned?: boolean;
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown: any JSON body; each endpoint's zod input schema has already validated it.
		body?: unknown;
		query?: Record<string, string | number | boolean>;
		/** Seconds Qdrant may take server-side; the client waits a little longer. */
		timeout?: number;
		schema: ZodType<T>;
	},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: normalizeQdrantBaseUrl(options.baseUrl, { pinned: options.pinned }),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Not TOKEN: the transport would turn it into a Bearer header.
		HEADERS: apiKey ? { 'api-key': apiKey } : {},
		// The transport's 20s default would abort waits on large writes and
		// snapshots that Qdrant still completes.
		TIMEOUT: (options.timeout ? options.timeout + 5 : 300) * 1000,
	};

	// unknown: the envelope's `result` differs per endpoint; options.schema checks it below.
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
