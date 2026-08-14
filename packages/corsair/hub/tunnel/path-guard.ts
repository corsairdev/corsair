import http from 'node:http';
import { CORSAIR_TUNNEL_PATH } from './constants';

const UPSTREAM_TIMEOUT_MS = 30_000;

/**
 * Loopback proxy that only forwards `/api/corsair` (and its subpaths) to the dev
 * app; every other path gets a 404. The tunnel shares this guard instead of the
 * app itself, so the public URL can never reach the developer's other routes.
 */
export function startPathGuard(
	appPort: number,
): Promise<{ port: number; close: () => Promise<void> }> {
	const server = http.createServer((req, res) => {
		const raw = req.url ?? '/';
		// Encoded path separators can smuggle traversal past normalization.
		if (/%2f|%5c/i.test(raw)) {
			res.statusCode = 400;
			res.end('Bad request');
			return;
		}
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
		const allowed =
			url.pathname === CORSAIR_TUNNEL_PATH ||
			url.pathname.startsWith(`${CORSAIR_TUNNEL_PATH}/`);
		if (!allowed) {
			res.statusCode = 404;
			res.end('Not found');
			return;
		}

		const proxyReq = http.request(
			{
				host: '127.0.0.1',
				port: appPort,
				method: req.method,
				// Forward the normalized path so the app can't re-resolve `..`.
				path: url.pathname + url.search,
				headers: req.headers,
				timeout: UPSTREAM_TIMEOUT_MS,
			},
			(proxyRes) => {
				res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
				proxyRes.pipe(res);
			},
		);
		proxyReq.on('timeout', () => proxyReq.destroy());
		proxyReq.on('error', () => {
			if (!res.headersSent) res.statusCode = 502;
			res.end('Bad gateway');
		});
		req.on('error', () => proxyReq.destroy());
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
