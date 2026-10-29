import type { CrowterminalContext } from '..';
import { callCrowterminal } from './shared';
import type {
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
} from './types';
import { RegisterAgentInputSchema, RegisterAgentResponseSchema } from './types';

/**
 * Self-registers an agent and returns a new API key. The key is shown once and
 * cannot be retrieved later, so the caller has to persist it. Rate limited to
 * five calls per hour per IP, and it creates a real agent on every success.
 */
export const register = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['agentRegister'],
): Promise<CrowterminalEndpointOutputs['agentRegister']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.agent.register',
			method: 'POST',
			inputSchema: RegisterAgentInputSchema,
			outputSchema: RegisterAgentResponseSchema,
			path: () => '/api/agent/register',
			body: (i) => ({ ...i }),
		},
		input,
	);
