import { logEventFromContext } from 'corsair/core';
import { makeXataManagementRequest } from '../client';
import type { XataEndpoints } from '../index';
import type { DatabasesListResponse } from './types';

export const list: XataEndpoints['databasesList'] = async (ctx, input) => {
	const workspaceId = input.workspaceId ?? ctx.options.workspaceId;
	if (!workspaceId) {
		throw new Error(
			'[validation:xata:workspaceId]: workspaceId must be specified in plugin options or endpoint payload.',
		);
	}

	const response = await makeXataManagementRequest<DatabasesListResponse>(
		`workspaces/${workspaceId}/dbs`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'xata.databases.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const Databases = {
	list,
} as const;
