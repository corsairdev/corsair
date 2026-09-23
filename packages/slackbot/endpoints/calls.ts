import { logEventFromContext } from 'corsair/core';
import { makeSlackbotRequest } from '../client';
import type { SlackbotEndpoints } from '../index';
import type { SlackbotEndpointOutputs } from './types';

/**
 * Registers a call with Slack so it renders as a first-class call card.
 * `external_unique_id` is the caller's own identifier and must stay stable for
 * the lifetime of the call — Slack uses it to deduplicate.
 */
export const add: SlackbotEndpoints['callsAdd'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<SlackbotEndpointOutputs['callsAdd']>(
		'calls.add',
		ctx.key,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'slackbot.calls.add',
		{ ...input },
		'completed',
	);
	return result;
};

export const info: SlackbotEndpoints['callsInfo'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['callsInfo']
	>('calls.info', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.calls.info',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: SlackbotEndpoints['callsUpdate'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['callsUpdate']
	>('calls.update', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.calls.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const end: SlackbotEndpoints['callsEnd'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<SlackbotEndpointOutputs['callsEnd']>(
		'calls.end',
		ctx.key,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'slackbot.calls.end',
		{ ...input },
		'completed',
	);
	return result;
};

export const participantsAdd: SlackbotEndpoints['callsParticipantsAdd'] =
	async (ctx, input) => {
		const result = await makeSlackbotRequest<
			SlackbotEndpointOutputs['callsParticipantsAdd']
		>('calls.participants.add', ctx.key, { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'slackbot.calls.participantsAdd',
			{ ...input },
			'completed',
		);
		return result;
	};

export const participantsRemove: SlackbotEndpoints['callsParticipantsRemove'] =
	async (ctx, input) => {
		const result = await makeSlackbotRequest<
			SlackbotEndpointOutputs['callsParticipantsRemove']
		>('calls.participants.remove', ctx.key, { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'slackbot.calls.participantsRemove',
			{ ...input },
			'completed',
		);
		return result;
	};
