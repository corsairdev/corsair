import { logEventFromContext } from 'corsair/core';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const getWhoami: HuggingFaceEndpoints['getWhoami'] = async (
	ctx,
	input,
) => {
	const response = await req(ctx, '/api/whoami-v2', { method: 'GET' });
	await logEventFromContext(
		ctx,
		'huggingface.account.getWhoami',
		summarize(input),
		'completed',
	);
	return response;
};

export const listNotifications: HuggingFaceEndpoints['listNotifications'] =
	async (ctx, input) => {
		const { read, type, page } = input;
		const response = await req(ctx, '/api/notifications', {
			method: 'GET',
			query: { read, type, page },
		});
		await logEventFromContext(
			ctx,
			'huggingface.account.listNotifications',
			summarize(input),
			'completed',
		);
		return response;
	};

export const deleteNotifications: HuggingFaceEndpoints['deleteNotifications'] =
	async (ctx, input) => {
		const { discussionIds, applyToAll, filter } = input;
		const response = await req(ctx, '/api/notifications', {
			method: 'DELETE',
			// HF DELETE /api/notifications: discussionIds live in the body;
			// applyToAll and the search filters are query parameters.
			query: { applyToAll, ...filter },
			body: discussionIds ? { discussionIds } : undefined,
		});
		await logEventFromContext(
			ctx,
			'huggingface.account.deleteNotifications',
			summarize(input),
			'completed',
		);
		return response;
	};
