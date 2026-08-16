import http from 'node:http';
import { CORSAIR_TUNNEL_PATH } from './constants';

const UPSTREAM_TIMEOUT_MS = 30_000;

// Client-controlled routing/identity headers the app must not trust from a
// request that arrived over the public tunnel. Any `x-forwarded-*` is dropped
// by prefix (for/host/proto/port/…), plus these exact names.
const UNSAFE_REQUEST_HEADERS = new Set(['host', 'forwarded', 'x-real-ip']);

function isUnsafeRequestHeader(name: string): boolean {
	return UNSAFE_REQUEST_HEADERS.has(name) || name.startsWith('x-forwarded-');
}

/**
 * Loopback proxy that only forwards `basePath` (and its subpaths) to the dev
 * app; every other path gets a 404. The tunnel shares this guard instead of the
 * app itself, so the public URL can never reach the developer's other routes.
 * `basePath` is the dev's delivery path (default /api/corsair) so a custom
 * delivery URL is still the only route the tunnel exposes.
 */
export function startPathGuard(
	appPort: number,
	basePath: string = CORSAIR_TUNNEL_PATH,
): Promise<{ port: number; close: () => Promise<void> }> {
	const server = http.createServer((req, res) => {
		const raw = req.url ?? '/';
		let url: URL;
		try {
			// Resolves `..` and `//` so the allow-check below can't be tricked
			// into forwarding a raw traversal path (e.g. /api/corsair/../admin).
			url = new URL(raw, 'http://127.0.0.1');
		} catch {
			res.statusCode = 400;
			res.end('Bad request');
			return;
		}
		// Encoded path separators in the PATH can smuggle traversal past
		// normalization (WHATWG URL keeps %2F/%5C undecoded in pathname). The
		// query string is exempt — encoded URLs in params are legitimate.
		if (/%2f|%5c/i.test(url.pathname)) {
			res.statusCode = 400;
			res.end('Bad request');
			return;
		}
		const allowed =
			url.pathname === basePath || url.pathname.startsWith(`${basePath}/`);
		if (!allowed) {
			res.statusCode = 404;
			res.end('Not found');
			return;
		}

		// Strip client-controlled routing/identity headers so whoever reaches the
		// public URL can't feed the dev app a spoofed Host / X-Forwarded-*.
		const fwdHeaders: http.OutgoingHttpHeaders = {
			host: `127.0.0.1:${appPort}`,
		};
		for (const [k, v] of Object.entries(req.headers)) {
			if (v !== undefined && !isUnsafeRequestHeader(k)) {
				fwdHeaders[k] = v;
			}
		}
		const proxyReq = http.request(
			{
				host: '127.0.0.1',
				port: appPort,
				method: req.method,
				// Forward the normalized path so the app can't re-resolve `..`.
				path: url.pathname + url.search,
				headers: fwdHeaders,
				timeout: UPSTREAM_TIMEOUT_MS,
			},
			(proxyRes) => {
				// Don't leak app cookies back out through the public tunnel.
				const respHeaders: http.OutgoingHttpHeaders = {};
				for (const [k, v] of Object.entries(proxyRes.headers)) {
					if (v !== undefined && k !== 'set-cookie') respHeaders[k] = v;
				}
				res.writeHead(proxyRes.statusCode ?? 502, respHeaders);
				proxyRes.pipe(res);
			},
		);
		proxyReq.on('timeout', () => proxyReq.destroy());
		proxyReq.on('error', () => {
			if (res.writableEnded) return;
			if (res.headersSent) {
				res.destroy();
				return;
			}
			res.statusCode = 502;
			res.end('Bad gateway');
		});
		req.on('error', () => proxyReq.destroy());
		// A client abort closes `res` without emitting an error on `req`.
		res.on('close', () => {
			if (!proxyReq.destroyed) proxyReq.destroy();
		});
		req.pipe(proxyReq);
	});

	return new Promise((resolve, reject) => {
		server.once('error', reject);
		server.listen(0, '127.0.0.1', () => {
			const address = server.address();
			const port = typeof address === 'object' && address ? address.port : 0;
			resolve({
				port,
				close: () =>
					new Promise<void>((done) => {
						server.close(() => done());
					}),
			});
		});
	});
}
