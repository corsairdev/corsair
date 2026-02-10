import { logEventFromContext } from '../../utils/events';
import type { GmailBoundEndpoints, GmailEndpoints } from '..';
import { makeGmailRequest } from '../client';
import type { GmailEndpointOutputs } from './types';

export const list: GmailEndpoints['labelsList'] = async (ctx, input) => {
	const result = await makeGmailRequest<GmailEndpointOutputs['labelsList']>(
		`/users/${input.userId || 'me'}/labels`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.labels && ctx.db.labels) {
		try {
			for (const label of result.labels) {
				if (label.id) {
					await ctx.db.labels.upsertByEntityId(label.id, {
						...label,
						id: label.id,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save labels to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmail.labels.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GmailEndpoints['labelsGet'] = async (ctx, input) => {
	const result = await makeGmailRequest<GmailEndpointOutputs['labelsGet']>(
		`/users/${input.userId || 'me'}/labels/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.id && ctx.db.labels) {
		try {
			await ctx.db.labels.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				messageListVisibility: result.messageListVisibility,
				labelListVisibility: result.labelListVisibility,
				type: result.type,
				messagesTotal: result.messagesTotal,
				messagesUnread: result.messagesUnread,
				threadsTotal: result.threadsTotal,
				threadsUnread: result.threadsUnread,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save label to database:', error);
		}
	}

	await logEventFromContext(ctx, 'gmail.labels.get', { ...input }, 'completed');
	return result;
};

export const create: GmailEndpoints['labelsCreate'] = async (ctx, input) => {
	const result = await makeGmailRequest<GmailEndpointOutputs['labelsCreate']>(
		`/users/${input.userId || 'me'}/labels`,
		ctx.key,
		{
			method: 'POST',
			body: input.label,
		},
	);

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.labels.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.labels.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GmailEndpoints['labelsUpdate'] = async (ctx, input) => {
	const result = await makeGmailRequest<GmailEndpointOutputs['labelsUpdate']>(
		`/users/${input.userId || 'me'}/labels/${input.id}`,
		ctx.key,
		{
			method: 'PUT',
			body: input.label,
		},
	);

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.labels.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.labels.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteLabel: GmailEndpoints['labelsDelete'] = async (
	ctx,
	input,
) => {
	await makeGmailRequest<GmailEndpointOutputs['labelsDelete']>(
		`/users/${input.userId || 'me'}/labels/${input.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	if (ctx.db.labels) {
		try {
			await ctx.db.labels.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete label from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmail.labels.delete',
		{ ...input },
		'completed',
	);
};
