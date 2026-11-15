import { logEventFromContext } from 'corsair/core';
import type { FolkEndpoints } from '..';
import { makeFolkRequest } from '../client';
import type {
	UsersGetCurrentUserResponse,
	UsersGetResponse,
	UsersListResponse,
} from './types';
import { FolkEndpointInputSchemas, FolkEndpointOutputSchemas } from './types';

export const list: FolkEndpoints['usersList'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.usersList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.cursor !== undefined) query.cursor = parsedInput.cursor;

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<UsersListResponse>(
		'/users',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = FolkEndpointOutputSchemas.usersList.parse(response);

	await logEventFromContext(
		ctx,
		'folk.users.list',
		{ count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};

export const getCurrentUser: FolkEndpoints['usersGetCurrentUser'] = async (
	ctx,
	input,
) => {
	FolkEndpointInputSchemas.usersGetCurrentUser.parse(input);

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<UsersGetCurrentUserResponse>(
		'/users/me',
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = FolkEndpointOutputSchemas.usersGetCurrentUser.parse(response);

	await logEventFromContext(
		ctx,
		'folk.users.getCurrentUser',
		{ userId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const get: FolkEndpoints['usersGet'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.usersGet.parse(input);

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<UsersGetResponse>(
		`/users/${encodeURIComponent(parsedInput.userId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = FolkEndpointOutputSchemas.usersGet.parse(response);

	await logEventFromContext(
		ctx,
		'folk.users.get',
		{ userId: parsed.data.id },
		'completed',
	);

	return parsed;
};
