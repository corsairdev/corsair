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

	if (result && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

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
			...(input.start_cursor && { start_cursor: input.start_cursor }),
			...(input.page_size && { page_size: input.page_size }),
		},
	});

	if (result.results && ctx.db.users) {
		try {
			for (const user of result.results) {
				if (user.id) {
					await ctx.db.users.upsertByEntityId(user.id, {
						...user,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'notion.users.getManyUsers',
		{ ...input },
		'completed',
	);
	return result;
};
