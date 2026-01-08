import type { CorsairEndpoint, CorsairContext } from '../../../core';
import { makeSlackRequest } from '../client';

export const archive = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; token?: string }],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.archive', token || input.token || '', {
			method: 'POST',
			body: { channel: input.channel },
		});
	};
};

export const close = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; token?: string }],
	Promise<{ ok: boolean; error?: string; no_op?: boolean; already_closed?: boolean }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.close', token || input.token || '', {
			method: 'POST',
			body: { channel: input.channel },
		});
	};
};

export const create = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ name: string; is_private?: boolean; team_id?: string; token?: string }],
	Promise<{ ok: boolean; channel?: { id: string; name: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.create', token || input.token || '', {
			method: 'POST',
			body: {
				name: input.name,
				is_private: input.is_private,
				team_id: input.team_id,
			},
		});
	};
};

export const get = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; include_locale?: boolean; include_num_members?: boolean; token?: string }],
	Promise<{ ok: boolean; channel?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.info', token || input.token || '', {
			method: 'GET',
			query: {
				channel: input.channel,
				include_locale: input.include_locale,
				include_num_members: input.include_num_members,
			},
		});
	};
};

export const list = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ exclude_archived?: boolean; types?: string; team_id?: string; cursor?: string; limit?: number; token?: string }],
	Promise<{ ok: boolean; channels?: Array<{ id: string; name?: string }>; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.list', token || input.token || '', {
			method: 'GET',
			query: {
				exclude_archived: input.exclude_archived,
				types: input.types,
				team_id: input.team_id,
				cursor: input.cursor,
				limit: input.limit,
			},
		});
	};
};

export const getHistory = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; latest?: string; oldest?: string; inclusive?: boolean; include_all_metadata?: boolean; cursor?: string; limit?: number; token?: string }],
	Promise<{ ok: boolean; messages?: Array<{ ts?: string; text?: string }>; has_more?: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.history', token || input.token || '', {
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
	};
};

export const invite = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; users: string; force?: boolean; token?: string }],
	Promise<{ ok: boolean; channel?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.invite', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				users: input.users,
				force: input.force,
			},
		});
	};
};

export const join = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; token?: string }],
	Promise<{ ok: boolean; channel?: { id: string; name?: string }; warning?: string; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.join', token || input.token || '', {
			method: 'POST',
			body: { channel: input.channel },
		});
	};
};

export const kick = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; user: string; token?: string }],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.kick', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				user: input.user,
			},
		});
	};
};

export const leave = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; token?: string }],
	Promise<{ ok: boolean; not_in_channel?: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.leave', token || input.token || '', {
			method: 'POST',
			body: { channel: input.channel },
		});
	};
};

export const getMembers = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; cursor?: string; limit?: number; token?: string }],
	Promise<{ ok: boolean; members?: string[]; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.members', token || input.token || '', {
			method: 'GET',
			query: {
				channel: input.channel,
				cursor: input.cursor,
				limit: input.limit,
			},
		});
	};
};

export const open = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel?: string; users?: string; prevent_creation?: boolean; return_im?: boolean; token?: string }],
	Promise<{ ok: boolean; channel?: { id: string; name?: string }; no_op?: boolean; already_open?: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.open', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				users: input.users,
				prevent_creation: input.prevent_creation,
				return_im: input.return_im,
			},
		});
	};
};

export const rename = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; name: string; token?: string }],
	Promise<{ ok: boolean; channel?: { id: string; name?: string }; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.rename', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				name: input.name,
			},
		});
	};
};

export const getReplies = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; ts: string; latest?: string; oldest?: string; inclusive?: boolean; include_all_metadata?: boolean; cursor?: string; limit?: number; token?: string }],
	Promise<{ ok: boolean; messages?: Array<{ ts?: string; text?: string }>; has_more?: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.replies', token || input.token || '', {
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
	};
};

export const setPurpose = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; purpose: string; token?: string }],
	Promise<{ ok: boolean; channel?: { id: string; name?: string }; purpose?: string; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.setPurpose', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				purpose: input.purpose,
			},
		});
	};
};

export const setTopic = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; topic: string; token?: string }],
	Promise<{ ok: boolean; channel?: { id: string; name?: string }; topic?: string; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.setTopic', token || input.token || '', {
			method: 'POST',
			body: {
				channel: input.channel,
				topic: input.topic,
			},
		});
	};
};

export const unarchive = (token: string): CorsairEndpoint<
	CorsairContext,
	[{ channel: string; token?: string }],
	Promise<{ ok: boolean; error?: string }>
> => {
	return async (_ctx, input) => {
		return makeSlackRequest('conversations.unarchive', token || input.token || '', {
			method: 'POST',
			body: { channel: input.channel },
		});
	};
};

