import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class EmeliaAPIError extends Error {
	public readonly code?: string;
	public readonly status?: number;
	public readonly statusText?: string;
	// Justification: provider error payloads are undocumented JSON of any shape.
	public readonly body?: unknown;
	public readonly retryAfter?: number | string;

	constructor(message: string, options?: { code?: string; cause?: Error }) {
		super(message, options);
		this.name = 'EmeliaAPIError';
		this.code = options?.code;
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const EMELIA_API_BASE = 'https://graphql.emelia.io';

// REST base verified via docs.emelia.io Introduction (Lists served under
// https://api.emelia.io/lists; campaigns/tools/providers/webhooks share the
// https://api.emelia.io host with path prefixes per endpoint page).
export const EMELIA_REST_BASE = 'https://api.emelia.io';

const EMELIA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

interface GraphQLResponse<T> {
	data?: T;
	errors?: Array<{
		message: string;
		extensions?: { code?: string };
	}>;
}

export async function makeEmeliaRequest<T>(
	query: string,
	apiKey: string,
	// Justification: GraphQL variables are an open JSON map by definition.
	variables?: Record<string, unknown>,
	// Transport retries after a rate-limit response. Queries default to 3;
	// pass 0 for mutations without documented idempotency protection, since
	// a 429 does not prove the first attempt had no side effect.
	maxRetries = 3,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: EMELIA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '/graphql',
		body: {
			query,
			variables: variables ?? {},
		},
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const response = await request<GraphQLResponse<T>>(config, requestOptions, {
			rateLimitConfig: {
				...EMELIA_RATE_LIMIT_CONFIG,
				maxRetries,
			},
		});

		if (response.errors && response.errors.length > 0) {
			const firstError = response.errors[0];
			if (firstError === undefined) {
				throw new EmeliaAPIError('Unknown GraphQL error');
			}
			throw new EmeliaAPIError(firstError.message, {
				code: firstError.extensions?.code,
			});
		}

		if (response.data === undefined || response.data === null) {
			throw new EmeliaAPIError('No data returned from Emelia GraphQL API');
		}

		return response.data;
	} catch (error) {
		if (error instanceof EmeliaAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const bodyDetail =
				error.body == null
					? ''
					: typeof error.body === 'string'
						? error.body
						: JSON.stringify(error.body);
			const message = bodyDetail
				? `${error.statusText || 'API Error'}: ${bodyDetail}`
				: error.statusText || 'Unknown API Error';
			throw new EmeliaAPIError(message, { cause: error });
		}
		if (error instanceof Error) {
			throw new EmeliaAPIError(error.message);
		}
		throw new EmeliaAPIError('Unknown error');
	}
}

export type EmeliaRestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type EmeliaRestOptions = {
	method?: EmeliaRestMethod;
	// Justification: REST JSON bodies are endpoint-specific open objects; zod
	// schemas validate shape before this point.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	// Transport retries after a rate-limit response. Defaults to 3 for GET
	// and 0 otherwise: Emelia documents duplicate protection only for
	// add-to-list contacts, so non-idempotent POST/DELETE operations must
	// not be re-sent blindly (a 429 does not prove the first attempt
	// had no side effect).
	maxRetries?: number;
};

// REST helper for docs.emelia.io endpoints. Auth is a raw API key in the
// `Authorization` header (per Introduction page); no Bearer prefix.
export async function makeEmeliaRestRequest<T>(
	path: string,
	apiKey: string,
	options: EmeliaRestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, maxRetries } = options;
	const effectiveRetries = maxRetries ?? (method === 'GET' ? 3 : 0);

	const config: OpenAPIConfig = {
		BASE: EMELIA_REST_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		// NOTE: DELETE carries a JSON body on legacy Emelia endpoints
		// (blacklist contact, webhook URL), so only GET omits it.
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: {
				...EMELIA_RATE_LIMIT_CONFIG,
				maxRetries: effectiveRetries,
			},
		});
	} catch (error) {
		if (error instanceof EmeliaAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const bodyDetail =
				error.body == null
					? ''
					: typeof error.body === 'string'
						? error.body
						: JSON.stringify(error.body);
			const message = bodyDetail
				? `${error.statusText || 'API Error'}: ${bodyDetail}`
				: error.statusText || 'Unknown API Error';
			throw new EmeliaAPIError(message, { cause: error });
		}
		if (error instanceof Error) {
			throw new EmeliaAPIError(error.message);
		}
		throw new EmeliaAPIError('Unknown error');
	}
}
