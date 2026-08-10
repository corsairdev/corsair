import { computeStepId, executeWorkflowRun } from '../workflows/execute';

// A corsair client shaped like the real one (corsair.<plugin>.api.<path>), so
// step.corsair's op-id walk resolves against a nested `.api` tree. Records every
// op input so tests can assert the call (and its absence on replay).
function mockCorsair(calls: unknown[]) {
	return {
		linear: {
			api: {
				issues: {
					create: async (input: { title: string }) => {
						calls.push(input);
						return { id: 'ISSUE-1', ...input };
					},
				},
			},
		},
	};
}

function run(code: string, extra: Record<string, unknown> = {}) {
	const calls: unknown[] = [];
	const promise = executeWorkflowRun({
		corsair: mockCorsair(calls),
		code,
		payload: null,
		timeoutMs: 200,
		...extra,
	});
	return { promise, calls };
}

describe('step.corsair — typed op call', () => {
	it('resolves an op id, calls it, and records the memoized step', async () => {
		const { promise, calls } = run(`
			module.exports.main = async (corsair, payload, step) => {
				return step.corsair('create', 'linear.issues.create', { title: 'Bug' });
			};
		`);
		const result = await promise;
		expect(result.status).toBe('completed');
		expect(calls).toEqual([{ title: 'Bug' }]);
		expect(result.steps[0]).toEqual({
			stepId: computeStepId('create', 0),
			name: 'create',
			seq: 0,
			status: 'completed',
			output: { id: 'ISSUE-1', title: 'Bug' },
		});
	});

	it('replays a memoized op without re-calling it', async () => {
		const stepId = computeStepId('create', 0);
		const { promise, calls } = run(
			`
			module.exports.main = async (corsair, payload, step) => {
				await step.corsair('create', 'linear.issues.create', { title: 'Bug' });
			};
		`,
			{ memoizedSteps: { [stepId]: { output: { id: 'CACHED' } } } },
		);
		const result = await promise;
		expect(result.status).toBe('completed');
		expect(calls).toEqual([]);
		// Replayed step is not re-reported (Hub already has it persisted).
		expect(result.steps).toEqual([]);
	});

	it('fails the step when the op path does not resolve to a function', async () => {
		const { promise, calls } = run(`
			module.exports.main = async (corsair, payload, step) => {
				return step.corsair('create', 'linear.issues.missing', {});
			};
		`);
		const result = await promise;
		expect(result.status).toBe('failed');
		expect(calls).toEqual([]);
		expect(result.error?.failedStep).toBe('create');
		expect(result.error?.message).toContain(
			'Unknown op "linear.issues.missing"',
		);
	});

	it('fails on a malformed op id (no plugin segment)', async () => {
		const { promise } = run(`
			module.exports.main = async (corsair, payload, step) => {
				return step.corsair('create', 'noplugin', {});
			};
		`);
		const result = await promise;
		expect(result.status).toBe('failed');
		expect(result.error?.message).toContain('Invalid op "noplugin"');
	});
});

describe('step.sleepUntil — absolute-time pause', () => {
	it('suspends until a future time', async () => {
		const when = new Date(Date.now() + 60_000).toISOString();
		const { promise } = run(`
			module.exports.main = async (corsair, payload, step) => {
				await step.sleepUntil('wait', ${JSON.stringify(when)});
				await step('after', async () => 'ran');
			};
		`);
		const result = await promise;
		expect(result.status).toBe('sleeping');
		// Within a few seconds of the requested wake time (host clock vs sandbox clock).
		const drift = Math.abs(
			new Date(result.sleepUntil!).getTime() - new Date(when).getTime(),
		);
		expect(drift).toBeLessThan(5_000);
		// The step after the pause did not run this attempt.
		expect(result.steps.map((s) => s.name)).toEqual(['wait']);
	});

	it('accepts an epoch-ms number and a past time (0-delay pause)', async () => {
		const { promise } = run(`
			module.exports.main = async (corsair, payload, step) => {
				await step.sleepUntil('wait', ${Date.now() - 10_000});
			};
		`);
		const result = await promise;
		expect(result.status).toBe('sleeping');
		expect(new Date(result.sleepUntil!).getTime()).toBeLessThanOrEqual(
			Date.now() + 1_000,
		);
	});
});
