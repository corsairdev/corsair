// The one place the cloud key-format contract lives, shared by the cloud client
// (core/cloud/index.ts) and the connect route handler (connect.ts) so they can
// never parse the same key differently.

// The stable public host for the hosted free tier. A cloud key carries its
// project slug (ck_cloud_<slug>.<secret>), so the caller builds its own base URL.
export const CLOUD_API_HOST = 'api.corsair.cloud';

// The two planes are two machines: calls execute on the project's runtime box
// behind CLOUD_API_HOST, while /v1 is served by the hub.
export const CLOUD_CONTROL_HOST = 'auth.corsair.dev';

export const LOOPBACK_HOSTS = new Set([
	'localhost',
	'127.0.0.1',
	'[::1]',
	'::1',
]);

// Slug is the segment after the ck_cloud_ prefix up to the first '.'; the secret
// is the remainder. The secret is base64url so it never contains '.', which is
// why the delimiter is unambiguous. Returns null when the key isn't in that
// shape (e.g. an older flat key with no '.'), so the caller can fall back to an
// explicit url or error clearly.
export function cloudSlugFromKey(apiKey: string): string | null {
	if (!apiKey.startsWith('ck_cloud_')) return null;
	const rest = apiKey.slice('ck_cloud_'.length);
	const sep = rest.indexOf('.');
	if (sep <= 0) return null;
	const slug = rest.slice(0, sep);
	return /^[a-z0-9]+$/.test(slug) ? slug : null;
}

export function cloudUrlFromKey(apiKey: string): string | null {
	const slug = cloudSlugFromKey(apiKey);
	return slug ? `https://${CLOUD_API_HOST}/${slug}/api/corsair` : null;
}

// Every v1 route is under /projects/<slug>, so the slug lives in the base and
// callers keep using relative paths. A custom base (local proxy, self-host)
// keeps management on it rather than silently back at prod — the default pair
// is the only case where the two planes are different machines, and only there
// is the host swapped.
export function cloudManagementUrlFromBase(
	baseUrl: string,
	slug: string,
): string {
	const url = new URL(baseUrl);
	if (url.host === CLOUD_API_HOST) {
		return `${url.protocol}//${CLOUD_CONTROL_HOST}/v1/projects/${slug}`;
	}
	// A proxy can be mounted under a prefix, so keep the base's own path: only
	// the project-shaped `/<slug>/api/corsair` tail belongs to the data plane.
	const mount = url.pathname
		.replace(/\/+$/, '')
		.replace(/\/[^/]+\/api\/corsair$/, '');
	return `${url.origin}${mount}/v1/projects/${slug}`;
}

export function cloudManagementUrlFromKey(apiKey: string): string | null {
	const slug = cloudSlugFromKey(apiKey);
	const projectUrl = cloudUrlFromKey(apiKey);
	if (!slug || !projectUrl) return null;
	return cloudManagementUrlFromBase(projectUrl, slug);
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
