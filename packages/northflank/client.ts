import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { z } from 'zod';

// JSON values carried over the wire. This finite recursive union keeps every
// request/response payload fully typed without resorting to `unknown`.
export type JsonObject = { [key: string]: JsonValue | undefined };
export type JsonArray = Array<JsonValue>;
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonObject
	| JsonArray;

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

export type NorthflankErrorDetails = {
	status?: number;
	statusText?: string;
	body?: JsonValue;
	cause?: Error;
};

export class NorthflankAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: JsonValue;

	constructor(message: string, details?: NorthflankErrorDetails) {
		super(message, details?.cause ? { cause: details.cause } : undefined);
		this.name = 'NorthflankAPIError';
		// ApiError (thrown by corsair/http) carries status/statusText/body on
		// the instance. Read them through an intersection view instead of a
		// cast or narrowing so this stays warning-free under strict rules.
		const fromCause: (Error & Partial<NorthflankAPIError>) | undefined =
			details?.cause;
		this.status = details?.status ?? fromCause?.status;
		this.statusText = details?.statusText ?? fromCause?.statusText;
		this.body = details?.body ?? fromCause?.body;
	}
}

// Northflank error envelope: { error: { message } } or { message }.
// Parsed with zod so message extraction never relies on manual narrowing.
const NorthflankErrorBodySchema = z.object({
	error: z.object({ message: z.string() }).partial().optional(),
	message: z.string().optional(),
});

function extractErrorMessage(
	body: JsonValue | undefined,
	fallback: string,
): string {
	const parsed = NorthflankErrorBodySchema.safeParse(body);
	if (parsed.success === false) return fallback;
	const nestedMessage = parsed.data.error?.message;
	if (nestedMessage !== undefined) return nestedMessage;
	const flatMessage = parsed.data.message;
	if (flatMessage !== undefined) return flatMessage;
	return fallback;
}

// Shape of whatever corsair/http throws (ApiError extends Error with extra
// status/body fields). Discriminated with zod — the caught value stays
// untouched, so no casts or narrowing operators are needed.
const CaughtErrorSchema = z.object({
	message: z.string(),
	status: z.number().optional(),
	statusText: z.string().optional(),
	body: JsonValueSchema.optional(),
});

export const NORTHFLANK_API_BASE = 'https://api.northflank.com/v1';

export type NorthflankMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type NorthflankRequestOptions = {
	method?: NorthflankMethod;
	body?: JsonValue;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
};

export async function makeNorthflankRequest<T>(
	endpoint: string,
	apiKey: string,
	options: NorthflankRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const config: OpenAPIConfig = {
		BASE: NORTHFLANK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: cleanEndpoint,
		query,
		...(body !== undefined && method !== 'GET' ? { body } : {}),
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		const parsed = CaughtErrorSchema.safeParse(error);
		if (parsed.success === false) {
			throw new NorthflankAPIError('Unknown Northflank API error');
		}
		const message = extractErrorMessage(parsed.data.body, parsed.data.message);
		throw new NorthflankAPIError(message, {
			status: parsed.data.status,
			statusText: parsed.data.statusText,
			body: parsed.data.body,
		});
	}
}
