import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class StormglassAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(message, options);
		this.name = 'StormglassAPIError';
		this.status = options?.status ?? code;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
	}
}

const STORMGLASS_API_BASE = 'https://api.stormglass.io/v2';

export type StormglassQueryValue = string | number | boolean | undefined;

export type StormglassRequestQuery = Record<string, StormglassQueryValue>;

function compactQuery(
	query: StormglassRequestQuery | undefined,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Performs a request against the Stormglass API.
 *
 * Auth: the raw API key is sent as-is in the `Authorization` header
 * (no `Bearer` prefix). Docs: https://docs.stormglass.io/#/
 */
export async function makeStormglassRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: StormglassRequestQuery;
	} = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: STORMGLASS_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: compactQuery(options.query),
		mediaType: 'application/json',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new StormglassAPIError(error.message, error.status, {
				cause: error,
				status: error.status,
				statusText: error.statusText,
				body: error.body,
				retryAfter: error.retryAfter,
			});
		}
		if (error instanceof Error) {
			throw new StormglassAPIError(error.message, undefined, { cause: error });
		}
		throw new StormglassAPIError('Unknown Stormglass API error');
	}
}
