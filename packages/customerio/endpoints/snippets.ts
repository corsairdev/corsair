import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import { makeAppRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// GET /v1/snippets
// Docs: https://docs.customer.io/integrations/api/app/tag/snippets/listSnippets/
export const listSnippets: CustomerioEndpoints['listSnippets'] = async (
	ctx,
	input,
) => {
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['listSnippets']
	>('/v1/snippets', ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'customerio.snippets.listSnippets',
		{ ...input },
		'completed',
	);
	return response;
};
