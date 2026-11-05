// The one place the cloud key-format contract lives, shared by the cloud client
// (core/cloud/index.ts) and the connect route handler (connect.ts) so they can
// never parse the same key differently.

// The stable public host for the hosted free tier. A cloud key carries its
// project slug (ck_cloud_<slug>.<secret>), so the caller builds its own base URL.
export const CLOUD_API_HOST = 'api.corsair.cloud';

export const LOOPBACK_HOSTS = new Set([
	'localhost',
	'127.0.0.1',
	'[::1]',
	'::1',
]);

/**
 * The project slug carried inside a `ck_cloud_<slug>.<secret>` key.
 *
 * The secret is base64url and so never contains '.', which is what makes the
 * delimiter unambiguous. Null for a key not in that shape (an older flat key
 * with no '.'), leaving the caller to fall back to an explicit url.
 */
export function projectSlugFromKey(apiKey: string): string | null {
	if (!apiKey.startsWith('ck_cloud_')) return null;
	const rest = apiKey.slice('ck_cloud_'.length);
	const sep = rest.indexOf('.');
	if (sep <= 0) return null;
	const slug = rest.slice(0, sep);
	return /^[a-z0-9]+$/.test(slug) ? slug : null;
}

/** Where this project's operation calls go. */
export function cloudUrlFromKey(apiKey: string): string | null {
	const slug = projectSlugFromKey(apiKey);
	return slug ? `https://${CLOUD_API_HOST}/${slug}/api/corsair` : null;
}

/**
 * Where this project's management calls go.
 *
 * Derived from the runtime base because the two share a hostname: the front
 * door splits /v1 off to the management API and leaves the rest to the runtime
 * fleet. So one `url` override moves both, and a split dev setup overrides the
 * management URL on its own.
 */
export function managementUrlFromBase(
	runtimeBaseUrl: string,
	slug: string,
): string {
	return `${new URL(runtimeBaseUrl).origin}/v1/projects/${slug}`;
}

// The project key rides as a bearer token, so http:// would leak it in
// cleartext (allowed only for loopback), and a query/fragment would land
// mid-URL once path segments are appended. `label` names the setting in errors.
export function assertCloudUrlSecure(
	url: string,
	label = 'Cloud base URL',
): void {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error(`${label} is not a valid URL: "${url}"`);
	}
	if (parsed.search || parsed.hash) {
		throw new Error(
			`${label} must not contain a query or fragment (got "${url}") — path segments are appended to it.`,
		);
	}
	if (parsed.protocol === 'https:') return;
	if (parsed.protocol === 'http:' && LOOPBACK_HOSTS.has(parsed.hostname)) {
		return;
	}
	throw new Error(
		`${label} must use https:// (got "${url}") — http:// is only allowed for localhost/127.0.0.1, since the project key is sent as a bearer token.`,
	);
}
