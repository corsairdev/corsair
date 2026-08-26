import type { CrowterminalContext } from '..';
import { callCrowterminal } from './shared';
import type {
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
} from './types';
import {
	SandboxClientInputSchema,
	SandboxClientResponseSchema,
	SandboxEngagementInputSchema,
	SandboxEngagementResponseSchema,
	SandboxMemoryInputSchema,
	SandboxMemoryResponseSchema,
	SandboxValidateInputSchema,
	SandboxValidateResponseSchema,
} from './types';

// Sandbox responses are fixtures and are marked `_sandbox: true`. They touch no
// real data and need no auth, so they are the safe way to exercise a workflow.

export const getClient = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['sandboxGetClient'],
): Promise<CrowterminalEndpointOutputs['sandboxGetClient']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.sandbox.get_client',
			inputSchema: SandboxClientInputSchema,
			outputSchema: SandboxClientResponseSchema,
			path: () => '/api/agent/sandbox/client',
		},
		input,
	);

export const getMemory = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['sandboxGetMemory'],
): Promise<CrowterminalEndpointOutputs['sandboxGetMemory']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.sandbox.get_memory',
			inputSchema: SandboxMemoryInputSchema,
			outputSchema: SandboxMemoryResponseSchema,
			path: () => '/api/agent/sandbox/memory',
		},
		input,
	);

export const engagementAnalysis = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['sandboxEngagementAnalysis'],
): Promise<CrowterminalEndpointOutputs['sandboxEngagementAnalysis']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.sandbox.engagement_analysis',
			method: 'POST',
			inputSchema: SandboxEngagementInputSchema,
			outputSchema: SandboxEngagementResponseSchema,
			path: () => '/api/agent/sandbox/engagement-analysis',
			body: (i) => (i.agentMd ? { agentMd: i.agentMd } : {}),
		},
		input,
	);

/** Sending a change whose newValue is "tutorial" returns a blocked result. */
export const validate = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['sandboxValidate'],
): Promise<CrowterminalEndpointOutputs['sandboxValidate']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.sandbox.validate',
			method: 'POST',
			inputSchema: SandboxValidateInputSchema,
			outputSchema: SandboxValidateResponseSchema,
			path: () => '/api/agent/sandbox/validate',
			body: (i) => ({ proposedChanges: i.proposedChanges }),
		},
		input,
	);
