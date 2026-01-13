import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from '../types';

export const add: SlackEndpoints['reactionsAdd'] = async (ctx, input) => {
	return makeSlackRequest<SlackEndpointOutputs['reactionsAdd']>(
		'reactions.add',
		ctx.options.botToken,
		{
			method: 'POST',
			body: {
				channel: input.channel,
				timestamp: input.timestamp,
				name: input.name,
			},
		},
	);
};

export const get: SlackEndpoints['reactionsGet'] = async (ctx, input) => {
	return makeSlackRequest<SlackEndpointOutputs['reactionsGet']>(
		'reactions.get',
		ctx.options.botToken,
		{
			method: 'GET',
			query: {
				channel: input.channel,
				timestamp: input.timestamp,
				file: input.file,
				file_comment: input.file_comment,
				full: input.full,
			},
		},
	);
};

export const remove: SlackEndpoints['reactionsRemove'] = async (ctx, input) => {
	return makeSlackRequest<SlackEndpointOutputs['reactionsRemove']>(
		'reactions.remove',
		ctx.options.botToken,
		{
			method: 'POST',
			body: {
				name: input.name,
				channel: input.channel,
				timestamp: input.timestamp,
				file: input.file,
				file_comment: input.file_comment,
			},
		},
	);
};
