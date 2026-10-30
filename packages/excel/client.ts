import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ExcelAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly code?: string;
	public readonly innerCode?: string;
	// Graph error bodies are objects, strings, or omitted.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly method?: ExcelRequestOptions['method'];

	constructor(
		message: string,
		options: {
			cause?: Error;
			// Same untyped failure body as the field above.
			body?: unknown;
			method?: ExcelRequestOptions['method'];
			status?: number;
			statusText?: string;
			code?: string;
			innerCode?: string;
			retryAfter?: number;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ExcelAPIError';
		this.body = options.body;
		this.method = options.method;
		this.status = options.status;
		this.statusText = options.statusText;
		this.code = options.code;
		this.innerCode = options.innerCode;
		this.retryAfter = options.retryAfter;
	}
}

// https://learn.microsoft.com/en-us/graph/api/resources/excel?view=graph-rest-1.0
export const EXCEL_API_BASE = 'https://graph.microsoft.com/v1.0';

export const XLSX_MEDIA_TYPE =
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Workbook calls regularly outlive the shared 20s default.
const EXCEL_TIMEOUT_MS = 120_000;

const EXCEL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type ExcelQueryValue = string | number | boolean | undefined;

export type ExcelRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: object | Blob;
	query?: Record<string, ExcelQueryValue>;
	headers?: Record<string, string>;
	mediaType?: string;
};

type GraphErrorFields = {
	code?: string;
	innerCode?: string;
	message?: string;
};

function stringField(record: object, key: string): string | undefined {
	const value = Object.entries(record).find(
		([entryKey]) => entryKey === key,
	)?.[1];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// body.error is an object on Graph, which the shared client stringifies as
// "[object Object]". Read code and message off the object instead.
function graphErrorFields(body: unknown): GraphErrorFields {
	if (body === null || typeof body !== 'object' || !('error' in body)) {
		return {};
	}
	const error = body.error;
	if (typeof error === 'string') {
		return { message: error };
	}
	if (error === null || typeof error !== 'object') {
		return {};
	}
	const code = stringField(error, 'code');
	const message = stringField(error, 'message');
	let innerCode: string | undefined;
	if ('innerError' in error) {
		const inner = error.innerError;
		if (inner !== null && typeof inner === 'object') {
			innerCode = stringField(inner, 'code');
		}
	}
	return { code, message, innerCode };
}

function definedQuery(
	query: Record<string, ExcelQueryValue> | undefined,
): Record<string, ExcelQueryValue> | undefined {
	if (query === undefined) {
		return undefined;
	}
	const entries = Object.entries(query).filter(
		([, value]) => value !== undefined,
	);
	if (entries.length === 0) {
		return undefined;
	}
	return Object.fromEntries(entries);
}

export async function makeExcelRequest<T>(
	endpoint: string,
	token: string,
	options: ExcelRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, headers, mediaType } = options;
	const config: OpenAPIConfig = {
		BASE: EXCEL_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: EXCEL_TIMEOUT_MS,
		TOKEN: token,
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: definedQuery(options.query),
		headers,
		body,
		mediaType:
			mediaType ??
			(body !== undefined && !(body instanceof Blob)
				? 'application/json'
				: undefined),
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: EXCEL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const parsed = graphErrorFields(error.body);
			const fallback =
				error.message && error.message !== '[object Object]'
					? error.message
					: undefined;
			const detail = [parsed.code, parsed.message ?? fallback]
				.filter((part): part is string => part !== undefined && part.length > 0)
				.join(': ');
			throw new ExcelAPIError(detail || 'Excel request failed', {
				cause: error,
				body: error.body,
				method,
				status: error.status,
				statusText: error.statusText,
				code: parsed.code,
				innerCode: parsed.innerCode,
				retryAfter: error.retryAfter,
			});
		}
		if (error instanceof Error) {
			throw new ExcelAPIError(error.message, { cause: error, method });
		}
		throw new ExcelAPIError('Unknown Excel error', { method });
	}
}
