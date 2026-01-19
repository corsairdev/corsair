import { logEvent } from '../../utils/events';
import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from './types';

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
	| (string & {});

export const add: SlackEndpoints['reactionsAdd'] = async (ctx, input) => {
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
		await logEvent(
			ctx.database,
			'slack.reactions.add',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(ctx.database, 'slack.reactions.add', { ...input }, 'failed');
		throw error;
	}
};

export const get: SlackEndpoints['reactionsGet'] = async (ctx, input) => {
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
		await logEvent(
			ctx.database,
			'slack.reactions.get',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(ctx.database, 'slack.reactions.get', { ...input }, 'failed');
		throw error;
	}
};

export const remove: SlackEndpoints['reactionsRemove'] = async (ctx, input) => {
	try {
		const result = await makeSlackRequest<
			SlackEndpointOutputs['reactionsRemove']
		>('reactions.remove', ctx.options.botToken, {
			method: 'POST',
			body: {
				name: input.name,
				channel: input.channel,
				timestamp: input.timestamp,
				file: input.file,
				file_comment: input.file_comment,
			},
		});
		await logEvent(
			ctx.database,
			'slack.reactions.remove',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'slack.reactions.remove',
			{ ...input },
			'failed',
		);
		throw error;
	}
};
