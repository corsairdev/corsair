import { logEventFromContext } from 'corsair/core';
import { makeZendeskRequest } from '../client';
import type { ZendeskEndpoints } from '../index';
import type { ZendeskEndpointOutputs } from './types';

export const list: ZendeskEndpoints['commentsList'] = async (ctx, input) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	const response = await makeZendeskRequest<
		ZendeskEndpointOutputs['commentsList']
	>(`tickets/${input.ticket_id}/comments.json`, ctx.key, subdomain, {
		method: 'GET',
		query: {
			...(input.page !== undefined && { page: input.page }),
			...(input.per_page !== undefined && { per_page: input.per_page }),
		},
	});

	const comments = response.comments || [];
	if (ctx.db.comments) {
		for (const comment of comments) {
			try {
				await ctx.db.comments.upsertByEntityId(String(comment.id), {
					id: comment.id,
					ticketId: input.ticket_id,
					body: comment.body ?? null,
					authorId: comment.author_id ?? null,
					public: comment.public ?? null,
					createdAt: comment.created_at ? new Date(comment.created_at) : null,
				});
			} catch (error) {
				console.warn('Failed to save comment to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.comments.list',
		{ ...input },
		'completed',
	);
	return response;
};
