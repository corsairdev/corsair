import { CORSAIR_INTERNAL } from '../core';
import type { RunTunnelPayload } from '../hub/contracts/tunnel';
import { processCorsair } from '../tunnel/index';
import type { WorkflowExecutor } from '../workflows/executor';
import { inProcessVmExecutor } from '../workflows/executor';

describe('inProcessVmExecutor', () => {
	it('runs a workflow through node:vm and reports the step completed', async () => {
		const result = await inProcessVmExecutor.run({
			corsair: {},
			code: "module.exports.main = async (corsair, payload, step) => { await step('noop', async () => 'ok'); };",
			payload: null,
			timeoutMs: 200,
		});
		expect(result.status).toBe('completed');
		expect(result.steps[0]).toMatchObject({
			name: 'noop',
			status: 'completed',
			output: 'ok',
		});
	});
});

function mockCorsair() {
	return {
		[CORSAIR_INTERNAL]: {
			plugins: [],
			kek: 'test-kek-with-at-least-32-characters!!',
			multiTenancy: false,
		},
	};
}

function runEnvelope(code: string): string {
	return JSON.stringify({
		type: 'run',
		payload: {
			runId: 'run-1',
			workflowId: 'wf-1',
			versionId: 'v-1',
			tenantId: 't-1',
			code,
			trigger: { type: 'manual', payload: null },
		} satisfies RunTunnelPayload,
	});
}

describe('processCorsair run dispatch', () => {
	it('routes a run through the injected executor', async () => {
		const seen: string[] = [];
		const fake: WorkflowExecutor = {
			run: async (input) => {
				seen.push(input.code);
				return { status: 'completed', steps: [] };
			},
		};
		const ack = await processCorsair(
			mockCorsair(),
			{
				headers: {},
				body: runEnvelope('module.exports.main = async () => {};'),
			},
			{
				allowUnsignedTunnel: true,
				allowWorkflowExecution: true,
				workflowExecutor: fake,
			},
		);
		expect(seen).toEqual(['module.exports.main = async () => {};']);
		expect(ack.status).toBe('ok');
		expect(ack.webhookResponse?.body).toMatchObject({
			run: { status: 'completed', steps: [] },
		});
	});

	it('defaults to the in-process vm executor when none is injected', async () => {
		const ack = await processCorsair(
			mockCorsair(),
			{
				headers: {},
				body: runEnvelope(
					"module.exports.main = async (corsair, payload, step) => { await step('noop', async () => 'ok'); };",
				),
			},
			{ allowUnsignedTunnel: true, allowWorkflowExecution: true },
		);
		expect(ack.status).toBe('ok');
		const body = ack.webhookResponse?.body as {
			run: { status: string; steps: Array<{ name: string; output: unknown }> };
		};
		expect(body.run.status).toBe('completed');
		expect(body.run.steps[0]).toMatchObject({ name: 'noop', output: 'ok' });
	});
});
