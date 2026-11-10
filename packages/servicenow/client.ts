import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * ServiceNow has no shared API host: every customer runs their own instance at
 * `https://{instance}.service-now.com`, and the Table API lives under
 * `/api/now/table`. So the instance is configuration, not a constant.
 */
export const DEFAULT_SERVICENOW_HOST = 'dev00000.service-now.com';

/**
 * The domains ServiceNow hosts instances on: `service-now.com` for commercial
 * instances and `servicenowservices.com` for government cloud ones. The host is
 * always built as `{instance}.{one of these}`, never taken as given: a stored
 * host is tenant input, and a free hostname would let a tenant point the
 * request, with its Basic credentials, at any server the runtime can reach.
 *
 * A custom URL (`support.acme.com`) is an alias of the instance's own
 * `service-now.com` name, so the instance name still reaches it.
 */
const COMMERCIAL_DOMAIN = 'service-now.com';
const SERVICENOW_DOMAINS = [COMMERCIAL_DOMAIN, 'servicenowservices.com'];

/** An instance name is one DNS label: letters, digits and inner hyphens. */
const INSTANCE_NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

const INSTANCE_HOST_HINT =
	'[servicenow] instance host must be an instance name or {instance}.service-now.com, e.g. acme or acme.service-now.com';

/**
 * Reduces what was configured to `{instance}.service-now.com` and rejects
 * everything else. Accepts the instance name alone (`acme`), the host
 * (`acme.service-now.com`) and `https://acme.service-now.com/`, because that is
 * what people paste from the address bar.
 */
export function normalizeServicenowHost(host: string): string {
	const trimmed = host.trim();
	if (!trimmed) {
		throw new Error('[servicenow] instance host is required');
	}

	let value = trimmed;
	if (trimmed.includes('://')) {
		let url: URL;
		try {
			url = new URL(trimmed);
		} catch {
			throw new Error('[servicenow] instance host is not a valid URL');
		}
		if (url.protocol !== 'https:') {
			throw new Error('[servicenow] instance host must use https');
		}
		if (url.username || url.password) {
			throw new Error(
				'[servicenow] instance host must not contain credentials',
			);
		}
		// `host` keeps a non-default port, which the checks below then reject.
		value = url.host;
	}

	// A loop rather than a trailing-slash regex, which CodeQL flags as ReDoS on
	// uncontrolled input. `workday` does the same.
	while (value.endsWith('/')) {
		value = value.slice(0, -1);
	}
	value = value.toLowerCase();

	const domain = SERVICENOW_DOMAINS.find((known) =>
		value.endsWith(`.${known}`),
	);
	// With no known domain the value has to be the instance name on its own.
	const instance = domain ? value.slice(0, -(domain.length + 1)) : value;
	if (!INSTANCE_NAME_PATTERN.test(instance)) {
		throw new Error(INSTANCE_HOST_HINT);
	}
	return `${instance}.${domain ?? COMMERCIAL_DOMAIN}`;
}

/** `https://{host}/api/now`, the base every Table API path hangs off. */
export function servicenowBase(host: string): string {
	return `https://${normalizeServicenowHost(host)}/api/now`;
}

/**
 * The credential pair. ServiceNow's Table API authenticates with **HTTP Basic**
 * (username and password), not a bearer token, so one string cannot carry it.
 * `keyBuilder` returns a single string, so the pair travels JSON-encoded and is
 * parsed here; `bonsai` does the same for its key/secret pair.
 */
export type ServicenowCredentials = {
	username: string;
	password: string;
};

/** Parses the pair out of the key builder's JSON string. */
export function parseCredentials(key: string): ServicenowCredentials {
	let parsed: unknown;
	try {
		parsed = JSON.parse(key);
	} catch {
		throw new ServicenowAPIError(
			'ServiceNow credentials must be a JSON object with username and password',
		);
	}
	const record = asRecord(parsed);
	const username = record?.username;
	const password = record?.password;
	if (
		typeof username !== 'string' ||
		username.length === 0 ||
		typeof password !== 'string' ||
		password.length === 0
	) {
		throw new ServicenowAPIError(
			'ServiceNow credentials must include a non-empty username and password',
		);
	}
	return { username, password };
}

/**
 * ServiceNow answers a failure with a real HTTP status and an `error` object:
 * `{ error: { message, detail }, status: "failure" }`. A success carries
 * `{ result }`. `message` is the short reason and `detail` the specific one, so
 * both are read.
 */
export class ServicenowAPIError extends Error {
	readonly status?: number;
	/** `error.detail` when present, which is usually the actionable part. */
	readonly detail?: string;
	/** Milliseconds from a Retry-After header, when ServiceNow sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			detail?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ServicenowAPIError';
		this.status = options.status;
		this.detail = options.detail;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** 404 on this API usually means the table name does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

/**
 * Reads an error body into a message and detail.
 * unknown: the body is untyped until the guards here narrow it.
 */
export function describeServicenowError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): { message: string; detail?: string } {
	const record = asRecord(body);
	const error = asRecord(record?.error);
	const message =
		typeof error?.message === 'string' && error.message.length > 0
			? error.message
			: fallback;
	const detail =
		typeof error?.detail === 'string' && error.detail.length > 0
			? error.detail
			: undefined;
	const label =
		status === undefined ? message : `ServiceNow ${status}: ${message}`;
	return detail ? { message: label, detail } : { message: label };
}

/** One record. Table columns are per-instance, so the shape stays open. */
export type ServicenowRecord = Record<string, unknown>;

/** The `result` of a successful call: one record, or an array of them. */
// unknown: callers parse this with the endpoint's zod output schema.
export type ServicenowResult = unknown;

export type ServicenowRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** Path after `/api/now`, e.g. `/table/incident`. */
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. A table name is not user data but can contain a dot. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// `corsair/http` replaces the default rate-limit config wholesale, so every
// field is spelled out. ServiceNow does not document a rate limit on the Table
// API, but a 429 from a gateway would otherwise throw on the missing header map.
const SERVICENOW_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function configWith(
	host: string,
	credentials: ServicenowCredentials,
): OpenAPIConfig {
	return {
		BASE: servicenowBase(host),
		VERSION: 'now',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// HTTP Basic: both are required for corsair/http to emit the header.
		USERNAME: credentials.username,
		PASSWORD: credentials.password,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};
}

/**
 * Sends one Table API request and returns the parsed body.
 *
 * `key` is the JSON-encoded credential pair and `host` the instance, so both
 * are explicit arguments: the client has no module state, which keeps it usable
 * from concurrent tenants.
 */
export async function makeServicenowRequest(
	host: string,
	key: string,
	{ method, path, query, body }: ServicenowRequest,
): Promise<ServicenowResult> {
	const credentials = parseCredentials(key);
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(
			configWith(host, credentials),
			requestOptions,
			{ rateLimitConfig: SERVICENOW_RATE_LIMIT_CONFIG },
		);
	} catch (error) {
		if (error instanceof ServicenowAPIError) throw error;
		if (error instanceof ApiError) {
			const described = describeServicenowError(
				error.status,
				error.body,
				error.message,
			);
			throw new ServicenowAPIError(described.message, {
				cause: error,
				status: error.status,
				detail: described.detail,
				retryAfter: error.retryAfter,
				method,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ServicenowAPIError(error.message, { cause: error, method });
		}
		throw new ServicenowAPIError('Unknown ServiceNow error', { method });
	}
}
