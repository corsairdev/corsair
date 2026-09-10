import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs, MembershipRecord } from './types';

// Constituent API list (ListConstituentMemberships). No single-membership GET
// exists on the Membership API (bare item route 404s; only sub-resource ops
// like fundraisers/renew exist), so junction filtering happens client-side.
// Ref: https://learn.microsoft.com/en-us/connectors/blackbaudconstituent
export const listMemberships: BlackbaudEndpoints['listMemberships'] = async (
	ctx,
	input,
) => {
	const response = await makeBlackbaudRequest<
		BlackbaudEndpointOutputs['listMemberships']
	>(
		`constituent/v1/constituents/${encodeURIComponent(input.constituent_id)}/memberships`,
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				offset: input.offset,
			},
			subscriptionKey: ctx.options.subscriptionKey,
		},
	);

	// Junction filter: match id fields without narrowing provider shapes.
	const filtered: MembershipRecord[] =
		input.member_junction_id === undefined
			? response.value
			: response.value.filter(
					(record) =>
						record.id === input.member_junction_id ||
						record.member_junction_id === input.member_junction_id,
				);

	await logEventFromContext(
		ctx,
		'blackbaud.memberships.list',
		{ constituent_id: input.constituent_id, count: filtered.length },
		'completed',
	);
	return {
		count: filtered.length,
		value: filtered,
	};
};
