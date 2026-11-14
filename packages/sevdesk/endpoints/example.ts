import { logEventFromContext } from 'corsair/core';
import type { SevdeskEndpoints } from '..';
import type { SevdeskEndpointOutputs } from './types';
import { makeSevdeskRequest } from '../client';

export const get: SevdeskEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeSevdeskRequest<SevdeskEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'sevdesk.example.get', { ...input }, 'completed');
	return response;
};
