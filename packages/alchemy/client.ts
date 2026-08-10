import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AlchemyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly code?: number;
	public readonly data?: unknown;

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
		}
	}
}

export type AlchemyNetwork =
	| 'eth-mainnet'
	| 'eth-sepolia'
	| 'polygon-mainnet'
	| 'arb-mainnet'
	| 'opt-mainnet'
	| 'base-mainnet'
	| string;

export function getAlchemyBaseUrl(network: string = 'eth-mainnet'): string {
	return `https://${network}.g.alchemy.com`;
}

type JsonRpcResponse<T> = {
	jsonrpc: string;
	id: number | string;
	result?: T;
	error?: {
		code: number;
		message: string;
		data?: unknown;
	};
};

export async function makeAlchemyJsonRpcRequest<T>(
	network: string = 'eth-mainnet',
	apiKey: string,
	method: string,
	params: unknown[] = [],
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: getAlchemyBaseUrl(network),
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/v2/${apiKey}`,
		body: {
			jsonrpc: '2.0',
			id: 1,
			method,
			params,
		},
	};

	try {
		const response = await request<JsonRpcResponse<T>>(config, requestOptions);

		if (response.error) {
			throw new AlchemyAPIError(response.error.message, {
				code: response.error.code,
				data: response.error.data,
				status: 400, // JSON-RPC errors are usually returned with 200 OK by Alchemy, but represent a bad request logic
			});
		}

		return response.result as T;
	} catch (error) {
		if (error instanceof AlchemyAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw new AlchemyAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new AlchemyAPIError(error.message, { cause: error });
		}
		throw new AlchemyAPIError('Unknown error');
	}
}

export async function makeAlchemyRestRequest<T>(
	network: string = 'eth-mainnet',
	apiKey: string,
	path: string, // e.g. /nft/v3/...
	query?: Record<string, string | number | boolean | Array<string> | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: getAlchemyBaseUrl(network),
		VERSION: '3.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const endpoint = path.includes('{apiKey}')
		? path.replace('{apiKey}', apiKey)
		: `${path}/${apiKey}`;

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AlchemyAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new AlchemyAPIError(error.message, { cause: error });
		}
		throw new AlchemyAPIError('Unknown error');
	}
}
