import { createHmac } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';

/**
 * Ghost is self-hosted or Ghost(Pro); every site has its own API at
 * `<site>/ghost/api`. The Admin API takes a key from a custom integration
 * (`<id>:<secret>`), signed into a short-lived JWT for every call. The
 * Content API (operations under `content.*`) takes the integration's Content
 * API key as a `key` query value instead.
 */
export const ghostAccountFields = ['site_url', 'content_api_key'] as const;

export type GhostAuthOptions = {
	/**
	 * The site's admin URL (`https://example.com`, `https://example.ghost.io`,
	 * or a subdirectory install). Overrides the account's stored `site_url`.
	 */
	siteUrl?: string;
	/** The integration's Content API key, for the `content.*` operations. */
	contentApiKey?: string;
};

export type GhostStoredKeys = {
	get_site_url?: () => Promise<string | null | undefined>;
	get_content_api_key?: () => Promise<string | null | undefined>;
};

export type GhostTarget = {
	base: string;
	headers: Record<string, string>;
	query: Record<string, string>;
	secrets: string[];
};

/** The API version the operations follow (Ghost 6). */
export const GHOST_ACCEPT_VERSION = 'v6.0';

/** The marker the manifest gives Content API operations. */
export const GHOST_CONTENT_API = 'content';

/** Loopback hosts only, where plain http may carry the key. */
export function isLocalHost(hostname: string): boolean {
	const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
	return (
		host === 'localhost' || host === '::1' || /^127(\.\d{1,3}){3}$/.test(host)
	);
}

/**
 * The API root for a site URL: `<site>/ghost/api`. The account may store the
 * site address or the admin URL (`https://example.com/ghost`); both land on
 * the same root.
 */
export function normalizeGhostSiteUrl(raw: string | undefined): string {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) throw new Error('[ghost] site URL is required');
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[ghost] site URL must be an absolute http(s) URL, for example https://example.com',
		);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error('[ghost] site URL must use http or https');
	}
	if (parsed.protocol === 'http:' && !isLocalHost(parsed.hostname)) {
		throw new Error(
			'[ghost] site URL must use https (plain http is allowed only for loopback hosts: localhost, 127.0.0.1, [::1])',
		);
	}
	if (parsed.username || parsed.password) {
		throw new Error('[ghost] site URL must not include credentials');
	}
	if (parsed.search || parsed.hash) {
		throw new Error('[ghost] site URL must not include a query or fragment');
	}
	let path = parsed.pathname;
	while (path.endsWith('/')) path = path.slice(0, -1);
	for (const suffix of [
		'/ghost/api/admin',
		'/ghost/api/content',
		'/ghost/api',
		'/ghost',
	]) {
		if (path.endsWith(suffix)) {
			path = path.slice(0, -suffix.length);
			break;
		}
	}
	return `${parsed.origin}${path}/ghost/api`;
}

function base64url(input: Buffer | string): string {
	return Buffer.from(input).toString('base64url');
}

/**
 * A Ghost Admin API token: HS256 over `{ iat, exp: iat + 5 min, aud: '/admin/' }`
 * with `kid` = the key's id, signed with the key's hex secret.
 */
export function ghostAdminToken(adminKey: string, now = Date.now()): string {
	const [id, secret, ...rest] = adminKey.trim().split(':');
	if (!id || !secret || rest.length > 0 || !/^[0-9a-f]+$/i.test(secret)) {
		throw new Error(
			'[ghost] the Admin API key must be <id>:<secret> as shown on the custom integration',
		);
	}
	const iat = Math.floor(now / 1000);
	const header = base64url(
		JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: id }),
	);
	const payload = base64url(
		JSON.stringify({ iat, exp: iat + 5 * 60, aud: '/admin/' }),
	);
	const signature = createHmac('sha256', Buffer.from(secret, 'hex'))
		.update(`${header}.${payload}`)
		.digest('base64url');
	return `${header}.${payload}.${signature}`;
}

async function stored(
	getter: (() => Promise<string | null | undefined>) | undefined,
): Promise<string> {
	return getter ? ((await tryGetStoredKey(getter))?.trim() ?? '') : '';
}

/**
 * Where a call goes and how it signs in: `<site>/ghost/api`, with a fresh
 * Admin JWT in `Authorization: Ghost <token>`, or for a Content API
 * operation the Content API key in the `key` query value.
 */
export async function resolveGhostTarget(
	ctx: { key: string; options: GhostAuthOptions; keys?: GhostStoredKeys },
	host?: string,
): Promise<GhostTarget> {
	const site =
		ctx.options?.siteUrl?.trim() || (await stored(ctx.keys?.get_site_url));
	if (!site) {
		throw new AuthMissingError(
			'ghost',
			'api_key',
			'[ghost] site URL is not set: connect the account with the site address (for example https://example.com)',
		);
	}
	const base = normalizeGhostSiteUrl(site);
	const headers = { 'Accept-Version': GHOST_ACCEPT_VERSION };
	if (host === GHOST_CONTENT_API) {
		const contentKey =
			ctx.options?.contentApiKey?.trim() ||
			(await stored(ctx.keys?.get_content_api_key));
		if (!contentKey) {
			throw new AuthMissingError(
				'ghost',
				'api_key',
				"[ghost] the Content API key is not set: add the integration's Content API key to the account to use content.* operations",
			);
		}
		return { base, headers, query: { key: contentKey }, secrets: [contentKey] };
	}
	return {
		base,
		headers: { ...headers, Authorization: `Ghost ${ghostAdminToken(ctx.key)}` },
		query: {},
		secrets: [],
	};
}

/**
 * A stored key belongs to the stored site. A `siteUrl` option that points
 * elsewhere would send it to another host's operator.
 */
export async function checkGhostStoredPairing(
	options: GhostAuthOptions,
	keys?: GhostStoredKeys,
): Promise<void> {
	if (!options.siteUrl?.trim()) return;
	const site = await stored(keys?.get_site_url);
	if (
		!site ||
		normalizeGhostSiteUrl(site) !== normalizeGhostSiteUrl(options.siteUrl)
	) {
		throw new AuthMissingError(
			'ghost',
			'api_key',
			'[ghost] the stored key belongs to another site than the siteUrl option: pass key with siteUrl, or connect an account for that site',
		);
	}
}
