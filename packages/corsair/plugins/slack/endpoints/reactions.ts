import { logEventFromContext } from '../../utils/events';
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
	const result = await makeSlackRequest<SlackEndpointOutputs['reactionsAdd']>(
		'reactions.add',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);
	await logEventFromContext(
		ctx,
		'slack.reactions.add',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: SlackEndpoints['reactionsGet'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['reactionsGet']>(
		'reactions.get',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);
	await logEventFromContext(
		ctx,
		'slack.reactions.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const remove: SlackEndpoints['reactionsRemove'] = async (ctx, input) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['reactionsRemove']
	>('reactions.remove', ctx.key, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'slack.reactions.remove',
		{ ...input },
		'completed',
	);
	return result;
};
