import { logEventFromContext } from 'corsair/core';
import type { PineconeEndpoints } from '..';
import { makePineconeRequest } from '../client';
import type { PineconeEndpointOutputs } from './types';

export const get: PineconeEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makePineconeRequest<
		PineconeEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'pinecone.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
