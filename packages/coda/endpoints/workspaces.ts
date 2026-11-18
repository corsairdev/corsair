import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const listUsers: CodaEndpoints['workspacesListUsers'] = async (ctx, input) => {
	const { workspaceId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['workspacesListUsers']
	>(`workspaces/${encodeURIComponent(workspaceId)}/users`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'coda.workspaces.listUsers',
		{ ...input },
		'completed',
	);
	return response;
};

const listRoles: CodaEndpoints['workspacesListRoles'] = async (ctx, input) => {
	const { workspaceId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['workspacesListRoles']
	>(`workspaces/${encodeURIComponent(workspaceId)}/roles`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'coda.workspaces.listRoles',
		{ ...input },
		'completed',
	);
	return response;
};

const changeUserRole: CodaEndpoints['workspacesChangeUserRole'] = async (
	ctx,
	input,
) => {
	const { workspaceId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['workspacesChangeUserRole']
	>(`workspaces/${encodeURIComponent(workspaceId)}/users/role`, ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.workspaces.changeUserRole',
		{ ...input },
		'completed',
	);
	return response;
};

export const Workspaces = {
	listUsers,
	listRoles,
	changeUserRole,
};
