import { CORSAIR_INTERNAL } from '../core';
import { deriveAck, pollOnce, startConnectLoop } from '../hub/connect/loop';

function mockCorsair(projectApiKey: string): unknown {
	return {
		[CORSAIR_INTERNAL]: {
			plugins: [],
			kek: 'test-kek-with-at-least-32-characters!!',
			multiTenancy: false,
			hub: {
				apiUrl: 'https://hub.test',
				projectApiKey,
				signingSecret: 's',
				allowWorkflowExecution: true,
			},
		},
	};
}

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

describe('startConnectLoop', () => {
	it('is a no-op when the hub is not configured', () => {
		const handle = startConnectLoop({});
		expect(typeof handle.stop).toBe('function');
		handle.stop();
	});

	it('does not start the loop for a non-dev (prod) key', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(res(204));
		const handle = startConnectLoop(mockCorsair('ck_prod_abc'));
		await Promise.resolve();
		expect(fetchSpy).not.toHaveBeenCalled();
		handle.stop();
		fetchSpy.mockRestore();
	});

	function countingIdleDeps() {
		const state = { calls: 0 };
		const deps = {
			fetch: (async () => {
				state.calls++;
				await sleep(5);
				return res(204);
			}) as unknown as typeof fetch,
			process: (async () => ({ status: 'ok' })) as any,
		};
		return { state, deps };
	}

	it('polls while running and halts on stop()', async () => {
		const { state, deps } = countingIdleDeps();
		const handle = startConnectLoop(mockCorsair('ck_dev_runtest'), deps);
		await sleep(40);
		expect(state.calls).toBeGreaterThan(0);
		handle.stop();
		await sleep(40);
		const afterStop = state.calls;
		await sleep(40);
		expect(state.calls).toBe(afterStop);
	});

	it('does not spawn a second loop for the same project key', async () => {
		const { state, deps } = countingIdleDeps();
		const first = startConnectLoop(mockCorsair('ck_dev_dedupe'), deps);
		const second = startConnectLoop(mockCorsair('ck_dev_dedupe'), deps);
		await sleep(40);
		expect(state.calls).toBeGreaterThan(0);
		// Stopping the one real loop must halt all polling — proving the second
		// call did not start its own loop.
		first.stop();
		await sleep(40);
		const afterStop = state.calls;
		await sleep(40);
		expect(state.calls).toBe(afterStop);
		second.stop();
	});
});
