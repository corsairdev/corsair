import { AuthMissingError, asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// The alias keeps the open type off the signatures below, where a trailing
// annotation would sit between code and a brace.
type UntypedBody = unknown; // unknown: provider bodies are open JSON; every use site parses with an output schema or reads one field.

/**
 * Gitea is self-hosted, so the instance URL is account config, not a constant.
 * Every request goes to `<instance>/api/v1`; the account may store the site
 * root (`https://git.example.com`) or the API root
 * (`https://git.example.com/api/v1`) and both land here.
 */
export function normalizeInstanceUrl(raw: string | undefined): string {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) {
		throw new Error('[gitea] instance URL is required');
	}
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[gitea] instance URL must be an absolute http(s) URL, for example https://git.example.com',
		);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error('[gitea] instance URL must use http or https');
	}
	if (!parsed.hostname) {
		throw new Error('[gitea] instance URL must include a host');
	}
	if (parsed.username || parsed.password) {
		throw new Error('[gitea] instance URL must not include credentials');
	}
	if (parsed.search || parsed.hash) {
		throw new Error(
			'[gitea] instance URL must not include a query or fragment',
		);
	}
	let path = parsed.pathname;
	// avoid /\/+$/ — CodeQL flags it as ReDoS on long slash runs
	while (path.endsWith('/')) {
		path = path.slice(0, -1);
	}
	// Subpath installs are supported (ROOT_URL), so the path is kept and only a
	// repeated API root is collapsed.
	if (path.endsWith('/api/v1')) {
		path = path.slice(0, -'/api/v1'.length);
	}
	return `${parsed.origin}${path}/api/v1`;
}

/**
 * Resolves the instance API base for one call: the `instanceUrl` plugin option
 * when set, otherwise the connected account's stored `instance_url` field.
 * keyBuilder already refused to bind without either; this repeats the check
 * where the URL is actually spent.
 */
export async function resolveGiteaInstance(ctx: {
	options?: { instanceUrl?: string };
	keys?: { get_instance_url?: () => Promise<string | null | undefined> };
}): Promise<string> {
	const fromOptions = ctx.options?.instanceUrl?.trim();
	if (fromOptions) return normalizeInstanceUrl(fromOptions);
	const fromAccount = (await ctx.keys?.get_instance_url?.())?.trim();
	if (fromAccount) return normalizeInstanceUrl(fromAccount);
	throw new AuthMissingError(
		'gitea',
		'api_key',
		'[gitea] instance URL is not set: connect the account with its Gitea site URL (for example https://gitea.com)',
	);
}

// The server caps `limit` at MAX_RESPONSE_ITEMS (50 by default, per the
// Gitea config cheat sheet; gitea.com answers 50 to limit=500). Sending 50
// when the caller omits one keeps a page from coming back silently short.
export const GITEA_MAX_PAGE_SIZE = 50;

// Live probe: gitea.com answered 429 with `retry-after: 60` on a burst, and
// the API documents no quota. When the header is absent the handler waits the
// observed window instead of hammering a self-hosted instance.
export const GITEA_RATE_LIMIT_FALLBACK_MS = 60_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads retry-after into the error.
const GITEA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type GiteaQuery = Record<string, string | number | boolean | undefined>;

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export type GiteaRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: GiteaQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: UntypedBody;
	/**
	 * True only for reads. Set per operation, never derived from the method:
	 * replaying a write after an unresolved outcome can repeat it (a retried
	 * issue create duplicates the issue), so SERVER_ERROR and transport
	 * retries gate on this flag.
	 */
	replayable: boolean;
};

/**
 * Gitea answers every 4xx with JSON `{ message, url }`, same shape on 401 and
 * 404. A missing route answers 404 with text/plain `404 page not found`
 * instead, so a text body here means the route itself does not exist on that
 * instance, not that the resource is missing.
 */
export class GiteaAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from the retry-after header, when the instance sent one. */
	readonly retryAfter?: number;
	/** The replayable flag the operation declared, carried for the handlers. */
	readonly replayable: boolean;
	/**
	 * True when the request never reached the provider (reset, DNS, abort), so
	 * replaying a read cannot have repeated anything.
	 */
	readonly isTransportFailure: boolean;
	readonly body?: UntypedBody; // unknown: a proxy can answer HTML or plain text instead of the JSON error.

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			body?: UntypedBody; // unknown: same open error body as the field above.
			retryAfter?: number;
			replayable?: boolean;
			isTransportFailure?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GiteaAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.replayable = options.replayable ?? false;
		this.isTransportFailure = options.isTransportFailure ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

function readMessage(body: UntypedBody): string | undefined {
	const value = asRecord(body)?.message;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function describeGiteaError(
	status: number | undefined,
	body: UntypedBody, // unknown: JSON error envelope, plain text, or a proxy's HTML.
	fallback: string,
): string {
	const text =
		readMessage(body) ??
		(typeof body === 'string' && body.length > 0 ? body : undefined) ??
		fallback;
	const label = [status].filter((part) => part !== undefined).join(' ');
	return label ? `Gitea ${label}: ${text}` : text;
}

export async function makeGiteaRequest(
	apiKey: string,
	baseUrl: string,
	{ method, path, query, body, replayable }: GiteaRequest,
): Promise<UntypedBody> {
	const config: OpenAPIConfig = {
		// Normalized here too, so a raw instance URL passed straight to the
		// client still lands on the API root.
		BASE: normalizeInstanceUrl(baseUrl),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Gitea API tokens do not accept Bearer; the literal word "token" is
		// required, so the header is written out instead of using TOKEN.
		HEADERS: {
			Accept: 'application/json',
			Authorization: `token ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<UntypedBody>(config, requestOptions, {
			rateLimitConfig: GITEA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError carries the status and retryAfter the handlers match
		// (429 retries) and core reads after a 401, so both are copied onto the
		// plugin error. The cause itself is dropped: the ApiError holds the full
		// request, and only transport errors keep one.
		if (error instanceof ApiError) {
			throw new GiteaAPIError(
				describeGiteaError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					replayable,
				},
			);
		}
		// Transport failures (reset, DNS, abort) never reached the provider and
		// never held a body, so this is the one branch that keeps the cause.
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GiteaAPIError(error.message, {
				cause: error,
				replayable,
				isTransportFailure: true,
			});
		}
		throw new GiteaAPIError('Unknown Gitea error', {
			replayable,
			isTransportFailure: true,
		});
	}
}
