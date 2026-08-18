import http from 'node:http';
import type { AddressInfo } from 'node:net';
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
} from '@jest/globals';
import { startPathGuard } from '../hub/tunnel/path-guard';

let app: http.Server;
let guard: { port: number; close: () => Promise<void> };
// The stub records forwarded paths here rather than echoing req.url into the
// response body (which would be a reflected-input pattern).
let appHits: string[] = [];
let lastHeaders: http.IncomingHttpHeaders = {};
let appPort = 0;

beforeAll(async () => {
	app = http.createServer((req, res) => {
		appHits.push(req.url ?? '');
		lastHeaders = req.headers;
		res.statusCode = 200;
		res.end('ok');
	});
	await new Promise<void>((r) => app.listen(0, '127.0.0.1', () => r()));
	appPort = (app.address() as AddressInfo).port;
	guard = await startPathGuard(appPort);
});

beforeEach(() => {
	appHits = [];
});

afterAll(async () => {
	await guard.close();
	await new Promise<void>((r) => app.close(() => r()));
});

async function get(path: string): Promise<number> {
	const res = await fetch(`http://127.0.0.1:${guard.port}${path}`);
	await res.text();
	return res.status;
}

// fetch() pre-normalizes `..`, so raw requests are needed to exercise the
// guard's own path normalization / bypass defenses.
function rawGet(path: string): Promise<number> {
	return new Promise((resolve, reject) => {
		const req = http.request(
			{ host: '127.0.0.1', port: guard.port, path, method: 'GET' },
			(res) => {
				res.resume();
				res.on('end', () => resolve(res.statusCode ?? 0));
			},
		);
		req.on('error', reject);
		req.end();
	});
}

describe('path-guard', () => {
	it('forwards /api/corsair to the app', async () => {
		expect(await get('/api/corsair')).toBe(200);
		expect(appHits).toContain('/api/corsair');
	});

	it('forwards /api/corsair subpaths', async () => {
		expect(await get('/api/corsair/webhook')).toBe(200);
		expect(appHits).toContain('/api/corsair/webhook');
	});

	it('passes query strings through on the corsair path', async () => {
		expect(await get('/api/corsair?token=abc')).toBe(200);
		expect(appHits).toContain('/api/corsair?token=abc');
	});

	it('allows percent-encoded slashes in the query string (only the path is guarded)', async () => {
		expect(await get('/api/corsair?u=https%3A%2F%2Fapp.example%2Fcb')).toBe(
			200,
		);
		expect(appHits.some((h) => h.startsWith('/api/corsair?u='))).toBe(true);
	});

	it('404s any other route — the app is never hit', async () => {
		expect(await get('/secret')).toBe(404);
		expect(appHits).toHaveLength(0);
	});

	it('404s look-alike prefixes like /api/corsair-evil', async () => {
		expect(await get('/api/corsair-evil')).toBe(404);
		expect(appHits).toHaveLength(0);
	});

	it('blocks raw path traversal — /api/corsair/../secret 404s, app never hit', async () => {
		expect(await rawGet('/api/corsair/../secret')).toBe(404);
		expect(appHits).toHaveLength(0);
	});

	it('blocks encoded-slash traversal — /api/corsair/..%2fadmin 400s', async () => {
		expect(await rawGet('/api/corsair/..%2fadmin')).toBe(400);
		expect(appHits).toHaveLength(0);
	});

	it('blocks protocol-relative //api/corsair (resolves off-path) → 404', async () => {
		expect(await rawGet('//api/corsair')).toBe(404);
		expect(appHits).toHaveLength(0);
	});

	it('strips client-controlled host + x-forwarded-* before forwarding', async () => {
		const res = await fetch(`http://127.0.0.1:${guard.port}/api/corsair`, {
			headers: {
				host: 'evil.example.com',
				forwarded: 'for=1.2.3.4',
				'x-forwarded-for': '1.2.3.4',
				'x-forwarded-host': 'evil.example.com',
				'x-forwarded-proto': 'https',
				'x-forwarded-port': '443',
				'x-real-ip': '1.2.3.4',
			},
		});
		await res.text();
		expect(lastHeaders.host).toBe(`127.0.0.1:${appPort}`);
		expect(lastHeaders.forwarded).toBeUndefined();
		expect(lastHeaders['x-forwarded-for']).toBeUndefined();
		expect(lastHeaders['x-forwarded-host']).toBeUndefined();
		expect(lastHeaders['x-forwarded-proto']).toBeUndefined();
		expect(lastHeaders['x-forwarded-port']).toBeUndefined();
		expect(lastHeaders['x-real-ip']).toBeUndefined();
	});
});

describe('path-guard with a custom basePath', () => {
	let custom: { port: number; close: () => Promise<void> };

	beforeAll(async () => {
		custom = await startPathGuard(appPort, '/external/api/corsair');
	});
	afterAll(async () => {
		await custom.close();
	});

	async function getCustom(path: string): Promise<number> {
		const res = await fetch(`http://127.0.0.1:${custom.port}${path}`);
		await res.text();
		return res.status;
	}

	it('forwards the custom delivery path to the app', async () => {
		expect(await getCustom('/external/api/corsair')).toBe(200);
		expect(appHits).toContain('/external/api/corsair');
	});

	it('404s the default /api/corsair when a custom path is configured', async () => {
		expect(await getCustom('/api/corsair')).toBe(404);
		expect(appHits).toHaveLength(0);
	});
});
