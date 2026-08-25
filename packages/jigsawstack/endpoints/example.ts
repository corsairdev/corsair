import { logEventFromContext } from 'corsair/core';
import type { JigsawstackEndpoints } from '..';
import { makeJigsawstackRequest } from '../client';
import type { JigsawstackEndpointOutputs } from './types';

export const get: JigsawstackEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeJigsawstackRequest<
		JigsawstackEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'jigsawstack.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
