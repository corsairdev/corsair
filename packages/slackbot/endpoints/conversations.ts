import { logEventFromContext } from 'corsair/core';
import { makeSlackbotRequest } from '../client';
import type { SlackbotEndpoints } from '../index';
import type { SlackbotEndpointOutputs, SlackChannel } from './types';

/**
 * Slack takes comma-delimited strings for multi-value params. The public input
 * schemas expose real arrays so callers get IntelliSense and length validation,
 * and the join happens here at the boundary.
 */
function csv(values: readonly string[] | undefined): string | undefined {
	return values?.length ? values.join(',') : undefined;
}

export const archive: SlackbotEndpoints['conversationsArchive'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsArchive']
	>('conversations.archive', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.archive',
		{ ...input },
		'completed',
	);
	return result;
};

export const unarchive: SlackbotEndpoints['conversationsUnarchive'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsUnarchive']
	>('conversations.unarchive', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.unarchive',
		{ ...input },
		'completed',
	);
	return result;
};

export const close: SlackbotEndpoints['conversationsClose'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsClose']
	>('conversations.close', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.close',
		{ ...input },
		'completed',
	);
	return result;
};

export const join: SlackbotEndpoints['conversationsJoin'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsJoin']
	>('conversations.join', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.join',
		{ ...input },
		'completed',
	);
	return result;
};

export const leave: SlackbotEndpoints['conversationsLeave'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsLeave']
	>('conversations.leave', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.leave',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: SlackbotEndpoints['conversationsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsCreate']
	>('conversations.create', ctx.key, { method: 'POST', body: input });

	if (result.ok && result.channel?.id && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.channel.id, {
				id: result.channel.id,
				name: result.channel.name,
				is_private: result.channel.is_private,
				is_archived: result.channel.is_archived,
				created: result.channel.created,
				creator: result.channel.creator,
			});
		} catch (error) {
			console.warn('Failed to cache created channel:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.conversations.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const info: SlackbotEndpoints['conversationsInfo'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsInfo']
	>('conversations.info', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.info',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: SlackbotEndpoints['conversationsList'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsList']
	>('conversations.list', ctx.key, {
		method: 'GET',
		query: { ...input, types: csv(input.types) },
	});
	await logEventFromContext(
		ctx,
		'slackbot.conversations.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listForUser: SlackbotEndpoints['conversationsListForUser'] =
	async (ctx, input) => {
		const result = await makeSlackbotRequest<
			SlackbotEndpointOutputs['conversationsListForUser']
		>('users.conversations', ctx.key, {
			method: 'GET',
			query: { ...input, types: csv(input.types) },
		});
		await logEventFromContext(
			ctx,
			'slackbot.conversations.listForUser',
			{ ...input },
			'completed',
		);
		return result;
	};

/**
 * Slack exposes no channel-name search for bot tokens, so this walks
 * `conversations.list` and filters client-side. The crawl is bounded by
 * `max_pages` (default 10) and reports `truncated` so callers can tell an
 * exhausted search from an abandoned one rather than silently trusting a
 * partial result.
 */
export const find: SlackbotEndpoints['conversationsFind'] = async (
	ctx,
	input,
) => {
	const maxPages = input.max_pages ?? 10;
	const match = input.match ?? 'contains';
	const needle = input.query.toLowerCase();

	const matches: SlackChannel[] = [];
	let cursor: string | undefined;
	let pagesScanned = 0;
	let truncated = false;

	do {
		const page = await makeSlackbotRequest<
			SlackbotEndpointOutputs['conversationsList']
		>('conversations.list', ctx.key, {
			method: 'GET',
			query: {
				cursor,
				limit: input.limit ?? 200,
				exclude_archived: input.exclude_archived,
				team_id: input.team_id,
				types: csv(input.types),
			},
		});
		pagesScanned += 1;

		for (const channel of page.channels ?? []) {
			const name = channel.name?.toLowerCase();
			if (!name) continue;
			const hit =
				match === 'exact'
					? name === needle
					: match === 'prefix'
						? name.startsWith(needle)
						: name.includes(needle);
			if (hit) matches.push(channel);
		}

		cursor = page.response_metadata?.next_cursor || undefined;
		if (cursor && pagesScanned >= maxPages) {
			truncated = true;
			break;
		}
	} while (cursor);

	await logEventFromContext(
		ctx,
		'slackbot.conversations.find',
		{ ...input },
		'completed',
	);

	return {
		ok: true,
		channels: matches,
		truncated,
		pages_scanned: pagesScanned,
	};
};

export const members: SlackbotEndpoints['conversationsMembers'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsMembers']
	>('conversations.members', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.members',
		{ ...input },
		'completed',
	);
	return result;
};

export const invite: SlackbotEndpoints['conversationsInvite'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsInvite']
	>('conversations.invite', ctx.key, {
		method: 'POST',
		body: { ...input, users: csv(input.users) },
	});
	await logEventFromContext(
		ctx,
		'slackbot.conversations.invite',
		{ ...input },
		'completed',
	);
	return result;
};

export const kick: SlackbotEndpoints['conversationsKick'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsKick']
	>('conversations.kick', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.kick',
		{ ...input },
		'completed',
	);
	return result;
};

export const rename: SlackbotEndpoints['conversationsRename'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsRename']
	>('conversations.rename', ctx.key, { method: 'POST', body: input });

	if (result.ok && result.channel?.id && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.channel.id, {
				id: result.channel.id,
				name: result.channel.name,
				is_private: result.channel.is_private,
				is_archived: result.channel.is_archived,
			});
		} catch (error) {
			console.warn('Failed to update cached channel name:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.conversations.rename',
		{ ...input },
		'completed',
	);
	return result;
};

export const setPurpose: SlackbotEndpoints['conversationsSetPurpose'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsSetPurpose']
	>('conversations.setPurpose', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.setPurpose',
		{ ...input },
		'completed',
	);
	return result;
};

export const setTopic: SlackbotEndpoints['conversationsSetTopic'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsSetTopic']
	>('conversations.setTopic', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.setTopic',
		{ ...input },
		'completed',
	);
	return result;
};

export const mark: SlackbotEndpoints['conversationsMark'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['conversationsMark']
	>('conversations.mark', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.conversations.mark',
		{ ...input },
		'completed',
	);
	return result;
};
