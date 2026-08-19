import { logEventFromContext } from 'corsair/core';
import { makeAttioRequest } from '../client';
import type { AttioEndpoints } from '../index';
import type { AttioEndpointOutputs } from './types';

export const list: AttioEndpoints['workspaceMembersList'] = async (
	ctx,
	input,
) => {
	const response = await makeAttioRequest<
		AttioEndpointOutputs['workspaceMembersList']
	>('v2/workspace_members', ctx.key, { method: 'GET' });

	if (response.data && ctx.db.workspaceMembers) {
		try {
			for (const member of response.data) {
				const entityId =
					typeof member.id === 'string'
						? member.id
						: member.id.workspace_member_id;
				await ctx.db.workspaceMembers.upsertByEntityId(entityId, member);
			}
		} catch (error) {
			console.warn('Failed to save workspace members to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'attio.workspaceMembers.list',
		{ ...input },
		'completed',
	);
	return response;
};
