import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export const SNOWFLAKE_USER_AGENT = 'corsair-snowflake/0.1.0';

// A synchronous submit holds the connection for up to 45 seconds, then returns
// a handle. 70s leaves room for that wait. Snowflake enforces the statement
// timeout separately, and that limit can reach seven days.
export const SNOWFLAKE_TIMEOUT_MS = 70_000;

// error-handlers.ts owns retries. One attempt here still extracts Retry-After
// on a 429. Snowflake does not document that header; a delta-seconds value is
// honored when a proxy or a future response sends one.
const SNOWFLAKE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export const SnowflakeTokenTypeSchema = z.enum([
	'KEYPAIR_JWT',
	'OAUTH',
	'PROGRAMMATIC_ACCESS_TOKEN',
	'WORKLOAD_IDENTITY_FEDERATION',
]);

export type SnowflakeTokenType = z.infer<typeof SnowflakeTokenTypeSchema>;

type AccountContext = {
	options?: { account?: string; tokenType?: string };
	keys: {
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
		fromOptions || (await readStored(ctx.keys.get_account)).trim();
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
	const raw = fromOptions || (await readStored(ctx.keys.get_tokenType)).trim();
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
	const withoutSlash = trimmed.replace(/\/+$/, '');
	if (withoutSlash.includes('/')) {
		throw new Error(`Snowflake account identifier is not a host: ${trimmed}`);
	}
	const lowered = withoutSlash.toLowerCase();
	const hostname = suffixOf(lowered) ? lowered : `${lowered}${COM_SUFFIX}`;
	assertAccountHostname(hostname);
	return `https://${hostname}`;
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

function toSnowflakeError(error: ApiError): SnowflakeAPIError {
	return new SnowflakeAPIError(
		describeSnowflakeError(error.status, error.body, error.message),
		{
			cause: error,
			status: error.status,
			code: readString(error.body, 'code'),
			sqlState: readString(error.body, 'sqlState'),
			statementHandle: readString(error.body, 'statementHandle'),
			retryAfter: error.retryAfter,
			body: error.body,
		},
	);
}

export type SnowflakeQuery = Record<string, string | number | boolean>;

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
	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'User-Agent': SNOWFLAKE_USER_AGENT,
	};
	if (options.tokenType) {
		headers['X-Snowflake-Authorization-Token-Type'] = options.tokenType;
	}

	const config: OpenAPIConfig = {
		BASE: options.baseUrl,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: options.apiKey,
		HEADERS: headers,
		TIMEOUT: SNOWFLAKE_TIMEOUT_MS,
	};

	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		query: options.query,
		body: options.body,
		errors: {
			405: 'Method Not Allowed',
			408: 'Request Timeout',
			415: 'Unsupported Media Type',
			422: 'Unprocessable Entity',
		},
	};

	try {
		// A 200 body is the result, including code 391908 (result too large to
		// inline). Snowflake does not report statement failure inside HTTP 200.
		return await request(config, requestOptions, {
			rateLimitConfig: SNOWFLAKE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof SnowflakeAPIError) throw error;
		if (error instanceof ApiError) throw toSnowflakeError(error);
		if (error instanceof Error) {
			throw new SnowflakeAPIError(error.message, { cause: error });
		}
		throw new SnowflakeAPIError('Unknown Snowflake API error');
	}
}
