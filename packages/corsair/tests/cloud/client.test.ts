import { buildCloudClient } from '../../core/cloud/client';

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

	it('rejects db/keys/webhooks as not available in cloud mode', () => {
		const client = buildCloudClient([{ id: 'slack' } as any], {
			transport: {} as any,
			tenantId: 'acme',
		});
		expect(() => (client as any).slack.db).toThrow(/cloud mode/);
		expect(() => (client as any).slack.keys).toThrow(/cloud mode/);
		expect(() => (client as any).slack.webhooks).toThrow(/cloud mode/);
	});
});
