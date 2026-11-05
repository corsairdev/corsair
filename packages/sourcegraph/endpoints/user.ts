import { logEventFromContext } from 'corsair/core';
import type { SourcegraphEndpoints } from '..';
import { sourcegraphGraphql } from '../client';
import type { GetCurrentUserResponse } from './types';
import { SourcegraphEndpointOutputSchemas } from './types';

const GET_CURRENT_USER = `
query GetCurrentUser {
  currentUser {
    id
    username
    displayName
    email
    siteAdmin
    viewerCanAdminister
    avatarURL
    url
    createdAt
  }
}
`;

export const getCurrent: SourcegraphEndpoints['getCurrentUser'] = async (
	ctx,
	input,
) => {
	const data = await sourcegraphGraphql<GetCurrentUserResponse>(
		ctx.key,
		GET_CURRENT_USER,
		undefined,
		ctx.options?.instanceUrl,
	);

	const parsed = SourcegraphEndpointOutputSchemas.getCurrentUser.parse(data);

	await logEventFromContext(
		ctx,
		'sourcegraph.user.getCurrent',
		{ ...input },
		'completed',
	);

	return parsed;
};
