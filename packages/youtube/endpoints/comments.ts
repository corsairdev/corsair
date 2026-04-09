import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const list: YoutubeEndpoints['commentsList'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['commentsList']
	>('/comments', ctx.key, {
		method: 'GET',
		query: {
			part: input.part ?? 'snippet',
			...(input.id && { id: input.id }),
			...(input.parentId && { parentId: input.parentId }),
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
			...(input.textFormat && { textFormat: input.textFormat }),
		},
	});

	if (response.items && ctx.db.comments) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.comments.upsertByEntityId(item.id, {
					...item.snippet,
					// authorChannelId in the API is an object { value: string }; extract the string
					authorChannelId: item.snippet?.authorChannelId?.value,
					id: item.id,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save comment to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.comments.list',
		{ parentId: input.parentId },
		'completed',
	);
	return response;
};

export const threadsList: YoutubeEndpoints['commentThreadsList'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['commentThreadsList']
	>('/commentThreads', ctx.key, {
		method: 'GET',
		query: {
			part: input.part ?? 'snippet,replies',
			...(input.id && { id: input.id }),
			...(input.order && { order: input.order }),
			...(input.videoId && { videoId: input.videoId }),
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
			...(input.textFormat && { textFormat: input.textFormat }),
			...(input.searchTerms && { searchTerms: input.searchTerms }),
			...(input.allThreadsRelatedToChannelId && {
				allThreadsRelatedToChannelId: input.allThreadsRelatedToChannelId,
			}),
		},
	});

	if (response.items && ctx.db.comments) {
		for (const thread of response.items) {
			const topComment = thread.snippet?.topLevelComment;
			if (!topComment?.id) continue;
			try {
				await ctx.db.comments.upsertByEntityId(topComment.id, {
					...topComment.snippet,
					// authorChannelId in the API is an object { value: string }; extract the string
					authorChannelId: topComment.snippet?.authorChannelId?.value,
					videoId: thread.snippet?.videoId,
					id: topComment.id,
				});
			} catch (error) {
				console.warn(
					'[youtube] Failed to save comment thread to database:',
					error,
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.comments.threadsList',
		{ videoId: input.videoId },
		'completed',
	);
	return response;
};

export const threadsList2: YoutubeEndpoints['commentThreadsList2'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['commentThreadsList2']
	>('/commentThreads', ctx.key, {
		method: 'GET',
		query: {
			part: input.part,
			...(input.id && { id: input.id }),
			...(input.order && { order: input.order }),
			...(input.videoId && { videoId: input.videoId }),
			...(input.channelId && { channelId: input.channelId }),
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
			...(input.textFormat && { textFormat: input.textFormat }),
			...(input.searchTerms && { searchTerms: input.searchTerms }),
			...(input.moderationStatus && {
				moderationStatus: input.moderationStatus,
			}),
			...(input.allThreadsRelatedToChannelId && {
				allThreadsRelatedToChannelId: input.allThreadsRelatedToChannelId,
			}),
		},
	});

	if (response.items && ctx.db.comments) {
		for (const thread of response.items) {
			const topComment = thread.snippet?.topLevelComment;
			if (!topComment?.id) continue;
			try {
				await ctx.db.comments.upsertByEntityId(topComment.id, {
					...topComment.snippet,
					// authorChannelId in the API is an object { value: string }; extract the string
					authorChannelId: topComment.snippet?.authorChannelId?.value,
					videoId: thread.snippet?.videoId,
					id: topComment.id,
				});
			} catch (error) {
				console.warn(
					'[youtube] Failed to save comment thread to database:',
					error,
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.comments.threadsList2',
		{ videoId: input.videoId },
		'completed',
	);
	return response;
};

export const post: YoutubeEndpoints['commentsPost'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['commentsPost']
	>('/commentThreads', ctx.key, {
		method: 'POST',
		query: { part: 'snippet' },
		body: {
			snippet: {
				channelId: input.channelId,
				videoId: input.videoId,
				topLevelComment: { snippet: { textOriginal: input.textOriginal } },
			},
		},
	});

	const topComment = response.snippet?.topLevelComment;
	if (topComment?.id && ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(topComment.id, {
				...topComment.snippet,
				// authorChannelId in the API is an object { value: string }; extract the string
				authorChannelId: topComment.snippet?.authorChannelId?.value,
				videoId: input.videoId,
				id: topComment.id,
			});
		} catch (error) {
			console.warn('[youtube] Failed to save comment to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.comments.post',
		{ videoId: input.videoId },
		'completed',
	);
	return response;
};

export const createReply: YoutubeEndpoints['commentsCreateReply'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['commentsCreateReply']
	>('/comments', ctx.key, {
		method: 'POST',
		query: { part: 'snippet' },
		body: {
			snippet: {
				parentId: input.parentId,
				textOriginal: input.textOriginal,
			},
		},
	});

	if (response.id && ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(response.id, {
				...response.snippet,
				// authorChannelId in the API is an object { value: string }; extract the string
				authorChannelId: response.snippet?.authorChannelId?.value,
				id: response.id,
			});
		} catch (error) {
			console.warn(
				'[youtube] Failed to save comment reply to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.comments.createReply',
		{ parentId: input.parentId },
		'completed',
	);
	return response;
};

export const update: YoutubeEndpoints['commentsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['commentsUpdate']
	>('/comments', ctx.key, {
		method: 'PUT',
		query: { part: 'snippet' },
		body: {
			id: input.id,
			snippet: { textOriginal: input.textOriginal },
		},
	});

	if (response.id && ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(response.id, {
				...response.snippet,
				// authorChannelId in the API is an object { value: string }; extract the string
				authorChannelId: response.snippet?.authorChannelId?.value,
				id: response.id,
			});
		} catch (error) {
			console.warn('[youtube] Failed to update comment in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.comments.update',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const del: YoutubeEndpoints['commentsDelete'] = async (ctx, input) => {
	await makeYoutubeRequest<void>('/comments', ctx.key, {
		method: 'DELETE',
		query: { id: input.id },
	});

	await logEventFromContext(
		ctx,
		'youtube.comments.delete',
		{ id: input.id },
		'completed',
	);
	return { deleted: true, comment_id: input.id, http_status: 204 };
};

export const markSpam: YoutubeEndpoints['commentsMarkSpam'] = async (
	ctx,
	input,
) => {
	await makeYoutubeRequest<void>('/comments/markAsSpam', ctx.key, {
		method: 'POST',
		query: { id: input.id },
	});

	await logEventFromContext(
		ctx,
		'youtube.comments.markSpam',
		{ id: input.id },
		'completed',
	);
	return { success: true, comment_ids: [input.id], http_status: 204 };
};

export const setModerationStatus: YoutubeEndpoints['commentsSetModerationStatus'] =
	async (ctx, input) => {
		await makeYoutubeRequest<void>('/comments/setModerationStatus', ctx.key, {
			method: 'POST',
			query: {
				id: input.id,
				moderationStatus: input.moderationStatus,
				...(input.banAuthor !== undefined && { banAuthor: input.banAuthor }),
			},
		});

		await logEventFromContext(
			ctx,
			'youtube.comments.setModerationStatus',
			{ id: input.id, moderationStatus: input.moderationStatus },
			'completed',
		);
		return {
			success: true,
			message: `Comment ${input.id} moderation status set to ${input.moderationStatus}`,
		};
	};
