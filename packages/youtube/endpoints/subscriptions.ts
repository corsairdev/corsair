import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const list: YoutubeEndpoints['subscriptionsList'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['subscriptionsList']
	>('/subscriptions', ctx.key, {
		method: 'GET',
		query: {
			mine: 'true',
			part: input.part ?? 'snippet,contentDetails',
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
		},
	});

	if (response.items && ctx.db.subscriptions) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.subscriptions.upsertByEntityId(item.id, {
					...item.snippet,
					// snippet.channelId is the subscriber's channel; resourceId.channelId is the subscribed channel
					channelId: item.snippet?.resourceId?.channelId,
					id: item.id,
				});
			} catch (error) {
				console.warn(
					'[youtube] Failed to save subscription to database:',
					error,
				);
			}
		}
	}

	await logEventFromContext(ctx, 'youtube.subscriptions.list', {}, 'completed');
	return response;
};

export const subscribe: YoutubeEndpoints['subscriptionsSubscribe'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['subscriptionsSubscribe']
	>('/subscriptions', ctx.key, {
		method: 'POST',
		query: { part: 'snippet,contentDetails,subscriberSnippet' },
		body: {
			snippet: {
				resourceId: { kind: 'youtube#channel', channelId: input.channelId },
			},
		},
	});

	if (response.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(response.id, {
				...response.snippet,
				// override channelId with the subscribed channel, not the subscriber's channel
				channelId: input.channelId,
				id: response.id,
			});
		} catch (error) {
			console.warn('[youtube] Failed to save subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.subscriptions.subscribe',
		{ channelId: input.channelId },
		'completed',
	);
	return response;
};

export const unsubscribe: YoutubeEndpoints['subscriptionsUnsubscribe'] = async (
	ctx,
	input,
) => {
	await makeYoutubeRequest<void>('/subscriptions', ctx.key, {
		method: 'DELETE',
		query: { id: input.subscriptionId },
	});

	await logEventFromContext(
		ctx,
		'youtube.subscriptions.unsubscribe',
		{ subscriptionId: input.subscriptionId },
		'completed',
	);
	return {
		unsubscribed: true,
		subscription_id: input.subscriptionId,
		http_status: 204,
	};
};
