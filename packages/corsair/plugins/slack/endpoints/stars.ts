import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from '../types';

export const add: SlackEndpoints['starsAdd'] = async (ctx, input) => {
	return makeSlackRequest<SlackEndpointOutputs['starsAdd']>(
		'stars.add',
		ctx.options.botToken,
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
};

export const remove: SlackEndpoints['starsRemove'] = async (ctx, input) => {
	return makeSlackRequest<SlackEndpointOutputs['starsRemove']>(
		'stars.remove',
		ctx.options.botToken,
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
};

export const list: SlackEndpoints['starsList'] = async (ctx, input) => {
	return makeSlackRequest<SlackEndpointOutputs['starsList']>(
		'stars.list',
		ctx.options.botToken,
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
};
