import { logEventFromContext } from 'corsair/core';
import { makeXquikRequest } from '../client';
import type { XquikEndpoints } from '../index';
import { baseUrlFromOptions, idsQuery, tweetFilterQuery } from './helpers';
import type { XquikEndpointOutputs } from './types';

export const batch: XquikEndpoints['tweetsBatch'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['tweetsBatch']>(
		'/x/tweets',
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			query: { ids: idsQuery(input.ids) },
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.tweets.batch',
		{ count: input.ids.length },
		'completed',
	);

	return response;
};

export const get: XquikEndpoints['tweetsGet'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['tweetsGet']>(
		`/x/tweets/${input.id}`,
		ctx.key,
		{ baseUrl: baseUrlFromOptions(ctx.options) },
	);

	await logEventFromContext(
		ctx,
		'xquik.tweets.get',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const search: XquikEndpoints['tweetsSearch'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['tweetsSearch']>(
		'/x/tweets/search',
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			query: {
				...tweetFilterQuery(input),
				cursor: input.cursor,
				limit: input.limit,
				q: input.q,
				queryType: input.queryType,
				sinceTime: input.sinceTime,
				untilTime: input.untilTime,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.tweets.search',
		{ q: input.q },
		'completed',
	);

	return response;
};

export const create: XquikEndpoints['tweetsCreate'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['tweetsCreate']>(
		'/x/tweets',
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			body: input,
			method: 'POST',
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.tweets.create',
		{
			account: input.account,
			pending:
				'status' in response && response.status === 'pending_confirmation',
		},
		'completed',
	);

	return response;
};

export const deleteTweet: XquikEndpoints['tweetsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['tweetsDelete']>(
		`/x/tweets/${input.id}`,
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			body: { account: input.account },
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.tweets.delete',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const like: XquikEndpoints['tweetsLike'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['tweetsLike']>(
		`/x/tweets/${input.id}/like`,
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			body: { account: input.account },
			method: 'POST',
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.tweets.like',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const unlike: XquikEndpoints['tweetsUnlike'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['tweetsUnlike']>(
		`/x/tweets/${input.id}/like`,
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			body: { account: input.account },
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.tweets.unlike',
		{ id: input.id },
		'completed',
	);

	return response;
};

export const retweet: XquikEndpoints['tweetsRetweet'] = async (ctx, input) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['tweetsRetweet']
	>(`/x/tweets/${input.id}/retweet`, ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
		body: { account: input.account },
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'xquik.tweets.retweet',
		{ id: input.id },
		'completed',
	);

	return response;
};
