import { buildCloudClient } from '../../core/cloud/client';
import { runReadonly, runWithMode } from '../../core/permissions';
import type { CorsairPlugin } from '../../core/plugins';

describe('buildCloudClient', () => {
	it('routes a nested op to the invoke path', async () => {
		const fetchMock = jest
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ data: { ts: '1' } }), { status: 200 }),
			);
		const transport = {
			baseUrl: 'https://vm/proj/api/corsair',
			apiKey: 'ck_cloud_x',
			fetch: fetchMock,
		};
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport,
			tenantId: 'acme',
		});
		const out = await (client as any).slack.api.messages.post({
			channel: '#g',
			text: 'hi',
		});
		expect(out).toEqual({ ts: '1' });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(
			'https://vm/proj/api/corsair/acme/slack/call/messages.post',
		);
		expect(JSON.parse(init.body)).toEqual({
			args: { channel: '#g', text: 'hi' },
		});
	});

	it('URL-encodes tenantId while preserving dots in the op path', async () => {
		const fetchMock = jest
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ data: {} }), { status: 200 }),
			);
		const transport = {
			baseUrl: 'https://vm/proj/api/corsair',
			apiKey: 'ck_cloud_x',
			fetch: fetchMock,
		};
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport,
			tenantId: 'a/b',
		});
		await (client as any).slack.api.messages.post({});
		const [url] = fetchMock.mock.calls[0];
		expect(url).toBe(
			'https://vm/proj/api/corsair/a%2Fb/slack/call/messages.post',
		);
	});

	it('rejects a call to a plugin not in the client', () => {
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {} as any,
			tenantId: 'acme',
		});
		expect(() => (client as any).notaplugin.api.x.y()).toThrow();
	});

	it('rejects keys/webhooks as not available in cloud mode', () => {
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {} as any,
			tenantId: 'acme',
		});
		expect(() => (client as any).slack.keys).toThrow(/cloud mode/);
		expect(() => (client as any).slack.webhooks).toThrow(/cloud mode/);
	});

	it('routes an entity-store call over HTTP', async () => {
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(JSON.stringify({ data: { entityId: 'C1' } }), {
				status: 200,
			}),
		);
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {
				baseUrl: 'https://vm/p/api/corsair',
				apiKey: 'ck',
				fetch: fetchMock as any,
			},
			tenantId: 'acme',
		});
		const row = await (client as any).slack.db.channels.findByEntityId('C1');
		expect(row).toEqual({ entityId: 'C1' });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(
			'https://vm/p/api/corsair/acme/slack/db/channels/findByEntityId',
		);
		expect(JSON.parse(init.body)).toEqual({ args: ['C1'] });
	});

	it('sends a Date argument as a marker, since a bare ISO string is dropped', async () => {
		const fetchMock = jest
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ data: [] }), { status: 200 }),
			);
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {
				baseUrl: 'https://vm/p/api/corsair',
				apiKey: 'ck',
				fetch: fetchMock as any,
			},
			tenantId: 'acme',
		});
		await (client as any).slack.db.channels.search({
			data: { created_at: { after: new Date('2026-01-01T00:00:00.000Z') } },
		});
		expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
			args: [
				{
					data: {
						created_at: { after: { $date: '2026-01-01T00:00:00.000Z' } },
					},
				},
			],
		});
	});

	it('refuses a db write inside a readonly scope, and allows a read', async () => {
		const fetchMock = jest
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ data: 7 }), { status: 200 }),
			);
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {
				baseUrl: 'https://vm/p/api/corsair',
				apiKey: 'ck',
				fetch: fetchMock as any,
			},
			tenantId: 'acme',
		});

		for (const method of ['upsertByEntityId', 'deleteByEntityId']) {
			await expect(
				runReadonly(() => (client as any).slack.db.channels[method]('C1')),
			).rejects.toThrow(/readonly|read-only/i);
		}
		expect(fetchMock).not.toHaveBeenCalled();

		await expect(
			runReadonly(() => (client as any).slack.db.channels.count()),
		).resolves.toBe(7);
	});

	it('does not expose a method outside the entity-client surface', () => {
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {} as any,
			tenantId: 'acme',
		});
		expect((client as any).slack.db.channels.constructor).toBeUndefined();
		expect((client as any).slack.db.channels.dropTable).toBeUndefined();
	});

	it('rejects chats/workflows as not available in cloud mode', () => {
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {} as any,
			tenantId: 'acme',
		});
		expect(() => (client as any).chats).toThrow(/cloud mode/);
		expect(() => (client as any).workflows).toThrow(/cloud mode/);
	});

	it('a partial path is not thenable, so awaiting it issues no request', async () => {
		const fetchMock = jest.fn();
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {
				baseUrl: 'https://vm/p/api/corsair',
				apiKey: 'k',
				fetch: fetchMock,
			},
			tenantId: 'acme',
		});
		const partial = (client as any).slack.api.messages;
		expect(partial.then).toBeUndefined();
		await partial;
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('the client itself is not thenable', async () => {
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {} as any,
			tenantId: 'acme',
		});
		expect((client as any).then).toBeUndefined();
		await client;
	});
});

type Probe = {
	slack: {
		api: { messages: { post(args: object): Promise<null> } };
		db: {
			channels: {
				list(): Promise<null>;
				deleteById(id: string): Promise<null>;
			};
		};
	};
};

describe('the caller mode over the wire', () => {
	function harness() {
		const fetchMock = jest
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ data: null }), { status: 200 }),
			);
		const client = buildCloudClient([{ id: 'slack' } as CorsairPlugin], {
			transport: {
				baseUrl: 'https://vm/proj/api/corsair',
				apiKey: 'ck_cloud_x',
				fetch: fetchMock,
			},
			tenantId: 'acme',
		});
		// CorsairClient's op tree is keyed off the plugin tuple's types, which a
		// bare `{ id }` does not carry, so the paths are named here instead.
		return { client: client as unknown as Probe, fetchMock };
	}

	const sentMode = (fetchMock: jest.Mock): string | undefined =>
		fetchMock.mock.calls[0][1].headers['x-corsair-mode'];

	it('sends nothing with no scope open', async () => {
		const { client, fetchMock } = harness();
		await client.slack.api.messages.post({});
		expect(sentMode(fetchMock)).toBeUndefined();
	});

	// The scope is process-local, so an op the server judges by risk can only
	// honour the caller's mode if it travels.
	it('sends the mode on an operation call', async () => {
		const { client, fetchMock } = harness();
		await runWithMode('cautious', () => client.slack.api.messages.post({}));
		expect(sentMode(fetchMock)).toBe('cautious');
	});

	it('sends the mode on an entity read', async () => {
		const { client, fetchMock } = harness();
		await runWithMode('strict', () => client.slack.db.channels.list());
		expect(sentMode(fetchMock)).toBe('strict');
	});

	it('refuses an entity delete before it reaches the wire', async () => {
		const { client, fetchMock } = harness();
		await expect(
			runWithMode('strict', () => client.slack.db.channels.deleteById('c1')),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
