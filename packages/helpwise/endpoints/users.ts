import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { HELPWISE_APP_BASE, makeHelpwiseRequest } from '../client';
import type { UsersGetMeResponse, UsersListResponse } from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const getMe: HelpwiseEndpoint<'users.getMe'> = async (ctx, input) => {
	HelpwiseEndpointInputSchemas['users.getMe'].parse(input);
	const response = await makeHelpwiseRequest<UsersGetMeResponse>(
		'/dev-apis/users/me',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: {},
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['users.getMe'].parse(response);
	await logEventFromContext(ctx, 'helpwise.users.getMe', {}, 'completed');
	return parsed;
};

export const list: HelpwiseEndpoint<'users.list'> = async (ctx, input) => {
	const parsedInput = HelpwiseEndpointInputSchemas['users.list'].parse(input);
	const response = await makeHelpwiseRequest<UsersListResponse>(
		'/dev-apis/users/list',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: parsedInput,
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['users.list'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.users.list',
		{
			count: Array.isArray(parsed.data)
				? parsed.data.length
				: (parsed.data?.users?.length ?? 0),
		},
		'completed',
	);
	return parsed;
};
