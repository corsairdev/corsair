import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class RunpodAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'RunpodAPIError';
	}
}

const RUNPOD_REST_V1 = 'https://rest.runpod.io/v1';
const RUNPOD_API = 'https://api.runpod.io';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

type GraphqlError = { message?: string };
type GraphqlPayload<T> = {
	data?: T;
	errors?: GraphqlError[];
};

type ErrorBody = {
	detail?: string;
	title?: string;
	message?: string;
	errors?: GraphqlError[];
};

export type RunpodGraphqlVariables = {
	[key: string]:
		| string
		| number
		| boolean
		| null
		| undefined
		| string[]
		| RunpodGraphqlVariables
		| RunpodGraphqlVariables[];
};

function extractErrorMessage(
	body: ErrorBody | string | null | undefined,
): string | undefined {
	if (typeof body === 'string' && body) return body;
	if (typeof body !== 'object' || body === null) return undefined;
	if (typeof body.detail === 'string' && body.detail) return body.detail;
	if (typeof body.title === 'string' && body.title) return body.title;
	if (typeof body.message === 'string' && body.message) return body.message;
	const first = body.errors?.[0]?.message;
	return typeof first === 'string' && first ? first : undefined;
}

function wrapTransportError(error: ApiError | Error | object): never {
	if (error instanceof ApiError) {
		throw new RunpodAPIError(
			extractErrorMessage(error.body) || error.message,
			undefined,
			error.status,
			error.retryAfter,
		);
	}
	if (error instanceof Error) {
		throw new RunpodAPIError(error.message);
	}
	throw new RunpodAPIError('Unknown RunPod API error');
}

export async function makeRunpodRequest<T>(
	base: 'v1' | 'v2',
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: RunpodGraphqlVariables;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const writes = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: base === 'v1' ? RUNPOD_REST_V1 : RUNPOD_API,
		VERSION: base === 'v1' ? '1.0.0' : '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: writes ? body : undefined,
		mediaType: writes ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError || error instanceof Error) {
			wrapTransportError(error);
		}
		throw new RunpodAPIError('Unknown RunPod API error');
	}
}

export async function makeRunpodGraphql<T>(
	apiKey: string,
	query: string,
	variables?: RunpodGraphqlVariables,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: RUNPOD_API,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '/graphql',
		body: { query, variables },
		mediaType: 'application/json; charset=utf-8',
		query: { api_key: apiKey },
	};

	let payload: GraphqlPayload<T>;
	try {
		payload = await request<GraphqlPayload<T>>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError || error instanceof Error) {
			wrapTransportError(error);
		}
		throw new RunpodAPIError('Unknown RunPod API error');
	}

	const graphqlError = payload.errors?.[0]?.message;
	if (graphqlError) {
		throw new RunpodAPIError(graphqlError);
	}
	if (payload.data === undefined) {
		throw new RunpodAPIError('RunPod GraphQL response missing data');
	}
	return payload.data;
}
