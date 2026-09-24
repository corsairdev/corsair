import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const financialApiLookup: BuiltWithEndpoints['financialApiLookup'] =
	async (ctx, input) => {
		const response = await makeBuiltWithRequest<
			BuiltWithEndpointOutputs['financialApiLookup']
		>('financial1/api.json', ctx.key, {
			method: 'GET',
			query: {
				LOOKUP: input.lookup,
			},
		});

		await logEventFromContext(
			ctx,
			'builtwith.financial.api.lookup',
			{ ...input },
			'completed',
		);

		return response;
	};
