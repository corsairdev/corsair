import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const MAILTRAP_API_BASE = 'https://mailtrap.io';

/**
 * Mailtrap documents no published rate-limit numbers for this surface. It
 * answers over-limit requests with a plain 429 and no documented
 * `Retry-After` header (confirmed against the public docs), so the retry
 * loop reacts to the 429 itself rather than pacing proactively against a
 * budget it is never told.
 */
const MAILTRAP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Raised when an operation needs an account id and none could be determined.
 *
 * A Mailtrap Personal Access Token can reach several accounts, so the
 * account is a second credential rather than something derivable from the
 * token alone — confirmed live: `GET /api/accounts` lists every account the
 * token can reach, and every other endpoint 404s without a valid account id
 * in the path.
 */
export class MailtrapAccountIdMissingError extends Error {
	constructor() {
		super(
			'Mailtrap requires an account id for this operation. Set `accountId` ' +
				'in the plugin options, or store one under the `account_id` key.',
		);
		this.name = 'MailtrapAccountIdMissingError';
	}
}

type MailtrapAccount = { id?: number; name?: string };

/**
 * Resolves the account reachable by a token.
 *
 * Only used when no account id was configured. `GET /api/accounts` needs no
 * account id itself (confirmed live), so it is safe to call before one is
 * known. Discovery is only unambiguous for a single account; with several,
 * the caller has to say which one.
 */
export async function discoverMailtrapAccountId(
	personalAccessToken: string,
): Promise<string> {
	const accounts = await makeMailtrapRequest<MailtrapAccount[]>(
		'/api/accounts',
		personalAccessToken,
	);

	const only = (accounts ?? []).length === 1 ? accounts[0] : undefined;
	if (!only?.id) throw new MailtrapAccountIdMissingError();

	return String(only.id);
}

export type MailtrapRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<
		string,
		string | number | boolean | string[] | number[] | undefined
	>;
};

/**
 * Issues a Mailtrap request with Bearer auth and rate-limit retries.
 *
 * Every operation in this catalog — contacts, templates, sending domains,
 * sandbox inboxes/messages, stats, billing, accounts, permissions,
 * suppressions — lives on the single `mailtrap.io` host (confirmed live and
 * against `mailtrap@4.8.0`'s `GENERAL_ENDPOINT`). The dedicated sending
 * hosts (`send.api.mailtrap.io`, `bulk.api.mailtrap.io`,
 * `sandbox.api.mailtrap.io`) back operations this catalog does not include.
 */
export async function makeMailtrapRequest<T>(
	path: string,
	personalAccessToken: string,
	options: MailtrapRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: MAILTRAP_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${personalAccessToken}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: MAILTRAP_RATE_LIMIT_CONFIG,
	});
}
