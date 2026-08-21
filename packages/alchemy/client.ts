import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AlchemyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly code?: number;
	public readonly data?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			body?: unknown;
			code?: number;
			data?: unknown;
		},
	) {
		super(message, { cause: options?.cause });
		this.name = 'AlchemyAPIError';
		this.status = options?.status;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.code = options?.code;
		this.data = options?.data;

		if (options?.cause instanceof ApiError) {
			this.status = this.status ?? options.cause.status;
			this.statusText = this.statusText ?? options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/** Hostname-safe Alchemy network labels (no dots/slashes — prevents credential redirect). */
export const ALCHEMY_NETWORKS = [
	'eth-mainnet',
	'eth-sepolia',
	'polygon-mainnet',
	'polygon-amoy',
	'arb-mainnet',
	'arb-sepolia',
	'opt-mainnet',
	'opt-sepolia',
	'base-mainnet',
	'base-sepolia',
	'bnb-mainnet',
	'avax-mainnet',
	'zksync-mainnet',
	'worldchain-mainnet',
	'solana-mainnet',
	'solana-devnet',
] as const;

export type AlchemyNetwork = (typeof ALCHEMY_NETWORKS)[number];

const NETWORK_SET = new Set<string>(ALCHEMY_NETWORKS);

/** Hostname-safe label: lowercase alphanumerics + hyphens only (no dots/slashes). */
const NETWORK_LABEL = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Reject anything that is not a known Alchemy network label. */
export function assertAlchemyNetwork(network: string): AlchemyNetwork {
	if (!NETWORK_LABEL.test(network) || !NETWORK_SET.has(network)) {
		throw new AlchemyAPIError(
			`Unsupported Alchemy network "${network}". Allowed: ${ALCHEMY_NETWORKS.join(', ')}`,
			{ status: 400 },
		);
	}
	return network as AlchemyNetwork;
}

export function getAlchemyBaseUrl(network: string = 'eth-mainnet'): string {
	const safe = assertAlchemyNetwork(network);
	return `https://${safe}.g.alchemy.com`;
}

export const ALCHEMY_PRICES_BASE = 'https://api.g.alchemy.com/prices/v1';
export const ALCHEMY_DATA_BASE = 'https://api.g.alchemy.com/data/v1';

type JsonRpcResponse<T> = {
	jsonrpc: string;
	id: number | string;
	result?: T;
	error?: { code: number; message: string; data?: unknown };
};

function wrapError(error: unknown): never {
	if (error instanceof AlchemyAPIError) throw error;
	if (error instanceof ApiError) {
		throw new AlchemyAPIError(error.message, { cause: error });
	}
	if (error instanceof Error) {
		throw new AlchemyAPIError(error.message, { cause: error });
	}
	throw new AlchemyAPIError('Unknown Alchemy error');
}

function chainConfig(base: string): OpenAPIConfig {
	return {
		BASE: base,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: { 'Content-Type': 'application/json' },
	};
}

export async function makeAlchemyJsonRpcRequest<T>(
	network: string,
	apiKey: string,
	method: string,
	params: unknown[] = [],
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/v2/${apiKey}`,
		body: { jsonrpc: '2.0', id: 1, method, params },
	};

	try {
		const response = await request<JsonRpcResponse<T>>(
			chainConfig(getAlchemyBaseUrl(network)),
			requestOptions,
		);
		if (response.error) {
			throw new AlchemyAPIError(response.error.message, {
				code: response.error.code,
				data: response.error.data,
				status: 400,
			});
		}
		return response.result as T;
	} catch (error) {
		wrapError(error);
	}
}

export async function makeAlchemyNftRequest<T>(
	network: string,
	apiKey: string,
	method: string,
	query?: Record<string, unknown>,
	options?: { method?: 'GET' | 'POST'; body?: unknown },
): Promise<T> {
	const httpMethod = options?.method ?? 'GET';
	const requestOptions: ApiRequestOptions = {
		method: httpMethod,
		url: `/nft/v3/${apiKey}/${method}`,
		query: httpMethod === 'GET' ? query : undefined,
		body: httpMethod === 'POST' ? (options?.body ?? query) : undefined,
	};

	try {
		return await request<T>(
			chainConfig(getAlchemyBaseUrl(network)),
			requestOptions,
		);
	} catch (error) {
		wrapError(error);
	}
}

export async function makeAlchemyPricesRequest<T>(
	apiKey: string,
	path: string,
	options?: {
		method?: 'GET' | 'POST';
		query?: Record<string, unknown>;
		body?: unknown;
	},
): Promise<T> {
	const httpMethod = options?.method ?? 'GET';
	const requestOptions: ApiRequestOptions = {
		method: httpMethod,
		url: `/${apiKey}${path}`,
		query: options?.query,
		body: options?.body,
	};

	try {
		return await request<T>(chainConfig(ALCHEMY_PRICES_BASE), requestOptions);
	} catch (error) {
		wrapError(error);
	}
}

export async function makeAlchemyDataRequest<T>(
	apiKey: string,
	path: string,
	body: unknown,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/${apiKey}${path}`,
		body,
	};

	try {
		return await request<T>(chainConfig(ALCHEMY_DATA_BASE), requestOptions);
	} catch (error) {
		wrapError(error);
	}
}
