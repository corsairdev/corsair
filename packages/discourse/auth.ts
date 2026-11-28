import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';

/**
 * Every Discourse forum has its own API and keys (Admin > Advanced > API
 * keys). The forum URL and the username to act as are account config beside
 * the key: an "All users" key acts as whichever user Api-Username names, a
 * single-user key always as its own user.
 */
export const discourseAccountFields = ['site_url', 'username'] as const;

export type DiscourseAuthOptions = {
	/**
	 * The forum the key belongs to (`https://forum.example.com`, or a
	 * subfolder install such as `https://example.com/forum`). Overrides the
	 * account's stored `site_url`.
	 */
	siteUrl?: string;
	/** The user to act as (Api-Username). Overrides the account's stored `username`. */
	username?: string;
};

export type DiscourseStoredKeys = {
	get_site_url?: () => Promise<string | null | undefined>;
	get_username?: () => Promise<string | null | undefined>;
};

export type DiscourseTarget = {
	base: string;
	headers: Record<string, string>;
	query: Record<string, string>;
	/** Credential values to scrub from error bodies. */
	secrets: string[];
};

/**
 * Loopback hosts only: `localhost`, `127.x.x.x` and `::1`. A `.local` name can
 * resolve to another machine, and plain HTTP to it would carry the key across
 * the network.
 */
export function isLocalHost(hostname: string): boolean {
	const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
	return (
		host === 'localhost' || host === '::1' || /^127(\.\d{1,3}){3}$/.test(host)
	);
}

/** The forum's base URL, without a trailing slash. */
export function normalizeDiscourseSiteUrl(raw: string | undefined): string {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) throw new Error('[discourse] site URL is required');
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[discourse] site URL must be an absolute http(s) URL, for example https://forum.example.com',
		);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error('[discourse] site URL must use http or https');
	}
	if (parsed.protocol === 'http:' && !isLocalHost(parsed.hostname)) {
		// The key travels in a header, which plain HTTP would carry in the clear.
		throw new Error(
			'[discourse] site URL must use https (plain http is allowed only for loopback hosts: localhost, 127.0.0.1, [::1])',
		);
	}
	if (parsed.username || parsed.password) {
		throw new Error('[discourse] site URL must not include credentials');
	}
	if (parsed.search || parsed.hash) {
		throw new Error(
			'[discourse] site URL must not include a query or fragment',
		);
	}
	let path = parsed.pathname;
	// A loop rather than /\/+$/, which CodeQL flags as ReDoS on long slash runs.
	while (path.endsWith('/')) path = path.slice(0, -1);
	return `${parsed.origin}${path}`;
}

async function stored(
	getter: (() => Promise<string | null | undefined>) | undefined,
): Promise<string> {
	return getter ? ((await tryGetStoredKey(getter))?.trim() ?? '') : '';
}

/**
 * Where a call goes and how it signs in: the `siteUrl` and `username` options
 * when set, else the account's stored `site_url` and `username`, with the key
 * in `Api-Key` and the user in `Api-Username`.
 */
export async function resolveDiscourseTarget(
	ctx: {
		key: string;
		options: DiscourseAuthOptions;
		keys?: DiscourseStoredKeys;
	},
	_host?: string,
): Promise<DiscourseTarget> {
	const site =
		ctx.options?.siteUrl?.trim() || (await stored(ctx.keys?.get_site_url));
	if (!site) {
		throw new AuthMissingError(
			'discourse',
			'api_key',
			'[discourse] site URL is not set: connect the account with the forum address (for example https://forum.example.com)',
		);
	}
	const username =
		ctx.options?.username?.trim() || (await stored(ctx.keys?.get_username));
	if (!username) {
		throw new AuthMissingError(
			'discourse',
			'api_key',
			'[discourse] username is not set: connect the account with the username the key acts as (an admin, or system)',
		);
	}
	return {
		base: normalizeDiscourseSiteUrl(site),
		headers: { 'Api-Key': ctx.key, 'Api-Username': username },
		query: {},
		secrets: [],
	};
}

/**
 * A stored key belongs to the stored forum. A `siteUrl` option that points
 * elsewhere would send it to another host's operator.
 */
export async function checkDiscourseStoredPairing(
	options: DiscourseAuthOptions,
	keys?: DiscourseStoredKeys,
): Promise<void> {
	if (!options.siteUrl?.trim()) return;
	const site = await stored(keys?.get_site_url);
	if (
		!site ||
		normalizeDiscourseSiteUrl(site) !==
			normalizeDiscourseSiteUrl(options.siteUrl)
	) {
		throw new AuthMissingError(
			'discourse',
			'api_key',
			'[discourse] the stored key belongs to another forum than the siteUrl option: pass key with siteUrl, or connect an account for that forum',
		);
	}
}
