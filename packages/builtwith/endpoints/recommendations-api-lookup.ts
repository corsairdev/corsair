import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const recommendationsApiLookup: BuiltWithEndpoints['recommendationsApiLookup'] =
	async (ctx, input) => {
		const response = await makeBuiltWithRequest<
			BuiltWithEndpointOutputs['recommendationsApiLookup']
		>('rec1/api.json', ctx.key, {
			method: 'GET',
			query: {
				LOOKUP: input.lookup,
			},
		});

		await logEventFromContext(
			ctx,
			'builtwith.recommendations.api.lookup',
			{ ...input },
			'completed',
		);

		return response;
	};
