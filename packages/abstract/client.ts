import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AbstractAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AbstractAPIError';

		// Preserve ApiError properties so error handlers can inspect status codes
		// and rate-limit headers without needing instanceof ApiError checks.
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

/**
 * Abstract API is split across a dedicated subdomain per product, each with
 * its own `/v1` root (e.g. `emailreputation.abstractapi.com/v1`). A single
 * API key is scoped per-product from the Abstract dashboard, but every
 * product shares the same request shape: GET with `api_key` + params passed
 * as query string.
 *
 * Note: Abstract's standalone "Email Validation" product isn't included
 * here — it isn't available on the account this plugin was built against,
 * so email validation is served from the Email Reputation API instead
 * (see endpoints/email-validation.ts).
 */
export const ABSTRACT_API_HOSTS = {
	emailReputation: 'https://emailreputation.abstractapi.com/v1',
	vat: 'https://vat.abstractapi.com/v1',
	ibanValidation: 'https://ibanvalidation.abstractapi.com/v1',
} as const;

export type AbstractAPIHost = keyof typeof ABSTRACT_API_HOSTS;

/**
 * Performs a request against a given Abstract API product.
 *
 * Auth: API key passed as the `api_key` query parameter (the only supported
 * method — Abstract does not accept bearer tokens or auth headers). All
 * currently-supported endpoints are GET-only.
 */
export async function makeAbstractRequest<T>(
	host: AbstractAPIHost,
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { query = {} } = options;

	const config: OpenAPIConfig = {
		BASE: ABSTRACT_API_HOSTS[host],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	// Abstract API authenticates via the `api_key` query parameter
	const queryWithAuth: Record<string, string | number | boolean | undefined> = {
		...query,
		api_key: apiKey,
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: queryWithAuth,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AbstractAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new AbstractAPIError(error.message, undefined, { cause: error });
		}
		throw new AbstractAPIError('Unknown error');
	}
}
