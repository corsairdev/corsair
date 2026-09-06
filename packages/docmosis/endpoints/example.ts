import { logEventFromContext } from 'corsair/core';
import type { DocmosisEndpoints } from '..';
import type { DocmosisEndpointOutputs } from './types';
import { makeDocmosisRequest } from '../client';

export const get: DocmosisEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeDocmosisRequest<DocmosisEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'docmosis.example.get', { ...input }, 'completed');
	return response;
};
