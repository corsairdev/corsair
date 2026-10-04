import { logEventFromContext } from 'corsair/core';
import type { CoassembleEndpoints } from '..';
import { makeCoassembleRequest } from '../client';
import type { CoassembleEndpointOutputs } from './types';

export const get: CoassembleEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCoassembleRequest<
		CoassembleEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'coassemble.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
