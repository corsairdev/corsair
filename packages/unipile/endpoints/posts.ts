import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import { accountPath, call, defineOperation, noContent } from './call';

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

// Get a Post (GET /v2/{account_id}/posts/{post_id})
export const get = defineOperation('postsGet', 'posts.get', {
	method: 'GET',
	path: '/v2/{account_id}/posts/{post_id}',
});

// Create a Post (POST /v2/{account_id}/posts)
export const create = defineOperation('postsCreate', 'posts.create', {
	method: 'POST',
	path: '/v2/{account_id}/posts',
	body: [
		'text',
		'attachments',
		'can_read',
		'can_comment',
		'quoted_post_id',
		'post_as',
		'specifics',
	],
});

// Update a Post (PATCH /v2/{account_id}/posts/{post_id})
export const update = defineOperation('postsUpdate', 'posts.update', {
	method: 'PATCH',
	path: '/v2/{account_id}/posts/{post_id}',
	body: ['text', 'can_comment'],
});

// Delete a Post (DELETE /v2/{account_id}/posts/{post_id})
export const remove = defineOperation(
	'postsDelete',
	'posts.delete',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/posts/{post_id}',
	},
	noContent,
);

// Create a Story (POST /v2/{account_id}/posts/stories)
export const createStory = defineOperation(
	'postsCreateStory',
	'posts.createStory',
	{
		method: 'POST',
		path: '/v2/{account_id}/posts/stories',
		body: ['attachment', 'text', 'specifics'],
	},
);

// Add Reaction to a Post (POST /v2/{account_id}/posts/{post_id}/reactions)
export const addReaction = defineOperation(
	'postsAddReaction',
	'posts.addReaction',
	{
		method: 'POST',
		path: '/v2/{account_id}/posts/{post_id}/reactions',
		body: ['reaction', 'react_as'],
	},
);

// Remove Reaction from a Post (DELETE /v2/{account_id}/posts/{post_id}/reactions)
export const removeReaction = defineOperation(
	'postsRemoveReaction',
	'posts.removeReaction',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/posts/{post_id}/reactions',
		body: ['reaction'],
	},
);

// Add Comment to a Post (POST /v2/{account_id}/posts/{post_id}/comments)
export const addComment = defineOperation(
	'postsAddComment',
	'posts.addComment',
	{
		method: 'POST',
		path: '/v2/{account_id}/posts/{post_id}/comments',
		body: ['text', 'comment_as', 'attachments'],
	},
);

// Update a Comment (PATCH /v2/{account_id}/posts/{post_id}/comments/{comment_id})
export const updateComment = defineOperation(
	'postsUpdateComment',
	'posts.updateComment',
	{
		method: 'PATCH',
		path: '/v2/{account_id}/posts/{post_id}/comments/{comment_id}',
		body: ['text'],
	},
);

// Delete Comment from a Post (DELETE /v2/{account_id}/posts/{post_id}/comments/{comment_id})
export const deleteComment = defineOperation(
	'postsDeleteComment',
	'posts.deleteComment',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/posts/{post_id}/comments/{comment_id}',
	},
	noContent,
);

// Reply to a Comment (POST /v2/{account_id}/posts/{post_id}/comments/{comment_id})
export const replyToComment = defineOperation(
	'postsReplyToComment',
	'posts.replyToComment',
	{
		method: 'POST',
		path: '/v2/{account_id}/posts/{post_id}/comments/{comment_id}',
		body: ['text', 'comment_as', 'attachments'],
	},
);

// List all Comment's Replies (GET /v2/{account_id}/posts/{post_id}/comments/{comment_id}/replies)
export const listCommentReplies = defineOperation(
	'postsListCommentReplies',
	'posts.listCommentReplies',
	{
		method: 'GET',
		path: '/v2/{account_id}/posts/{post_id}/comments/{comment_id}/replies',
		query: ['offset', 'cursor', 'limit'],
	},
);

// List all Comment's Reactions (GET /v2/{account_id}/posts/{post_id}/comments/{comment_id}/reactions)
export const listCommentReactions = defineOperation(
	'postsListCommentReactions',
	'posts.listCommentReactions',
	{
		method: 'GET',
		path: '/v2/{account_id}/posts/{post_id}/comments/{comment_id}/reactions',
		query: ['offset', 'cursor', 'limit'],
	},
);

// Add Reaction to a Comment (POST /v2/{account_id}/posts/{post_id}/comments/{comment_id}/reactions)
export const addCommentReaction = defineOperation(
	'postsAddCommentReaction',
	'posts.addCommentReaction',
	{
		method: 'POST',
		path: '/v2/{account_id}/posts/{post_id}/comments/{comment_id}/reactions',
		body: ['reaction', 'react_as'],
	},
);

// Remove Reaction from a Comment (DELETE /v2/{account_id}/posts/{post_id}/comments/{comment_id}/reactions)
export const removeCommentReaction = defineOperation(
	'postsRemoveCommentReaction',
	'posts.removeCommentReaction',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/posts/{post_id}/comments/{comment_id}/reactions',
		body: ['reaction'],
	},
);
