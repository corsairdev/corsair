import { logEventFromContext } from 'corsair/core';
import type { BrowserToolEndpoints } from '..';
import { makeBrowserToolRequest } from '../client';
import type { BrowserToolEndpointOutputs } from './types';

export const get: BrowserToolEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBrowserToolRequest<
		BrowserToolEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'browsertool.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
