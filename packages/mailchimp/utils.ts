import { createHash } from 'node:crypto';

/**
 * A Mailchimp subscriber hash is the MD5 hash of the lowercase version of the
 * list member's email address. It is used as the path parameter for all
 * member-scoped endpoints (`/lists/{list_id}/members/{subscriber_hash}`).
 *
 * If the caller already passes a 32-character hex hash, it is returned as-is
 * (lowercased) so member endpoints can accept either an email or a hash.
 */
export function subscriberHash(emailOrHash: string): string {
	const value = emailOrHash.trim();
	if (/^[a-f0-9]{32}$/i.test(value)) {
		return value.toLowerCase();
	}
	return createHash('md5').update(value.toLowerCase()).digest('hex');
}

/**
 * Mailchimp API keys embed their data center as a suffix, e.g. `...-us19`.
 * The data center determines the API base URL and cannot be assumed.
 */
export function dataCenterFromApiKey(apiKey: string): string {
	const separatorIndex = apiKey.lastIndexOf('-');
	const dc = separatorIndex === -1 ? '' : apiKey.slice(separatorIndex + 1);
	if (!dc) {
		throw new Error(
			'Could not determine Mailchimp data center from API key: expected a "-<dc>" suffix (e.g. "-us19").',
		);
	}
	return dc;
}

/**
 * Builds the versioned Marketing API base URL for a given data center.
 * OAuth connections resolve the data center from the OAuth metadata endpoint;
 * API-key connections derive it from the key suffix.
 */
export function mailchimpBaseUrl(dataCenter: string): string {
	if (!dataCenter) {
		throw new Error(
			'A Mailchimp data center is required to build the base URL.',
		);
	}
	return `https://${dataCenter}.api.mailchimp.com/3.0`;
}

/**
 * Mailchimp API-key auth uses HTTP Basic with any username and the key as the
 * password.
 */
export function basicAuthHeader(apiKey: string): string {
	if (!apiKey) {
		throw new Error(
			'A Mailchimp API key is required to build the auth header.',
		);
	}
	const encoded = Buffer.from(`anystring:${apiKey}`).toString('base64');
	return `Basic ${encoded}`;
}

/** OAuth connections authenticate with a bearer access token. */
export function bearerAuthHeader(accessToken: string): string {
	if (!accessToken) {
		throw new Error(
			'A Mailchimp access token is required to build the auth header.',
		);
	}
	return `Bearer ${accessToken}`;
}

/**
 * Packs an OAuth access token + its resolved data center into a single string
 * that flows through `ctx.key`. The data center is resolved once via the OAuth
 * metadata endpoint (in the keyBuilder) and reused on every subsequent request,
 * so per-call code does not need to re-fetch it or know the auth mode.
 *
 * API-key connections do not need packing (the data center is encoded in the
 * key suffix) and pass through `parseMailchimpKey` unchanged.
 */
export function packMailchimpOAuthKey(
	accessToken: string,
	dataCenter: string,
): string {
	if (!accessToken) {
		throw new Error(
			'A Mailchimp access token is required to pack an OAuth key.',
		);
	}
	if (!dataCenter) {
		throw new Error(
			'A Mailchimp data center is required to pack an OAuth key.',
		);
	}
	return JSON.stringify({ token: accessToken, dc: dataCenter });
}

export type ParsedMailchimpKey = {
	token: string;
	authType: 'api_key' | 'oauth_2';
	dataCenter?: string;
};

/**
 * Splits a `ctx.key` value into the underlying credential + auth metadata.
 *
 * - JSON-packed keys (OAuth) carry the access token, the `oauth_2` auth type,
 *   and the resolved data center.
 * - Bare strings are treated as API keys (`api_key` auth type, data center
 *   derived from the `-<dc>` suffix by the caller).
 */
export function parseMailchimpKey(rawKey: string): ParsedMailchimpKey {
	if (!rawKey) {
		throw new Error('A Mailchimp key is required.');
	}
	const trimmed = rawKey.trim();
	if (trimmed.startsWith('{')) {
		// JSON fields are untrusted until both values pass runtime type checks.
		let parsed: { token?: unknown; dc?: unknown };
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			throw new Error('Invalid packed Mailchimp OAuth key.');
		}
		if (typeof parsed.token !== 'string' || typeof parsed.dc !== 'string') {
			throw new Error(
				'Malformed packed Mailchimp OAuth key: expected { token, dc }.',
			);
		}
		return { token: parsed.token, authType: 'oauth_2', dataCenter: parsed.dc };
	}
	return { token: rawKey, authType: 'api_key' };
}

export type MailchimpListQuery = {
	count?: number;
	offset?: number;
	fields?: string[];
	excludeFields?: string[];
};

/**
 * Normalizes common list/pagination options into the query shape the Mailchimp
 * API expects (`count`, `offset`, `fields`, `exclude_fields`). Array field
 * selectors are joined into comma-separated strings.
 */
export function normalizeListQuery(
	query: MailchimpListQuery = {},
): Record<string, string | number> {
	const normalized: Record<string, string | number> = {};
	if (query.count !== undefined) normalized.count = query.count;
	if (query.offset !== undefined) normalized.offset = query.offset;
	if (query.fields?.length) normalized.fields = query.fields.join(',');
	if (query.excludeFields?.length) {
		normalized.exclude_fields = query.excludeFields.join(',');
	}
	return normalized;
}
