import { logEventFromContext } from 'corsair/core';
import { makeSlackbotRequest } from '../client';
import type { SlackbotEndpoints } from '../index';
import type { SlackbotEndpointOutputs, SlackUser } from './types';

export const list: SlackbotEndpoints['usersList'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersList']
	>('users.list', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.users.list',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Slack offers no user-search method to bot tokens, so this pages `users.list`
 * and matches locally on name, real name, display name and email. Bots and
 * deactivated accounts are excluded by default because the common case is
 * finding a human to address. Bounded by `max_pages`; `truncated` reports
 * whether the crawl was cut short.
 */
export const find: SlackbotEndpoints['usersFind'] = async (ctx, input) => {
	const maxPages = input.max_pages ?? 10;
	const needle = input.query.toLowerCase();

	const matches: SlackUser[] = [];
	let cursor: string | undefined;
	let pagesScanned = 0;
	let truncated = false;

	do {
		const page = await makeSlackbotRequest<
			SlackbotEndpointOutputs['usersList']
		>('users.list', ctx.key, {
			method: 'GET',
			query: {
				cursor,
				limit: input.limit ?? 200,
				team_id: input.team_id,
			},
		});
		pagesScanned += 1;

		for (const member of page.members ?? []) {
			if (member.deleted && !input.include_deleted) continue;
			if (member.is_bot && !input.include_bots) continue;

			const profile = member.profile as
				| { display_name?: string; email?: string; real_name?: string }
				| undefined;
			const haystack = [
				member.name,
				member.real_name,
				profile?.display_name,
				profile?.real_name,
				profile?.email,
			]
				.filter((v): v is string => typeof v === 'string')
				.map((v) => v.toLowerCase());

			if (haystack.some((v) => v.includes(needle))) matches.push(member);
		}

		cursor = page.response_metadata?.next_cursor || undefined;
		if (cursor && pagesScanned >= maxPages) {
			truncated = true;
			break;
		}
	} while (cursor);

	await logEventFromContext(
		ctx,
		'slackbot.users.find',
		{ ...input },
		'completed',
	);

	return {
		ok: true,
		members: matches,
		truncated,
		pages_scanned: pagesScanned,
	};
};

export const info: SlackbotEndpoints['usersInfo'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersInfo']
	>('users.info', ctx.key, { method: 'GET', query: input });

	if (result.ok && result.user?.id && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.user.id, {
				id: result.user.id,
				name: result.user.name,
				real_name: result.user.real_name,
				team_id: result.user.team_id,
				is_bot: result.user.is_bot,
				deleted: result.user.deleted,
				tz: result.user.tz,
			});
		} catch (error) {
			console.warn('Failed to cache user:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.users.info',
		{ ...input },
		'completed',
	);
	return result;
};

export const getProfile: SlackbotEndpoints['usersGetProfile'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersGetProfile']
	>('users.profile.get', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.users.getProfile',
		{ ...input },
		'completed',
	);
	return result;
};

export const getPresence: SlackbotEndpoints['usersGetPresence'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersGetPresence']
	>('users.getPresence', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.users.getPresence',
		{ ...input },
		'completed',
	);
	return result;
};

export const setPresence: SlackbotEndpoints['usersSetPresence'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersSetPresence']
	>('users.setPresence', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.users.setPresence',
		{ ...input },
		'completed',
	);
	return result;
};

export const setActive: SlackbotEndpoints['usersSetActive'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersSetActive']
	>('users.setActive', ctx.key, { method: 'POST', body: {} });
	await logEventFromContext(
		ctx,
		'slackbot.users.setActive',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Slack has deprecated `users.lookupByEmail`. It is kept because existing
 * workspaces still serve it; prefer `users.find` for new work.
 *
 * @deprecated Use {@link find} instead.
 */
export const lookupByEmail: SlackbotEndpoints['usersLookupByEmail'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersLookupByEmail']
	>('users.lookupByEmail', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.users.lookupByEmail',
		{ ...input },
		'completed',
	);
	return result;
};

export const botsInfo: SlackbotEndpoints['usersBotsInfo'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersBotsInfo']
	>('bots.info', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.users.botsInfo',
		{ ...input },
		'completed',
	);
	return result;
};

export const dndInfo: SlackbotEndpoints['usersDndInfo'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersDndInfo']
	>('dnd.info', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.users.dndInfo',
		{ ...input },
		'completed',
	);
	return result;
};

export const dndTeamInfo: SlackbotEndpoints['usersDndTeamInfo'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['usersDndTeamInfo']
	>('dnd.teamInfo', ctx.key, {
		method: 'GET',
		query: {
			...input,
			users: input.users?.length ? input.users.join(',') : undefined,
		},
	});
	await logEventFromContext(
		ctx,
		'slackbot.users.dndTeamInfo',
		{ ...input },
		'completed',
	);
	return result;
};
