import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const get: FreeAgentEndpoints['companyGet'] = async (ctx, input) => {
	const parsedInput = FreeAgentEndpointInputSchemas.companyGet.parse(input);
	void parsedInput;
	const response = await makeFreeAgentRequest('/v2/company', ctx);
	return FreeAgentEndpointOutputSchemas.companyGet.parse(response);
};

export const businessCategories: FreeAgentEndpoints['companyBusinessCategories'] =
	async (ctx, input) => {
		FreeAgentEndpointInputSchemas.companyBusinessCategories.parse(input);
		const response = await makeFreeAgentRequest(
			'/v2/company/business_categories',
			ctx,
		);
		return FreeAgentEndpointOutputSchemas.companyBusinessCategories.parse(
			response,
		);
	};

export const taxTimeline: FreeAgentEndpoints['companyTaxTimeline'] = async (
	ctx,
	input,
) => {
	FreeAgentEndpointInputSchemas.companyTaxTimeline.parse(input);
	const response = await makeFreeAgentRequest('/v2/company/tax_timeline', ctx);
	return FreeAgentEndpointOutputSchemas.companyTaxTimeline.parse(response);
};
