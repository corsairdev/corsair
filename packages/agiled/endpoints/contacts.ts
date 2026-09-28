import type { AgiledEndpoints } from '..';
import { makeAgiledRequest } from '../client';
import type { AgiledEndpointOutputs } from './types';
import { AgiledEndpointOutputSchemas } from './types';

export const list: AgiledEndpoints['listContacts'] = async (ctx, input) => {
	const response = await makeAgiledRequest<
		AgiledEndpointOutputs['listContacts']
	>('/contacts', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
		},
	});

	const parsed = AgiledEndpointOutputSchemas.listContacts.safeParse(response);
	if (!parsed.success) {
		throw new Error(
			`Agiled contacts.list response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};
