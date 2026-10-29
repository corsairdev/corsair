import { computeStepId, executeWorkflowRun } from '../workflows/execute';

// A mock tenant client. `db.query` echoes its arg so tests can prove the
// membrane lets normal calls through and hardens the result.
function mockCorsair() {
	return {
		token: 'secret-should-not-leak',
		db: {
			query: async (x: unknown) => ({ rows: [x] }),
		},
	};
}

function run(code: string, extra: Record<string, unknown> = {}) {
	return executeWorkflowRun({
		corsair: mockCorsair(),
		code,
		payload: null,
		timeoutMs: 200,
		...extra,
	});
}

describe('executeWorkflowRun — happy path', () => {
	it('runs a step and reports it completed', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				await step('greet', async () => 'hello');
			};
		`);
		expect(result.status).toBe('completed');
		expect(result.steps).toEqual([
			{
				stepId: computeStepId('greet', 0),
				name: 'greet',
				seq: 0,
				status: 'completed',
				output: 'hello',
			},
		]);
	});

	it('gives distinct stepIds to reused names (loops) but stable ones across attempts', async () => {
		const a = computeStepId('sync', 0);
		const b = computeStepId('sync', 1);
		expect(a).not.toBe(b);
		expect(computeStepId('sync', 0)).toBe(a);
		// Pin the wire format: Hub persists these as cross-version memo keys, so a
		// change to the hash input/digest/truncation must break this test.
		expect(a).toMatch(/^st_[0-9a-f]{16}$/);
		expect(a).toBe('st_db505c3e4b022e6f');
	});

	it('passes calls through the membrane and hardens the result', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				await step('query', async () => {
					const r = await corsair.db.query('ping');
					return r.rows[0];
				});
			};
		`);
		expect(result.status).toBe('completed');
		expect(result.steps[0].output).toBe('ping');
	});
});

describe('executeWorkflowRun — sandbox isolation', () => {
	it('blocks the constructor.constructor escape on host objects', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				await step('escape', async () => {
					try {
						const Fn = corsair.db.query.constructor.constructor;
						return 'leaked:' + typeof Fn('return process')();
					} catch (e) {
						return 'blocked:' + (e && e.name);
					}
				});
			};
		`);
		expect(result.status).toBe('completed');
		expect(result.steps[0].output).toMatch(/^blocked:/);
	});

	it('has no host globals in scope', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				await step('globals', async () => JSON.stringify({
					process: typeof process,
					Buffer: typeof Buffer,
					fetch: typeof fetch,
				}));
			};
		`);
		expect(JSON.parse(result.steps[0].output as string)).toEqual({
			process: 'undefined',
			Buffer: 'undefined',
			fetch: 'undefined',
		});
	});

	it('rejects require()', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				const fs = require('fs');
			};
		`);
		expect(result.status).toBe('failed');
		expect(result.error?.message).toMatch(/may not import modules/);
	});
});

describe('executeWorkflowRun — replay / memoization', () => {
	it('replays memoized steps without re-running them, keeping seq stable', async () => {
		// `a` throws if executed — proving the memoized value is returned instead.
		const result = await run(
			`
			module.exports.main = async (corsair, payload, step) => {
				const a = await step('a', async () => { throw new Error('should-not-run'); });
				await step('b', async () => 'B:' + a);
			};
		`,
			{ memoizedSteps: { [computeStepId('a', 0)]: { output: 'memoA' } } },
		);
		expect(result.status).toBe('completed');
		// Only the freshly-run step is reported; `b` still gets seq 1 because the
		// replayed `a` advances the counter.
		expect(result.steps).toEqual([
			{
				stepId: computeStepId('b', 1),
				name: 'b',
				seq: 1,
				status: 'completed',
				output: 'B:memoA',
			},
		]);
	});

	it('reports the failed step name', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				await step('boom', async () => { throw new Error('kaboom'); });
			};
		`);
		expect(result.status).toBe('failed');
		expect(result.error).toEqual({ message: 'kaboom', failedStep: 'boom' });
	});
});

describe('executeWorkflowRun — sleep', () => {
	it('unwinds on step.sleep and resumes past it on the next attempt', async () => {
		const code = `
			module.exports.main = async (corsair, payload, step) => {
				await step('one', async () => 1);
				await step.sleep('nap', 60000);
				await step('two', async () => 2);
			};
		`;

		const first = await run(code);
		expect(first.status).toBe('sleeping');
		expect(Number.isNaN(Date.parse(first.sleepUntil as string))).toBe(false);
		expect(first.steps.map((s) => s.name)).toEqual(['one', 'nap']);

		const second = await run(code, {
			memoizedSteps: {
				[computeStepId('one', 0)]: { output: 1 },
				[computeStepId('nap', 1)]: { output: null },
			},
		});
		expect(second.status).toBe('completed');
		expect(second.steps).toEqual([
			{
				stepId: computeStepId('two', 2),
				name: 'two',
				seq: 2,
				status: 'completed',
				output: 2,
			},
		]);
	});

	it('does not crash on a non-finite sleep duration (B3)', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				await step.sleep('nap', NaN);
			};
		`);
		expect(result.status).toBe('sleeping');
		expect(Number.isNaN(Date.parse(result.sleepUntil as string))).toBe(false);
	});

	it('still pauses when a broad try/catch swallows the sleep and more steps follow', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				try { await step.sleep('nap', 60000); } catch (e) { /* swallow */ }
				await step('after', async () => 'ran');
			};
		`);
		// The pause re-asserts on the next step call, so 'after' never runs.
		expect(result.status).toBe('sleeping');
		expect(result.steps.map((s) => s.name)).toEqual(['nap']);
	});

	it('still pauses when the sleep is swallowed and main returns normally', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				try { await step.sleep('nap', 60000); } catch (e) { /* swallow */ }
			};
		`);
		expect(result.status).toBe('sleeping');
		expect(result.steps.map((s) => s.name)).toEqual(['nap']);
	});
});

describe('executeWorkflowRun — resource limits (B1)', () => {
	it('aborts a synchronous runaway via the vm timeout', async () => {
		const result = await run(
			`module.exports.main = async () => { while (true) {} };`,
			{ timeoutMs: 100 },
		);
		expect(result.status).toBe('failed');
	});

	it('aborts a hung workflow via the wall-clock cap', async () => {
		const result = await run(
			`module.exports.main = async () => { await new Promise(() => {}); };`,
			{ timeoutMs: 100 },
		);
		expect(result.status).toBe('failed');
		expect(result.error?.message).toMatch(/time limit/);
	});
});
