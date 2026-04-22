import { createReadStream, existsSync, statSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MIME: Record<string, string> = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'application/javascript; charset=utf-8',
	'.mjs': 'application/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.ico': 'image/x-icon',
	'.map': 'application/json; charset=utf-8',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
};

/**
 * Resolve the directory that holds the built SPA assets.
 * In a built studio package:     dist/server/index.js → ../web
 * In dev (tsx src/server/...):   src/server/...     → ../../dist/web (if built)
 */
function resolveWebRoot(): string {
	const here = fileURLToPath(new URL('.', import.meta.url));
	const built = resolve(here, '../web');
	if (existsSync(join(built, 'index.html'))) return built;
	const viaDev = resolve(here, '../../dist/web');
	return viaDev;
}

export function createStaticServer(webRoot?: string) {
	const root = webRoot ?? resolveWebRoot();

	return function serveStatic(
		req: IncomingMessage,
		res: ServerResponse,
	): boolean {
		if (req.method !== 'GET' && req.method !== 'HEAD') return false;

		const url = new URL(req.url ?? '/', 'http://localhost');
		let pathname = decodeURIComponent(url.pathname);
		if (pathname === '/' || pathname === '') pathname = '/index.html';

		const unsafe = join(root, pathname);
		const safe = normalize(unsafe);
		if (!safe.startsWith(root)) {
			res.writeHead(403).end('forbidden');
			return true;
		}

		let filePath = safe;
		if (!existsSync(filePath) || !statSync(filePath).isFile()) {
			// SPA fallback — any non-asset path renders index.html
			filePath = join(root, 'index.html');
			if (!existsSync(filePath)) {
				res.writeHead(404, { 'content-type': 'text/plain' });
				res.end(
					`Corsair Studio assets not found at ${root}.\n` +
						'If running from source, run `pnpm --filter @corsair-dev/studio build:web` first.',
				);
				return true;
			}
		}

		const ext = extname(filePath).toLowerCase();
		const type = MIME[ext] ?? 'application/octet-stream';
		res.writeHead(200, { 'content-type': type });
		if (req.method === 'HEAD') {
			res.end();
			return true;
		}
		createReadStream(filePath).pipe(res);
		return true;
	};
}
