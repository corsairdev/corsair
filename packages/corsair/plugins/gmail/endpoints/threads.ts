import { logEvent } from '../../utils/events';
import type { GmailEndpoints } from '..';
import { makeGmailRequest } from '../client';
import type { GmailEndpointOutputs } from './types';

export const list: GmailEndpoints['threadsList'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['threadsList']>(
			`/users/${input.userId || 'me'}/threads`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
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
							id: thread.id,
							snippet: thread.snippet,
							historyId: thread.historyId,
							createdAt: new Date(),
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save threads to database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.threads.list',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.threads.list',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const get: GmailEndpoints['threadsGet'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['threadsGet']>(
			`/users/${input.userId || 'me'}/threads/${input.id}`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
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
					id: result.id,
					snippet: result.snippet,
					historyId: result.historyId,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save thread to database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.threads.get',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.threads.get',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const modify: GmailEndpoints['threadsModify'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['threadsModify']>(
			`/users/${input.userId || 'me'}/threads/${input.id}/modify`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'POST',
				body: {
					addLabelIds: input.addLabelIds,
					removeLabelIds: input.removeLabelIds,
				},
			},
		);

		if (result.id && ctx.db.threads) {
			try {
				await ctx.db.threads.upsert(result.id, {
					id: result.id,
					snippet: result.snippet,
					historyId: result.historyId,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to update thread in database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.threads.modify',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.threads.modify',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const deleteThread: GmailEndpoints['threadsDelete'] = async (
	ctx,
	input,
) => {
	try {
		await makeGmailRequest<GmailEndpointOutputs['threadsDelete']>(
			`/users/${input.userId || 'me'}/threads/${input.id}`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'DELETE',
			},
		);

		if (ctx.db.threads) {
			try {
				await ctx.db.threads.deleteByResourceId(input.id);
			} catch (error) {
				console.warn('Failed to delete thread from database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.threads.delete',
			{ ...input },
			'completed',
		);
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.threads.delete',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const trash: GmailEndpoints['threadsTrash'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['threadsTrash']>(
			`/users/${input.userId || 'me'}/threads/${input.id}/trash`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'POST',
			},
		);

		await logEvent(
			ctx.database,
			'gmail.threads.trash',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.threads.trash',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const untrash: GmailEndpoints['threadsUntrash'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<
			GmailEndpointOutputs['threadsUntrash']
		>(
			`/users/${input.userId || 'me'}/threads/${input.id}/untrash`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'POST',
			},
		);

		await logEvent(
			ctx.database,
			'gmail.threads.untrash',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.threads.untrash',
			{ ...input },
			'failed',
		);
		throw error;
	}
};
