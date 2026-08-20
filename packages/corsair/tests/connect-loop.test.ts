import { CORSAIR_INTERNAL } from '../core';
import { deriveAck, pollOnce, startConnectLoop } from '../hub/connect/loop';

function mockCorsair(
	projectApiKey: string,
	allowWorkflowExecution = true,
): unknown {
	return {
		[CORSAIR_INTERNAL]: {
			plugins: [],
			kek: 'test-kek-with-at-least-32-characters!!',
			multiTenancy: false,
			hub: {
				apiUrl: 'https://hub.test',
				projectApiKey,
				signingSecret: 's',
				allowWorkflowExecution,
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

const pulled = (extra?: Record<string, unknown>) =>
	res(200, {
		deliveryId: 'd1',
		body: '{"type":"run"}',
		headers: { 'x-corsair-signature': 'sha256=x' },
		...extra,
	});

const okRun = () =>
	jest.fn(async () => ({
		status: 'ok',
		webhookResponse: { status: 200, body: { status: 'ok' } },
	}));

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
			.mockResolvedValueOnce(pulled())
			.mockResolvedValueOnce(res(200, { ok: true }));
		const process = okRun();
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

	it('treats a stale ack (ok:false) as handled without retrying', async () => {
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce(pulled())
			.mockResolvedValueOnce(res(200, { ok: false }));
		const out = await pollOnce({}, hub, {
			fetch: fetchMock as any,
			process: okRun() as any,
		});
		expect(out).toBe('handled');
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('retries a transiently failed ack and succeeds', async () => {
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce(pulled())
			.mockResolvedValueOnce(res(503))
			.mockResolvedValueOnce(res(200, { ok: true }));
		const out = await pollOnce({}, hub, {
			fetch: fetchMock as any,
			process: okRun() as any,
		});
		expect(out).toBe('handled');
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	it('returns error when the ack never lands', async () => {
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce(pulled())
			.mockResolvedValue(res(500));
		const out = await pollOnce({}, hub, {
			fetch: fetchMock as any,
			process: okRun() as any,
		});
		expect(out).toBe('error');
		// 1 pull + 3 ack attempts
		expect(fetchMock).toHaveBeenCalledTimes(4);
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

	it('warns and does not poll for a dev key with execution disabled', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(res(204));
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const handle = startConnectLoop(mockCorsair('ck_dev_noexec', false));
		await Promise.resolve();
		expect(fetchSpy).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('workflow executions not enabled'),
		);
		handle.stop();
		warnSpy.mockRestore();
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

	// A pull that blocks until its request is aborted, so a stop() can be
	// observed while a pull is genuinely in flight.
	function blockingDeps() {
		const state = { starts: 0, aborts: 0 };
		const deps = {
			fetch: ((_url: string, init?: { signal?: AbortSignal }) => {
				state.starts++;
				return new Promise<Response>((_resolve, reject) => {
					init?.signal?.addEventListener('abort', () => {
						state.aborts++;
						const err = new Error('aborted');
						err.name = 'AbortError';
						reject(err);
					});
				});
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
		first.stop();
		await sleep(40);
		const afterStop = state.calls;
		await sleep(40);
		expect(state.calls).toBe(afterStop);
		second.stop();
	});

	it('frees the key on stop so an immediate restart runs exactly one loop', async () => {
		const a = blockingDeps();
		const first = startConnectLoop(mockCorsair('ck_dev_owner'), a.deps);
		await sleep(10);
		expect(a.state.starts).toBe(1);

		first.stop();
		expect(a.state.aborts).toBe(1);

		const b = blockingDeps();
		const second = startConnectLoop(mockCorsair('ck_dev_owner'), b.deps);
		await sleep(10);
		// The restart actually started (the key was freed), and the old loop is
		// gone — only the new loop is polling.
		expect(b.state.starts).toBe(1);
		second.stop();
		await sleep(10);
		expect(b.state.aborts).toBe(1);
	});
});
