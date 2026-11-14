import { logEventFromContext } from 'corsair/core';
import type { HelpScoutEndpoints } from '..';
import type { HelpScoutEndpointOutputs } from './types';
import { makeHelpScoutRequest } from '../client';

export const get: HelpScoutEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeHelpScoutRequest<HelpScoutEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'helpscout.example.get', { ...input }, 'completed');
	return response;
};
