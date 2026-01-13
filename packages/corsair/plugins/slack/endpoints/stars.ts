import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from '../types';
import { logEvent, updateEventStatus } from '../../utils/events';

export const add: SlackEndpoints['starsAdd'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'slack.stars.add', {
		channel: input.channel,
		timestamp: input.timestamp,
		file: input.file,
		file_comment: input.file_comment,
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['starsAdd']>(
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
		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const remove: SlackEndpoints['starsRemove'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'slack.stars.remove', {
		channel: input.channel,
		timestamp: input.timestamp,
		file: input.file,
		file_comment: input.file_comment,
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['starsRemove']>(
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
		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const list: SlackEndpoints['starsList'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'slack.stars.list', {
		team_id: input.team_id,
		cursor: input.cursor,
		limit: input.limit,
		page: input.page,
		count: input.count,
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['starsList']>(
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
		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};
