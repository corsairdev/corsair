import { computeStepId, executeWorkflowRun } from '../workflows/execute';

const code = `
	module.exports.main = async (corsair, payload, step) => {
		await step('ask', async () => corsair.slack.api.messages.post({ text: 'approve?' }));
		const d = await step.waitForEvent('decision', {
			event: 'slack.block_actions',
			match: { 'data.callback_id': payload.id },
			timeout: '1d',
		});
		if (!d || d.data.action !== 'approve') return 'stopped';
		return step('refund', async () => corsair.stripe.api.refunds.create({ id: payload.id }));
	};
`;

it('suspends at the wait, then replays to completion with the injected event', async () => {
	const corsair = {
		slack: { api: { messages: { post: async () => ({ ok: true }) } } },
		stripe: {
			api: { refunds: { create: async (i: unknown) => ({ refunded: i }) } },
		},
	};
	// Phase 1: run until the wait.
	const first = await executeWorkflowRun({
		corsair,
		code,
		payload: { id: 'r1' },
	});
	expect(first.status).toBe('waiting');
	expect(first.waiter?.event).toBe('slack.block_actions');
	expect(first.steps.map((s) => s.name)).toEqual(['ask']);

	// Simulate Hub resolving the waiter: persist the event under the wait stepId.
	const stepId = computeStepId('decision', 1); // seq 1 (after 'ask' at seq 0)
	const memo = {
		[computeStepId('ask', 0)]: { output: { ok: true } },
		[stepId]: {
			output: {
				name: 'slack.block_actions',
				data: { action: 'approve', callback_id: 'r1' },
			},
		},
	};
	// Phase 2: replay past the wait.
	const second = await executeWorkflowRun({
		corsair,
		code,
		payload: { id: 'r1' },
		memoizedSteps: memo,
	});
	expect(second.status).toBe('completed');
	expect(second.steps.find((s) => s.name === 'refund')?.output).toEqual({
		refunded: { id: 'r1' },
	});
});

it('branches on timeout (null injection)', async () => {
	const corsair = {
		slack: { api: { messages: { post: async () => ({ ok: true }) } } },
		stripe: { api: { refunds: { create: async () => ({}) } } },
	};
	const memo = {
		[computeStepId('ask', 0)]: { output: { ok: true } },
		[computeStepId('decision', 1)]: { output: null },
	};
	const result = await executeWorkflowRun({
		corsair,
		code,
		payload: { id: 'r1' },
		memoizedSteps: memo,
	});
	expect(result.status).toBe('completed');
	// 'refund' never ran; main returned 'stopped'.
	expect(result.steps.map((s) => s.name)).not.toContain('refund');
});
