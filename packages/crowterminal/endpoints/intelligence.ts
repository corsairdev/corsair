import type { CrowterminalContext } from '..';
import { callCrowterminal } from './shared';
import type {
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
} from './types';
import {
	GetByokPlatformIntelInputSchema,
	GetByokPlatformIntelResponseSchema,
	GetPlatformIntelInputSchema,
	GetPlatformIntelResponseSchema,
} from './types';

export const getPlatform = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['intelGetPlatform'],
): Promise<CrowterminalEndpointOutputs['intelGetPlatform']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.intel.get_platform',
			inputSchema: GetPlatformIntelInputSchema,
			outputSchema: GetPlatformIntelResponseSchema,
			path: () => '/api/agent/platform-intel',
		},
		input,
	);

/**
 * The BYOK variant returns the same algorithm context without client scoping,
 * so it does not trigger LLM inference charges.
 */
export const getByokPlatform = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['intelGetByokPlatform'],
): Promise<CrowterminalEndpointOutputs['intelGetByokPlatform']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.intel.get_byok_platform',
			inputSchema: GetByokPlatformIntelInputSchema,
			outputSchema: GetByokPlatformIntelResponseSchema,
			path: () => '/api/agent/byok/platform-intel',
		},
		input,
	);
