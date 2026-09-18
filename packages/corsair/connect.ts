import { assertCloudUrlSecure, cloudUrlFromKey } from './core/cloud/url';

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
 * import { corsairConnect } from 'corsair/connect';
 * const proxy = corsairConnect({
 *   apiKey: process.env.CORSAIR_CLOUD_KEY!,
 *   authorize: async (req) => Boolean(await getSession(req)),
 * });
 * export const GET = proxy;
 * export const POST = proxy;
 * ```
 */

export interface CorsairConnectOptions {
	/** `ck_cloud_…` key for the project. Injected as the upstream bearer, and the
	 * upstream URL is derived from it. */
	apiKey: string;
	/** Override the URL derived from the key (dev/testing only). */
	url?: string;
	/** Path prefix this route is mounted at. Stripped before forwarding. Default `/api/corsair`. */
	basePath?: string;
	/**
	 * Runs before every forwarded request. Return `false` (or throw) to reject
	 * with 401 — the caller's own credentials never reach this handler, so this
	 * is the only place to check who's asking and for which tenant.
	 */
	authorize?: (req: Request) => boolean | Promise<boolean>;
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
export function corsairConnect(
	options: CorsairConnectOptions,
): (req: Request) => Promise<Response> {
	const url = options.url ?? cloudUrlFromKey(options.apiKey);
	if (!url) {
		throw new Error(
			'corsairConnect: could not resolve a URL from apiKey — pass a ck_cloud_<slug>.<secret> key, or set `url` explicitly.',
		);
	}
	assertCloudUrlSecure(url, 'Cloud proxy URL');
	if (!options.authorize) {
		// Warn in every environment, production included: a route with no
		// authorize forwards any tenant/plugin/op with the project key, and
		// suppressing the signal in prod is exactly backwards.
		console.warn(
			'[corsair] corsairConnect has no `authorize` — this route forwards any tenant/plugin/op with your cloud key. Add `authorize` before exposing it.',
		);
	}
	const upstream = url.endsWith('/') ? url.slice(0, -1) : url;
	const basePath = options.basePath ?? '/api/corsair';

	return async (req: Request): Promise<Response> => {
		if (options.authorize) {
			// A thrown authorize is a denied request, not a proxy crash: a leaked
			// stack would otherwise surface as a 500 with the key-bearing route live.
			let ok: boolean;
			try {
				ok = await options.authorize(req);
			} catch {
				ok = false;
			}
			if (!ok) {
				return new Response(JSON.stringify({ error: 'unauthorized' }), {
					status: 401,
					headers: { 'content-type': 'application/json' },
				});
			}
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
