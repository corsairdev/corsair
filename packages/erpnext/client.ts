import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ErpnextAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` is intentional here: the body is whatever the Frappe site
	// returned (JSON with `exc`/`_server_messages`, sometimes plain text), so
	// no narrower type can be guaranteed and callers must narrow it.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'ErpnextAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/**
 * ERPNext tokens are `<api_key>:<api_secret>` pairs. The composite credential
 * the key builder returns is forwarded as Frappe's documented custom scheme.
 */
export function erpnextAuthorizationHeader(key: string): string {
	return `token ${key}`;
}

// Frappe does not document central rate limits; instances answer 429 with
// Retry-After when throttled. Retrying belongs to the endpoint-level error
// handlers, which can tell reads from writes, so the transport never replays
// a request here.
const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type ErpnextRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// `unknown` is intentional here: bodies are provider-defined payloads
	// (documents are open record sets validated by each operation's input
	// schema before they reach this transport).
	body?: unknown;
	// `unknown` is intentional here: query values are provider-defined filter,
	// field-list, and pagination inputs forwarded as-is after validation.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	mediaType?: string;
};

export async function makeErpnextRequest<T>(
	endpoint: string,
	baseUrl: string,
	key: string,
	options: ErpnextRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, mediaType } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl.replace(/\/+$/, ''),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			// Frappe's documented token scheme; sent verbatim so the shared
			// client never rewrites it to a Bearer header.
			Authorization: erpnextAuthorizationHeader(key),
			...headers,
		},
	};

	const hasBody = body !== undefined && method !== 'GET';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: hasBody ? (mediaType ?? 'application/json') : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ErpnextAPIError) throw error;
		if (error instanceof Error) {
			throw new ErpnextAPIError(error.message, { cause: error });
		}
		throw new ErpnextAPIError('Unknown ERPNext API error');
	}
}

/**
 * Fetches binary content (document PDFs, stored files) with the same token
 * authentication. The shared transport returns non-JSON bodies as decoded
 * text, which mangles bytes, so downloads go through fetch directly and the
 * bytes come back as base64 for the operation's output schema.
 */
export async function fetchErpnextBinary(
	endpoint: string,
	baseUrl: string,
	key: string,
): Promise<string> {
	const url = `${baseUrl.replace(/\/+$/, '')}${endpoint}`;
	const response = await fetch(url, {
		headers: { Authorization: erpnextAuthorizationHeader(key) },
		signal: AbortSignal.timeout(60_000),
	});
	if (!response.ok) {
		const statusText = response.statusText || 'Request failed';
		throw new ErpnextAPIError(
			`ERPNext binary download failed with HTTP ${response.status}: ${statusText}`,
			{ cause: new Error(String(response.status)) },
		);
	}
	const bytes = new Uint8Array(await response.arrayBuffer());
	return Buffer.from(bytes).toString('base64');
}
