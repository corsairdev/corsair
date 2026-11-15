import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import {
	accountPath,
	call,
	defineBinaryOperation,
	defineOperation,
	noContent,
} from './call';

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

// Set Presence (POST /v2/{account_id}/presence)
export const setPresence = defineOperation(
	'usersSetPresence',
	'users.setPresence',
	{ method: 'POST', path: '/v2/{account_id}/presence', body: ['presence'] },
);

// Get a User Presence (GET /v2/{account_id}/users/{user_id}/presence)
export const getPresence = defineOperation(
	'usersGetPresence',
	'users.getPresence',
	{ method: 'GET', path: '/v2/{account_id}/users/{user_id}/presence' },
);

// Get a User Picture (GET /v2/{account_id}/users/{user_id}/picture)
export const getPicture = defineBinaryOperation(
	'usersGetPicture',
	'users.getPicture',
	{ method: 'GET', path: '/v2/{account_id}/users/{user_id}/picture' },
);

// Update a User Profile (PATCH /v2/{account_id}/users/{user_id})
export const updateProfile = defineOperation(
	'usersUpdateProfile',
	'users.updateProfile',
	{
		method: 'PATCH',
		path: '/v2/{account_id}/users/{user_id}',
		body: [
			'first_name',
			'last_name',
			'description',
			'location',
			'bio',
			'picture',
			'background_picture',
			'specifics',
		],
	},
);

// Delete a Relation (DELETE /v2/{account_id}/users/me/relations/{user_id})
export const removeRelation = defineOperation(
	'usersRemoveRelation',
	'users.removeRelation',
	{ method: 'DELETE', path: '/v2/{account_id}/users/me/relations/{user_id}' },
	noContent,
);

// List Followers of a User (GET /v2/{account_id}/users/{user_id}/followers)
export const listFollowers = defineOperation(
	'usersListFollowers',
	'users.listFollowers',
	{
		method: 'GET',
		path: '/v2/{account_id}/users/{user_id}/followers',
		query: ['offset', 'cursor', 'limit'],
	},
);

// List Following of a User (GET /v2/{account_id}/users/{user_id}/following)
export const listFollowing = defineOperation(
	'usersListFollowing',
	'users.listFollowing',
	{
		method: 'GET',
		path: '/v2/{account_id}/users/{user_id}/following',
		query: ['offset', 'cursor', 'limit'],
	},
);

// Follow a User (POST /v2/{account_id}/users/me/follow/{user_id})
export const follow = defineOperation('usersFollow', 'users.follow', {
	method: 'POST',
	path: '/v2/{account_id}/users/me/follow/{user_id}',
});

// Unfollow a User (POST /v2/{account_id}/users/me/unfollow/{user_id})
export const unfollow = defineOperation('usersUnfollow', 'users.unfollow', {
	method: 'POST',
	path: '/v2/{account_id}/users/me/unfollow/{user_id}',
});
