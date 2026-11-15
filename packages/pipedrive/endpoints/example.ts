import { logEventFromContext } from 'corsair/core';
import type { PipedriveEndpoints } from '..';
import type { PipedriveEndpointOutputs } from './types';
import { makePipedriveRequest } from '../client';

export const get: PipedriveEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makePipedriveRequest<PipedriveEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'pipedrive.example.get', { ...input }, 'completed');
	return response;
};
