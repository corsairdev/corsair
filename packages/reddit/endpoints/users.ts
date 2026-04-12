import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditUserRequest } from '../client';
import { CommentDataSchema, PostDataSchema, UserDataSchema } from './types';

type RedditListingResponse = {
	kind: 'Listing';
	data: {
		modhash: string | null;
		dist: number | null;
		after: string | null;
		before: string | null;
		children: Array<{
			kind: string;
			data: Record<string, any>;
		}>;
	};
};

type UserAboutResponse = {
	kind: string;
	data: Record<string, any>;
};

export const getAbout: RedditEndpoints['usersGetAbout'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditUserRequest<UserAboutResponse>(
		input.username,
		'about',
	);

	const user = UserDataSchema.parse(raw.data);

	if (ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(String(user.id), {
				id: user.id,
				name: user.name,
				link_karma: user.link_karma,
				comment_karma: user.comment_karma,
				total_karma: user.total_karma,
				is_suspended: user.is_suspended,
				created_utc: user.created_utc,
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'reddit.users.getAbout',
		{ ...input },
		'completed',
	);

	return user;
};

export const getSubmitted: RedditEndpoints['usersGetSubmitted'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditUserRequest<RedditListingResponse>(
		input.username,
		'submitted',
		{
			query: {
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
				sort: input.sort,
				t: input.t,
			},
		},
	);

	const posts = raw.data.children
		.filter((child) => child.kind === 't3')
		.map((child) => PostDataSchema.parse(child.data));

	await logEventFromContext(
		ctx,
		'reddit.users.getSubmitted',
		{ ...input },
		'completed',
	);

	return {
		posts,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? posts.length,
	};
};

export const getComments: RedditEndpoints['usersGetComments'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditUserRequest<RedditListingResponse>(
		input.username,
		'comments',
		{
			query: {
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
				sort: input.sort,
				t: input.t,
			},
		},
	);

	const comments = raw.data.children
		.filter((child) => child.kind === 't1')
		.map((child) => CommentDataSchema.parse(child.data));

	await logEventFromContext(
		ctx,
		'reddit.users.getComments',
		{ ...input },
		'completed',
	);

	return {
		comments,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? comments.length,
	};
};

export const getOverview: RedditEndpoints['usersGetOverview'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditUserRequest<RedditListingResponse>(
		input.username,
		'overview',
		{
			query: {
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
				sort: input.sort,
				t: input.t,
			},
		},
	);

	const items = raw.data.children.map((child) => {
		if (child.kind === 't3') return PostDataSchema.parse(child.data);
		return CommentDataSchema.parse(child.data);
	});

	await logEventFromContext(
		ctx,
		'reddit.users.getOverview',
		{ ...input },
		'completed',
	);

	return {
		items,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? items.length,
	};
};
