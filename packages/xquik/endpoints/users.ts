import { logEventFromContext } from 'corsair/core';
import { makeXquikRequest } from '../client';
import type { XquikEndpoints } from '../index';
import { baseUrlFromOptions, idsQuery, tweetFilterQuery } from './helpers';
import type { XquikEndpointOutputs } from './types';

export const batch: XquikEndpoints['usersBatch'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['usersBatch']>(
		'/x/users/batch',
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			query: { ids: idsQuery(input.ids) },
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.users.batch',
		{ count: input.ids.length },
		'completed',
	);

	return response;
};

export const get: XquikEndpoints['usersGet'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['usersGet']>(
		`/x/users/${input.id}`,
		ctx.key,
		{ baseUrl: baseUrlFromOptions(ctx.options) },
	);

	await logEventFromContext(
		ctx,
		'xquik.users.get',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const search: XquikEndpoints['usersSearch'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['usersSearch']>(
		'/x/users/search',
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			query: { cursor: input.cursor, q: input.q },
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.users.search',
		{ q: input.q },
		'completed',
	);

	return response;
};

export const tweets: XquikEndpoints['usersTweets'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['usersTweets']>(
		`/x/users/${input.id}/tweets`,
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			query: {
				...tweetFilterQuery(input),
				cursor: input.cursor,
				includeParentTweet: input.includeParentTweet,
				includeReplies: input.includeReplies,
				pageSize: input.pageSize,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.users.tweets',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const followers: XquikEndpoints['usersFollowers'] = async (
	ctx,
	input,
) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['usersFollowers']
	>(`/x/users/${input.id}/followers`, ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
		query: { cursor: input.cursor, pageSize: input.pageSize },
	});

	await logEventFromContext(
		ctx,
		'xquik.users.followers',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const following: XquikEndpoints['usersFollowing'] = async (
	ctx,
	input,
) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['usersFollowing']
	>(`/x/users/${input.id}/following`, ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
		query: { cursor: input.cursor, pageSize: input.pageSize },
	});

	await logEventFromContext(
		ctx,
		'xquik.users.following',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const follow: XquikEndpoints['usersFollow'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['usersFollow']>(
		`/x/users/${input.id}/follow`,
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			body: { account: input.account },
			method: 'POST',
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.users.follow',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const unfollow: XquikEndpoints['usersUnfollow'] = async (ctx, input) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['usersUnfollow']
	>(`/x/users/${input.id}/follow`, ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
		body: { account: input.account },
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'xquik.users.unfollow',
		{ id: input.id },
		'completed',
	);

	return response;
};
