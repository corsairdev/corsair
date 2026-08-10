import { computeStepId, executeWorkflowRun } from '../workflows/execute';

function mockCorsair() {
	return { db: { query: async (x: unknown) => ({ rows: [x] }) } };
}

// Records ai calls; returns JSON-encoded canned output keyed by stepName.
function stubAi(outputs: Record<string, unknown>) {
	const calls: Array<Record<string, unknown>> = [];
	const ai = async (req: Record<string, unknown>): Promise<string> => {
		calls.push(req);
		return JSON.stringify(outputs[req.stepName as string] ?? null);
	};
	return { ai, calls };
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

describe('step.ai — verbs', () => {
	it('object: passes a typed request and returns the parsed object', async () => {
		const { ai, calls } = stubAi({ triage: { title: 'Bug', priority: 2 } });
		const result = await run(
			`
			module.exports.main = async (corsair, payload, step) => {
				const draft = await step.ai.object('triage', {
					input: 'there is a bug',
					prompt: 'triage into a linear issue',
					returnObject: { op: 'linear.issues.create', pick: ['title'] },
				});
				await step('use', async () => draft.title + ':' + draft.priority);
			};
		`,
			{ ai },
		);
		expect(result.status).toBe('completed');
		expect(calls).toEqual([
			{
				kind: 'object',
				stepName: 'triage',
				input: 'there is a bug',
				prompt: 'triage into a linear issue',
				returnObject: { op: 'linear.issues.create', pick: ['title'] },
			},
		]);
		expect(result.steps[0]).toEqual({
			stepId: computeStepId('triage', 0),
			name: 'triage',
			seq: 0,
			status: 'completed',
			output: { title: 'Bug', priority: 2 },
		});
		expect(result.steps[1].output).toBe('Bug:2');
	});

	it('callable: returns a plain string (text)', async () => {
		const { ai } = stubAi({ sum: 'a short summary' });
		const result = await run(
			`
			module.exports.main = async (corsair, payload, step) => {
				const s = await step.ai('sum', { input: 'long thread', prompt: 'summarize' });
				await step('out', async () => s.toUpperCase());
			};
		`,
			{ ai },
		);
		expect(result.status).toBe('completed');
		expect(result.steps[0].output).toBe('a short summary');
		expect(result.steps[1].output).toBe('A SHORT SUMMARY');
	});

	it('enum: forwards options and returns the chosen one', async () => {
		const { ai, calls } = stubAi({ sev: 'high' });
		const result = await run(
			`
			module.exports.main = async (corsair, payload, step) => {
				await step.ai.enum('sev', { input: 'prod down', prompt: 'severity', options: ['low','high'] });
			};
		`,
			{ ai },
		);
		expect(result.status).toBe('completed');
		expect(calls[0].options).toEqual(['low', 'high']);
		expect(result.steps[0].output).toBe('high');
	});

	it('bool: returns a boolean', async () => {
		const { ai } = stubAi({ spam: false });
		const result = await run(
			`
			module.exports.main = async (corsair, payload, step) => {
				await step.ai.bool('spam', { input: 'hello', prompt: 'is this spam?' });
			};
		`,
			{ ai },
		);
		expect(result.status).toBe('completed');
		expect(result.steps[0].output).toBe(false);
	});
});

describe('step.ai — memoization & failure', () => {
	it('replays a memoized ai step without calling ai again', async () => {
		const ai = async () => {
			throw new Error('ai should not be called on replay');
		};
		const result = await run(
			`
			module.exports.main = async (corsair, payload, step) => {
				const draft = await step.ai.object('triage', { input: 'x', prompt: 'p', returnObject: { op: 'linear.issues.create' } });
				await step('use', async () => 'title=' + draft.title);
			};
		`,
			{
				ai,
				memoizedSteps: {
					[computeStepId('triage', 0)]: { output: { title: 'MEMO' } },
				},
			},
		);
		expect(result.status).toBe('completed');
		expect(result.steps).toEqual([
			{
				stepId: computeStepId('use', 1),
				name: 'use',
				seq: 1,
				status: 'completed',
				output: 'title=MEMO',
			},
		]);
	});

	it('a rejecting ai call fails the step with its name', async () => {
		const ai = async () => {
			throw new Error('gateway exploded');
		};
		const result = await run(
			`
			module.exports.main = async (corsair, payload, step) => {
				await step.ai.object('triage', { input: 'x', prompt: 'p', returnObject: { op: 'linear.issues.create' } });
			};
		`,
			{ ai },
		);
		expect(result.status).toBe('failed');
		expect(result.error).toEqual({
			message: 'gateway exploded',
			failedStep: 'triage',
		});
	});

	it('fails clearly when step.ai is used but no ai capability is wired', async () => {
		const result = await run(`
			module.exports.main = async (corsair, payload, step) => {
				await step.ai('sum', { input: 'x', prompt: 'p' });
			};
		`);
		expect(result.status).toBe('failed');
		expect(result.error?.message).toMatch(/step\.ai/i);
	});
});
