import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from '../types';
import { logEvent, updateEventStatus } from '../../utils/events';

const SLACK_REACTIONS = [
	'thumbsup',
	'thumbsdown',
	'+1',
	'-1',
	'smile',
	'joy',
	'heart',
	'heart_eyes',
	'clap',
	'tada',
	'fire',
	'100',
	'eyes',
	'thinking_face',
	'rocket',
	'white_check_mark',
	'heavy_check_mark',
	'x',
	'red_circle',
	'large_blue_circle',
	'warning',
	'rotating_light',
	'ok',
	'ok_hand',
	'raised_hands',
] as const;

export type SlackReactionName =
	| (typeof SLACK_REACTIONS)[number]
	| string;

export const add: SlackEndpoints['reactionsAdd'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'slack.reactions.add', {
		channel: input.channel,
		timestamp: input.timestamp,
		name: input.name,
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['reactionsAdd']>(
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
		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const get: SlackEndpoints['reactionsGet'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'slack.reactions.get', {
		channel: input.channel,
		timestamp: input.timestamp,
		file: input.file,
		file_comment: input.file_comment,
		full: input.full,
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['reactionsGet']>(
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
		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const remove: SlackEndpoints['reactionsRemove'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'slack.reactions.remove', {
		name: input.name,
		channel: input.channel,
		timestamp: input.timestamp,
		file: input.file,
		file_comment: input.file_comment,
	});

	try {
		const result = await makeSlackRequest<SlackEndpointOutputs['reactionsRemove']>(
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
		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};
