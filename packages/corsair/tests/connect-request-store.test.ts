import {
	CONNECT_REQUEST_TTL_MS,
	clearConnectRequest,
	readConnectRequest,
	recordConnectRequest,
	recordConnectRequestBestEffort,
} from '../core/connect-request/store';
import { createTestDatabase } from './setup-db';

describe('connect-request store', () => {
	it('records a request and reads it back for the tenant', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await recordConnectRequest(database, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
			});
			const req = await readConnectRequest(database, 'acme');
			expect(req).toEqual({
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
				requestedAt: expect.any(String),
			});
		} finally {
			cleanup();
		}
	});

	it('keeps one row per tenant — the latest failure wins', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await recordConnectRequest(database, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/one',
			});
			await recordConnectRequest(database, {
				tenantId: 'acme',
				plugin: 'github',
				connectUrl: 'https://hub.corsair.dev/connect/two',
			});
			const req = await readConnectRequest(database, 'acme');
			expect(req?.plugin).toBe('github');
			expect(req?.connectUrl).toBe('https://hub.corsair.dev/connect/two');
		} finally {
			cleanup();
		}
	});

	it('scopes by tenant — another tenant sees nothing', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await recordConnectRequest(database, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
			});
			expect(await readConnectRequest(database, 'other')).toBeNull();
		} finally {
			cleanup();
		}
	});

	it('treats an expired request as gone', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{
					tenantId: 'acme',
					plugin: 'linear',
					connectUrl: 'https://hub.corsair.dev/connect/abc',
				},
				t0,
			);
			// still live just before the TTL, gone just after
			expect(
				await readConnectRequest(
					database,
					'acme',
					t0 + CONNECT_REQUEST_TTL_MS - 1,
				),
			).not.toBeNull();
			expect(
				await readConnectRequest(
					database,
					'acme',
					t0 + CONNECT_REQUEST_TTL_MS + 1,
				),
			).toBeNull();
		} finally {
			cleanup();
		}
	});

	it('clears a request', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await recordConnectRequest(database, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
			});
			await clearConnectRequest(database, 'acme');
			expect(await readConnectRequest(database, 'acme')).toBeNull();
		} finally {
			cleanup();
		}
	});
});

describe('recordConnectRequestBestEffort', () => {
	it('no-ops without a database, plugin, or connectUrl — never throws', async () => {
		await expect(
			recordConnectRequestBestEffort(undefined, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: 'x',
			}),
		).resolves.toBeUndefined();

		const { database, cleanup } = createTestDatabase();
		try {
			await recordConnectRequestBestEffort(database, {
				tenantId: 'acme',
				plugin: null,
				connectUrl: 'x',
			});
			await recordConnectRequestBestEffort(database, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: null,
			});
			expect(await readConnectRequest(database, 'acme')).toBeNull();
		} finally {
			cleanup();
		}
	});

	it('records when everything is present, defaulting a missing tenant', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await recordConnectRequestBestEffort(database, {
				tenantId: undefined,
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
			});
			expect(await readConnectRequest(database, 'default')).toMatchObject({
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
			});
		} finally {
			cleanup();
		}
	});
});
