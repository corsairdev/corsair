import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

export const getMembershipDetails: BlackbaudEndpoints['getMembershipDetails'] =
	async (ctx, input) => {
		const response = await makeBlackbaudRequest<
			BlackbaudEndpointOutputs['getMembershipDetails']
		>(
			`membership/v1/memberships/${encodeURIComponent(input.member_junction_id)}`,
			ctx.key,
			{
				method: 'GET',
				subscriptionKey: ctx.options.subscriptionKey,
			},
		);

		await logEventFromContext(
			ctx,
			'blackbaud.memberships.get',
			{ member_junction_id: input.member_junction_id },
			'completed',
		);
		return response;
	};
