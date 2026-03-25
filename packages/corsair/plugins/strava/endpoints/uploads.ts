import type { StravaEndpoints } from '..';
import { makeStravaRequest } from '../client';
import type { StravaEndpointOutputs } from './types';

export const create: StravaEndpoints['uploadsCreate'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['uploadsCreate']>(
		'uploads',
		ctx.key,
		{
			method: 'POST',
			body: {
				file: input.file,
				data_type: input.data_type,
				name: input.name,
				description: input.description,
				trainer: input.trainer,
				commute: input.commute,
				external_id: input.external_id,
			},
		},
	);

	return result;
};

export const get: StravaEndpoints['uploadsGet'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['uploadsGet']>(
		`uploads/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	return result;
};
