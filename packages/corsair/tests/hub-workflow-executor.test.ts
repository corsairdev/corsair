import { createHmac, randomUUID } from 'node:crypto';
import { CORSAIR_INTERNAL } from '../core';
import type { RunTunnelPayload } from '../hub/contracts/tunnel';
import { handleHubDeliveryPost } from '../hub/delivery';
import { resetDeliveryReplayGuardForTests } from '../hub/internal/delivery-replay-guard';
import type { WorkflowExecutor } from '../workflows/executor';

const SIGNING_SECRET = 'test-signing-secret-1234567890';

function corsairWithHub(executor: WorkflowExecutor) {
	return {
		[CORSAIR_INTERNAL]: {
			plugins: [],
			kek: 'test-kek-with-at-least-32-characters!!',
			multiTenancy: false,
			hub: {
				apiUrl: 'https://hub.example',
				projectApiKey: 'ck_dev_test',
				signingSecret: SIGNING_SECRET,
				allowWorkflowExecution: true,
				workflowExecutor: executor,
			},
		},
	};
}

function signedRunRequest() {
	const body = JSON.stringify({
		type: 'run',
		payload: {
			runId: 'r1',
			workflowId: 'w1',
			versionId: 'v1',
			tenantId: 't1',
			code: 'module.exports.main = async () => {};',
			trigger: { type: 'manual', payload: null },
		} satisfies RunTunnelPayload,
	});
	return {
		headers: {
			'x-corsair-signature': `sha256=${createHmac('sha256', SIGNING_SECRET).update(body).digest('hex')}`,
			'x-corsair-timestamp': String(Math.floor(Date.now() / 1000)),
			'x-corsair-nonce': randomUUID(),
		},
		body,
	};
}

describe('hub delivery forwards hub.workflowExecutor', () => {
	beforeEach(() => resetDeliveryReplayGuardForTests());

	it('routes a run delivery through the configured executor', async () => {
		const seen: string[] = [];
		const fake: WorkflowExecutor = {
			run: async (input) => {
				seen.push(input.code);
				return { status: 'completed', steps: [] };
			},
		};
		const result = await handleHubDeliveryPost(
			corsairWithHub(fake),
			signedRunRequest(),
		);
		expect(seen).toEqual(['module.exports.main = async () => {};']);
		expect(result.type).toBe('json');
	});
});
