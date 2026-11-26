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

	// The runtime's own refusals (a missing key, an unknown path, a project
	// slug asked for an instance route) carry `code`, not `error`.
	it('keeps the code, message and trace id of a runtime refusal', async () => {
		const t = transportWith(
			new Response(
				JSON.stringify({
					code: 'not_found',
					hop: 'internal',
					message: 'no route',
				}),
				{ status: 404, headers: { 'x-corsair-trace-id': 'trace_1' } },
			),
		);
		await expect(cloudRequest(t, 'GET', '/tenants')).rejects.toMatchObject({
			status: 404,
			code: 'not_found',
			message: 'no route',
			extra: { hop: 'internal', requestId: 'trace_1' },
		});
	});

	it('prefers a Request-Id header and keeps it on an SDK error too', async () => {
		const t = transportWith(
			new Response(
				JSON.stringify({
					error: 'not_connected',
					message: 'connect slack',
					reason: 'missing',
				}),
				{
					status: 409,
					headers: { 'request-id': 'req_1', 'x-corsair-trace-id': 'trace_1' },
				},
			),
		);
		await expect(
			cloudRequest(t, 'POST', '/default/slack/call/messages.post', {
				args: {},
			}),
		).rejects.toMatchObject({
			status: 409,
			code: 'not_connected',
			extra: { reason: 'missing', requestId: 'req_1' },
		});
	});

	it('still reads an unrecognised body as internal_error', async () => {
		const t = transportWith(
			new Response(JSON.stringify({ oops: true }), { status: 502 }),
		);
		await expect(cloudRequest(t, 'GET', '/tenants')).rejects.toMatchObject({
			status: 502,
			code: 'internal_error',
		});
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

	it('throws a typed error for a 2xx response with an empty body', async () => {
		const t = transportWith(new Response('', { status: 200 }));
		await expect(
			cloudRequest(t, 'GET', '/default/slack/status'),
		).rejects.toMatchObject({ status: 200, code: 'internal_error' });
	});

	it('throws a typed error for a 2xx response with unparseable JSON', async () => {
		const t = transportWith(new Response('not json', { status: 200 }));
		await expect(
			cloudRequest(t, 'GET', '/default/slack/status'),
		).rejects.toMatchObject({ status: 200, code: 'internal_error' });
	});

	it('maps a request timeout to a typed error, not a raw AbortError', async () => {
		const t: CloudTransport = {
			baseUrl: 'https://vm.example/proj/api/corsair',
			apiKey: 'ck_cloud_x',
			timeoutMs: 5,
			fetch: jest.fn(
				() =>
					new Promise<Response>(() => {
						/* never resolves */
					}),
			),
		};
		await expect(
			cloudRequest(t, 'GET', '/default/slack/status'),
		).rejects.toMatchObject({ code: 'internal_error', status: 0 });
	});
});
