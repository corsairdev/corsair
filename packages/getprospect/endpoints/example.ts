import { logEventFromContext } from 'corsair/core';
import type { GetProspectEndpoints } from '..';
import type { GetProspectEndpointOutputs } from './types';
import { makeGetProspectRequest } from '../client';

export const get: GetProspectEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGetProspectRequest<GetProspectEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'getprospect.example.get', { ...input }, 'completed');
	return response;
};
