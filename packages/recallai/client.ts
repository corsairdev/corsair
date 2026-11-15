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

/**
 * Recall.ai runs a separate deployment per region, and an API key only works
 * on the host of the region it was created in. us-west-2 is the default
 * because Recall's US sign-up link creates workspaces there.
 * @see https://docs.recall.ai/docs/regions
 */
export const RECALLAI_REGION_BASE_URLS = {
	'us-east-1': 'https://us-east-1.recall.ai',
	'us-west-2': 'https://us-west-2.recall.ai',
	'eu-central-1': 'https://eu-central-1.recall.ai',
	'ap-northeast-1': 'https://ap-northeast-1.recall.ai',
} as const;

export type RecallaiRegion = keyof typeof RECALLAI_REGION_BASE_URLS;

export const RECALLAI_DEFAULT_REGION: RecallaiRegion = 'us-west-2';
export const RECALLAI_API_BASE =
	RECALLAI_REGION_BASE_URLS[RECALLAI_DEFAULT_REGION];
export const RECALLAI_REGIONS = Object.keys(
	RECALLAI_REGION_BASE_URLS,
) as RecallaiRegion[];

type RecallaiRequestContext = {
	key: string;
	options?: { region?: string };
	keys?: { get_region?: () => Promise<string | null | undefined> };
};

type RecallaiRequestOptions = NonNullable<
	Parameters<typeof makeRecallaiRequest>[2]
>;

export const isRecallaiRegion = (region: string): region is RecallaiRegion =>
	Object.hasOwn(RECALLAI_REGION_BASE_URLS, region);

/**
 * Reads the region stored with the connected account. A tenant with no
 * account row has no DEK, so the key manager throws instead of returning
 * null; that case means "no region stored" and falls back to the default.
 */
async function readStoredRegion(
	ctx: RecallaiRequestContext,
): Promise<string | null | undefined> {
	try {
		return await ctx.keys?.get_region?.();
	} catch (error) {
		// why safe: narrows to the uninitialized-tenant case, which carries no
		// stored region; anything else rethrows untouched.
		if (error instanceof Error && /no dek found/i.test(error.message)) {
			return null;
		}
		throw error;
	}
}

/**
 * Picks the region for a request: the plugin option, then the region stored
 * with the connected account, then us-west-2. The value is only ever used as a
 * key into RECALLAI_REGION_BASE_URLS, so no caller-supplied text reaches the
 * request host.
 */
export async function resolveRecallaiRegion(
	ctx: RecallaiRequestContext,
): Promise<RecallaiRegion> {
	const configured = ctx.options?.region ?? (await readStoredRegion(ctx));
	if (configured === undefined || configured === null) {
		return RECALLAI_DEFAULT_REGION;
	}
	if (typeof configured !== 'string') {
		throw new Error('Recall.ai region must be a string');
	}
	// People often paste the host from the dashboard URL, so
	// `https://eu-central-1.recall.ai/` and `eu-central-1.recall.ai` are read
	// as `eu-central-1`. The result is still checked against the list below.
	const region = configured
		.trim()
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/\/+$/, '')
		.replace(/\.recall\.ai$/, '');
	if (region === '') return RECALLAI_DEFAULT_REGION;
	if (!isRecallaiRegion(region)) {
		throw new Error(
			`Unsupported Recall.ai region: ${configured.trim()}. Use one of ${RECALLAI_REGIONS.join(', ')}`,
		);
	}
	return region;
}

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
		// Endpoint schemas validate provider-specific JSON bodies before transport;
		// their open-ended nested fields cannot share a narrower static shape.
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | string[] | number | boolean | undefined>;
		region?: RecallaiRegion;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		region = RECALLAI_DEFAULT_REGION,
		headers,
	} = options;
	const baseUrl = RECALLAI_REGION_BASE_URLS[region];
	const authorization = apiKey.startsWith('Token ')
		? apiKey
		: `Token ${apiKey}`;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			...headers,
			Authorization: authorization,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: 'application/json; charset=utf-8',
		query,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// A key sent to another region's host is rejected as unknown, so a
			// 401 most often means the region does not match the key.
			const message =
				error.status === 401
					? `${error.message}: Recall.ai rejected the API key at ${baseUrl}. Keys only work in the region they were created in; check the region setting.`
					: error.message;
			throw new RecallaiAPIError(
				message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
}

export async function makeRecallaiContextRequest<T>(
	ctx: RecallaiRequestContext,
	endpoint: string,
	options: RecallaiRequestOptions = {},
): Promise<T> {
	const region = await resolveRecallaiRegion(ctx);
	return makeRecallaiRequest<T>(endpoint, ctx.key, {
		...options,
		region,
	});
}
