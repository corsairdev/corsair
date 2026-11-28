import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';

/**
 * n8n is self-hosted (or n8n Cloud on a paid plan): every instance has its
 * own API, at `<instance>/api/v1`, and its own API keys (Settings → n8n API).
 * The instance URL is account config beside the key.
 */
export const n8nAccountFields = ['instance_url'] as const;

export type N8nAuthOptions = {
	/**
	 * The n8n instance the key belongs to (`https://n8n.example.com`,
	 * `https://acme.app.n8n.cloud`), with or without `/api/v1`. Overrides the
	 * account's stored `instance_url`.
	 */
	instanceUrl?: string;
};

export type N8nStoredKeys = {
	get_instance_url?: () => Promise<string | null | undefined>;
};

export type N8nTarget = {
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

/**
 * The API root for an instance URL. The account may store the instance
 * address (`https://n8n.example.com`) or the API root
 * (`https://n8n.example.com/api/v1`); both land on `<instance>/api/v1`.
 */
export function normalizeN8nInstanceUrl(raw: string | undefined): string {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) throw new Error('[n8n] instance URL is required');
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[n8n] instance URL must be an absolute http(s) URL, for example https://n8n.example.com',
		);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error('[n8n] instance URL must use http or https');
	}
	if (parsed.protocol === 'http:' && !isLocalHost(parsed.hostname)) {
		// The key travels in a header, which plain HTTP would carry in the clear.
		throw new Error(
			'[n8n] instance URL must use https (plain http is allowed only for loopback hosts: localhost, 127.0.0.1, [::1])',
		);
	}
	if (parsed.username || parsed.password) {
		throw new Error('[n8n] instance URL must not include credentials');
	}
	if (parsed.search || parsed.hash) {
		throw new Error('[n8n] instance URL must not include a query or fragment');
	}
	let path = parsed.pathname;
	// A loop rather than /\/+$/, which CodeQL flags as ReDoS on long slash runs.
	while (path.endsWith('/')) path = path.slice(0, -1);
	if (path.endsWith('/api/v1')) path = path.slice(0, -'/api/v1'.length);
	return `${parsed.origin}${path}/api/v1`;
}

async function storedInstance(keys?: N8nStoredKeys): Promise<string> {
	const getter = keys?.get_instance_url;
	return getter ? ((await tryGetStoredKey(getter))?.trim() ?? '') : '';
}

/**
 * Where a call goes and how it signs in: the `instanceUrl` option when set,
 * else the account's stored `instance_url`, with the key in `X-N8N-API-KEY`.
 */
export async function resolveN8nTarget(
	ctx: { key: string; options: N8nAuthOptions; keys?: N8nStoredKeys },
	_host?: string,
): Promise<N8nTarget> {
	const instance =
		ctx.options?.instanceUrl?.trim() || (await storedInstance(ctx.keys));
	if (!instance) {
		throw new AuthMissingError(
			'n8n',
			'api_key',
			'[n8n] instance URL is not set: connect the account with its n8n address (for example https://n8n.example.com)',
		);
	}
	return {
		base: normalizeN8nInstanceUrl(instance),
		headers: { 'X-N8N-API-KEY': ctx.key },
		query: {},
		secrets: [],
	};
}

/**
 * A stored key belongs to the stored instance. An `instanceUrl` option that
 * points elsewhere would send it to another host's operator.
 */
export async function checkN8nStoredPairing(
	options: N8nAuthOptions,
	keys?: N8nStoredKeys,
): Promise<void> {
	if (!options.instanceUrl?.trim()) return;
	const stored = await storedInstance(keys);
	if (
		!stored ||
		normalizeN8nInstanceUrl(stored) !==
			normalizeN8nInstanceUrl(options.instanceUrl)
	) {
		throw new AuthMissingError(
			'n8n',
			'api_key',
			'[n8n] the stored key belongs to another instance than the instanceUrl option: pass key with instanceUrl, or connect an account for that instance',
		);
	}
}
