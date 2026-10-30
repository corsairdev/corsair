import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

// Membership API: GET /membership/v1/memberships/{member_junction_id}/membershipdetails
export const getMembershipDetails: BlackbaudEndpoints['getMembershipDetails'] =
	async (ctx, input) => {
		const response = await makeBlackbaudRequest<
			BlackbaudEndpointOutputs['getMembershipDetails']
		>(
			`membership/v1/memberships/${encodeURIComponent(input.member_junction_id)}/membershipdetails`,
			ctx.key,
			{
				method: 'GET',
				subscriptionKey: ctx.options.subscriptionKey,
			},
		);

		if (ctx.db.memberships) {
			try {
				await ctx.db.memberships.upsertByEntityId(input.member_junction_id, {
					...response,
					id: input.member_junction_id,
				});
			} catch (error) {
				console.warn('Failed to save membership to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'blackbaud.membership.get_details',
			{ member_junction_id: input.member_junction_id },
			'completed',
		);
		return response;
	};
