import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class MarketstackAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	/** Raw Marketstack JSON body; narrowed only after isMarketstackErrorBody. */
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly apiCode?: string;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			apiCode?: string;
		},
	) {
		super(message, options);
		this.name = 'MarketstackAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
		this.apiCode = options?.apiCode;
	}
}

// HTTPS only — marketstack's access_key is sent as a query parameter on every
// request, so this must never be requested over plain HTTP. HTTPS is available
// on every marketstack plan, including free.
//
// v2, not v1 — v1 is deprecated; newly issued access keys target v2, and v2
// changes the wire shape of a few endpoints (ticker listing moves to
// /tickerslist and keys results by `ticker` instead of `symbol`, ticker-scoped
// EOD nests bars under `data.eod`, and single-exchange lookups wrap the
// exchange in a `data` envelope). Those endpoints remap the v2 response back
// onto this plugin's stable output shape — see endpoints/tickers.ts and
// endpoints/exchanges.ts.
export const MARKETSTACK_API_BASE = 'https://api.marketstack.com/v2';

const NO_DEK_ERROR_PATTERN = /no dek found/i;

export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

export function joinSymbols(symbols: string[] | string): string {
	return Array.isArray(symbols) ? symbols.join(',') : symbols;
}

interface MarketstackErrorBody {
	error: {
		code: string;
		message: string;
		context?: unknown;
	};
}

function isMarketstackErrorBody(value: unknown): value is MarketstackErrorBody {
	if (typeof value !== 'object' || value === null) return false;
	const { error } = value as { error?: unknown };
	if (typeof error !== 'object' || error === null) return false;
	const { code, message } = error as { code?: unknown; message?: unknown };
	return typeof code === 'string' && typeof message === 'string';
}

export async function makeMarketstackRequest<T>(
	endpoint: string,
	accessKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { query = {} } = options;

	const config: OpenAPIConfig = {
		BASE: MARKETSTACK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const queryWithAuth: Record<string, string | number | boolean | undefined> = {
		...query,
		access_key: accessKey,
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: queryWithAuth,
	};

	let raw: T | MarketstackErrorBody;
	try {
		raw = await request<T | MarketstackErrorBody>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new MarketstackAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new MarketstackAPIError(error.message, { cause: error });
		}
		throw new MarketstackAPIError('Unknown error');
	}

	if (isMarketstackErrorBody(raw)) {
		throw new MarketstackAPIError(raw.error.message, {
			apiCode: raw.error.code,
		});
	}

	return raw;
}
