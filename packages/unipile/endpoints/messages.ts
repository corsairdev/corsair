import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import { accountPath, call } from './call';

export const list: UnipileEndpoints['messagesList'] = (ctx, input) =>
	call(ctx, 'messagesList', 'messages.list', input, (parsed) => ({
		method: 'GET',
		path: accountPath(
			parsed.account_id,
			`/chats/${segment(parsed.chat_id)}/messages`,
		),
		query: {
			before: parsed.before,
			after: parsed.after,
			user_id: parsed.user_id,
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));

// Never retried on a timeout or 5xx: a duplicate message is worse than none.
export const send: UnipileEndpoints['messagesSend'] = (ctx, input) =>
	call(ctx, 'messagesSend', 'messages.send', input, (parsed) => {
		const { account_id, chat_id, ...body } = parsed;
		return {
			method: 'POST',
			path: accountPath(account_id, `/chats/${segment(chat_id)}/messages/send`),
			body,
		};
	});
