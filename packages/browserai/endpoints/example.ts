import { logEventFromContext } from 'corsair/core';
import type { BrowseraiEndpoints } from '..';
import { makeBrowseraiRequest } from '../client';
import type { BrowseraiEndpointOutputs } from './types';

export const get: BrowseraiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBrowseraiRequest<
		BrowseraiEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'browserai.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
