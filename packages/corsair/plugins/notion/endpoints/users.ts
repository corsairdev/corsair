import { logEventFromContext } from '../../utils/events';
import type { NotionEndpoints } from '..';
import { makeNotionRequest } from '../client';
import type { NotionEndpointOutputs } from './types';

export const getUser: NotionEndpoints['usersGetUser'] = async (ctx, input) => {
	const result = await makeNotionRequest<NotionEndpointOutputs['usersGetUser']>(
		`v1/users/${input.user_id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'notion.users.getUser',
		{ ...input },
		'completed',
	);
	return result;
};

export const getManyUsers: NotionEndpoints['usersGetManyUsers'] = async (
	ctx,
	input,
) => {
	const result = await makeNotionRequest<
		NotionEndpointOutputs['usersGetManyUsers']
	>('v1/users', ctx.key, {
		method: 'GET',
		query: {
			start_cursor: input.start_cursor,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'notion.users.getManyUsers',
		{ ...input },
		'completed',
	);
	return result;
};
