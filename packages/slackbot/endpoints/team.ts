import { logEventFromContext } from 'corsair/core';
import { makeSlackbotRequest } from '../client';
import type { SlackbotEndpoints } from '../index';
import type { SlackbotEndpointOutputs } from './types';

/**
 * Attaches custom previews to links the bot posted. `unfurls` maps each URL to
 * its Block Kit or attachment preview.
 */
export const unfurl: SlackbotEndpoints['teamUnfurl'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['teamUnfurl']
	>('chat.unfurl', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.team.unfurl',
		{ ...input },
		'completed',
	);
	return result;
};

export const info: SlackbotEndpoints['teamInfo'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<SlackbotEndpointOutputs['teamInfo']>(
		'team.info',
		ctx.key,
		{ method: 'GET', query: input },
	);
	await logEventFromContext(
		ctx,
		'slackbot.team.info',
		{ ...input },
		'completed',
	);
	return result;
};

export const profileGet: SlackbotEndpoints['teamProfileGet'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['teamProfileGet']
	>('team.profile.get', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.team.profileGet',
		{ ...input },
		'completed',
	);
	return result;
};

export const emojiList: SlackbotEndpoints['teamEmojiList'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['teamEmojiList']
	>('emoji.list', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.team.emojiList',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Opens (or resumes) a DM or multi-person DM. Passing `users` opens an MPIM
 * when more than one id is supplied; passing `channel` resumes an existing one.
 */
export const openDm: SlackbotEndpoints['teamOpenDm'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['teamOpenDm']
	>('conversations.open', ctx.key, {
		method: 'POST',
		body: {
			...input,
			users: input.users?.length ? input.users.join(',') : undefined,
		},
	});
	await logEventFromContext(
		ctx,
		'slackbot.team.openDm',
		{ ...input },
		'completed',
	);
	return result;
};
