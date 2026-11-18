import { createHmac } from 'node:crypto';
import type { HubConfig } from './types';

/** The header Corsair Cloud's runtime adds to its managed-pricing requests. */
export const RUNTIME_PROOF_HEADER = 'x-corsair-runtime-proof';

/**
 * Signs a managed-pricing request to Hub with the runtime's proof key, so Hub
 * can tell Corsair Cloud's runtime from any other caller. Hub derives the same
 * key on its side. The signature covers the time and what the request is for,
 * so a header is good only for that request, and only briefly. Empty without a
 * key, which is every SDK outside the cloud runtime.
 */
export function runtimeProofHeaders(
	hub: HubConfig,
	input: {
		path: string;
		plugin: string;
		tenantId: string;
		operation: string;
		nowMs?: number;
	},
): Record<string, string> {
	if (!hub.runtimeProofKey) return {};
	const t = Math.floor((input.nowMs ?? Date.now()) / 1000);
	const signature = createHmac('sha256', hub.runtimeProofKey)
		.update(
			[t, input.path, input.plugin, input.tenantId, input.operation].join('\n'),
		)
		.digest('base64url');
	return { [RUNTIME_PROOF_HEADER]: `t=${t},v1=${signature}` };
}
