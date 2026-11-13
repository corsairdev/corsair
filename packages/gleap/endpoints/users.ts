import { logEventFromContext } from 'corsair/core';
import type { GleapEndpoints } from '..';
import { makeGleapRequest } from '../client';
import type {
	UsersGetMeOutput,
	UsersListOutput,
	UsersUpdateOutput,
} from './types';
import {
	GleapEndpointInputSchemas,
	GleapEndpointOutputSchemas,
} from './types';

export const getMe: GleapEndpoints['usersGetMe'] = async (ctx, input) => {
	GleapEndpointInputSchemas.usersGetMe.parse(input);
	const response = await makeGleapRequest<UsersGetMeOutput>(
		'/users/me',
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.usersGetMe.parse(response);
	await logEventFromContext(ctx, 'gleap.users.getMe', { me: true }, 'completed');
	return output;
};

export const list: GleapEndpoints['usersList'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.usersList.parse(input);
	const response = await makeGleapRequest<UsersListOutput>(
		'/projects/users',
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.usersList.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.users.list',
		{ count: output.length },
		'completed',
	);
	return output;
};

export const update: GleapEndpoints['usersUpdate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.usersUpdate.parse(input);
	const { userId, ...body } = parsed;
	const response = await makeGleapRequest<UsersUpdateOutput>(
		`/users/${encodeURIComponent(userId)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.usersUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.users.update',
		{ completed: true },
		'completed',
	);
	return output;
};
