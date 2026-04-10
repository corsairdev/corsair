import { logEventFromContext } from 'corsair/core';
import type { GmailBoundEndpoints, GmailEndpoints } from '..';
import { makeAuthenticatedGmailRequest } from '../client';
import type { GmailEndpointOutputs } from './types';

export const list: GmailEndpoints['draftsList'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['draftsList']
	>(`/users/${input.userId || 'me'}/drafts`, ctx, {
		method: 'GET',
		query: {
			maxResults: input.maxResults,
			pageToken: input.pageToken,
			q: input.q,
		},
	});

	if (result.drafts && ctx.db.drafts) {
		try {
			for (const draft of result.drafts) {
				if (draft.id) {
					await ctx.db.drafts.upsertByEntityId(draft.id, {
						...draft,
						id: draft.id,
						messageId: draft.message?.id,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save drafts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmail.drafts.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GmailEndpoints['draftsGet'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['draftsGet']
	>(`/users/${input.userId || 'me'}/drafts/${input.id}`, ctx, {
		method: 'GET',
		query: {
			format: input.format,
		},
	});

	if (result.id && ctx.db.drafts) {
		try {
			await ctx.db.drafts.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				messageId: result.message?.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save draft to database:', error);
		}
	}

	await logEventFromContext(ctx, 'gmail.drafts.get', { ...input }, 'completed');
	return result;
};

export const create: GmailEndpoints['draftsCreate'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['draftsCreate']
	>(`/users/${input.userId || 'me'}/drafts`, ctx, {
		method: 'POST',
		body: input.draft,
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.drafts.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.drafts.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GmailEndpoints['draftsUpdate'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['draftsUpdate']
	>(`/users/${input.userId || 'me'}/drafts/${input.id}`, ctx, {
		method: 'PUT',
		body: input.draft,
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.drafts.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.drafts.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteDraft: GmailEndpoints['draftsDelete'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedGmailRequest<GmailEndpointOutputs['draftsDelete']>(
		`/users/${input.userId || 'me'}/drafts/${input.id}`,
		ctx,
		{
			method: 'DELETE',
		},
	);

	if (ctx.db.drafts) {
		try {
			await ctx.db.drafts.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete draft from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmail.drafts.delete',
		{ ...input },
		'completed',
	);
};

export const send: GmailEndpoints['draftsSend'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['draftsSend']
	>(`/users/${input.userId || 'me'}/drafts/send`, ctx, {
		method: 'POST',
		body: {
			id: input.id,
			message: input.message,
		},
	});

	await logEventFromContext(
		ctx,
		'gmail.drafts.send',
		{ ...input },
		'completed',
	);
	return result;
};
