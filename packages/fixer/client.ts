import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FixerAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly retryAfter?: number;
	public readonly apiCode?: number;
	public readonly apiType?: string;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			apiCode?: number;
			apiType?: string;
		},
	) {
		super(message, options);
		this.name = 'FixerAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.retryAfter = options.cause.retryAfter;
		}
		this.apiCode = options?.apiCode;
		this.apiType = options?.apiType;
	}
}

/**
 * https://docs.apilayer.com/fixer/docs/api-documentation?utm_source=FixerHomePage&utm_medium=Referral
 * Auth is the `access_key` query parameter — Fixer does not accept it as a
 * header. HTTPS is only available on paid plans; free-tier keys must use
 * `http://data.fixer.io/api` instead.
 */
export const FIXER_API_BASE = 'https://data.fixer.io/api';

interface FixerErrorBody {
	success: false;
	error: {
		code: number;
		type: string;
		info?: string;
	};
}

function isFixerErrorBody(value: unknown): value is FixerErrorBody {
	if (typeof value !== 'object' || value === null) return false;
	const { success, error } = value as { success?: unknown; error?: unknown };
	if (success !== false || typeof error !== 'object' || error === null) {
		return false;
	}
	const { code, type, info } = error as {
		code?: unknown;
		type?: unknown;
		info?: unknown;
	};
	return (
		typeof code === 'number' &&
		typeof type === 'string' &&
		(info === undefined || typeof info === 'string')
	);
}

function buildConfig(): OpenAPIConfig {
	return {
		BASE: FIXER_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {},
	};
}

/**
 * GET https://data.fixer.io/api/{path}
 * Fixer responds with `{ success: false, error: { code, type, info } }`
 * (HTTP 200) for plan/business errors (invalid key, rate limit, restricted
 * base currency, ...), and ordinary HTTP error statuses for transport-level
 * failures.
 */
export async function fixerGet<T>(
	path: string,
	apiKey: string,
	query: Record<string, string | undefined>,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		mediaType: 'application/json; charset=utf-8',
		query: { ...query, access_key: apiKey },
	};

	let body: unknown;
	try {
		body = await request<unknown>(buildConfig(), requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new FixerAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new FixerAPIError(error.message, { cause: error });
		}
		throw new FixerAPIError('Unknown error');
	}

	if (isFixerErrorBody(body)) {
		throw new FixerAPIError(body.error.info ?? body.error.type, {
			apiCode: body.error.code,
			apiType: body.error.type,
		});
	}

	return body as T;
}

/** Fixer expects comma-separated, uppercase ISO 4217 codes. */
export function joinSymbols(symbols?: string[]): string | undefined {
	if (!symbols || symbols.length === 0) {
		return undefined;
	}
	return symbols.map((symbol) => symbol.toUpperCase()).join(',');
}

export const FIXER_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
