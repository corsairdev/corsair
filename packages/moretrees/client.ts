import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	BinaryResponse,
	OpenAPIConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MORETREES_HOSTS = {
	user_management:
		'https://user-management-service.platform.moretrees.eco/user-management-api/external',
	project_management:
		'https://project-management-service.platform.moretrees.eco/project-management-api/external',
	transaction_management:
		'https://transaction-management-service.platform.moretrees.eco/transaction-management-api/external',
} as const;

export type MoreTreesService = keyof typeof MORETREES_HOSTS;

/**
 * The account code that selects the payment account. Stored on the account
 * (Settings > Account Settings) or passed as the `accountCode` plugin option.
 */
export type MoreTreesCallContext = {
	key: string;
	options: { accountCode?: string };
	keys: {
		get_account_code: () => Promise<string | null | undefined>;
	};
};

/** Resolves the account code: the inline option wins over the stored field. */
export async function resolveAccountCode(
	ctx: MoreTreesCallContext,
): Promise<string> {
	const value = ctx.options.accountCode ?? (await ctx.keys.get_account_code());
	if (!value) {
		throw new Error(
			'More Trees account code is required: pass it in the input, set accountCode in the plugin options or save account_code on the account.',
		);
	}
	return value;
}

// ── Lossless JSON ─────────────────────────────────────────────────────────
// More Trees issues 64-bit IDs (projects and trees such as
// 1212386588741402633). JSON.parse rounds anything above 2^53, so an ID read
// from projects.list and sent back to trees.plant would name another tree.
// Responses are read as bytes and parsed here: integer literals outside the
// safe range become strings, and every ID field is returned as a string.

/** Quotes integer literals that JSON.parse would round. */
export function quoteUnsafeIntegers(text: string): string {
	let out = '';
	let i = 0;
	while (i < text.length) {
		const ch = text[i] as string;
		if (ch === '"') {
			const start = i;
			i++;
			while (i < text.length && text[i] !== '"') {
				i += text[i] === '\\' ? 2 : 1;
			}
			i++;
			out += text.slice(start, i);
			continue;
		}
		if (ch === '-' || (ch >= '0' && ch <= '9')) {
			const match = /^-?\d+(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i));
			const token = match?.[0] ?? ch;
			const isInteger = !match?.[1] && !match?.[2];
			out +=
				isInteger && !Number.isSafeInteger(Number(token))
					? `"${token}"`
					: token;
			i += token.length;
			continue;
		}
		out += ch;
		i++;
	}
	return out;
}

const ID_KEY = /^(id|.*_id|.*Id)$/;

/** Returns every ID field (`id`, `*_id`, `*Id`) as a string. */
// unknown: walks arbitrary parsed JSON.
export function stringifyIds(value: unknown, key?: string): unknown {
	if (Array.isArray(value)) return value.map((item) => stringifyIds(item));
	if (value && typeof value === 'object') {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value)) out[k] = stringifyIds(v, k);
		return out;
	}
	if (key && ID_KEY.test(key) && typeof value === 'number') {
		return String(value);
	}
	return value;
}

// unknown: the result is arbitrary JSON until the endpoint schema parses it.
export function parseMoreTreesJson(text: string): unknown {
	if (text.trim() === '') return undefined;
	return stringifyIds(JSON.parse(quoteUnsafeIntegers(text)));
}

/** A JSON number written exactly as given, for 64-bit IDs. */
export class RawJsonNumber {
	constructor(readonly digits: string) {}
}

/** Serializes a body, writing RawJsonNumber values as bare digits. */
// unknown: the endpoint's input schema has already validated the body.
export function serializeMoreTreesBody(body: unknown): string {
	const marks: string[] = [];
	// A per-call tag, so no string in the body can look like a placeholder.
	const tag = crypto.randomUUID();
	const json = JSON.stringify(body, (_key, value) => {
		if (value instanceof RawJsonNumber) {
			marks.push(value.digits);
			return `${tag}:${marks.length - 1}`;
		}
		return value;
	});
	return json.replace(
		new RegExp(`"${tag}:(\\d+)"`, 'g'),
		(_m, index: string) => marks[Number(index)] as string,
	);
}

/** Turns an ID input (digits or a safe integer) into an exact JSON number. */
export function rawId(value: string | number | undefined) {
	return value === undefined ? undefined : new RawJsonNumber(String(value));
}

// ── Errors ────────────────────────────────────────────────────────────────

/** Request facts the error handlers need, kept off the error object. */
export type MoreTreesRequestFacts = {
	method: string;
	/** True when a 5xx or a network drop can replay the request. */
	replayable: boolean;
};

const requestFacts = new WeakMap<object, MoreTreesRequestFacts>();

export function recordRequestFacts(
	error: object,
	facts: MoreTreesRequestFacts,
): void {
	requestFacts.set(error, facts);
}

export function getRequestFacts(
	error: Error,
): MoreTreesRequestFacts | undefined {
	return requestFacts.get(error);
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * More Trees answers failures with a Spring envelope:
 * `{"status":404,"timeStamp":"...","error":"MTC-0004","message":"The
 * requested resource does not exist.","path":"/external/forest/x"}`
 * (probed 11-26). 401s come back with an empty body.
 */
export function describeMoreTreesError(
	status: number | undefined,
	// unknown: the provider's error body.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const message = readString(record, 'message');
	const code = readString(record, 'error');
	const text =
		message && code && code !== message
			? `${message} (${code})`
			: (message ?? code ?? fallback);
	return status === undefined
		? `More Trees: ${text}`
		: `More Trees ${status}: ${text}`;
}

/**
 * Rebuilds core's ApiError without the request body (gift recipients carry
 * names and email addresses) and with the provider's message. Status,
 * Retry-After and the rate-limit fields stay as core set them.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const { body: _body, formData: _formData, ...request } = error.request;
	return new ApiError(
		request,
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		describeMoreTreesError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// ── Requests ──────────────────────────────────────────────────────────────

export type MoreTreesQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type MoreTreesRequest = {
	service: MoreTreesService;
	method: 'GET' | 'POST';
	path: string;
	query?: MoreTreesQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** True when a 5xx or a network drop can replay the request. */
	replayable: boolean;
};

const decoder = new TextDecoder();

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMoreTreesRequest(
	ctx: MoreTreesCallContext,
	{ service, method, path, query, body, replayable }: MoreTreesRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: MORETREES_HOSTS[service],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-API-KEY': ctx.key,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		// A Blob goes out as written, so 64-bit IDs keep every digit.
		body:
			body === undefined
				? undefined
				: new Blob([serializeMoreTreesBody(body)], {
						type: 'application/json',
					}),
		// Bytes, so the lossless parser sees the digits JSON.parse would round.
		responseType: 'binary',
	};

	try {
		// Core retries a 429 three times, honouring Retry-After.
		const response = await request<BinaryResponse>(config, requestOptions);
		return parseMoreTreesJson(decoder.decode(response.bytes));
	} catch (error) {
		const thrown = error instanceof ApiError ? sanitizeApiError(error) : error;
		if (thrown && typeof thrown === 'object') {
			recordRequestFacts(thrown, { method, replayable });
		}
		throw thrown;
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
