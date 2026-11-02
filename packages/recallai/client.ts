import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class RecallaiAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'RecallaiAPIError';
	}
}

export const RECALLAI_API_BASE = 'https://us-west-2.recall.ai';

export const RECALLAI_REGION_BASE_URLS = {
	'us-east-1': 'https://us-east-1.recall.ai',
	'us-west-2': 'https://us-west-2.recall.ai',
	'eu-central-1': 'https://eu-central-1.recall.ai',
	'ap-northeast-1': 'https://ap-northeast-1.recall.ai',
} as const;

export type RecallaiRegion = keyof typeof RECALLAI_REGION_BASE_URLS;

type RecallaiRequestContext = {
	key: string;
	options?: object;
};

type RecallaiRequestOptions = NonNullable<
	Parameters<typeof makeRecallaiRequest>[2]
>;

const isRecallaiRegion = (region: string): region is RecallaiRegion =>
	Object.hasOwn(RECALLAI_REGION_BASE_URLS, region);

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeRecallaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | string[] | number | boolean | undefined>;
		baseUrl?: string;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = RECALLAI_API_BASE,
		headers,
	} = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: apiKey,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: 'application/json; charset=utf-8',
		query,
	};
	const authorization = apiKey.startsWith('Token ')
		? apiKey
		: `Token ${apiKey}`;

	try {
		return await request<T>(
			{
				...config,
				TOKEN: authorization,
				HEADERS: { ...config.HEADERS, Authorization: authorization },
			},
			requestOptions,
			{
				rateLimitConfig: RATE_LIMIT_CONFIG,
			},
		);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new RecallaiAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
}

export function makeRecallaiContextRequest<T>(
	ctx: RecallaiRequestContext,
	endpoint: string,
	options: RecallaiRequestOptions = {},
): Promise<T> {
	const regionValue =
		ctx.options && 'region' in ctx.options ? ctx.options.region : undefined;
	if (regionValue !== undefined && typeof regionValue !== 'string') {
		throw new Error('Recall.ai region must be a string');
	}
	const region = regionValue;
	const baseUrl =
		region && isRecallaiRegion(region)
			? RECALLAI_REGION_BASE_URLS[region]
			: undefined;
	if (region && !baseUrl) {
		throw new Error(`Unsupported Recall.ai region: ${region}`);
	}
	return makeRecallaiRequest<T>(endpoint, ctx.key, {
		...options,
		...(baseUrl ? { baseUrl } : {}),
	});
}
