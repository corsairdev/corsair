import type { AgiledEndpoints } from '..';
import { makeAgiledRequest } from '../client';
import type { AgiledEndpointOutputs } from './types';

export const list: AgiledEndpoints['listContacts'] = async (ctx, input) => {
	return makeAgiledRequest<AgiledEndpointOutputs['listContacts']>(
		'/contacts',
		ctx.key,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
		},
	);
};
