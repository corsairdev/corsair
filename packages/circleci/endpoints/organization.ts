import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCIGraphQLCall } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * Reads an organization by id via GraphQL.
 *
 * Only the `id` form is exposed as input, not `name`+`vcsType`: confirmed
 * live that `organization(name:,vcsType:)` fails against this account's own
 * personal GitHub org, while `organization(id:)` succeeds for it and for a
 * standalone CircleCI org. Resolve the id from `GET /me/collaborations`
 * first (`userListCollaborations` in this plugin) rather than a name lookup.
 */
export const get: CircleCIEndpoints['organizationGet'] = async (ctx, input) => {
	const result = await circleCIGraphQLCall<{
		organization: CircleCIEndpointOutputs['organizationGet'];
	}>(ctx, `query($id: ID!) { organization(id: $id) { id name } }`, {
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'circleci.organization.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return result.organization;
};
