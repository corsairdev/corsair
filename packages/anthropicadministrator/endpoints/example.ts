import { logEventFromContext } from 'corsair/core';
import type { AnthropicAdministratorEndpoints } from '..';
import type { AnthropicAdministratorEndpointOutputs } from './types';
import { makeAnthropicAdministratorRequest } from '../client';

export const get: AnthropicAdministratorEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAnthropicAdministratorRequest<AnthropicAdministratorEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'anthropicadministrator.example.get', { ...input }, 'completed');
	return response;
};
