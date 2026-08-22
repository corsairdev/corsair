import { logEventFromContext } from 'corsair/core';
import { makeXataManagementRequest } from '../client';
import type { XataEndpoints } from '../index';
import type { WorkspacesListResponse } from './types';

export const list: XataEndpoints['workspacesList'] = async (ctx, input) => {
	const response = await makeXataManagementRequest<WorkspacesListResponse>(
		'workspaces',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'xata.workspaces.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const Workspaces = {
	list,
} as const;
