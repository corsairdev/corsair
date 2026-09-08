import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error class for Beaconchain API errors.
 * Wraps API errors with additional context like status, statusText, body, and retryAfter.
 */
export class BeaconchainAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'BeaconchainAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export type BeaconchainChain = 'mainnet' | 'hoodi';

const V1_BASE = {
	mainnet: 'https://beaconcha.in/api/v1',
	hoodi: 'https://hoodi.beaconcha.in/api/v1',
} as const;

const ORIGIN = {
	mainnet: 'https://beaconcha.in',
	hoodi: 'https://hoodi.beaconcha.in',
} as const;

const V2_BASE = 'https://beaconcha.in/api/v2';

/**
 * Validates and returns the Beaconchain API key.
 * @param key - The API key to validate
 * @returns The validated API key
 * @throws AuthMissingError if key is undefined or empty
 */
export function requireBeaconchainKey(key: string | undefined): string {
	if (!key) {
		throw new AuthMissingError('beaconchain', 'api_key');
	}
	return key;
}

/**
 * Builds the request body for Beaconchain V2 API calls.
 * @param input - Input parameters including chain, cursor, and page_size
 * @param extra - Additional properties to include in the body
 * @returns Formatted request body with chain, pagination, and extra fields
 */
export function v2Body(
	input: { chain?: BeaconchainChain; cursor?: string; page_size?: number },
	extra: Record<string, unknown> = {},
): Record<string, unknown> {
	return {
		chain: input.chain ?? 'mainnet',
		...extra,
		...(input.cursor !== undefined ? { cursor: input.cursor } : {}),
		...(input.page_size !== undefined ? { page_size: input.page_size } : {}),
	};
}

/**
 * Builds request options for Beaconchain V1 API GET calls.
 * @param chain - Optional chain (mainnet or hoodi)
 * @param extra - Additional options including query parameters
 * @returns Request options with GET method and optional chain/query
 */
export function v1GetOptions(
	chain?: BeaconchainChain,
	extra: { query?: Record<string, string | number | boolean | undefined> } = {},
) {
	return {
		method: 'GET' as const,
		...(extra.query ? { query: extra.query } : {}),
		...(chain ? { chain } : {}),
	};
}

interface MakeRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	chain?: BeaconchainChain;
	auth: 'v1' | 'v2';
	base?: string;
}

async function makeRequest<T>(
	endpoint: string,
	apiKey: string,
	options: MakeRequestOptions,
): Promise<T> {
	const { method = 'GET', body, query, auth } = options;
	const baseUrl =
		options.base ??
		(auth === 'v1' ? V1_BASE[options.chain ?? 'mainnet'] : V2_BASE);

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: auth === 'v1' ? '1.0.0' : '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: auth === 'v2' ? apiKey : undefined,
		HEADERS:
			auth === 'v1'
				? {
						apikey: apiKey,
						'Content-Type': 'application/json',
					}
				: {
						'Content-Type': 'application/json',
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BeaconchainAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new BeaconchainAPIError(error.message, { cause: error });
		}
		throw new BeaconchainAPIError('Unknown error');
	}
}

/**
 * Makes a request to the Beaconchain V1 API.
 * @param endpoint - API endpoint path (e.g., 'validator/123')
 * @param apiKey - API key for authentication (sent as apikey header)
 * @param options - Request options (method, body, query, chain)
 * @returns Parsed API response
 * @throws BeaconchainAPIError on API errors
 */
export async function makeBeaconchainV1Request<T>(
	endpoint: string,
	apiKey: string,
	options: Omit<MakeRequestOptions, 'auth' | 'base'> = {},
): Promise<T> {
	return makeRequest<T>(endpoint, apiKey, {
		...options,
		method: options.method ?? 'GET',
		auth: 'v1',
	});
}

/**
 * Makes a request to the Beaconchain V2 API.
 * @param endpoint - API endpoint path (e.g., 'ethereum/validators')
 * @param apiKey - API key for authentication (sent as Bearer token)
 * @param options - Request options (method, body, query, chain)
 * @returns Parsed API response
 * @throws BeaconchainAPIError on API errors
 */
export async function makeBeaconchainV2Request<T>(
	endpoint: string,
	apiKey: string,
	options: Omit<MakeRequestOptions, 'auth' | 'base'> = {},
): Promise<T> {
	return makeRequest<T>(endpoint, apiKey, {
		...options,
		method: options.method ?? 'POST',
		auth: 'v2',
	});
}

/**
 * Makes a health check request to the Beaconchain API.
 * @param apiKey - API key for authentication
 * @param chain - Chain to check (mainnet or hoodi), defaults to mainnet
 * @returns Health check response as string
 * @throws BeaconchainAPIError on API errors
 */
export async function makeBeaconchainHealthRequest(
	apiKey: string,
	chain: BeaconchainChain = 'mainnet',
): Promise<string> {
	const raw = await makeRequest<unknown>('api/healthz', apiKey, {
		method: 'GET',
		auth: 'v1',
		base: ORIGIN[chain],
		chain,
	});
	return typeof raw === 'string' ? raw : JSON.stringify(raw);
}
