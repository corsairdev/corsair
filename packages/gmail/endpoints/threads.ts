import { logEventFromContext } from 'corsair/core';
import type { GmailBoundEndpoints, GmailEndpoints } from '..';
import { makeAuthenticatedGmailRequest } from '../client';
import type { GmailEndpointOutputs } from './types';

export const list: GmailEndpoints['threadsList'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['threadsList']
	>(`/users/${input.userId || 'me'}/threads`, ctx, {
		method: 'GET',
		query: {
			q: input.q,
			maxResults: input.maxResults,
			pageToken: input.pageToken,
			labelIds: input.labelIds?.join(','),
			includeSpamTrash: input.includeSpamTrash,
		},
	});

	if (result.threads && ctx.db.threads) {
		try {
			for (const thread of result.threads) {
				if (thread.id) {
					await ctx.db.threads.upsertByEntityId(thread.id, {
						...thread,
						id: thread.id,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save threads to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmail.threads.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GmailEndpoints['threadsGet'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['threadsGet']
	>(`/users/${input.userId || 'me'}/threads/${input.id}`, ctx, {
		method: 'GET',
		query: {
			format: input.format,
			metadataHeaders: input.metadataHeaders?.join(','),
		},
	});

	if (result.id && ctx.db.threads) {
		try {
			await ctx.db.threads.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save thread to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmail.threads.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const modify: GmailEndpoints['threadsModify'] = async (ctx, input) => {
	const body: {
		addLabelIds?: string[];
		removeLabelIds?: string[];
	} = {};

	if (input.addLabelIds && input.addLabelIds.length > 0) {
		body.addLabelIds = input.addLabelIds;
	}

	if (input.removeLabelIds && input.removeLabelIds.length > 0) {
		body.removeLabelIds = input.removeLabelIds;
	}

	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['threadsModify']
	>(`/users/${input.userId || 'me'}/threads/${input.id}/modify`, ctx, {
		method: 'POST',
		body,
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.threads.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.threads.modify',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteThread: GmailEndpoints['threadsDelete'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedGmailRequest<GmailEndpointOutputs['threadsDelete']>(
		`/users/${input.userId || 'me'}/threads/${input.id}`,
		ctx,
		{
			method: 'DELETE',
		},
	);

	if (ctx.db.threads) {
		try {
			await ctx.db.threads.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete thread from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmail.threads.delete',
		{ ...input },
		'completed',
	);
};

export const trash: GmailEndpoints['threadsTrash'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['threadsTrash']
	>(`/users/${input.userId || 'me'}/threads/${input.id}/trash`, ctx, {
		method: 'POST',
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.threads.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.threads.trash',
		{ ...input },
		'completed',
	);
	return result;
};

export const untrash: GmailEndpoints['threadsUntrash'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['threadsUntrash']
	>(`/users/${input.userId || 'me'}/threads/${input.id}/untrash`, ctx, {
		method: 'POST',
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.threads.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.threads.untrash',
		{ ...input },
		'completed',
	);
	return result;
};
