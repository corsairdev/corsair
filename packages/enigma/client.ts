import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const ENIGMA_API_BASE = 'https://api.enigma.com';
const ENIGMA_GRAPHQL_PATH = '/graphql';
// CloudFront refuses POST /graphql/ (trailing slash) with a 403 HTML page, so
// the path stays out of BASE: request() joins BASE and url with a slash.
export const ENIGMA_API_URL = `${ENIGMA_API_BASE}${ENIGMA_GRAPHQL_PATH}`;

export type EnigmaGraphQLRequest = {
	query: string;
	// unknown: GraphQL variables are arbitrary JSON per query.
	variables?: Record<string, unknown>;
};

// unknown: error bodies are the GraphQL errors array, a REST body, or HTML.
function readMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	const errors = Array.isArray(record?.errors) ? record.errors : undefined;
	const first = errors ? asRecord(errors[0]) : undefined;
	const graphQLMessage = first?.message;
	if (typeof graphQLMessage === 'string' && graphQLMessage.length > 0) {
		return graphQLMessage;
	}
	// Enigma's gateway answers 401/402 with { error_message, error_code, retryable }.
	const gatewayMessage = record?.error_message;
	if (typeof gatewayMessage === 'string' && gatewayMessage.length > 0) {
		return gatewayMessage;
	}
	const statusMessage = record?.message;
	if (typeof statusMessage === 'string' && statusMessage.length > 0) {
		return statusMessage;
	}
	const detail = record?.detail;
	if (typeof detail === 'string' && detail.length > 0) return detail;
	return undefined;
}

export function describeEnigmaError(
	status: number | undefined,
	// unknown: any error body shape until readMessage narrows it.
	body: unknown,
	fallback: string,
): string {
	const text = readMessage(body) ?? fallback;
	const label = status === undefined ? 'Enigma' : `Enigma ${status}`;
	return `${label}: ${text}`;
}

export class EnigmaAPIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;
	// unknown: the raw error body, an HTML page when a proxy answers.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'EnigmaAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

const ENIGMA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

// unknown: callers parse data with the endpoint's zod output schema.
export async function makeEnigmaRequest(
	apiKey: string,
	{ query, variables }: EnigmaGraphQLRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: ENIGMA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'x-api-key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: ENIGMA_GRAPHQL_PATH,
		body: { query, variables },
		mediaType: 'application/json',
	};

	try {
		// unknown: a GraphQL transport answer: { data?, errors? }.
		const body: unknown = await request<unknown>(config, requestOptions, {
			rateLimitConfig: ENIGMA_RATE_LIMIT_CONFIG,
		});
		const record = asRecord(body);
		const errors = Array.isArray(record?.errors) ? record.errors : [];
		if (errors.length > 0) {
			throw new EnigmaAPIError(
				describeEnigmaError(200, body, 'GraphQL request failed'),
				{ body },
			);
		}
		if (!record?.data) {
			throw new EnigmaAPIError('Enigma: response has no data field', { body });
		}
		return record.data;
	} catch (error) {
		if (error instanceof EnigmaAPIError) throw error;
		if (error instanceof ApiError) {
			throw new EnigmaAPIError(
				describeEnigmaError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		if (error instanceof Error || error instanceof DOMException) {
			throw new EnigmaAPIError(error.message, { cause: error });
		}
		throw new EnigmaAPIError('Unknown Enigma error');
	}
}

// unknown: search returns [SearchUnion]; the endpoint picks the typed entity.
export function firstSearchResult(data: unknown): unknown {
	const record = asRecord(data);
	const search = record?.search;
	if (!Array.isArray(search)) {
		throw new EnigmaAPIError(
			'Enigma: search field is missing or not an array',
			{
				body: data,
			},
		);
	}
	return search.find((entry) => entry !== null && entry !== undefined) ?? null;
}
