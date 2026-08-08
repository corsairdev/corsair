import { deriveAck, pollOnce } from '../hub/connect/loop';

const hub = {
	apiUrl: 'https://hub.test',
	projectApiKey: 'ck_dev_abc',
	signingSecret: 's',
	allowWorkflowExecution: true,
} as any;

function res(status: number, json?: unknown): Response {
	return {
		status,
		ok: status >= 200 && status < 300,
		json: async () => json,
	} as unknown as Response;
}

describe('deriveAck', () => {
	it('maps a run success to its webhookResponse', () => {
		expect(
			deriveAck({
				status: 'ok',
				webhookResponse: { status: 200, body: { status: 'ok', run: { x: 1 } } },
			} as any),
		).toEqual({ status: 200, body: { status: 'ok', run: { x: 1 } } });
	});

	it('maps a failure to 502 with the error', () => {
		expect(deriveAck({ status: 'failed', error: 'boom' } as any)).toEqual({
			status: 502,
			body: { status: 'error', error: 'boom' },
		});
	});
});

describe('pollOnce', () => {
	it('returns idle on 204 and does not call process', async () => {
		const fetchMock = jest.fn(async () => res(204));
		const process = jest.fn();
		const out = await pollOnce({}, hub, {
			fetch: fetchMock as any,
			process: process as any,
		});
		expect(out).toBe('idle');
		expect(process).not.toHaveBeenCalled();
	});

	it('processes an envelope and posts the ack', async () => {
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce(
				res(200, {
					deliveryId: 'd1',
					body: '{"type":"run"}',
					headers: { 'x-corsair-signature': 'sha256=x' },
				}),
			)
			.mockResolvedValueOnce(res(200, { ok: true }));
		const process = jest.fn(async () => ({
			status: 'ok',
			webhookResponse: { status: 200, body: { status: 'ok' } },
		}));
		const out = await pollOnce({}, hub, {
			fetch: fetchMock as any,
			process: process as any,
		});
		expect(out).toBe('handled');
		expect(process).toHaveBeenCalledWith(
			{},
			{
				headers: { 'x-corsair-signature': 'sha256=x' },
				body: '{"type":"run"}',
			},
			{ signingSecret: 's', allowWorkflowExecution: true },
		);
		const ackCall = fetchMock.mock.calls[1] as unknown[];
		expect(ackCall[0]).toBe('https://hub.test/api/dev/ack');
		expect(JSON.parse((ackCall[1] as { body: string }).body)).toMatchObject({
			deliveryId: 'd1',
			status: 200,
		});
	});

	it('returns error on a non-204/2xx pull', async () => {
		const fetchMock = jest.fn(async () => res(500));
		const out = await pollOnce({}, hub, {
			fetch: fetchMock as any,
			process: jest.fn() as any,
		});
		expect(out).toBe('error');
	});
});
