import { logEventFromContext } from '../../utils/events';
import type { GmailBoundEndpoints, GmailEndpoints } from '..';
import { makeGmailRequest } from '../client';
import type { GmailEndpointOutputs } from './types';

export const list: GmailEndpoints['threadsList'] = async (ctx, input) => {
	const result = await makeGmailRequest<GmailEndpointOutputs['threadsList']>(
		`/users/${input.userId || 'me'}/threads`,
		ctx.key,
		{
			method: 'GET',
			query: {
				q: input.q,
				maxResults: input.maxResults,
				pageToken: input.pageToken,
				labelIds: input.labelIds?.join(','),
				includeSpamTrash: input.includeSpamTrash,
			},
		},
	);

	if (result.threads && ctx.db.threads) {
		try {
			for (const thread of result.threads) {
				if (thread.id) {
					await ctx.db.threads.upsert(thread.id, {
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
	const result = await makeGmailRequest<GmailEndpointOutputs['threadsGet']>(
		`/users/${input.userId || 'me'}/threads/${input.id}`,
		ctx.key,
		{
			method: 'GET',
			query: {
				format: input.format,
				metadataHeaders: input.metadataHeaders?.join(','),
			},
		},
	);

	if (result.id && ctx.db.threads) {
		try {
			await ctx.db.threads.upsert(result.id, {
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
	const result = await makeGmailRequest<GmailEndpointOutputs['threadsModify']>(
		`/users/${input.userId || 'me'}/threads/${input.id}/modify`,
		ctx.key,
		{
			method: 'POST',
			body: {
				addLabelIds: input.addLabelIds,
				removeLabelIds: input.removeLabelIds,
			},
		},
	);

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.threadsGet({ id: result.id, userId: input.userId });
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
	await makeGmailRequest<GmailEndpointOutputs['threadsDelete']>(
		`/users/${input.userId || 'me'}/threads/${input.id}`,
		ctx.key,
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
	const result = await makeGmailRequest<GmailEndpointOutputs['threadsTrash']>(
		`/users/${input.userId || 'me'}/threads/${input.id}/trash`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.threadsGet({ id: result.id, userId: input.userId });
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
	const result = await makeGmailRequest<GmailEndpointOutputs['threadsUntrash']>(
		`/users/${input.userId || 'me'}/threads/${input.id}/untrash`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.threadsGet({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.threads.untrash',
		{ ...input },
		'completed',
	);
	return result;
};
