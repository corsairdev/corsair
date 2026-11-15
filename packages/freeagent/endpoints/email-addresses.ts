import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentPaginatedRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const list: FreeAgentEndpoints['emailAddressesList'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.emailAddressesList.parse(input);
	const response = await makeFreeAgentPaginatedRequest(
		'/v2/email_addresses',
		ctx.key,
		parsed.query ?? {},
		FreeAgentEndpointOutputSchemas.emailAddressesList.omit({
			pagination: true,
		}),
	);
	return FreeAgentEndpointOutputSchemas.emailAddressesList.parse({
		...response.data,
		pagination: response.pagination,
	});
};
