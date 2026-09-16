/**
 * Corsair Cloud proxy — server-only. Holds the `ck_cloud_` key; never import
 * this into browser code. Pairs with `<CorsairProvider baseURL={basePath}>`,
 * which never sees the key.
 *
 * @example
 * ```ts
 * // app/api/corsair/[...path]/route.ts
 * import { createCloudProxy } from 'corsair/cloud-proxy';
 * const proxy = createCloudProxy({
 *   apiKey: process.env.CORSAIR_CLOUD_KEY!,
 *   url: process.env.CORSAIR_CLOUD_URL!,
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
}

function stripBasePath(pathname: string, basePath: string): string {
	const normalized = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
	if (!normalized) return pathname;
	if (pathname === normalized) return '';
	if (pathname.startsWith(`${normalized}/`)) return pathname.slice(normalized.length);
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
	const upstream = options.url.endsWith('/') ? options.url.slice(0, -1) : options.url;
	const basePath = options.basePath ?? '/api/corsair';

	return async (req: Request): Promise<Response> => {
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
