import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const get: FreeAgentEndpoints['companyGet'] = async (ctx, input) => {
	const parsedInput = FreeAgentEndpointInputSchemas.companyGet.parse(input);
	void parsedInput;
	const response = await makeFreeAgentRequest('/v2/company', ctx.key);
	return FreeAgentEndpointOutputSchemas.companyGet.parse(response);
};
