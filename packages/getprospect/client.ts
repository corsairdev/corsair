import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	ApiResult,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import { GetProspectOperationInputSchemas } from './endpoints/types';
import { SchemaErrorCode, SchemaErrorName } from './schema/api';

export const GETPROSPECT_API_BASE = 'https://api.getprospect.com';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type GetProspectRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: object;
	// Per-route query fields differ; values are schema-validated before reaching this transport boundary.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	timeout?: number;
};

const ProviderErrorEnvelopeSchema = z
	.object({
		errors: z
			.array(
				z
					.object({
						name: z.string().optional(),
						message: z.string().optional(),
						payload: z.record(z.string(), z.json()).optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

type SafeProviderErrorBody = {
	success: false;
	data: null;
	errors?: Array<{
		name?: string;
		message?: string;
		payload?: Record<string, string | number | boolean>;
	}>;
};

// Field names the provider may cite in a validation error: every key of the
// plugin's own input schemas, collected once from the Zod definitions. A field
// path is shown only when each of its segments is one of these keys.
let knownFieldNames: ReadonlySet<string> | undefined;

// `unknown` because Zod definitions are walked structurally across schema kinds.
function collectFieldNames(
	schema: unknown,
	names: Set<string>,
	seen: Set<unknown>,
) {
	if (typeof schema !== 'object' || schema === null || seen.has(schema)) return;
	seen.add(schema);
	// `unknown` because each Zod schema kind keeps different members in its definition.
	const def: unknown = (schema as { _zod?: { def?: unknown } })._zod?.def;
	if (typeof def !== 'object' || def === null) return;
	const members = def as Record<string, unknown>;
	const shape = members.shape;
	if (typeof shape === 'object' && shape !== null) {
		for (const [key, child] of Object.entries(shape)) {
			names.add(key);
			collectFieldNames(child, names, seen);
		}
	}
	for (const key of [
		'innerType',
		'element',
		'valueType',
		'left',
		'right',
		'in',
		'out',
	]) {
		collectFieldNames(members[key], names, seen);
	}
	if (Array.isArray(members.options)) {
		for (const option of members.options)
			collectFieldNames(option, names, seen);
	}
}

function fieldNames(): ReadonlySet<string> {
	if (!knownFieldNames) {
		const names = new Set<string>();
		for (const schema of Object.values(GetProspectOperationInputSchemas)) {
			collectFieldNames(schema, names, new Set());
		}
		knownFieldNames = names;
	}
	return knownFieldNames;
}

/** The field path when every segment is a known input key or an index. */
export function allowlistedField(field: unknown): string | undefined {
	if (typeof field !== 'string' || field.length === 0 || field.length > 200) {
		return undefined;
	}
	const segments = field.split(/[.[\]]/).filter((segment) => segment !== '');
	if (segments.length === 0) return undefined;
	const names = fieldNames();
	return segments.every(
		(segment) => /^\d+$/.test(segment) || names.has(segment),
	)
		? field
		: undefined;
}

const JSON_TYPE_NAMES = new Set([
	'string',
	'number',
	'integer',
	'boolean',
	'array',
	'object',
	'null',
]);

/**
 * A validation message written by the plugin from the error's code and an
 * allowlisted field name. The provider's own message is never forwarded: it
 * can repeat the person or company that was sent ("Jane Doe is not a valid
 * name"), and no pattern can tell a name from the rest of the sentence.
 */
export function validationMessage(
	// Payload members are untrusted provider JSON narrowed one by one here.
	payload: Record<string, unknown> | undefined,
): string {
	const field = allowlistedField(payload?.field);
	const subject = field ?? 'a field';
	const code = SchemaErrorCode.safeParse(payload?.code);
	switch (code.success ? code.data : undefined) {
		case 'unknown_field': {
			const suggestion = allowlistedField(payload?.did_you_mean);
			const problem = field
				? `${field} is not a field of this request`
				: 'the request has a field the API does not accept';
			return suggestion ? `${problem} (did you mean ${suggestion}?)` : problem;
		}
		case 'conflicting_fields':
			return `${subject} conflicts with another field in this request`;
		case 'missing_field':
			return `${subject} is required`;
		case 'wrong_type': {
			const type = payload?.received_type;
			return `${subject} has the wrong type${
				typeof type === 'string' && JSON_TYPE_NAMES.has(type)
					? ` (got ${type})`
					: ''
			}`;
		}
		case 'value_not_allowed':
			return `${subject} has a value that is not allowed`;
		case 'out_of_range':
			return `${subject} is out of range`;
		case 'invalid_format':
			return `${subject} has an invalid format`;
		case 'invalid_value':
			return `${subject} has an invalid value`;
		default:
			return field ? `${field} is not valid` : 'the request failed validation';
	}
}

// `unknown` because ApiError bodies contain untrusted provider JSON that must be whitelisted before exposure.
function safeProviderErrorBody(
	body: unknown,
): SafeProviderErrorBody | undefined {
	const parsed = ProviderErrorEnvelopeSchema.safeParse(body);
	if (!parsed.success || !parsed.data.errors) return undefined;
	const errors = parsed.data.errors.map((providerError) => {
		const safeError: NonNullable<SafeProviderErrorBody['errors']>[number] = {};
		const name = SchemaErrorName.safeParse(providerError.name);
		if (name.success) safeError.name = name.data;
		if (safeError.name === 'VALIDATION_ERROR') {
			safeError.message = validationMessage(providerError.payload);
		}
		const providerPayload = providerError.payload;
		if (providerPayload) {
			const safePayload: Record<string, string | number | boolean> = {};
			const code = SchemaErrorCode.safeParse(providerPayload.code);
			if (code.success) safePayload.code = code.data;
			for (const key of [
				'needed',
				'remaining',
				'limit',
				'reset_seconds',
				'needed_usd',
				'available_usd',
			]) {
				const value = providerPayload[key];
				if (typeof value === 'number' && Number.isFinite(value)) {
					safePayload[key] = value;
				}
			}
			if (
				typeof providerPayload.bucket === 'string' &&
				['search', 'enrich', 'email', 'jobs', 'poll'].includes(
					providerPayload.bucket,
				)
			) {
				safePayload.bucket = providerPayload.bucket;
			}
			if (
				typeof providerPayload.window === 'string' &&
				['minute', 'day'].includes(providerPayload.window)
			) {
				safePayload.window = providerPayload.window;
			}
			if (Object.keys(safePayload).length > 0) safeError.payload = safePayload;
		}
		return safeError;
	});
	return { success: false, data: null, errors };
}

function safeApiError(
	error: ApiError,
	method: NonNullable<GetProspectRequestOptions['method']>,
): ApiError {
	const body = safeProviderErrorBody(error.body);
	const firstError = body?.errors?.[0];
	const errorCode = firstError?.payload?.code;
	const errorKind =
		firstError?.name && errorCode
			? `${firstError.name} (${errorCode})`
			: firstError?.name;
	const providerMessage = firstError?.message
		? `${errorKind}: ${firstError.message}`
		: errorKind;
	const safeRequest: ApiRequestOptions = {
		method,
		url: '/v2/[redacted]',
	};
	const safeResponse: ApiResult = {
		url: `${GETPROSPECT_API_BASE}/v2/`,
		ok: false,
		status: error.status,
		statusText: '',
		body,
	};
	return new ApiError(
		safeRequest,
		safeResponse,
		providerMessage
			? `GetProspect request failed (HTTP ${error.status}): ${providerMessage}`
			: `GetProspect request failed (HTTP ${error.status})`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export async function makeGetProspectRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: GetProspectRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, timeout = 20_000 } = options;
	if (apiKey === undefined || apiKey.length === 0) {
		throw new AuthMissingError('getprospect', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: GETPROSPECT_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: Math.min(Math.max(timeout, 1_000), 95_000),
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			...headers,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// `unknown` because JavaScript can throw any value; narrow to ApiError before reading provider fields.
		// Core ApiError retains body and request details, which may contain prospect PII.
		if (error instanceof ApiError) throw safeApiError(error, method);
		// Network errors may include full URLs or transport details; expose only a safe summary.
		throw new Error('GetProspect request failed');
	}
}
