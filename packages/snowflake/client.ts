import { AuthMissingError } from 'corsair/core';
import { z } from 'zod';

export const SNOWFLAKE_USER_AGENT = 'corsair-snowflake/0.1.0';

// A synchronous submit holds the connection for up to 45 seconds, then returns
// a handle. 70s leaves room for that wait. Snowflake enforces the statement
// timeout separately, and that limit can reach seven days.
export const SNOWFLAKE_TIMEOUT_MS = 70_000;

// error-handlers.ts owns retries. This client makes one attempt. A 429 may
// carry Retry-After as delta-seconds or an HTTP-date; both become milliseconds.

export const SnowflakeTokenTypeSchema = z.enum([
	'KEYPAIR_JWT',
	'OAUTH',
	'PROGRAMMATIC_ACCESS_TOKEN',
	'WORKLOAD_IDENTITY_FEDERATION',
]);

export type SnowflakeTokenType = z.infer<typeof SnowflakeTokenTypeSchema>;

type AccountContext = {
	options?: { account?: string; tokenType?: string };
	// Corsair attaches `keys` only when a database and KEK are configured. A
	// client built with direct credentials has none, so stored lookups are skipped.
	keys?: {
		get_account: () => Promise<string | null>;
		get_tokenType: () => Promise<string | null>;
	};
};

// An account that was never initialized has no DEK. Reading an optional stored
// field then throws from the key manager. That is "nothing stored", not a
// failed request, when the caller can still pass the value as an option.
async function readStored(read: () => Promise<string | null>): Promise<string> {
	try {
		return (await read()) ?? '';
	} catch (error) {
		if (error instanceof Error && error.message.includes('No DEK found')) {
			return '';
		}
		throw error;
	}
}

export async function resolveSnowflakeAccount(
	ctx: AccountContext,
): Promise<string> {
	const fromOptions = ctx.options?.account?.trim() ?? '';
	const account =
		fromOptions ||
		(ctx.keys ? (await readStored(ctx.keys.get_account)).trim() : '');
	if (!account) {
		throw new AuthMissingError(
			'snowflake',
			'account',
			'[auth-missing:snowflake:account]: a Snowflake account identifier is required. It is the host of https://<account>.snowflakecomputing.com',
		);
	}
	return account;
}

export async function resolveSnowflakeTokenType(
	ctx: AccountContext,
): Promise<SnowflakeTokenType | undefined> {
	const fromOptions = ctx.options?.tokenType?.trim() ?? '';
	const raw =
		fromOptions ||
		(ctx.keys ? (await readStored(ctx.keys.get_tokenType)).trim() : '');
	if (!raw) return undefined;
	return SnowflakeTokenTypeSchema.parse(raw);
}

const COM_SUFFIX = '.snowflakecomputing.com';
const CN_SUFFIX = '.snowflakecomputing.cn';

// Letters, digits, hyphens, and underscores. Dots separate legacy locator
// segments and private-link labels. Snowflake documents underscores in
// account-name hostnames.
const ACCOUNT_LABEL =
	/^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?)*$/;

function suffixOf(hostname: string): string | undefined {
	if (hostname.length > COM_SUFFIX.length && hostname.endsWith(COM_SUFFIX)) {
		return COM_SUFFIX;
	}
	if (hostname.length > CN_SUFFIX.length && hostname.endsWith(CN_SUFFIX)) {
		return CN_SUFFIX;
	}
	return undefined;
}

function assertAccountHostname(hostname: string): void {
	const suffix = suffixOf(hostname);
	if (!suffix) {
		throw new Error(
			`Snowflake account host is not a snowflakecomputing.com or snowflakecomputing.cn host: ${hostname}`,
		);
	}
	const labels = hostname.slice(0, -suffix.length);
	if (!ACCOUNT_LABEL.test(labels)) {
		throw new Error(
			`Snowflake account host is not a valid account identifier: ${hostname}`,
		);
	}
}

function baseUrlFromAbsolute(account: string): string {
	let url: URL;
	try {
		url = new URL(account);
	} catch {
		throw new Error(`Snowflake account URL is not absolute: ${account}`);
	}
	if (url.protocol !== 'https:') {
		throw new Error('Snowflake account URL must use https');
	}
	if (url.username || url.password) {
		throw new Error('Snowflake account URL must not include credentials');
	}
	if (url.port) {
		throw new Error('Snowflake account URL must not include a port');
	}
	if (url.pathname !== '/' && url.pathname !== '') {
		throw new Error('Snowflake account URL must not include a path');
	}
	if (url.search || url.hash) {
		throw new Error('Snowflake account URL must not include a query or hash');
	}
	const hostname = url.hostname.toLowerCase();
	assertAccountHostname(hostname);
	return `https://${hostname}`;
}

/**
 * Resolves the account credential to `https://<account>.snowflakecomputing.com`.
 * Accepts an org-account identifier, a legacy locator (`xy12345.us-east-2.aws`),
 * or a full https host, including private-link and `snowflakecomputing.cn`.
 */
export function accountBaseUrl(account: string): string {
	const trimmed = account.trim();
	if (!trimmed) {
		throw new Error('Snowflake account identifier is empty');
	}
	if (trimmed.includes('://') || trimmed.startsWith('//')) {
		return baseUrlFromAbsolute(trimmed);
	}
	const withoutSlash = stripTrailingSlashes(trimmed);
	if (withoutSlash.includes('/')) {
		throw new Error(`Snowflake account identifier is not a host: ${trimmed}`);
	}
	const lowered = withoutSlash.toLowerCase();
	const hostname = suffixOf(lowered) ? lowered : `${lowered}${COM_SUFFIX}`;
	assertAccountHostname(hostname);
	return `https://${hostname}`;
}

// A regex of one-or-more slashes is polynomial on a long run of slashes
// (CodeQL js/polynomial-redos). Count them instead.
function stripTrailingSlashes(value: string): string {
	let end = value.length;
	while (end > 0 && value.charCodeAt(end - 1) === 47) {
		end -= 1;
	}
	return end === value.length ? value : value.slice(0, end);
}

/** Delta-seconds or an HTTP-date, in milliseconds. Undefined when unparseable. */
export function retryAfterHeaderToMs(
	header: string | null,
	now = Date.now(),
): number | undefined {
	if (!header) return undefined;
	const trimmed = header.trim();
	if (/^\d+$/.test(trimmed)) return Number(trimmed) * 1000;
	const parsed = Date.parse(trimmed);
	if (Number.isNaN(parsed)) return undefined;
	return Math.max(0, parsed - now);
}

/**
 * Snowflake error bodies are `{ code, message, sqlState?, statementHandle? }`.
 * 405 can be empty, and a proxy can answer with text.
 */
export class SnowflakeAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly sqlState?: string;
	readonly statementHandle?: string;
	readonly retryAfter?: number;
	// unknown: the body is the untrusted payload described on the class.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			sqlState?: string;
			statementHandle?: string;
			retryAfter?: number;
			// unknown: same untrusted error payload described on the class field.
			body?: unknown;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SnowflakeAPIError';
		this.status = options.status;
		this.code = options.code;
		this.sqlState = options.sqlState;
		this.statementHandle = options.statementHandle;
		this.retryAfter = options.retryAfter;
		this.body = options.body;
	}
}

// unknown: a JSON object, a string, or empty until this guard runs.
function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function readString(
	// unknown: one field of an untrusted error body.
	body: unknown,
	key: string,
): string | undefined {
	if (!isRecord(body)) return undefined;
	const value = body[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function redactSecrets(message: string): string {
	return message
		.replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
		.replace(
			/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
			'[redacted-jwt]',
		);
}

export function describeSnowflakeError(
	status: number | undefined,
	// unknown: untrusted error body; only a string `message` is read.
	body: unknown,
	fallback: string,
): string {
	const text = redactSecrets(readString(body, 'message') ?? fallback);
	return status !== undefined ? `Snowflake ${status}: ${text}` : text;
}

const STATUS_FALLBACK: Record<number, string> = {
	400: 'Bad Request',
	401: 'Unauthorized',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	408: 'Request Timeout',
	415: 'Unsupported Media Type',
	422: 'Unprocessable Entity',
	429: 'Too Many Requests',
	500: 'Internal Server Error',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
};

export type SnowflakeQuery = Record<string, string | number | boolean>;

function queryString(query: SnowflakeQuery | undefined): string {
	if (!query) return '';
	const parts: string[] = [];
	for (const [key, value] of Object.entries(query)) {
		parts.push(
			`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
		);
	}
	return parts.length > 0 ? `?${parts.join('&')}` : '';
}

// unknown: a JSON body, text, or an empty error page.
async function readResponseBody(response: Response): Promise<unknown> {
	if (response.status === 204) return undefined;
	const contentType = response.headers.get('content-type') ?? '';
	const text = await response.text();
	if (!text) return undefined;
	if (contentType.toLowerCase().includes('application/json')) {
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	}
	return text;
}

export async function makeSnowflakeRequest(options: {
	baseUrl: string;
	apiKey: string;
	tokenType?: SnowflakeTokenType;
	method: 'GET' | 'POST';
	path: string;
	query?: SnowflakeQuery;
	body?: Record<string, string | number | boolean | object>;
	// unknown: the caller parses this JSON with the endpoint output schema.
}): Promise<unknown> {
	const headers = new Headers({
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'User-Agent': SNOWFLAKE_USER_AGENT,
		Authorization: `Bearer ${options.apiKey}`,
	});
	if (options.tokenType) {
		headers.set('X-Snowflake-Authorization-Token-Type', options.tokenType);
	}

	const base = options.baseUrl.endsWith('/')
		? options.baseUrl.slice(0, -1)
		: options.baseUrl;
	const path = options.path.startsWith('/') ? options.path : `/${options.path}`;
	const url = `${base}${path}${queryString(options.query)}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: options.method,
			headers,
			body:
				options.body === undefined ? undefined : JSON.stringify(options.body),
			signal: AbortSignal.timeout(SNOWFLAKE_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new SnowflakeAPIError(error.message, { cause: error });
		}
		throw new SnowflakeAPIError('Unknown Snowflake API error');
	}

	const responseBody = await readResponseBody(response);
	// 2xx includes 202 (statement still running). Code 391908 on 200 means the
	// result was too large to inline; it is not a failure envelope.
	if (response.ok) return responseBody;

	const retryAfter =
		response.status === 429
			? retryAfterHeaderToMs(response.headers.get('Retry-After'))
			: undefined;
	throw new SnowflakeAPIError(
		describeSnowflakeError(
			response.status,
			responseBody,
			STATUS_FALLBACK[response.status] ?? response.statusText,
		),
		{
			status: response.status,
			code: readString(responseBody, 'code'),
			sqlState: readString(responseBody, 'sqlState'),
			statementHandle: readString(responseBody, 'statementHandle'),
			retryAfter,
			body: responseBody,
		},
	);
}
