import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	WorkspaceAclUpdateInput,
	WorkspaceAclUpdateResponse,
} from './types';

export async function update(
	ctx: ClickupRequestContext,
	input: WorkspaceAclUpdateInput,
): Promise<WorkspaceAclUpdateResponse> {
	const { workspace_id, object_type, object_id, ...body } = input;
	const response = await makeClickupRequest<WorkspaceAclUpdateResponse>(
		`workspaces/${workspace_id}/${object_type}/${object_id}/acls`,
		ctx.key,
		{ method: 'PATCH', version: 'v3', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.workspaceAcl.update',
		{ workspace_id },
		'completed',
	);
	return response;
}
