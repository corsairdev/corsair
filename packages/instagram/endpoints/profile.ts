import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { InstagramEndpointOutputs } from './types';

export const get: InstagramEndpoints['GetInstagramUser'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetInstagramUser']
	>(`/${input.ig_id}`, ctx, {
		method: 'GET',
		query: {
			fields: input.q,
		},
	});

	if (result && ctx.db.users) {
		try {
			const res = await ctx.db.users.upsertByEntityId(input.ig_id, {
				...result,
			});
		} catch (err) {
			console.warn('error to save instagram account details into database');
		}
	}

	await logEventFromContext(
		ctx,
		'instagram.profile.getInstagramUser',
		{ ...input },
		'completed',
	);

	return result;
};

export const insights: InstagramEndpoints['GetAccountInsights'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetAccountInsights']
	>(`/${input.ig_id}/insights`, ctx, {
		method: 'GET',
		query: {
			metric: input.metric,
			period: input.period,
			timeframe: input.timeframe,
			metric_type: input.metric_type,
			breakdown: input.breakdown,
			since: input.since,
			until: input.until,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.profile.insights',
		{ ...input },
		'completed',
	);

	return result;
};

export const contentPublishingLimit: InstagramEndpoints['GetIgUserContentPublishingLimit'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedInstagramRequest<
			InstagramEndpointOutputs['GetIgUserContentPublishingLimit']
		>(`/${input.ig_id}/content_publishing_limit`, ctx, {
			method: 'GET',
			query: {
				fields: 'config,quota_usage',
			},
		});

		await logEventFromContext(
			ctx,
			'instagram.profile.contentPublishingLimit',
			{ ...input },
			'completed',
		);

		return result;
	};

export const liveMedia: InstagramEndpoints['GetIgUserLiveMedia'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetIgUserLiveMedia']
	>(`/${input.ig_id}/live_media`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields,
			after: input.after,
			before: input.before,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.profile.liveMedia',
		{ ...input },
		'completed',
	);

	return result;
};

export const media: InstagramEndpoints['GetIgUserMedia'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetIgUserMedia']
	>(`/${input.ig_id}/media`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields,
			after: input.after,
			before: input.before,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.profile.media',
		{ ...input },
		'completed',
	);

	return result;
};

export const stories: InstagramEndpoints['GetIgUserStories'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetIgUserStories']
	>(`/${input.ig_id}/stories`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields,
			after: input.after,
			before: input.before,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.profile.stories',
		{ ...input },
		'completed',
	);

	return result;
};

export const tags: InstagramEndpoints['GetIgUserTags'] = async (ctx, input) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetIgUserTags']
	>(`/${input.ig_id}/tags`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields,
			after: input.after,
			before: input.before,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.profile.tags',
		{ ...input },
		'completed',
	);

	return result;
};

export const info: InstagramEndpoints['GetUserInfo'] = async (ctx, input) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetUserInfo']
	>(`/${input.ig_id}`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.profile.info',
		{ ...input },
		'completed',
	);

	return result;
};

export const userInsights: InstagramEndpoints['GetUserInsights'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetUserInsights']
	>(`/${input.ig_id}/insights`, ctx, {
		method: 'GET',
		query: {
			metric: input.metrics.join(','),
			period: input.period,
			since: input.since,
			until: input.until,
			metric_type: input.metric_type,
			breakdown: input.breakdown,
			timeframe: input.timeframe,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.profile.userInsights',
		{ ...input },
		'completed',
	);

	return result;
};

export const userMedia: InstagramEndpoints['GetUserMedia'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetUserMedia']
	>(`/${input.ig_id}/media`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields,
			after: input.after,
			before: input.before,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.profile.userMedia',
		{ ...input },
		'completed',
	);

	return result;
};

export const replyMentions: InstagramEndpoints['ReplyToIgUserMentions'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedInstagramRequest<
			InstagramEndpointOutputs['ReplyToIgUserMentions']
		>(`/${input.mention_id}/comments`, ctx, {
			method: 'POST',
			body: {
				message: input.message,
			},
		});

		await logEventFromContext(
			ctx,
			'instagram.profile.replyMentions',
			{ ...input },
			'completed',
		);

		return result;
	};
