/**
 * Corsair Cloud proxy — server-only. Holds the `ck_cloud_` key; never import
 * this into browser code. Pairs with `<CorsairProvider baseURL={basePath}>`,
 * which never sees the key.
 *
 * The route forwards whatever tenant/plugin/op the caller asks for, so it must
 * not be mounted without gating who's allowed to call it. Pass `authorize` to
 * check the caller (session, tenant scoping, ...) before it reaches Cloud.
 *
 * @example
 * ```ts
 * // app/api/corsair/[...path]/route.ts
 * import { createCloudProxy } from 'corsair/cloud-proxy';
 * const proxy = createCloudProxy({
 *   apiKey: process.env.CORSAIR_CLOUD_KEY!,
 *   url: process.env.CORSAIR_CLOUD_URL!,
 *   authorize: async (req) => Boolean(await getSession(req)),
 * });
 * export const GET = proxy;
 * export const POST = proxy;
 * ```
 */

export interface CloudProxyOptions {
	/** `ck_cloud_…` key for the project. Injected as the upstream bearer. */
	apiKey: string;
	/** Project runtime base URL, e.g. `https://<vm>.corsair.cloud/<project>/api/corsair`. */
	url: string;
	/** Path prefix this route is mounted at. Stripped before forwarding. Default `/api/corsair`. */
	basePath?: string;
	/**
	 * Runs before every forwarded request. Return `false` (or throw) to reject
	 * with 401 — the caller's own credentials never reach this handler, so this
	 * is the only place to check who's asking and for which tenant.
	 */
	authorize?: (req: Request) => boolean | Promise<boolean>;
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

// The cloud key is sent as a bearer token, so http:// would leak it in
// cleartext — allowed only for loopback, matching the reference client.
function assertSecureCloudUrl(url: string): void {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error(`Cloud proxy URL is not a valid URL: "${url}"`);
	}
	if (parsed.protocol === 'https:') return;
	if (parsed.protocol === 'http:' && LOOPBACK_HOSTS.has(parsed.hostname)) {
		return;
	}
	throw new Error(
		`Cloud proxy requires an https:// URL (got "${url}") — http:// is only allowed for localhost/127.0.0.1.`,
	);
}

function stripBasePath(pathname: string, basePath: string): string {
	const normalized = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
	if (!normalized) return pathname;
	if (pathname === normalized) return '';
	if (pathname.startsWith(`${normalized}/`))
		return pathname.slice(normalized.length);
	return pathname;
}

/**
 * Creates a `(Request) => Promise<Response>` handler that forwards requests
 * under `basePath` to the Corsair Cloud runtime, adding the bearer server-side.
 * Only the method, path, search, body, and content-type are forwarded —
 * the caller's own Authorization header and cookies are dropped.
 */
export function createCloudProxy(
	options: CloudProxyOptions,
): (req: Request) => Promise<Response> {
	assertSecureCloudUrl(options.url);
	const upstream = options.url.endsWith('/')
		? options.url.slice(0, -1)
		: options.url;
	const basePath = options.basePath ?? '/api/corsair';

	return async (req: Request): Promise<Response> => {
		if (options.authorize && !(await options.authorize(req))) {
			return new Response(JSON.stringify({ error: 'unauthorized' }), {
				status: 401,
				headers: { 'content-type': 'application/json' },
			});
		}

		const reqUrl = new URL(req.url);
		const path = stripBasePath(reqUrl.pathname, basePath);
		const target = `${upstream}${path}${reqUrl.search}`;

		const headers = new Headers();
		const contentType = req.headers.get('content-type');
		if (contentType) headers.set('content-type', contentType);
		headers.set('authorization', `Bearer ${options.apiKey}`);

		const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
		const upstreamRes = await fetch(target, {
			method: req.method,
			headers,
			body: hasBody ? await req.arrayBuffer() : undefined,
		});

		const resHeaders = new Headers();
		const resContentType = upstreamRes.headers.get('content-type');
		if (resContentType) resHeaders.set('content-type', resContentType);

		return new Response(upstreamRes.body, {
			status: upstreamRes.status,
			headers: resHeaders,
		});
	};
}
