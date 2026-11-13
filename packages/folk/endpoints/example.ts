import { logEventFromContext } from 'corsair/core';
import type { FolkEndpoints } from '..';
import type { FolkEndpointOutputs } from './types';
import { makeFolkRequest } from '../client';

export const get: FolkEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFolkRequest<FolkEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'folk.example.get', { ...input }, 'completed');
	return response;
};
