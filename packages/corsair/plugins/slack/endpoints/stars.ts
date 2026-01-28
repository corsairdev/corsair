import { logEventFromContext } from '../../utils/events';
import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from './types';

export const add: SlackEndpoints['starsAdd'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['starsAdd']>(
		'stars.add',
		ctx.key,
		{
			method: 'POST',
			body: {
				channel: input.channel,
				timestamp: input.timestamp,
				file: input.file,
				file_comment: input.file_comment,
			},
		},
	);
	await logEventFromContext(ctx, 'slack.stars.add', { ...input }, 'completed');
	return result;
};

export const remove: SlackEndpoints['starsRemove'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['starsRemove']>(
		'stars.remove',
		ctx.key,
		{
			method: 'POST',
			body: {
				channel: input.channel,
				timestamp: input.timestamp,
				file: input.file,
				file_comment: input.file_comment,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'slack.stars.remove',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: SlackEndpoints['starsList'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['starsList']>(
		'stars.list',
		ctx.key,
		{
			method: 'GET',
			query: {
				team_id: input.team_id,
				cursor: input.cursor,
				limit: input.limit,
				page: input.page,
				count: input.count,
			},
		},
	);
	await logEventFromContext(ctx, 'slack.stars.list', { ...input }, 'completed');
	return result;
};
