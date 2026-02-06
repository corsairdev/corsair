import { logEventFromContext } from '../../utils/events';
import type { SlackBoundEndpoints, SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from './types';

export const random: SlackEndpoints['channelsRandom'] = async (ctx, input) => {
	console.log('random channel', ctx.key);
	return {
		done: true,
	};
};

export const archive: SlackEndpoints['channelsArchive'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsArchive']
	>('conversations.archive', ctx.key, {
		method: 'POST',
		body: { channel: input.channel },
	});

	if (result.ok && ctx.db.channels) {
		const endpoints = ctx.endpoints as SlackBoundEndpoints;
		await endpoints.channels.get({ channel: input.channel });
	}

	await logEventFromContext(
		ctx,
		'slack.channels.archive',
		{ ...input },
		'completed',
	);
	return result;
};

export const close: SlackEndpoints['channelsClose'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsClose']>(
		'conversations.close',
		ctx.key,
		{
			method: 'POST',
			body: { channel: input.channel },
		},
	);
	await logEventFromContext(
		ctx,
		'slack.channels.close',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: SlackEndpoints['channelsCreate'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsCreate']>(
		'conversations.create',
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				is_private: input.is_private,
				team_id: input.team_id,
			},
		},
	);

	if (result.ok && result.channel && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.channel.id, {
				...result.channel,
			});
		} catch (error) {
			console.warn('Failed to save channel to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.channels.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: SlackEndpoints['channelsGet'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsGet']>(
		'conversations.info',
		ctx.key,
		{
			method: 'GET',
			query: {
				channel: input.channel,
				include_locale: input.include_locale,
				include_num_members: input.include_num_members,
			},
		},
	);

	if (result.ok && result.channel && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.channel.id, {
				...result.channel,
			});
		} catch (error) {
			console.warn('Failed to save channel to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.channels.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: SlackEndpoints['channelsList'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsList']>(
		'conversations.list',
		ctx.key,
		{
			method: 'POST',
			query: {
				exclude_archived: input.exclude_archived,
				types: input.types,
				team_id: input.team_id,
				cursor: input.cursor,
				limit: input.limit,
			},
		},
	);

	if (result.ok && result.channels && ctx.db.channels) {
		try {
			for (const channel of result.channels) {
				if (channel.id) {
					await ctx.db.channels.upsertByEntityId(channel.id, {
						...channel,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save channels to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.channels.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getHistory: SlackEndpoints['channelsGetHistory'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsGetHistory']
	>('conversations.history', ctx.key, {
		method: 'GET',
		query: {
			channel: input.channel,
			latest: input.latest,
			oldest: input.oldest,
			inclusive: input.inclusive,
			include_all_metadata: input.include_all_metadata,
			cursor: input.cursor,
			limit: input.limit,
		},
	});

	if (result.ok && result.messages && ctx.db.messages) {
		try {
			for (const message of result.messages) {
				if (message.ts) {
					await ctx.db.messages.upsertByEntityId(message.ts, {
						...message,
						id: message.ts,
						channel: input.channel,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save messages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.channels.getHistory',
		{ ...input },
		'completed',
	);
	return result;
};

export const invite: SlackEndpoints['channelsInvite'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsInvite']>(
		'conversations.invite',
		ctx.key,
		{
			method: 'POST',
			body: {
				channel: input.channel,
				users: input.users,
				force: input.force,
			},
		},
	);

	if (result.ok && result.channel && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.channel.id, {
				...result.channel,
			});
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.channels.invite',
		{ ...input },
		'completed',
	);
	return result;
};

export const join: SlackEndpoints['channelsJoin'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsJoin']>(
		'conversations.join',
		ctx.key,
		{
			method: 'POST',
			body: { channel: input.channel },
		},
	);

	if (result.ok && result.channel) {
		const endpoints = ctx.endpoints as SlackBoundEndpoints;
		await endpoints.channels.getMembers({ channel: result.channel.id });
	}

	await logEventFromContext(
		ctx,
		'slack.channels.join',
		{ ...input },
		'completed',
	);
	return result;
};

export const kick: SlackEndpoints['channelsKick'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsKick']>(
		'conversations.kick',
		ctx.key,
		{
			method: 'POST',
			body: {
				channel: input.channel,
				user: input.user,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'slack.channels.kick',
		{ ...input },
		'completed',
	);
	return result;
};

export const leave: SlackEndpoints['channelsLeave'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsLeave']>(
		'conversations.leave',
		ctx.key,
		{
			method: 'POST',
			body: { channel: input.channel },
		},
	);

	if (result.ok && ctx.db.channels) {
		const endpoints = ctx.endpoints as SlackBoundEndpoints;
		await endpoints.channels.get({ channel: input.channel });
	}

	await logEventFromContext(
		ctx,
		'slack.channels.leave',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMembers: SlackEndpoints['channelsGetMembers'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsGetMembers']
	>('conversations.members', ctx.key, {
		method: 'GET',
		query: {
			channel: input.channel,
			cursor: input.cursor,
			limit: input.limit,
		},
	});

	if (result.ok && result.members && ctx.db.channels) {
		try {
			const existing = await ctx.db.channels.findByEntityId(input.channel);
			if (existing) {
				await ctx.db.channels.upsertByEntityId(input.channel, {
					...existing.data,
					num_members: result.members.length,
				});
			}
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.channels.getMembers',
		{ ...input },
		'completed',
	);
	return result;
};

export const open: SlackEndpoints['channelsOpen'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsOpen']>(
		'conversations.open',
		ctx.key,
		{
			method: 'POST',
			body: {
				channel: input.channel,
				users: input.users,
				prevent_creation: input.prevent_creation,
				return_im: input.return_im,
			},
		},
	);

	if (result.ok && result.channel && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.channel.id, {
				...result.channel,
			});
		} catch (error) {
			console.warn('Failed to save channel to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.channels.open',
		{ ...input },
		'completed',
	);
	return result;
};

export const rename: SlackEndpoints['channelsRename'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsRename']>(
		'conversations.rename',
		ctx.key,
		{
			method: 'POST',
			body: {
				channel: input.channel,
				name: input.name,
			},
		},
	);

	if (result.ok && result.channel && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.channel.id, {
				...result.channel,
			});
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.channels.rename',
		{ ...input },
		'completed',
	);
	return result;
};

export const getReplies: SlackEndpoints['channelsGetReplies'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsGetReplies']
	>('conversations.replies', ctx.key, {
		method: 'GET',
		query: {
			channel: input.channel,
			ts: input.ts,
			latest: input.latest,
			oldest: input.oldest,
			inclusive: input.inclusive,
			include_all_metadata: input.include_all_metadata,
			cursor: input.cursor,
			limit: input.limit,
		},
	});

	if (result.ok && result.messages && ctx.db.messages) {
		try {
			for (const message of result.messages) {
				if (message.ts) {
					await ctx.db.messages.upsertByEntityId(message.ts, {
						...message,
						id: message.ts,
						channel: input.channel,
						thread_ts: input.ts,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save replies to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slack.channels.getReplies',
		{ ...input },
		'completed',
	);
	return result;
};

export const setPurpose: SlackEndpoints['channelsSetPurpose'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsSetPurpose']
	>('conversations.setPurpose', ctx.key, {
		method: 'POST',
		body: {
			channel: input.channel,
			purpose: input.purpose,
		},
	});

	if (result.ok && result.channel) {
		const endpoints = ctx.endpoints as SlackBoundEndpoints;
		await endpoints.channels.get({ channel: result.channel.id });
	}

	await logEventFromContext(
		ctx,
		'slack.channels.setPurpose',
		{ ...input },
		'completed',
	);
	return result;
};

export const setTopic: SlackEndpoints['channelsSetTopic'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsSetTopic']
	>('conversations.setTopic', ctx.key, {
		method: 'POST',
		body: {
			channel: input.channel,
			topic: input.topic,
		},
	});

	if (result.ok && result.channel) {
		const endpoints = ctx.endpoints as SlackBoundEndpoints;
		await endpoints.channels.get({ channel: result.channel.id });
	}

	await logEventFromContext(
		ctx,
		'slack.channels.setTopic',
		{ ...input },
		'completed',
	);
	return result;
};

export const unarchive: SlackEndpoints['channelsUnarchive'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsUnarchive']
	>('conversations.unarchive', ctx.key, {
		method: 'POST',
		body: { channel: input.channel },
	});

	if (result.ok && ctx.db.channels) {
		const endpoints = ctx.endpoints as SlackBoundEndpoints;
		await endpoints.channels.get({ channel: input.channel });
	}

	await logEventFromContext(
		ctx,
		'slack.channels.unarchive',
		{ ...input },
		'completed',
	);
	return result;
};
