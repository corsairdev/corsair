import { hubApiPost } from '../hub/client/http';
import type { HubConfig } from '../hub/types';
import type { SendEventCallback } from './execute';

// ─────────────────────────────────────────────────────────────────────────────
// step.sendEvent host capability
//
// The sandbox can't reach the network, so this host callback POSTs the emitted
// event to Hub's /events endpoint, which buffers it, resolves matching waiters,
// and dispatches event-triggered workflows. Auth is the same env key + tenant as
// step.ai. Memoization (in step()) makes retries safe: a re-delivered attempt
// replays the send step instead of re-emitting.
// ─────────────────────────────────────────────────────────────────────────────

export type SendEventContext = {
	hub: HubConfig;
	runId: string;
	workflowId: string;
	tenantId: string;
};

export function createSendEventCallback(
	ctx: SendEventContext,
): SendEventCallback {
	return async (name, dataJson) => {
		await hubApiPost<{ ok: true }>({
			hub: ctx.hub,
			path: `/events?tenantId=${encodeURIComponent(ctx.tenantId)}`,
			body: {
				runId: ctx.runId,
				workflowId: ctx.workflowId,
				name,
				data: JSON.parse(dataJson) as unknown,
			},
			parseResponse: (payload) => payload as { ok: true },
		});
	};
}
