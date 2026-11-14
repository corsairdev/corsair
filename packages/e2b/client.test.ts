import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeE2bRequest } from './client';
import { e2bOperationRoutes } from './endpoints/routes';
import { E2bEndpointOutputSchemas } from './endpoints/types';

describe('E2B API client', () => {
	const originalFetch = globalThis.fetch;
	let calls: Array<{ url: string; init?: RequestInit }>;

	beforeEach(() => {
		calls = [];
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('uses X-API-Key and the platform API host', async () => {
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			return new Response('[]', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};

		await makeE2bRequest(
			e2bOperationRoutes['sandboxes.list'],
			'project-api-key',
			{ query: { state: ['running', 'paused'] } },
		);

		expect(calls).toHaveLength(1);
		const call = calls[0];
		expect(call?.url).toContain('https://api.e2b.app/v2/sandboxes');
		expect(call?.url).toContain('state=running%2Cpaused');
		expect(new Headers(call?.init?.headers).get('X-API-Key')).toBe(
			'project-api-key',
		);
		expect(new Headers(call?.init?.headers).get('Authorization')).toBeNull();
	});

	it('returns E2B header cursors and forwards them to the next page', async () => {
		const listedSandbox = {
			templateID: 'template-test',
			sandboxID: 'sandbox-test',
			clientID: 'client-test',
			startedAt: '2026-01-01T00:00:00Z',
			endAt: '2026-01-01T00:05:00Z',
			cpuCount: 1,
			memoryMB: 128,
			diskSizeMB: 0,
			state: 'running',
			envdVersion: 'test',
		};
		let page = 0;
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			page += 1;
			return page === 1
				? new Response(JSON.stringify([listedSandbox]), {
						status: 200,
						headers: {
							'Content-Type': 'application/json',
							'X-Next-Token': 'next-page',
							'X-Total-Running': '1',
						},
					})
				: new Response('[]', {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					});
		};

		const firstResult = await makeE2bRequest(
			e2bOperationRoutes['sandboxes.list'],
			'project-api-key',
			{ query: { limit: 1 } },
		);
		const firstPage =
			E2bEndpointOutputSchemas['sandboxes.list'].parse(firstResult);
		expect(firstPage.items).toEqual([listedSandbox]);
		expect(firstPage.nextToken).toBe('next-page');
		expect(firstPage.totalRunning).toBe(1);

		const secondResult = await makeE2bRequest(
			e2bOperationRoutes['sandboxes.list'],
			'project-api-key',
			{ query: { limit: 1, nextToken: firstPage.nextToken } },
		);
		const secondPage =
			E2bEndpointOutputSchemas['sandboxes.list'].parse(secondResult);
		expect(secondPage.items).toEqual([]);
		expect(secondPage.nextToken).toBeUndefined();
		expect(calls).toHaveLength(2);
		expect(
			new URL(calls[0]?.url ?? 'https://api.e2b.app').searchParams.get(
				'nextToken',
			),
		).toBeNull();
		expect(
			new URL(calls[1]?.url ?? 'https://api.e2b.app').searchParams.get(
				'nextToken',
			),
		).toBe('next-page');
	});

	it('fails before fetch when a platform API key is missing', async () => {
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			return new Response('[]', { status: 200 });
		};

		await expect(
			makeE2bRequest(
				e2bOperationRoutes['templates.listDefault'],
				undefined,
				{},
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(calls).toHaveLength(0);
	});

	it('keeps the documented health check keyless on the sandbox host', async () => {
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			return new Response(null, { status: 204 });
		};

		await makeE2bRequest(e2bOperationRoutes['envd.health'], undefined, {
			headers: { e2bSandboxId: 'sbx-test', e2bSandboxPort: 49983 },
		});

		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toContain('https://sandbox.e2b.app/health');
		const headers = new Headers(calls[0]?.init?.headers);
		expect(headers.get('X-API-Key')).toBeNull();
		expect(headers.get('E2b-Sandbox-Id')).toBe('sbx-test');
		expect(headers.get('E2b-Sandbox-Port')).toBe('49983');
	});

	it('uses the sandbox access token and Connect version for unary RPC', async () => {
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			return new Response(JSON.stringify({ entries: [] }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};

		await makeE2bRequest(e2bOperationRoutes['filesystem.listDir'], undefined, {
			headers: {
				e2bSandboxId: 'sbx-test',
				e2bSandboxPort: 49983,
				e2bAccessToken: 'sandbox-access-token',
			},
			body: { path: '/tmp' },
		});

		const headers = new Headers(calls[0]?.init?.headers);
		expect(calls[0]?.url).toContain(
			'https://sandbox.e2b.app/filesystem.Filesystem/ListDir',
		);
		expect(headers.get('X-Access-Token')).toBe('sandbox-access-token');
		expect(headers.get('Connect-Protocol-Version')).toBe('1');
		expect(headers.get('X-API-Key')).toBeNull();
		expect(JSON.parse(String(calls[0]?.init?.body))).toEqual({ path: '/tmp' });
	});

	it('extracts Retry-After once for the plugin retry handler', async () => {
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			return new Response(
				JSON.stringify({ code: 429, message: 'Rate limit exceeded' }),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '4',
					},
				},
			);
		};

		// A failed API call has no return type; the branch below narrows its error.
		const result: unknown = await makeE2bRequest(
			e2bOperationRoutes['sandboxes.list'],
			'project-api-key',
			{},
		).catch((error: unknown) => error);

		expect(result).toBeInstanceOf(ApiError);
		if (result instanceof ApiError) {
			expect(result.status).toBe(429);
			expect(result.retryAfter).toBe(4000);
		}
		expect(calls).toHaveLength(1);
	});

	it('redacts secret request fields from propagated provider errors', async () => {
		const secretValue = 'xy';
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			return new Response(
				JSON.stringify({
					code: 400,
					message: `Invalid value ${secretValue}`,
					value: secretValue,
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		};

		// A caught rejection is unknown until it is narrowed to the transport error.
		const result: unknown = await makeE2bRequest(
			e2bOperationRoutes['secrets.create'],
			'project-api-key',
			{ body: { name: 'fixture-secret', value: secretValue } },
		).catch((error: unknown) => error);

		expect(result).toBeInstanceOf(ApiError);
		if (result instanceof ApiError) {
			expect(JSON.stringify(result.request.body)).not.toContain(secretValue);
			expect(JSON.stringify(result.body)).not.toContain(secretValue);
			expect(result.message).not.toContain(secretValue);
		}
	});

	it('redacts every environment variable value from propagated provider errors', async () => {
		const secretValue = 'env-secret-fixture';
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			return new Response(
				JSON.stringify({ code: 400, message: `bad env ${secretValue}` }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } },
			);
		};

		// A caught rejection is unknown until it is narrowed to the transport error.
		const result: unknown = await makeE2bRequest(
			e2bOperationRoutes['sandboxes.create'],
			'project-api-key',
			{
				body: {
					templateID: 'base',
					envVars: { OPENAI_API_KEY: secretValue },
				},
			},
		).catch((error: unknown) => error);

		expect(result).toBeInstanceOf(ApiError);
		if (result instanceof ApiError) {
			const body = JSON.stringify(result.request.body);
			expect(body).not.toContain(secretValue);
			expect(body).toContain('OPENAI_API_KEY');
			expect(JSON.stringify(result.body)).not.toContain(secretValue);
			expect(result.message).not.toContain(secretValue);
		}
	});

	it('redacts headers injected by network rule transforms', async () => {
		const secretValue = 'injected-header-fixture';
		globalThis.fetch = async () =>
			new Response(JSON.stringify({ code: 400, message: 'bad rule' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});

		// A caught rejection is unknown until it is narrowed to the transport error.
		const result: unknown = await makeE2bRequest(
			e2bOperationRoutes['sandboxes.updateNetwork'],
			'project-api-key',
			{
				path: { sandboxID: 'sandbox-test' },
				body: {
					rules: {
						'api.example.com': [
							{ transform: { headers: { 'X-Custom-Key': secretValue } } },
						],
					},
				},
			},
		).catch((error: unknown) => error);

		expect(result).toBeInstanceOf(ApiError);
		if (result instanceof ApiError) {
			expect(JSON.stringify(result.request.body)).not.toContain(secretValue);
		}
	});

	it('encodes slashes in path IDs so they cannot change the route', async () => {
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			return new Response(null, { status: 204 });
		};

		await makeE2bRequest(
			e2bOperationRoutes['sandboxes.kill'],
			'project-api-key',
			{
				path: { sandboxID: '../volumes/volume-test' },
			},
		);

		expect(calls[0]?.url).toBe(
			'https://api.e2b.app/sandboxes/..%2Fvolumes%2Fvolume-test',
		);
		expect(calls[0]?.init?.method).toBe('DELETE');
	});

	it('rejects dot segments as path IDs before calling E2B', async () => {
		globalThis.fetch = async (url, init) => {
			calls.push({ url: String(url), init });
			return new Response(null, { status: 204 });
		};

		for (const sandboxID of ['..', '.']) {
			await expect(
				makeE2bRequest(
					e2bOperationRoutes['sandboxes.kill'],
					'project-api-key',
					{
						path: { sandboxID },
					},
				),
			).rejects.toThrow('sandboxID');
		}
		expect(calls).toHaveLength(0);
	});

	it('redacts a secret fully when a shorter secret is its prefix', async () => {
		const longSecret = 'sk-secret-fixture';
		globalThis.fetch = async () =>
			new Response(
				JSON.stringify({ code: 400, message: `bad env ${longSecret}` }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } },
			);

		// A caught rejection is unknown until it is narrowed to the transport error.
		const result: unknown = await makeE2bRequest(
			e2bOperationRoutes['sandboxes.create'],
			'project-api-key',
			{
				body: {
					templateID: 'base',
					envVars: { PREFIX: 'sk-', KEY: longSecret },
				},
			},
		).catch((error: unknown) => error);

		expect(result).toBeInstanceOf(ApiError);
		if (result instanceof ApiError) {
			expect(JSON.stringify(result.body)).not.toContain('secret-fixture');
			expect(result.message).not.toContain('secret-fixture');
		}
	});

	it('keeps query values such as sandbox metadata out of propagated errors', async () => {
		const email = 'alice@example.com';
		globalThis.fetch = async () =>
			new Response(JSON.stringify({ code: 400, message: 'bad query' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});

		// A caught rejection is unknown until it is narrowed to the transport error.
		const result: unknown = await makeE2bRequest(
			e2bOperationRoutes['sandboxes.list'],
			'project-api-key',
			{ query: { metadata: `owner=${email}` } },
		).catch((error: unknown) => error);

		expect(result).toBeInstanceOf(ApiError);
		if (result instanceof ApiError) {
			expect(JSON.stringify(result.request)).not.toContain('alice');
			expect(result.url).not.toContain('alice');
			expect(result.message).not.toContain('alice');
		}
	});
});
