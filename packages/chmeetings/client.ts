import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export class ChMeetingsAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	/** Provider error body when the transport returned JSON. */
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: {
			cause?: Error;
			retryAfter?: number;
			/** Raw provider error payload; shape varies by status. */
			body?: unknown;
		},
	) {
		super(message, options);
		this.name = 'ChMeetingsAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		} else if (code !== undefined) {
			this.status = code;
			this.retryAfter = options?.retryAfter;
			this.body = options?.body;
		}
	}
}

export const CHMEETINGS_API_BASE = 'https://api.chmeetings.com/api/v1';

export type ChMeetingsRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	/** JSON body fields accepted by the official DTO for this route. */
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	responseType?: 'json' | 'empty';
};

export function compactQuery(
	query: Record<string, string | number | boolean | undefined> | undefined,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export function compactBody(
	/** Request body before dropping undefined keys. */
	body: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
	if (!body) return undefined;
	/** Same keys as `body`, without undefined values. */
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

const EnvelopeSchema = z.object({
	status_code: z.union([z.number(), z.string()]).optional(),
	errors: z.array(z.string()).nullable().optional(),
	paging: z
		.object({
			total_count: z.union([z.number(), z.string()]).optional(),
			page: z.union([z.number(), z.string()]).optional(),
			page_size: z.union([z.number(), z.string()]).optional(),
		})
		.optional(),
	/** Resource-specific payload; callers parse with the endpoint schema. */
	data: z.unknown().optional(),
});

/** `raw` is the untyped HTTP JSON body before envelope parse. */
function envelopeErrors(raw: unknown): string {
	const parsed = EnvelopeSchema.safeParse(raw);
	if (!parsed.success || !parsed.data.errors?.length) return '';
	return `: ${parsed.data.errors.join(', ')}`;
}

function envelopeStatus(raw: unknown): number | undefined {
	const parsed = EnvelopeSchema.safeParse(raw);
	if (!parsed.success || parsed.data.status_code == null) return undefined;
	const status = Number(parsed.data.status_code);
	return Number.isFinite(status) ? status : undefined;
}

function isEnvelopeFailure(raw: unknown): boolean {
	const parsed = EnvelopeSchema.safeParse(raw);
	if (!parsed.success) return false;
	if (parsed.data.errors?.length) return true;
	const status = envelopeStatus(raw);
	return status !== undefined && status >= 400;
}

function throwEnvelope(raw: unknown, fallback: string): never {
	throw new ChMeetingsAPIError(
		`${fallback}${envelopeErrors(raw)}`,
		envelopeStatus(raw),
		{
			body: raw,
		},
	);
}

export function unwrapData<T>(
	/** Unparsed HTTP JSON: envelope or bare resource. */
	raw: unknown,
	schema: z.ZodType<T>,
	label: string,
): T {
	const parsed = EnvelopeSchema.safeParse(raw);
	const looksLikeEnvelope =
		parsed.success &&
		raw !== null &&
		typeof raw === 'object' &&
		('data' in raw || 'status_code' in raw || 'errors' in raw);
	if (looksLikeEnvelope) {
		if (isEnvelopeFailure(raw)) throwEnvelope(raw, label);
		if (parsed.data.data == null) {
			throw new ChMeetingsAPIError(`${label} not found`, 404, { body: raw });
		}
		return schema.parse(parsed.data.data);
	}
	return schema.parse(raw);
}

export function unwrapList<T>(
	/** Unparsed list envelope `{ paging, data }`. */
	raw: unknown,
	itemSchema: z.ZodType<T>,
): {
	paging?: {
		total_count?: number | string;
		page?: number | string;
		page_size?: number | string;
	};
	data: T[];
} {
	const parsed = EnvelopeSchema.parse(raw);
	if (isEnvelopeFailure(raw)) throwEnvelope(raw, 'Request failed');
	return {
		paging: parsed.paging,
		data: z.array(itemSchema).parse(parsed.data ?? []),
	};
}

/** `raw` is empty, 204, or a `{ status_code, errors }` envelope. */
export function unwrapEmpty(raw: unknown): { success: true } {
	if (raw == null || raw === '') return { success: true };
	if (isEnvelopeFailure(raw)) throwEnvelope(raw, 'Request failed');
	return { success: true };
}

/**
 * ChMeetings auth is the `apikey` header (OpenAPI security scheme ApiKey).
 * Bearer tokens are rejected.
 */
export async function makeChMeetingsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ChMeetingsRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, responseType = 'json' } = options;
	const urlPath = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const config: OpenAPIConfig = {
		BASE: CHMEETINGS_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			apikey: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: urlPath,
		query: compactQuery(query),
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? compactBody(body)
				: undefined,
		mediaType: 'application/json',
	};

	try {
		const response = await request<T | undefined>(config, requestOptions);
		if (responseType === 'empty') {
			return (response ?? null) as T;
		}
		if (response === undefined && method !== 'GET') {
			return { success: true } as T;
		}
		return response as T;
	} catch (error) {
		if (error instanceof ApiError) {
			if (responseType === 'empty' && error.status === 204) {
				return { success: true } as T;
			}
			throw new ChMeetingsAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new ChMeetingsAPIError(error.message, undefined, { cause: error });
		}
		throw new ChMeetingsAPIError('Unknown error');
	}
}
