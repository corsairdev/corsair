import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './types';

export const financialApiLookup: BuiltWithEndpoints['financialApiLookup'] =
	async (ctx, rawInput) => {
		const input =
			BuiltWithEndpointInputSchemas.financialApiLookup.parse(rawInput);
		const response = await makeBuiltWithRequest(
			'financial1/api.json',
			ctx.key,
			BuiltWithEndpointOutputSchemas.financialApiLookup,
			{
				method: 'GET',
				query: {
					LOOKUP: input.lookup,
				},
			},
		);

		if (response.domain && ctx.db.companyFinancials) {
			try {
				await ctx.db.companyFinancials.upsertByEntityId(response.domain, {
					id: response.domain,
					domain: response.domain,
					companyName: response.companyName,
					employees: response.employees,
					followers: response.followers,
					products: response.products,
					spend: response.spend,
				});
			} catch (error) {
				console.warn('Failed to save BuiltWith financials to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'builtwith.financial.api.lookup',
			{ ...input },
			'completed',
		);

		return response;
	};
