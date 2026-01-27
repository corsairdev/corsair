import { logEvent } from '../../utils/events';
import type { GmailEndpoints } from '..';
import { makeGmailRequest } from '../client';
import type { GmailEndpointOutputs } from './types';

export const list: GmailEndpoints['labelsList'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['labelsList']>(
			`/users/${input.userId || 'me'}/labels`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'GET',
			},
		);

		if (result.labels && ctx.db.labels) {
			try {
				for (const label of result.labels) {
					if (label.id) {
						await ctx.db.labels.upsert(label.id, {
							id: label.id,
							name: label.name,
							messageListVisibility: label.messageListVisibility,
							labelListVisibility: label.labelListVisibility,
							type: label.type,
							messagesTotal: label.messagesTotal,
							messagesUnread: label.messagesUnread,
							threadsTotal: label.threadsTotal,
							threadsUnread: label.threadsUnread,
							createdAt: new Date(),
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save labels to database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.labels.list',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(ctx.database, 'gmail.labels.list', { ...input }, 'failed');
		throw error;
	}
};

export const get: GmailEndpoints['labelsGet'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['labelsGet']>(
			`/users/${input.userId || 'me'}/labels/${input.id}`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'GET',
			},
		);

		if (result.id && ctx.db.labels) {
			try {
				await ctx.db.labels.upsert(result.id, {
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

		await logEvent(ctx.database, 'gmail.labels.get', { ...input }, 'completed');
		return result;
	} catch (error) {
		await logEvent(ctx.database, 'gmail.labels.get', { ...input }, 'failed');
		throw error;
	}
};

export const create: GmailEndpoints['labelsCreate'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['labelsCreate']>(
			`/users/${input.userId || 'me'}/labels`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'POST',
				body: input.label,
			},
		);

		if (result.id && ctx.db.labels) {
			try {
				await ctx.db.labels.upsert(result.id, {
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

		await logEvent(
			ctx.database,
			'gmail.labels.create',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(ctx.database, 'gmail.labels.create', { ...input }, 'failed');
		throw error;
	}
};

export const update: GmailEndpoints['labelsUpdate'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['labelsUpdate']>(
			`/users/${input.userId || 'me'}/labels/${input.id}`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'PUT',
				body: input.label,
			},
		);

		if (result.id && ctx.db.labels) {
			try {
				await ctx.db.labels.upsert(result.id, {
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
				console.warn('Failed to update label in database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.labels.update',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(ctx.database, 'gmail.labels.update', { ...input }, 'failed');
		throw error;
	}
};

export const deleteLabel: GmailEndpoints['labelsDelete'] = async (
	ctx,
	input,
) => {
	try {
		await makeGmailRequest<GmailEndpointOutputs['labelsDelete']>(
			`/users/${input.userId || 'me'}/labels/${input.id}`,
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

		if (ctx.db.labels) {
			try {
				await ctx.db.labels.deleteByResourceId(input.id);
			} catch (error) {
				console.warn('Failed to delete label from database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.labels.delete',
			{ ...input },
			'completed',
		);
	} catch (error) {
		await logEvent(ctx.database, 'gmail.labels.delete', { ...input }, 'failed');
		throw error;
	}
};
