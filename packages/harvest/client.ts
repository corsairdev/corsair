import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const HARVEST_API_BASE = 'https://api.harvestapp.com/v2';

/**
 * Account discovery lives on Harvest ID, not on the API host.
 *
 * @see https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/
 */
const HARVEST_ID_BASE = 'https://id.getharvest.com/api/v2';

/**
 * Harvest allows 100 requests per 15 seconds and answers with 429 plus a
 * `Retry-After` header once that is exceeded.
 *
 * Successful responses carry no rate-limit headers at all — there is no
 * `X-RateLimit-Remaining` to pace against — so the client cannot throttle
 * proactively and has to react to the 429 when it arrives.
 *
 * The Reports API has a far stricter budget (100 requests per 15 minutes), but
 * no reporting operation is part of this plugin, so a single configuration
 * covers every request made here.
 */
const HARVEST_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Harvest rejects any request without a `User-Agent` with 400 Bad Request, so
 * it is set here rather than left to callers.
 */
const HARVEST_USER_AGENT = 'Corsair (https://github.com/corsairdev/corsair)';

/**
 * Raised when an operation needs an account id and none could be determined.
 *
 * A Harvest access token can reach several accounts, so the account is a second
 * credential rather than something derivable from the token alone.
 */
export class HarvestAccountIdMissingError extends Error {
	constructor() {
		super(
			'Harvest requires an account id. Set `accountId` in the plugin options, ' +
				'or store one under the `account_id` key.',
		);
		this.name = 'HarvestAccountIdMissingError';
	}
}

type HarvestIdAccount = {
	id?: number;
	name?: string;
	product?: string;
};

/**
 * Resolves the Harvest account reachable by a token.
 *
 * Only used when no account id was configured. Harvest ID lists Forecast
 * accounts alongside Harvest ones and a Forecast id is rejected by the Harvest
 * API, so the list is filtered on `product`. Discovery is only unambiguous for
 * a single Harvest account; with several, the caller has to say which one.
 *
 * The call goes through the shared `request` helper rather than `fetch` so that
 * it inherits the same timeout and rate-limit retries as every other request.
 * A transport failure therefore surfaces as an `ApiError` carrying its status —
 * a rejected token reads as 401 rather than as a missing account id — and
 * `HarvestAccountIdMissingError` is reserved for a reachable list that does not
 * name exactly one Harvest account.
 */
export async function discoverHarvestAccountId(
	accessToken: string,
): Promise<string> {
	const config: OpenAPIConfig = {
		BASE: HARVEST_ID_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: `Bearer ${accessToken}`,
			'User-Agent': HARVEST_USER_AGENT,
			Accept: 'application/json',
		},
	};

	const payload = await request<{ accounts?: HarvestIdAccount[] }>(
		config,
		{ method: 'GET', url: 'accounts', mediaType: 'application/json' },
		{ rateLimitConfig: HARVEST_RATE_LIMIT_CONFIG },
	);

	const harvestAccounts = (payload?.accounts ?? []).filter(
		(account) => account.product === 'harvest' && account.id != null,
	);

	const only = harvestAccounts.length === 1 ? harvestAccounts[0] : undefined;
	if (!only?.id) throw new HarvestAccountIdMissingError();

	return String(only.id);
}

export type HarvestRequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
};

/**
 * Issues a Harvest request with bearer auth, the account header and
 * rate-limit retries.
 *
 * Harvest reports failures with real status codes — 403, 404, 422, 429, 500 —
 * so no response-body inspection is needed to tell success from failure and the
 * shared `request` helper's error handling applies unchanged.
 */
export async function makeHarvestRequest<T>(
	endpoint: string,
	accessToken: string,
	accountId: string,
	options: HarvestRequestOptions = {},
): Promise<T> {
	if (!accountId) throw new HarvestAccountIdMissingError();

	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: HARVEST_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
			'Harvest-Account-Id': accountId,
			'User-Agent': HARVEST_USER_AGENT,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PATCH' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: HARVEST_RATE_LIMIT_CONFIG,
	});
}
