import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

/** List all users in the workspace */
export const usersList: HexEndpoints['usersList'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.usersList.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['usersList']>(
		`/v1/users`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				after: parsedInput.after,
				before: parsedInput.before,
				limit: parsedInput.limit,
				sortBy: parsedInput.sortBy,
				sortDirection: parsedInput.sortDirection,
				groupId: parsedInput.groupId,
				userIds: parsedInput.userIds,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.usersList.parse(response);
	await logEventFromContext(
		ctx,
		'hex.users.list',
		{ operation: 'users.list' },
		'completed',
	);
	return parsed;
};

/** Deactivate a user */
export const usersDeactivate: HexEndpoints['usersDeactivate'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.usersDeactivate.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['usersDeactivate']>(
		`/v1/users/${encodeURIComponent(String(parsedInput.userId))}/deactivate`,
		ctx.key,
		{
			method: 'POST',
		},
	);
	const parsed = HexEndpointOutputSchemas.usersDeactivate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.users.deactivate',
		{ operation: 'users.deactivate' },
		'completed',
	);
	return parsed;
};

/** Returns information about the current logged in user. */
export const usersMe: HexEndpoints['usersMe'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.usersMe.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['usersMe']>(
		`/v1/users/me`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HexEndpointOutputSchemas.usersMe.parse(response);
	await logEventFromContext(
		ctx,
		'hex.users.me',
		{ operation: 'users.me' },
		'completed',
	);
	return parsed;
};
