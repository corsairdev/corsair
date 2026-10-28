import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import { accountPath, call } from './call';

export const list: UnipileEndpoints['chatsList'] = (ctx, input) =>
	call(ctx, 'chatsList', 'chats.list', input, (parsed) => ({
		method: 'GET',
		path: accountPath(parsed.account_id, '/chats'),
		query: {
			type: parsed.type,
			before: parsed.before,
			after: parsed.after,
			is_archived: parsed.is_archived,
			is_unread: parsed.is_unread,
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));

export const get: UnipileEndpoints['chatsGet'] = (ctx, input) =>
	call(ctx, 'chatsGet', 'chats.get', input, (parsed) => ({
		method: 'GET',
		path: accountPath(parsed.account_id, `/chats/${segment(parsed.chat_id)}`),
	}));

// Sends the first message of a new chat. Never retried on a timeout or 5xx.
export const start: UnipileEndpoints['chatsStart'] = (ctx, input) =>
	call(ctx, 'chatsStart', 'chats.start', input, (parsed) => {
		const { account_id, ...body } = parsed;
		return {
			method: 'POST',
			path: accountPath(account_id, '/chats/send'),
			body,
		};
	});
