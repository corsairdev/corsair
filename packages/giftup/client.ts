import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GiftUpAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'GiftUpAPIError';
	}
}

export const GIFTUP_API_BASE = 'https://api.giftup.app';

export type GiftUpQuery = Record<string, string | number | boolean | undefined>;

/** Compact query params by dropping undefined values */
export function compactQuery(
	query?: GiftUpQuery,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			out[key] = value;
		}
	}
	return out;
}

/** Encode path parameter with encodeURIComponent */
export function encodeGiftUpPathId(id: number | string): string {
	return encodeURIComponent(String(id));
}

const REDACTED = '[redacted]';
const SECRET_FIELD_NAMES = new Set([
	'apikey',
	'token',
	'secret',
	'password',
	'authorization',
	'privatekey',
	'clientsecret',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
	// `unknown` because untrusted JSON objects need runtime verification before key access
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeValue(value: unknown, secrets: string[]): unknown {
	// `unknown` because payload can contain arbitrary nested JSON structures
	if (typeof value === 'string') {
		let result = value;
		for (const secret of secrets) {
			if (secret && secret.length >= 3) {
				result = result.split(secret).join(REDACTED);
			}
		}
		return result;
	}
	if (Array.isArray(value)) {
		// `unknown` because array items can be any JSON type
		return value.map((item: unknown) => sanitizeValue(item, secrets));
	}
	if (isRecord(value)) {
		// `unknown` because sanitized output object holds arbitrary JSON properties
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value)) {
			const normalizedKey = k.toLowerCase().replace(/[-_]/g, '');
			if (SECRET_FIELD_NAMES.has(normalizedKey)) {
				out[k] = REDACTED;
			} else {
				out[k] = sanitizeValue(v, secrets);
			}
		}
		return out;
	}
	return value;
}

/** Redact credentials in-place without replacing core's ApiError instance or clobbering stacks */
export function redactApiErrorInPlace(
	error: ApiError,
	secrets: string[],
): ApiError {
	if (error.request) {
		if (error.request.headers && isRecord(error.request.headers)) {
			for (const headerKey of Object.keys(error.request.headers)) {
				if (headerKey.toLowerCase() === 'authorization') {
					Reflect.set(error.request.headers, headerKey, REDACTED);
				}
			}
		}
		if (error.request.body !== undefined) {
			Reflect.set(
				error.request,
				'body',
				sanitizeValue(error.request.body, secrets),
			);
		}
	}
	if (error.body !== undefined) {
		Reflect.set(error, 'body', sanitizeValue(error.body, secrets));
	}
	return error;
}

export type GiftUpRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` because request body can be object, array (for JSON Patch), or primitives
	body?: unknown;
	query?: GiftUpQuery;
	auth?: boolean;
	testMode?: boolean;
};

export async function makeGiftUpRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: GiftUpRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		auth = true,
		testMode = false,
	} = options;

	if (auth) {
		if (apiKey === undefined || apiKey === '') {
			throw new AuthMissingError('giftup', 'api_key');
		}
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type':
			method === 'PATCH' ? 'application/json-patch+json' : 'application/json',
	};

	const secretsToRedact: string[] = [];
	if (apiKey && apiKey.length >= 3) {
		secretsToRedact.push(apiKey);
	}

	if (auth && apiKey) {
		headers.Authorization = `Bearer ${apiKey}`;
	}

	if (testMode) {
		headers['x-giftup-testmode'] = 'true';
	}

	const config: OpenAPIConfig = {
		BASE: GIFTUP_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType:
			method === 'PATCH'
				? 'application/json-patch+json'
				: 'application/json; charset=utf-8',
		query: compactQuery(query),
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			redactApiErrorInPlace(error, secretsToRedact);
			throw error;
		}
		if (error instanceof Error) {
			throw new GiftUpAPIError(error.message);
		}
		throw new GiftUpAPIError('Unknown error');
	}
}
