import { logEventFromContext } from 'corsair/core';
import type { ExistEndpoints } from '..';
import { makeExistRequest } from '../client';
import type { ExistEndpointOutputs } from './types';

export const get: ExistEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeExistRequest<ExistEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'exist.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
