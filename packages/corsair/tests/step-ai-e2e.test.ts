import { z } from 'zod';
import type { HubAiRequestBody, HubInfer } from '../workflows/ai';
import { createAiStepCallback } from '../workflows/ai';
import { executeWorkflowRun } from '../workflows/execute';

// End-to-end through the REAL step.ai path. Everything runs for real — the vm
// executor, op-schema resolution, z.toJSONSchema, Zod validation, the corrective
// retry, memoization, and the downstream corsair op — EXCEPT the single network
// hop to Hub (`HubInfer`), which we stub with a canned model output. Swapping the
// stub for the live `/workflows/ai` route + a real gateway key is the only
// difference between this and a production run.

// The plugin's real input Zod, as it lives host-side in packages/linear. step.ai
// resolves `linear.issues.create` to this and derives the response JSON Schema.
const linearIssueCreateInput = z.object({
	teamId: z.string(),
	title: z.string(),
	description: z.string().optional(),
	priority: z.number().int().min(0).max(4).optional(),
});

const plugins = [
	{
		id: 'linear',
		endpointSchemas: { 'issues.create': { input: linearIssueCreateInput } },
	},
];

function mockCorsair(calls: unknown[]) {
	return {
		linear: {
			api: {
				issues: {
					create: async (input: Record<string, unknown>) => {
						calls.push(input);
						return {
							id: 'ISSUE-42',
							url: 'https://linear.app/acme/ISSUE-42',
							...input,
						};
					},
				},
			},
		},
	};
}

// A realistic generated workflow (type annotations stripped, as the Hub transpiler
// delivers it). Slack bug message -> AI drafts an issue typed to the create op ->
// the same op writes it.
const GENERATED_WORKFLOW = `
	module.exports.main = async (corsair, payload, step) => {
		if (!/bug/i.test(payload.event.text)) return;

		const draft = await step.ai.object("draft-issue", {
			input: payload.event.text,
			prompt: "Turn this Slack bug report into a Linear issue title + description.",
			returnObject: { op: "linear.issues.create", pick: ["title", "description"] },
		});

		await step("create-issue", async () =>
			corsair.linear.api.issues.create({
				teamId: "team_9f2c",
				title: draft.title,
				description: draft.description,
			}),
		);
	};
`;

describe('step.ai — end to end on a generated workflow', () => {
	it('drafts a typed object and feeds it into the create op', async () => {
		const calls: unknown[] = [];
		const inferCalls: HubAiRequestBody[] = [];
		const infer: HubInfer = async (body) => {
			inferCalls.push(body);
			return {
				output: {
					title: 'Checkout submit throws 500',
					description: 'Users report the checkout submit button returns a 500.',
				},
				model: 'gpt-5.6-sol',
			};
		};
		const ai = createAiStepCallback(
			{
				hub: {} as never,
				plugins,
				runId: 'run_1',
				workflowId: 'wf_1',
				tenantId: 'acme',
			},
			infer,
		);

		const result = await executeWorkflowRun({
			corsair: mockCorsair(calls),
			code: GENERATED_WORKFLOW,
			payload: { event: { text: 'there is a bug in checkout' } },
			ai,
		});

		expect(result.status).toBe('completed');

		// The op's input schema was resolved, picked to title+description, and turned
		// into the JSON Schema Hub gets as response_format.
		expect(inferCalls[0]?.responseSchema).toMatchObject({
			type: 'object',
			properties: {
				title: { type: 'string' },
				description: { type: 'string' },
			},
			required: ['title'],
		});

		// step.ai.object returned the validated typed object as the step output.
		expect(result.steps[0]).toMatchObject({
			name: 'draft-issue',
			status: 'completed',
			output: { title: 'Checkout submit throws 500' },
		});

		// The downstream op received the AI output verbatim.
		expect(calls[0]).toEqual({
			teamId: 'team_9f2c',
			title: 'Checkout submit throws 500',
			description: 'Users report the checkout submit button returns a 500.',
		});
	});

	it('corrects itself: one invalid model output, one retry, then completes', async () => {
		const calls: unknown[] = [];
		const prompts: string[] = [];
		let n = 0;
		const infer: HubInfer = async (body) => {
			prompts.push(body.prompt);
			n += 1;
			if (n === 1) return { output: { description: 'no title field' } }; // invalid
			return { output: { title: 'Fixed title', description: 'valid now' } };
		};
		const ai = createAiStepCallback(
			{
				hub: {} as never,
				plugins,
				runId: 'run_2',
				workflowId: 'wf_2',
				tenantId: 'acme',
			},
			infer,
		);

		const result = await executeWorkflowRun({
			corsair: mockCorsair(calls),
			code: GENERATED_WORKFLOW,
			payload: { event: { text: 'bug: login is broken' } },
			ai,
		});

		expect(result.status).toBe('completed');
		expect(n).toBe(2); // one call + one corrective retry
		expect(prompts[1]).toContain('failed validation'); // the retry names the error
		expect(calls[0]).toMatchObject({ title: 'Fixed title' });
	});
});
