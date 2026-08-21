import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { dopplerCall, seg } from './shared';
import type { DopplerEndpointOutputs } from './types';

/**
 * The only group operation the catalog claims. `GET /v3/workplace/groups`
 * itself answers 403 on this development account (Team+/Enterprise-gated),
 * confirmed live - this operation is implemented and covered by mocked
 * tests only, matching `changeRequests`' treatment.
 */
export const deleteMember: DopplerEndpoints['groupsDeleteMember'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<
		DopplerEndpointOutputs['groupsDeleteMember']
	>(
		ctx,
		`workplace/groups/group/${seg(input.group)}/members/${seg(input.type)}/${seg(input.memberSlug)}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'doppler.groups.deleteMember',
		auditPayload(input, ['group', 'type', 'memberSlug']),
		'completed',
	);
	return result;
};
