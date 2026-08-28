import { logEventFromContext } from 'corsair/core';
import { makeSlackbotRequest } from '../client';
import type { SlackbotEndpoints } from '../index';
import type { SlackbotEndpointOutputs } from './types';

export const add: SlackbotEndpoints['remindersAdd'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['remindersAdd']
	>('reminders.add', ctx.key, { method: 'POST', body: input });

	if (result.ok && result.reminder?.id && ctx.db.reminders) {
		try {
			await ctx.db.reminders.upsertByEntityId(result.reminder.id, {
				id: result.reminder.id,
				text: result.reminder.text,
				user: result.reminder.user,
				creator: result.reminder.creator,
				time: result.reminder.time,
				recurring: result.reminder.recurring,
			});
		} catch (error) {
			console.warn('Failed to cache reminder:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.reminders.add',
		{ ...input },
		'completed',
	);
	return result;
};

export const info: SlackbotEndpoints['remindersInfo'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['remindersInfo']
	>('reminders.info', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.reminders.info',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: SlackbotEndpoints['remindersList'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['remindersList']
	>('reminders.list', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.reminders.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const remove: SlackbotEndpoints['remindersDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['remindersDelete']
	>('reminders.delete', ctx.key, { method: 'POST', body: input });

	if (result.ok && ctx.db.reminders) {
		try {
			await ctx.db.reminders.deleteByEntityId(input.reminder);
		} catch (error) {
			console.warn('Failed to evict reminder from cache:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.reminders.delete',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Slack has deprecated `reminders.complete`; it remains available to existing
 * workspaces but is not accepted for new apps.
 *
 * @deprecated Slack no longer supports completing reminders via the Web API.
 */
export const complete: SlackbotEndpoints['remindersComplete'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['remindersComplete']
	>('reminders.complete', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.reminders.complete',
		{ ...input },
		'completed',
	);
	return result;
};
