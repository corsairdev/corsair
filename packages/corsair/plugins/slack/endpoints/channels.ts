import type { CorsairEndpoint, CorsairPluginContext } from '../../../core';
import { makeSlackRequest } from '../client';
import type { SlackSchema } from '../schema';

export const archive = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; token?: string }],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; error?: string }>(
			'conversations.archive',
			token || input.token || '',
			{
				method: 'POST',
				body: { channel: input.channel },
			},
		);

		if (result.ok && ctx.channels) {
			try {
				const existing = await ctx.channels.findByResourceId(input.channel);
				if (existing) {
					await ctx.channels.upsertByResourceId({
						resourceId: input.channel,
						data: {
							...existing,
							is_archived: true,
						},
					});
				}
			} catch (error) {
				console.warn('Failed to update channel in database:', error);
			}
		}

		return result;
	};
};

export const close = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; token?: string }],
	Promise<{
		ok: boolean;
		error?: string;
		no_op?: boolean;
		already_closed?: boolean;
	}>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest<{
			ok: boolean;
			error?: string;
			no_op?: boolean;
			already_closed?: boolean;
		}>('conversations.close', token || input.token || '', {
			method: 'POST',
			body: { channel: input.channel },
		});
	};
};

export const create = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ name: string; is_private?: boolean; team_id?: string; token?: string }],
	Promise<{
		ok: boolean;
		channel?: { id: string; name: string };
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			channel?: { id: string; name: string };
			error?: string;
		}>('conversations.create', token || input.token || '', {
			method: 'POST',
			body: {
				name: input.name,
				is_private: input.is_private,
				team_id: input.team_id,
			},
		});

		if (result.ok && result.channel && ctx.channels) {
			try {
				await ctx.channels.upsertByResourceId({
					resourceId: result.channel.id,
					data: {
						id: result.channel.id,
						name: result.channel.name,
						is_private: input.is_private,
						is_archived: false,
						createdAt: new Date(),
					},
				});
			} catch (error) {
				console.warn('Failed to save channel to database:', error);
			}
		}

		return result;
	};
};

export const get = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			channel: string;
			include_locale?: boolean;
			include_num_members?: boolean;
			token?: string;
		},
	],
	Promise<{
		ok: boolean;
		channel?: { id: string; name?: string };
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			channel?: { id: string; name?: string };
			error?: string;
		}>('conversations.info', token || input.token || '', {
			method: 'GET',
			query: {
				channel: input.channel,
				include_locale: input.include_locale,
				include_num_members: input.include_num_members,
			},
		});

		if (result.ok && result.channel && ctx.channels) {
			try {
				await ctx.channels.upsertByResourceId({
					resourceId: result.channel.id,
					data: {
						id: result.channel.id,
						name: result.channel.name,
						createdAt: new Date(),
					},
				});
			} catch (error) {
				console.warn('Failed to save channel to database:', error);
			}
		}

		return result;
	};
};

export const list = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			exclude_archived?: boolean;
			types?: string;
			team_id?: string;
			cursor?: string;
			limit?: number;
			token?: string;
		},
	],
	Promise<{
		ok: boolean;
		channels?: Array<{ id: string; name?: string }>;
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			channels?: Array<{ id: string; name?: string }>;
			error?: string;
		}>('conversations.list', token || input.token || '', {
			method: 'GET',
			query: {
				exclude_archived: input.exclude_archived,
				types: input.types,
				team_id: input.team_id,
				cursor: input.cursor,
				limit: input.limit,
			},
		});

		if (result.ok && result.channels && ctx.channels) {
			try {
				for (const channel of result.channels) {
					if (channel.id) {
						await ctx.channels.upsertByResourceId({
							resourceId: channel.id,
							data: {
								id: channel.id,
								name: channel.name,
								createdAt: new Date(),
							},
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save channels to database:', error);
			}
		}

		return result;
	};
};

export const getHistory = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			channel: string;
			latest?: string;
			oldest?: string;
			inclusive?: boolean;
			include_all_metadata?: boolean;
			cursor?: string;
			limit?: number;
			token?: string;
		},
	],
	Promise<{
		ok: boolean;
		messages?: Array<{ ts?: string; text?: string }>;
		has_more?: boolean;
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			messages?: Array<{ ts?: string; text?: string }>;
			has_more?: boolean;
			error?: string;
		}>('conversations.history', token || input.token || '', {
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

		if (result.ok && result.messages && ctx.messages) {
			try {
				for (const message of result.messages) {
					if (message.ts) {
						await ctx.messages.upsertByResourceId({
							resourceId: message.ts,
							data: {
								id: message.ts,
								ts: message.ts,
								text: message.text,
								channel: input.channel,
								createdAt: new Date(),
							},
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save messages to database:', error);
			}
		}

		return result;
	};
};

export const invite = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; users: string; force?: boolean; token?: string }],
	Promise<{
		ok: boolean;
		channel?: { id: string; name?: string };
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			channel?: { id: string; name?: string };
			error?: string;
		}>('conversations.invite', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				users: input.users,
				force: input.force,
			},
		});

		if (result.ok && result.channel && ctx.channels) {
			try {
				await ctx.channels.upsertByResourceId({
					resourceId: result.channel.id,
					data: {
						id: result.channel.id,
						name: result.channel.name,
						createdAt: new Date(),
					},
				});
			} catch (error) {
				console.warn('Failed to update channel in database:', error);
			}
		}

		return result;
	};
};

export const join = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; token?: string }],
	Promise<{
		ok: boolean;
		channel?: { id: string; name?: string };
		warning?: string;
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			channel?: { id: string; name?: string };
			warning?: string;
			error?: string;
		}>('conversations.join', token || input.token || '', {
			method: 'POST',
			body: { channel: input.channel },
		});

		if (result.ok && result.channel && ctx.channels) {
			try {
				const existing = await ctx.channels.findByResourceId(input.channel);
				await ctx.channels.upsertByResourceId({
					resourceId: result.channel.id,
					data: {
						...(existing || { id: result.channel.id }),
						name: result.channel.name,
						is_member: true,
					},
				});
			} catch (error) {
				console.warn('Failed to update channel in database:', error);
			}
		}

		return result;
	};
};

export const kick = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; user: string; token?: string }],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest<{ ok: boolean; error?: string }>(
			'conversations.kick',
			token || input.token || '',
			{
				method: 'POST',
				body: {
					channel: input.channel,
					user: input.user,
				},
			},
		);
	};
};

export const leave = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; token?: string }],
	Promise<{ ok: boolean; not_in_channel?: boolean; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			not_in_channel?: boolean;
			error?: string;
		}>('conversations.leave', token || input.token || '', {
			method: 'POST',
			body: { channel: input.channel },
		});

		if (result.ok && ctx.channels) {
			try {
				const existing = await ctx.channels.findByResourceId(input.channel);
				if (existing) {
					await ctx.channels.upsertByResourceId({
						resourceId: input.channel,
						data: {
							...existing,
							is_member: false,
						},
					});
				}
			} catch (error) {
				console.warn('Failed to update channel in database:', error);
			}
		}

		return result;
	};
};

export const getMembers = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; cursor?: string; limit?: number; token?: string }],
	Promise<{ ok: boolean; members?: string[]; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			members?: string[];
			error?: string;
		}>('conversations.members', token || input.token || '', {
			method: 'GET',
			query: {
				channel: input.channel,
				cursor: input.cursor,
				limit: input.limit,
			},
		});

		if (result.ok && result.members && ctx.channels) {
			try {
				const existing = await ctx.channels.findByResourceId(input.channel);
				if (existing) {
					await ctx.channels.upsertByResourceId({
						resourceId: input.channel,
						data: {
							...existing,
							num_members: result.members.length,
						},
					});
				}
			} catch (error) {
				console.warn('Failed to update channel in database:', error);
			}
		}

		return result;
	};
};

export const open = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			channel?: string;
			users?: string;
			prevent_creation?: boolean;
			return_im?: boolean;
			token?: string;
		},
	],
	Promise<{
		ok: boolean;
		channel?: { id: string; name?: string };
		no_op?: boolean;
		already_open?: boolean;
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			channel?: { id: string; name?: string };
			no_op?: boolean;
			already_open?: boolean;
			error?: string;
		}>('conversations.open', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				users: input.users,
				prevent_creation: input.prevent_creation,
				return_im: input.return_im,
			},
		});

		if (result.ok && result.channel && ctx.channels) {
			try {
				await ctx.channels.upsertByResourceId({
					resourceId: result.channel.id,
					data: {
						id: result.channel.id,
						name: result.channel.name,
						createdAt: new Date(),
					},
				});
			} catch (error) {
				console.warn('Failed to save channel to database:', error);
			}
		}

		return result;
	};
};

export const rename = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; name: string; token?: string }],
	Promise<{
		ok: boolean;
		channel?: { id: string; name?: string };
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			channel?: { id: string; name?: string };
			error?: string;
		}>('conversations.rename', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				name: input.name,
			},
		});

		if (result.ok && result.channel && ctx.channels) {
			try {
				const existing = await ctx.channels.findByResourceId(input.channel);
				await ctx.channels.upsertByResourceId({
					resourceId: result.channel.id,
					data: {
						...(existing || { id: result.channel.id }),
						name: result.channel.name,
						name_normalized: result.channel.name,
					},
				});
			} catch (error) {
				console.warn('Failed to update channel in database:', error);
			}
		}

		return result;
	};
};

export const getReplies = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[
		{
			channel: string;
			ts: string;
			latest?: string;
			oldest?: string;
			inclusive?: boolean;
			include_all_metadata?: boolean;
			cursor?: string;
			limit?: number;
			token?: string;
		},
	],
	Promise<{
		ok: boolean;
		messages?: Array<{ ts?: string; text?: string }>;
		has_more?: boolean;
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			messages?: Array<{ ts?: string; text?: string }>;
			has_more?: boolean;
			error?: string;
		}>('conversations.replies', token || input.token || '', {
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

		if (result.ok && result.messages && ctx.messages) {
			try {
				for (const message of result.messages) {
					if (message.ts) {
						await ctx.messages.upsertByResourceId({
							resourceId: message.ts,
							data: {
								id: message.ts,
								ts: message.ts,
								text: message.text,
								channel: input.channel,
								thread_ts: input.ts,
								createdAt: new Date(),
							},
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save replies to database:', error);
			}
		}

		return result;
	};
};

export const setPurpose = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; purpose: string; token?: string }],
	Promise<{
		ok: boolean;
		channel?: { id: string; name?: string };
		purpose?: string;
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			channel?: { id: string; name?: string };
			purpose?: string;
			error?: string;
		}>('conversations.setPurpose', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				purpose: input.purpose,
			},
		});

		if (result.ok && result.channel && ctx.channels) {
			try {
				const existing = await ctx.channels.findByResourceId(input.channel);
				await ctx.channels.upsertByResourceId({
					resourceId: result.channel.id,
					data: {
						...(existing || { id: result.channel.id }),
						purpose: result.purpose
							? {
									value: result.purpose,
									creator: '',
									last_set: Date.now(),
								}
							: undefined,
					},
				});
			} catch (error) {
				console.warn('Failed to update channel in database:', error);
			}
		}

		return result;
	};
};

export const setTopic = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; topic: string; token?: string }],
	Promise<{
		ok: boolean;
		channel?: { id: string; name?: string };
		topic?: string;
		error?: string;
	}>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{
			ok: boolean;
			channel?: { id: string; name?: string };
			topic?: string;
			error?: string;
		}>('conversations.setTopic', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				topic: input.topic,
			},
		});

		if (result.ok && result.channel && ctx.channels) {
			try {
				const existing = await ctx.channels.findByResourceId(input.channel);
				await ctx.channels.upsertByResourceId({
					resourceId: result.channel.id,
					data: {
						...(existing || { id: result.channel.id }),
						topic: result.topic
							? {
									value: result.topic,
									creator: '',
									last_set: Date.now(),
								}
							: undefined,
					},
				});
			} catch (error) {
				console.warn('Failed to update channel in database:', error);
			}
		}

		return result;
	};
};

export const unarchive = (
	token: string,
): CorsairEndpoint<
	CorsairPluginContext<'slack', typeof SlackSchema>,
	[{ channel: string; token?: string }],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (ctx, input) => {
		const result = await makeSlackRequest<{ ok: boolean; error?: string }>(
			'conversations.unarchive',
			token || input.token || '',
			{
				method: 'POST',
				body: { channel: input.channel },
			},
		);

		if (result.ok && ctx.channels) {
			try {
				const existing = await ctx.channels.findByResourceId(input.channel);
				if (existing) {
					await ctx.channels.upsertByResourceId({
						resourceId: input.channel,
						data: {
							...existing,
							is_archived: false,
						},
					});
				}
			} catch (error) {
				console.warn('Failed to update channel in database:', error);
			}
		}

		return result;
	};
};
