import { z } from 'zod';
import type { HubConfig } from '../hub/types';
import type {
	AiStepContext,
	HubAiRequestBody,
	HubInfer,
} from '../workflows/ai';
import { createAiStepCallback, resolveOpInputSchema } from '../workflows/ai';
import type { AiStepRequest } from '../workflows/execute';

const linearIssueInput = z.object({
	title: z.string(),
	description: z.string(),
	priority: z.number(),
});

function ctx(): AiStepContext {
	return {
		hub: {} as HubConfig, // unused: infer is injected in these tests
		plugins: [
			{
				id: 'linear',
				endpointSchemas: { 'issues.create': { input: linearIssueInput } },
			},
		],
		runId: 'run_1',
		workflowId: 'wf_1',
		tenantId: 'tenant_1',
	};
}

// Returns queued outputs in order; records every request body.
function fakeInfer(outputs: unknown[]) {
	const calls: HubAiRequestBody[] = [];
	let i = 0;
	const infer: HubInfer = async (body) => {
		calls.push(body);
		return { output: outputs[i++] };
	};
	return { infer, calls };
}

function objectReq(overrides: Partial<AiStepRequest> = {}): AiStepRequest {
	return {
		kind: 'object',
		stepName: 'triage',
		input: 'there is a bug',
		prompt: 'triage into a linear issue',
		returnObject: { op: 'linear.issues.create' },
		...overrides,
	};
}

describe('createAiStepCallback — object', () => {
	it('sends a JSON Schema and returns the validated object as a JSON string', async () => {
		const { infer, calls } = fakeInfer([
			{ title: 'Bug', description: 'boom', priority: 2 },
		]);
		const ai = createAiStepCallback(ctx(), infer);
		const out = await ai(objectReq());
		expect(JSON.parse(out)).toEqual({
			title: 'Bug',
			description: 'boom',
			priority: 2,
		});
		expect(calls).toHaveLength(1);
		expect(calls[0].kind).toBe('object');
		expect(calls[0].input).toBe('there is a bug');
		expect(calls[0].responseSchema).toBeDefined();
	});

	it('picks fields and strips everything else', async () => {
		const { infer } = fakeInfer([
			{ title: 'Bug', description: 'ignored', priority: 99 },
		]);
		const ai = createAiStepCallback(ctx(), infer);
		const out = await ai(
			objectReq({
				returnObject: { op: 'linear.issues.create', pick: ['title'] },
			}),
		);
		expect(JSON.parse(out)).toEqual({ title: 'Bug' });
	});

	it('retries once with the errors appended, then succeeds', async () => {
		const { infer, calls } = fakeInfer([
			{ title: 42, description: 'boom', priority: 2 }, // title wrong type
			{ title: 'Bug', description: 'boom', priority: 2 },
		]);
		const ai = createAiStepCallback(ctx(), infer);
		const out = await ai(objectReq());
		expect(JSON.parse(out)).toEqual({
			title: 'Bug',
			description: 'boom',
			priority: 2,
		});
		expect(calls).toHaveLength(2);
		expect(calls[1].prompt).toMatch(/failed validation/i);
	});

	it('throws after the retry is still invalid', async () => {
		const { infer, calls } = fakeInfer([{ title: 1 }, { title: 2 }]);
		const ai = createAiStepCallback(ctx(), infer);
		await expect(ai(objectReq())).rejects.toThrow(/did not match/i);
		expect(calls).toHaveLength(2);
	});
});

describe('createAiStepCallback — text / enum / bool', () => {
	it('text: no JSON Schema, returns the string JSON-encoded', async () => {
		const { infer, calls } = fakeInfer(['a short summary']);
		const ai = createAiStepCallback(ctx(), infer);
		const out = await ai({
			kind: 'text',
			stepName: 'sum',
			input: 'thread',
			prompt: 'summarize',
		});
		expect(JSON.parse(out)).toBe('a short summary');
		expect(calls[0].responseSchema).toBeUndefined();
	});

	it('enum: returns the chosen option', async () => {
		const { infer } = fakeInfer(['high']);
		const ai = createAiStepCallback(ctx(), infer);
		const out = await ai({
			kind: 'enum',
			stepName: 'sev',
			input: 'prod down',
			prompt: 'severity',
			options: ['low', 'high'],
		});
		expect(JSON.parse(out)).toBe('high');
	});

	it('enum: rejects a value outside the options', async () => {
		const { infer } = fakeInfer(['critical', 'critical']);
		const ai = createAiStepCallback(ctx(), infer);
		await expect(
			ai({
				kind: 'enum',
				stepName: 'sev',
				input: 'x',
				prompt: 'severity',
				options: ['low', 'high'],
			}),
		).rejects.toThrow(/did not match/i);
	});

	it('bool: returns a boolean', async () => {
		const { infer } = fakeInfer([false]);
		const ai = createAiStepCallback(ctx(), infer);
		const out = await ai({
			kind: 'bool',
			stepName: 'spam',
			input: 'hi',
			prompt: 'is this spam?',
		});
		expect(JSON.parse(out)).toBe(false);
	});
});

describe('op resolution', () => {
	it('resolves a real op to its input schema', () => {
		const schema = resolveOpInputSchema(ctx().plugins, 'linear.issues.create');
		expect(
			schema.safeParse({ title: 'x', description: 'y', priority: 1 }).success,
		).toBe(true);
	});

	it('rejects an unknown plugin', () => {
		expect(() =>
			resolveOpInputSchema(ctx().plugins, 'ghost.issues.create'),
		).toThrow(/Unknown plugin "ghost"/);
	});

	it('rejects an unknown op on a known plugin', () => {
		expect(() =>
			resolveOpInputSchema(ctx().plugins, 'linear.issues.nope'),
		).toThrow(/No input schema/);
	});
});
