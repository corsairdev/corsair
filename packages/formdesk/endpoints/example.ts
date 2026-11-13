import { logEventFromContext } from 'corsair/core';
import type { FormdeskEndpoints } from '..';
import type { FormdeskEndpointOutputs } from './types';
import { makeFormdeskRequest } from '../client';

export const get: FormdeskEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFormdeskRequest<FormdeskEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'formdesk.example.get', { ...input }, 'completed');
	return response;
};
