import { logEventFromContext } from 'corsair/core';
import { makeReplyioRequest } from '../client';
import type { ReplyioEndpoint, ReplyioEndpointContext } from './context';
import type { ReplyioEndpointOutputs } from './types';

export const getCurrent: ReplyioEndpoint<'usersGetCurrent'> = async (
	ctx: ReplyioEndpointContext,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['usersGetCurrent']
	>('whoami', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'replyio.users.getCurrent',
		{ userId: response.userId },
		'completed',
	);
	return response;
};

export const listTeam: ReplyioEndpoint<'usersListTeam'> = async (
	ctx: ReplyioEndpointContext,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['usersListTeam']
	>('whoami/team-users', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'replyio.users.listTeam', {}, 'completed');
	return response;
};
