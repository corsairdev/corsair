import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const get: DovetailEndpoints['filesGet'] = async (ctx, input) => {
	const result = await makeDovetailRequest<DovetailEndpointOutputs['filesGet']>(
		`/v1/files/${encodeURIComponent(input.file_id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'dovetail.files.get',
		{ id: result.data.id },
		'completed',
	);
	return result;
};
