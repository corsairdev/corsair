import { makePageFacebookRequest, resolvePageId } from '../client';
import type { FacebookEndpoints } from '../index';
import {
	buildPaginationQuery,
	logFacebookEvent,
	omitUndefined,
} from './shared';
import type { FacebookEndpointOutputs } from './types';

function formatMetric(metric: string | string[]): string {
	return Array.isArray(metric) ? metric.join(',') : metric;
}

export const create: FacebookEndpoints['createPost'] = async (ctx, input) => {
	const { page_id, ...body } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['createPost']
	>(`/${page_id}/feed`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined(body),
	});

	await logFacebookEvent(ctx, 'facebook.posts.create', { ...input });
	return result;
};

export const get: FacebookEndpoints['getPost'] = async (ctx, input) => {
	const pageId = resolvePageId(input.page_id, input.post_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPost']
	>(`/${input.post_id}`, ctx, pageId, {
		query: {
			fields:
				input.fields ??
				'id,message,created_time,updated_time,is_published,scheduled_publish_time,permalink_url,full_picture',
		},
	});

	if (result.id) {
		try {
			await ctx.db.posts.upsertByEntityId(result.id, {
				postId: result.id,
				pageId,
				message: result.message,
				createdTime: result.created_time,
				isPublished: result.is_published,
				permalinkUrl: result.permalink_url,
				scheduledPublishTime: result.scheduled_publish_time,
			});
		} catch {
			// Non-fatal cache write
		}
	}

	await logFacebookEvent(ctx, 'facebook.posts.get', { ...input });
	return result;
};

export const list: FacebookEndpoints['getPagePosts'] = async (ctx, input) => {
	// /feed returns page posts + visitor posts + tagged posts (most complete timeline).
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPagePosts']
	>(`/${input.page_id}/feed`, ctx, input.page_id, {
		query: buildPaginationQuery({
			fields:
				input.fields ??
				'id,message,created_time,is_published,permalink_url,full_picture',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	if (result.data) {
		for (const post of result.data) {
			if (!post.id) continue;
			try {
				await ctx.db.posts.upsertByEntityId(post.id, {
					postId: post.id,
					pageId: input.page_id,
					message: post.message,
					createdTime: post.created_time,
					isPublished: post.is_published,
					permalinkUrl: post.permalink_url,
				});
			} catch {
				// Non-fatal cache write
			}
		}
	}

	await logFacebookEvent(ctx, 'facebook.posts.list', { ...input });
	return result;
};

export const listScheduled: FacebookEndpoints['getScheduledPosts'] = async (
	ctx,
	input,
) => {
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getScheduledPosts']
	>(`/${input.page_id}/scheduled_posts`, ctx, input.page_id, {
		query: buildPaginationQuery({
			fields:
				input.fields ??
				'id,message,created_time,scheduled_publish_time,is_published',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	await logFacebookEvent(ctx, 'facebook.posts.listScheduled', { ...input });
	return result;
};

export const update: FacebookEndpoints['updatePost'] = async (ctx, input) => {
	const { post_id, page_id, ...body } = input;
	const pageId = resolvePageId(page_id, post_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['updatePost']
	>(`/${post_id}`, ctx, pageId, {
		method: 'POST',
		body: omitUndefined(body),
	});

	await logFacebookEvent(ctx, 'facebook.posts.update', { ...input });
	return result;
};

export const remove: FacebookEndpoints['deletePost'] = async (ctx, input) => {
	const pageId = resolvePageId(input.page_id, input.post_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['deletePost']
	>(`/${input.post_id}`, ctx, pageId, {
		method: 'DELETE',
	});

	if (result.success) {
		try {
			await ctx.db.posts.deleteByEntityId(input.post_id);
		} catch {
			// Non-fatal cache write
		}
	}

	await logFacebookEvent(ctx, 'facebook.posts.delete', { ...input });
	return result;
};

export const reschedule: FacebookEndpoints['reschedulePost'] = async (
	ctx,
	input,
) => {
	const { post_id, page_id, scheduled_publish_time } = input;
	const pageId = resolvePageId(page_id, post_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['reschedulePost']
	>(`/${post_id}`, ctx, pageId, {
		method: 'POST',
		body: { scheduled_publish_time },
	});

	await logFacebookEvent(ctx, 'facebook.posts.reschedule', { ...input });
	return result;
};

export const publishScheduled: FacebookEndpoints['publishScheduledPost'] =
	async (ctx, input) => {
		const pageId = resolvePageId(input.page_id, input.post_id);
		const result = await makePageFacebookRequest<
			FacebookEndpointOutputs['publishScheduledPost']
		>(`/${input.post_id}`, ctx, pageId, {
			method: 'POST',
			body: { is_published: true },
		});

		await logFacebookEvent(ctx, 'facebook.posts.publishScheduled', {
			...input,
		});
		return result;
	};

export const listTagged: FacebookEndpoints['getPageTaggedPosts'] = async (
	ctx,
	input,
) => {
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPageTaggedPosts']
	>(`/${input.page_id}/tagged`, ctx, input.page_id, {
		query: buildPaginationQuery({
			fields:
				input.fields ?? 'id,message,created_time,permalink_url,full_picture',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	await logFacebookEvent(ctx, 'facebook.posts.listTagged', { ...input });
	return result;
};

export const getInsights: FacebookEndpoints['getPostInsights'] = async (
	ctx,
	input,
) => {
	const pageId = resolvePageId(input.page_id, input.post_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPostInsights']
	>(`/${input.post_id}/insights`, ctx, pageId, {
		query: {
			metric: formatMetric(input.metric),
		},
	});

	if (result.data) {
		for (const insight of result.data) {
			const insightId = insight.id ?? `${input.post_id}:${insight.name}`;
			try {
				await ctx.db.insights.upsertByEntityId(insightId, {
					insightId,
					objectId: input.post_id,
					name: insight.name,
					period: insight.period,
					value: insight.values?.[0]?.value,
					endTime: insight.values?.[0]?.end_time,
				});
			} catch {
				// Non-fatal cache write
			}
		}
	}

	await logFacebookEvent(ctx, 'facebook.posts.getInsights', { ...input });
	return result;
};

export const getReactions: FacebookEndpoints['getPostReactions'] = async (
	ctx,
	input,
) => {
	const { post_id, page_id, type, ...pagination } = input;
	const pageId = resolvePageId(page_id, post_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPostReactions']
	>(`/${post_id}/reactions`, ctx, pageId, {
		query: omitUndefined({
			type,
			limit: pagination.limit,
			after: pagination.after,
			before: pagination.before,
		}),
	});

	if (result.data) {
		for (const reaction of result.data) {
			if (!reaction.id) continue;
			try {
				await ctx.db.reactions.upsertByEntityId(`${post_id}:${reaction.id}`, {
					objectId: post_id,
					userId: reaction.id,
					name: reaction.name,
					type: reaction.type,
				});
			} catch {
				// Non-fatal cache write
			}
		}
	}

	await logFacebookEvent(ctx, 'facebook.posts.getReactions', { ...input });
	return result;
};
