import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const get: DovetailEndpoints['filesGet'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.filesGet.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['filesGet']
	>(`/v1/files/${encodeURIComponent(parsed.file_id)}`, ctx.key, {
		method: 'GET',
	});
	const validated = DovetailEndpointOutputSchemas.filesGet.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.files.get',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};
