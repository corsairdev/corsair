import { logEventFromContext } from 'corsair/core';
import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';

export const get: ExtractaaiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'extractaai.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
