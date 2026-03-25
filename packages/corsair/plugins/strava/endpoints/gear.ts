import type { StravaEndpoints } from '..';
import { makeStravaRequest } from '../client';
import type { StravaEndpointOutputs } from './types';

export const get: StravaEndpoints['gearGet'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['gearGet']>(
		`gear/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	return result;
};
