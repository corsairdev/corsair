import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';

export const add: SlackEndpoints['reactionsAdd'] = async (ctx, input) => {
	return makeSlackRequest('reactions.add', ctx.options.botToken, {
		method: 'POST',
		body: {
			channel: input.channel,
			timestamp: input.timestamp,
			name: input.name,
		},
	});
};

export const get: SlackEndpoints['reactionsGet'] = async (ctx, input) => {
	return makeSlackRequest('reactions.get', ctx.options.botToken, {
		method: 'GET',
		query: {
			channel: input.channel,
			timestamp: input.timestamp,
			file: input.file,
			file_comment: input.file_comment,
			full: input.full,
		},
	});
};

export const remove: SlackEndpoints['reactionsRemove'] = async (ctx, input) => {
	return makeSlackRequest('reactions.remove', ctx.options.botToken, {
		method: 'POST',
		body: {
			name: input.name,
			channel: input.channel,
			timestamp: input.timestamp,
			file: input.file,
			file_comment: input.file_comment,
		},
	});
};
