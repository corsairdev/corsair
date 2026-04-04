import { logEventFromContext } from 'corsair/core';
import type { MondayEndpoints } from '..';
import { makeMondayRequest } from '../client';
import type { MondayEndpointOutputs } from './types';

export const list: MondayEndpoints['workspacesList'] = async (ctx, input) => {
	const result = await makeMondayRequest<
		MondayEndpointOutputs['workspacesList']
	>(
		`query($limit: Int, $page: Int, $kind: WorkspaceKind, $state: State) {
			workspaces(limit: $limit, page: $page, kind: $kind, state: $state) {
				id
				name
				kind
				description
			}
		}`,
		ctx.key,
		{
			limit: input.limit,
			page: input.page,
			kind: input.kind,
			state: input.state,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.workspaces.list',
		{ ...input },
		'completed',
	);
	return result;
};
