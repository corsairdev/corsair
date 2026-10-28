import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import { accountPath, call } from './call';

export const list: UnipileEndpoints['postsList'] = (ctx, input) =>
	call(ctx, 'postsList', 'posts.list', input, (parsed) => ({
		method: 'GET',
		path: accountPath(
			parsed.account_id,
			`/users/${segment(parsed.user_id)}/posts`,
		),
		query: {
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));

export const listReactions: UnipileEndpoints['postsListReactions'] = (
	ctx,
	input,
) =>
	call(ctx, 'postsListReactions', 'posts.listReactions', input, (parsed) => ({
		method: 'GET',
		path: accountPath(
			parsed.account_id,
			`/posts/${segment(parsed.post_id)}/reactions`,
		),
		query: {
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));

export const listComments: UnipileEndpoints['postsListComments'] = (
	ctx,
	input,
) =>
	call(ctx, 'postsListComments', 'posts.listComments', input, (parsed) => ({
		method: 'GET',
		path: accountPath(
			parsed.account_id,
			`/posts/${segment(parsed.post_id)}/comments`,
		),
		query: {
			sort_by: parsed.sort_by,
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));
