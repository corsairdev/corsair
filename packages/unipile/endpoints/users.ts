import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import { accountPath, call } from './call';

export const getProfile: UnipileEndpoints['usersGetProfile'] = (ctx, input) =>
	call(ctx, 'usersGetProfile', 'users.getProfile', input, (parsed) => ({
		method: 'GET',
		path: accountPath(parsed.account_id, `/users/${segment(parsed.user_id)}`),
		query: { with_sections: parsed.with_sections, variant: parsed.variant },
	}));

// Tells LinkedIn the profile was viewed, so the member sees the visit.
export const visitProfile: UnipileEndpoints['usersVisitProfile'] = (
	ctx,
	input,
) =>
	call(ctx, 'usersVisitProfile', 'users.visitProfile', input, (parsed) => ({
		method: 'POST',
		path: accountPath(parsed.account_id, '/users/visit-profile'),
		query: { token: parsed.token },
	}));

export const listRelations: UnipileEndpoints['usersListRelations'] = (
	ctx,
	input,
) =>
	call(ctx, 'usersListRelations', 'users.listRelations', input, (parsed) => ({
		method: 'GET',
		path: accountPath(
			parsed.account_id,
			`/users/${segment(parsed.user_id)}/relations`,
		),
		query: {
			search: parsed.search,
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));

export const getChat: UnipileEndpoints['usersGetChat'] = (ctx, input) =>
	call(ctx, 'usersGetChat', 'users.getChat', input, (parsed) => ({
		method: 'GET',
		path: accountPath(
			parsed.account_id,
			`/users/${segment(parsed.user_id)}/chat`,
		),
	}));

export const listReactions: UnipileEndpoints['usersListReactions'] = (
	ctx,
	input,
) =>
	call(ctx, 'usersListReactions', 'users.listReactions', input, (parsed) => ({
		method: 'GET',
		path: accountPath(
			parsed.account_id,
			`/users/${segment(parsed.user_id)}/reactions`,
		),
		query: {
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));

export const listComments: UnipileEndpoints['usersListComments'] = (
	ctx,
	input,
) =>
	call(ctx, 'usersListComments', 'users.listComments', input, (parsed) => ({
		method: 'GET',
		path: accountPath(
			parsed.account_id,
			`/users/${segment(parsed.user_id)}/comments`,
		),
		query: {
			offset: parsed.offset,
			cursor: parsed.cursor,
			limit: parsed.limit,
		},
	}));
