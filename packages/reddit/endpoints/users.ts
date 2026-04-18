import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditRequest } from '../client';
import { CommentDataSchema, PostDataSchema, UserDataSchema } from './types';
import { extractComments, extractPosts, saveCommentsToDb, savePostsToDb, saveUserToDb } from './utils';
import type { RedditEntityEnvelopeRaw, RedditListingRaw } from './types';

export const getAbout: RedditEndpoints['usersGetAbout'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditRequest<RedditEntityEnvelopeRaw>(
		`/user/${input.username}/about.json`,
	);

	const user = UserDataSchema.parse(raw.data);
	await saveUserToDb(ctx, user);

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
		{ query },
	);

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

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
		{ query },
	);

	const comments = extractComments(raw);
	await saveCommentsToDb(ctx, comments);

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
		{ query },
	);

	const items = raw.data.children.map((child) => {
		if (child.kind === 't3') return PostDataSchema.parse(child.data); // t3 = link/post, else t1 = comment
		return CommentDataSchema.parse(child.data);
	});

	const extractedPosts = extractPosts(raw);
	await savePostsToDb(ctx, extractedPosts);

	const extractedComments = extractComments(raw);
	await saveCommentsToDb(ctx, extractedComments);

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
