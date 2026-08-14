import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { startPathGuard } from '../hub/tunnel/path-guard';

let app: http.Server;
let guard: { port: number; close: () => Promise<void> };

beforeAll(async () => {
	app = http.createServer((req, res) => {
		res.statusCode = 200;
		res.end(`app-hit:${req.url}`);
	});
	await new Promise<void>((r) => app.listen(0, '127.0.0.1', () => r()));
	guard = await startPathGuard((app.address() as AddressInfo).port);
});

afterAll(async () => {
	await guard.close();
	await new Promise<void>((r) => app.close(() => r()));
});

async function get(path: string): Promise<{ status: number; body: string }> {
	const res = await fetch(`http://127.0.0.1:${guard.port}${path}`);
	return { status: res.status, body: await res.text() };
}

// fetch() pre-normalizes `..`, so raw requests are needed to exercise the
// guard's own path normalization / bypass defenses.
function rawGet(path: string): Promise<{ status: number; body: string }> {
	return new Promise((resolve, reject) => {
		const req = http.request(
			{ host: '127.0.0.1', port: guard.port, path, method: 'GET' },
			(res) => {
				let body = '';
				res.on('data', (c) => {
					body += c;
				});
				res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
			},
		);
		req.on('error', reject);
		req.end();
	});
}

describe('path-guard', () => {
	it('forwards /api/corsair to the app', async () => {
		const r = await get('/api/corsair');
		expect(r.status).toBe(200);
		expect(r.body).toBe('app-hit:/api/corsair');
	});

	it('forwards /api/corsair subpaths', async () => {
		const r = await get('/api/corsair/webhook');
		expect(r.status).toBe(200);
		expect(r.body).toBe('app-hit:/api/corsair/webhook');
	});

	it('passes query strings through on the corsair path', async () => {
		const r = await get('/api/corsair?token=abc');
		expect(r.status).toBe(200);
		expect(r.body).toBe('app-hit:/api/corsair?token=abc');
	});

	it('404s any other route — the app is never hit', async () => {
		const r = await get('/secret');
		expect(r.status).toBe(404);
		expect(r.body).not.toContain('app-hit');
	});

	it('404s look-alike prefixes like /api/corsair-evil', async () => {
		const r = await get('/api/corsair-evil');
		expect(r.status).toBe(404);
	});

	it('blocks raw path traversal — /api/corsair/../secret 404s, app never hit', async () => {
		const r = await rawGet('/api/corsair/../secret');
		expect(r.status).toBe(404);
		expect(r.body).not.toContain('app-hit');
	});

	it('blocks encoded-slash traversal — /api/corsair/..%2fadmin 400s', async () => {
		const r = await rawGet('/api/corsair/..%2fadmin');
		expect(r.status).toBe(400);
	});

	it('blocks protocol-relative //api/corsair (resolves off-path) → 404', async () => {
		const r = await rawGet('//api/corsair');
		expect(r.status).toBe(404);
	});
});
