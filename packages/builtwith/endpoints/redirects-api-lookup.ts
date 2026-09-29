import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const redirectsApiLookup: BuiltWithEndpoints['redirectsApiLookup'] =
	async (ctx, input) => {
		const response = await makeBuiltWithRequest<
			BuiltWithEndpointOutputs['redirectsApiLookup']
		>('redirect1/api.json', ctx.key, {
			method: 'GET',
			query: {
				LOOKUP: input.lookup,
			},
		});

		await logEventFromContext(
			ctx,
			'builtwith.redirects.api.lookup',
			{ ...input },
			'completed',
		);

		return response;
	};
