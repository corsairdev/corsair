import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditRequest } from '../client';
import { CommentDataSchema, PostDataSchema, UserDataSchema } from './types';
import type { RedditEntityEnvelopeRaw, RedditListingRaw } from './types';

export const getAbout: RedditEndpoints['usersGetAbout'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditRequest<RedditEntityEnvelopeRaw>(
		`/user/${input.username}/about.json`,
	);

	const user = UserDataSchema.parse(raw.data);

	if (ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(String(user.id), {
				...user,
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
	const { username, ...query } = input;
	const raw = await makeRedditRequest<RedditListingRaw>(
		`/user/${username}/submitted.json`,
		{ query: query as Record<string, string | number | boolean | undefined> },
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
	const { username, ...query } = input;
	const raw = await makeRedditRequest<RedditListingRaw>(
		`/user/${username}/comments.json`,
		{ query: query as Record<string, string | number | boolean | undefined> },
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
	const { username, ...query } = input;
	const raw = await makeRedditRequest<RedditListingRaw>(
		`/user/${username}/overview.json`,
		{ query: query as Record<string, string | number | boolean | undefined> },
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
