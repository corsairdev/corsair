import type { CloudTransport } from '../../core/cloud/http';
import { cloudRequest } from '../../core/cloud/http';

function transportWith(res: Response): CloudTransport {
	return {
		baseUrl: 'https://vm.example/proj/api/corsair',
		apiKey: 'ck_cloud_x',
		fetch: jest.fn().mockResolvedValue(res),
	};
}

describe('cloudRequest', () => {
	it('sends bearer auth and returns parsed data', async () => {
		const t = transportWith(
			new Response(JSON.stringify({ data: { ok: 1 } }), { status: 200 }),
		);
		const out = await cloudRequest<{ data: { ok: number } }>(
			t,
			'POST',
			'/default/slack/call/messages.post',
			{ args: {} },
		);
		expect(out).toEqual({ data: { ok: 1 } });
		const call = (t.fetch as jest.Mock).mock.calls[0];
		expect(call[0]).toBe(
			'https://vm.example/proj/api/corsair/default/slack/call/messages.post',
		);
		expect((call[1].headers as Record<string, string>).authorization).toBe(
			'Bearer ck_cloud_x',
		);
	});

	it('maps an error envelope to a typed error', async () => {
		const t = transportWith(
			new Response(
				JSON.stringify({ error: 'not_connected', message: 'connect slack' }),
				{ status: 400 },
			),
		);
		await expect(
			cloudRequest(t, 'POST', '/default/slack/call/messages.post', {
				args: {},
			}),
		).rejects.toMatchObject({ code: 'not_connected' });
	});

	it('tolerates a trailing slash on baseUrl and a leading slash on path', async () => {
		const t: CloudTransport = {
			baseUrl: 'https://vm.example/proj/api/corsair/',
			apiKey: 'ck_cloud_x',
			fetch: jest
				.fn()
				.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 })),
		};
		await cloudRequest(t, 'GET', '/default/slack/status');
		const call = (t.fetch as jest.Mock).mock.calls[0];
		expect(call[0]).toBe(
			'https://vm.example/proj/api/corsair/default/slack/status',
		);
	});
});
