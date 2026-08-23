import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BeaconchainAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BeaconchainAPIError';
	}
}

const BEACONCHAIN_API_V1_BASE = 'https://beaconcha.in/api/v1';
const BEACONCHAIN_API_V2_BASE = 'https://beaconcha.in/api/v2';

interface MakeRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
}

async function makeRequest<T>(
	baseUrl: string,
	endpoint: string,
	apiKey: string,
	options: MakeRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
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
			throw error;
		}
		if (error instanceof Error) {
			throw new BeaconchainAPIError(error.message);
		}
		throw new BeaconchainAPIError('Unknown error');
	}
}

export async function makeBeaconchainV1Request<T>(
	endpoint: string,
	apiKey: string,
	options: MakeRequestOptions = {},
): Promise<T> {
	return makeRequest<T>(BEACONCHAIN_API_V1_BASE, endpoint, apiKey, options);
}

export async function makeBeaconchainV2Request<T>(
	endpoint: string,
	apiKey: string,
	options: MakeRequestOptions = {},
): Promise<T> {
	return makeRequest<T>(BEACONCHAIN_API_V2_BASE, endpoint, apiKey, options);
}

// Legacy function for backward compatibility
export async function makeBeaconchainRequest<T>(
	endpoint: string,
	apiKey: string,
	options: MakeRequestOptions = {},
): Promise<T> {
	// Default to V2 for backward compatibility
	return makeBeaconchainV2Request<T>(endpoint, apiKey, options);
}
