import type { SlackEndpoints } from '..';
import { makeSlackRequest } from '../client';
import type { SlackEndpointOutputs } from '../types';

export const archive: SlackEndpoints['channelsArchive'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsArchive']
	>('conversations.archive', ctx.options.botToken, {
		method: 'POST',
		body: { channel: input.channel },
	});

	if (result.ok && ctx.db.channels) {
		try {
			const existing = await ctx.db.channels.findByResourceId(input.channel);
			if (existing) {
				await ctx.db.channels.upsert(input.channel, {
					...existing.data,
					is_archived: true,
				});
			}
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	return result;
};

export const close: SlackEndpoints['channelsClose'] = async (ctx, input) => {
	return makeSlackRequest<SlackEndpointOutputs['channelsClose']>(
		'conversations.close',
		ctx.options.botToken,
		{
			method: 'POST',
			body: { channel: input.channel },
		},
	);
};

export const create: SlackEndpoints['channelsCreate'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsCreate']>(
		'conversations.create',
		ctx.options.botToken,
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
			await ctx.db.channels.upsert(result.channel.id, {
				id: result.channel.id,
				name: result.channel.name,
				is_private: input.is_private,
				is_archived: false,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save channel to database:', error);
		}
	}

	return result;
};

export const get: SlackEndpoints['channelsGet'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsGet']>(
		'conversations.info',
		ctx.options.botToken,
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
			await ctx.db.channels.upsert(result.channel.id, {
				id: result.channel.id,
				name: result.channel.name,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save channel to database:', error);
		}
	}

	return result;
};

export const list: SlackEndpoints['channelsList'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsList']>(
		'conversations.list',
		ctx.options.botToken,
		{
			method: 'GET',
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
					await ctx.db.channels.upsert(channel.id, {
						id: channel.id,
						name: channel.name,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save channels to database:', error);
		}
	}

	return result;
};

export const getHistory: SlackEndpoints['channelsGetHistory'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsGetHistory']
	>('conversations.history', ctx.options.botToken, {
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
					await ctx.db.messages.upsert(message.ts, {
						id: message.ts,
						ts: message.ts,
						text: message.text,
						channel: input.channel,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save messages to database:', error);
		}
	}

	return result;
};

export const invite: SlackEndpoints['channelsInvite'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsInvite']>(
		'conversations.invite',
		ctx.options.botToken,
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
			await ctx.db.channels.upsert(result.channel.id, {
				id: result.channel.id,
				name: result.channel.name,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	return result;
};

export const join: SlackEndpoints['channelsJoin'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsJoin']>(
		'conversations.join',
		ctx.options.botToken,
		{
			method: 'POST',
			body: { channel: input.channel },
		},
	);

	if (result.ok && result.channel && ctx.db.channels) {
		try {
			const existing = await ctx.db.channels.findByResourceId(input.channel);
			await ctx.db.channels.upsert(result.channel.id, {
				...(existing?.data || { id: result.channel.id }),
				name: result.channel.name,
				is_member: true,
			});
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	return result;
};

export const kick: SlackEndpoints['channelsKick'] = async (ctx, input) => {
	return makeSlackRequest<SlackEndpointOutputs['channelsKick']>(
		'conversations.kick',
		ctx.options.botToken,
		{
			method: 'POST',
			body: {
				channel: input.channel,
				user: input.user,
			},
		},
	);
};

export const leave: SlackEndpoints['channelsLeave'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsLeave']>(
		'conversations.leave',
		ctx.options.botToken,
		{
			method: 'POST',
			body: { channel: input.channel },
		},
	);

	if (result.ok && ctx.db.channels) {
		try {
			const existing = await ctx.db.channels.findByResourceId(input.channel);
			if (existing) {
				await ctx.db.channels.upsert(input.channel, {
					...existing.data,
					is_member: false,
				});
			}
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	return result;
};

export const getMembers: SlackEndpoints['channelsGetMembers'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsGetMembers']
	>('conversations.members', ctx.options.botToken, {
		method: 'GET',
		query: {
			channel: input.channel,
			cursor: input.cursor,
			limit: input.limit,
		},
	});

	if (result.ok && result.members && ctx.db.channels) {
		try {
			const existing = await ctx.db.channels.findByResourceId(input.channel);
			if (existing) {
				await ctx.db.channels.upsert(input.channel, {
					...existing.data,
					num_members: result.members.length,
				});
			}
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	return result;
};

export const open: SlackEndpoints['channelsOpen'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsOpen']>(
		'conversations.open',
		ctx.options.botToken,
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
			await ctx.db.channels.upsert(result.channel.id, {
				id: result.channel.id,
				name: result.channel.name,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save channel to database:', error);
		}
	}

	return result;
};

export const rename: SlackEndpoints['channelsRename'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['channelsRename']>(
		'conversations.rename',
		ctx.options.botToken,
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
			const existing = await ctx.db.channels.findByResourceId(input.channel);
			await ctx.db.channels.upsert(result.channel.id, {
				...(existing?.data || { id: result.channel.id }),
				name: result.channel.name,
				name_normalized: result.channel.name,
			});
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	return result;
};

export const getReplies: SlackEndpoints['channelsGetReplies'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsGetReplies']
	>('conversations.replies', ctx.options.botToken, {
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
					await ctx.db.messages.upsert(message.ts, {
						id: message.ts,
						ts: message.ts,
						text: message.text,
						channel: input.channel,
						thread_ts: input.ts,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save replies to database:', error);
		}
	}

	return result;
};

export const setPurpose: SlackEndpoints['channelsSetPurpose'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsSetPurpose']
	>('conversations.setPurpose', ctx.options.botToken, {
		method: 'POST',
		body: {
			channel: input.channel,
			purpose: input.purpose,
		},
	});

	if (result.ok && result.channel && ctx.db.channels) {
		try {
			const existing = await ctx.db.channels.findByResourceId(input.channel);
			await ctx.db.channels.upsert(result.channel.id, {
				...(existing?.data || { id: result.channel.id }),
				purpose: result.purpose
					? {
							value: result.purpose,
							creator: '',
							last_set: Date.now(),
						}
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	return result;
};

export const setTopic: SlackEndpoints['channelsSetTopic'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsSetTopic']
	>('conversations.setTopic', ctx.options.botToken, {
		method: 'POST',
		body: {
			channel: input.channel,
			topic: input.topic,
		},
	});

	if (result.ok && result.channel && ctx.db.channels) {
		try {
			const existing = await ctx.db.channels.findByResourceId(input.channel);
			await ctx.db.channels.upsert(result.channel.id, {
				...(existing?.data || { id: result.channel.id }),
				topic: result.topic
					? {
							value: result.topic,
							creator: '',
							last_set: Date.now(),
						}
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	return result;
};

export const unarchive: SlackEndpoints['channelsUnarchive'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackRequest<
		SlackEndpointOutputs['channelsUnarchive']
	>('conversations.unarchive', ctx.options.botToken, {
		method: 'POST',
		body: { channel: input.channel },
	});

	if (result.ok && ctx.db.channels) {
		try {
			const existing = await ctx.db.channels.findByResourceId(input.channel);
			if (existing) {
				await ctx.db.channels.upsert(input.channel, {
					...existing.data,
					is_archived: false,
				});
			}
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	return result;
};
