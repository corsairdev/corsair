import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';

/**
 * Segment has two APIs with two credentials. The Public API (workspace
 * management) takes a Public API token as a Bearer token; the Tracking API
 * (identify, track, page, screen, group, alias, batch) takes a source's write
 * key as the HTTP Basic username. The connection's key is the token; the write
 * key and the workspace region are account config beside it.
 */
export const segmentAccountFields = ['region', 'write_key'] as const;

/** The host tracking operations carry in the manifest (`operation.host`). */
export const SEGMENT_TRACKING_HOST = 'api.segment.io';

const HOSTS = {
	us: {
		api: 'https://api.segmentapis.com',
		tracking: 'https://api.segment.io/v1',
	},
	eu: {
		api: 'https://eu1.api.segmentapis.com',
		tracking: 'https://events.eu1.segmentapis.com/v1',
	},
} as const;

export type SegmentRegion = keyof typeof HOSTS;

export type SegmentAuthOptions = {
	/**
	 * The workspace region: `us` (default) or `eu`. EU workspaces live on
	 * eu1.api.segmentapis.com and take events on events.eu1.segmentapis.com;
	 * the US hosts answer an EU token with 403. Overrides the account's stored
	 * `region`.
	 */
	region?: SegmentRegion;
	/**
	 * The source write key the tracking operations send with (the source's
	 * Settings > API Keys). Overrides the account's stored `write_key`.
	 */
	writeKey?: string;
	/**
	 * Another Public API base (a proxy in front of api.segmentapis.com). Must
	 * be https. Only with a key passed in options: a stored token is never
	 * sent to a host the account did not choose.
	 */
	baseUrl?: string;
};

export type SegmentStoredKeys = {
	get_region?: () => Promise<string | null | undefined>;
	get_write_key?: () => Promise<string | null | undefined>;
};

export type SegmentTarget = {
	base: string;
	headers: Record<string, string>;
	query: Record<string, string>;
	/** Credential values to scrub from error bodies. */
	secrets: string[];
};

/** `us`, `eu` (also `eu1`, `eu-west-1`), case-insensitive; empty means `us`. */
export function normalizeSegmentRegion(
	raw: string | undefined | null,
): SegmentRegion {
	const value = (raw ?? '').trim().toLowerCase();
	if (
		value === '' ||
		value === 'us' ||
		value === 'us1' ||
		value === 'us-west-2'
	) {
		return 'us';
	}
	if (value === 'eu' || value === 'eu1' || value === 'eu-west-1') return 'eu';
	throw new Error('[segment] region must be us or eu');
}

/** An https base URL without a trailing slash, query, fragment or credentials. */
export function normalizeSegmentBaseUrl(raw: string): string {
	let parsed: URL;
	try {
		parsed = new URL(raw.trim());
	} catch {
		throw new Error('[segment] baseUrl must be an absolute https URL');
	}
	if (parsed.protocol !== 'https:') {
		throw new Error('[segment] baseUrl must use https');
	}
	if (parsed.username || parsed.password) {
		throw new Error('[segment] baseUrl must not include credentials');
	}
	if (parsed.search || parsed.hash) {
		throw new Error('[segment] baseUrl must not include a query or fragment');
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

/** Public API tokens start with `sgp_`; write keys are plain alphanumerics. */
export function isPublicApiToken(key: string): boolean {
	return key.startsWith('sgp_');
}

/**
 * Where a call goes and how it signs in. Tracking routes go to the region's
 * tracking host with the write key (the `writeKey` option, else the stored
 * `write_key`, else the connection key when it is a write key and not a
 * Public API token). Everything else goes to the region's Public API host
 * with the token.
 */
export async function resolveSegmentTarget(
	ctx: { key: string; options: SegmentAuthOptions; keys?: SegmentStoredKeys },
	host?: string,
): Promise<SegmentTarget> {
	const region = normalizeSegmentRegion(
		ctx.options?.region || (await stored(ctx.keys?.get_region)),
	);
	if (host === SEGMENT_TRACKING_HOST) {
		const writeKey =
			ctx.options?.writeKey?.trim() ||
			(await stored(ctx.keys?.get_write_key)) ||
			(ctx.key && !isPublicApiToken(ctx.key) ? ctx.key : '');
		if (!writeKey) {
			throw new AuthMissingError(
				'segment',
				'api_key',
				'[segment] tracking calls need a source write key: store it as the account write_key (the source Settings > API Keys) or pass the writeKey option',
			);
		}
		return {
			base: HOSTS[region].tracking,
			headers: {
				Authorization: `Basic ${Buffer.from(`${writeKey}:`).toString('base64')}`,
			},
			query: {},
			secrets: [writeKey],
		};
	}
	const base = ctx.options?.baseUrl?.trim()
		? normalizeSegmentBaseUrl(ctx.options.baseUrl)
		: HOSTS[region].api;
	return {
		base,
		headers: { Authorization: `Bearer ${ctx.key}` },
		query: {},
		secrets: [],
	};
}

/**
 * A stored token belongs to the region's Segment hosts. A `baseUrl` option
 * pointing elsewhere would hand it to another host's operator.
 */
export async function checkSegmentStoredPairing(
	options: SegmentAuthOptions,
	keys?: SegmentStoredKeys,
): Promise<void> {
	if (!options.baseUrl?.trim()) return;
	const region = normalizeSegmentRegion(
		options.region || (await stored(keys?.get_region)),
	);
	if (normalizeSegmentBaseUrl(options.baseUrl) !== HOSTS[region].api) {
		throw new AuthMissingError(
			'segment',
			'api_key',
			'[segment] a stored token is only sent to Segment: pass key with the baseUrl option, or drop baseUrl',
		);
	}
}
