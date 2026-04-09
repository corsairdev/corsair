import { logEventFromContext } from 'corsair/core';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const create: FigmaEndpoints['webhooksCreate'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksCreate']>(
		`v2/webhooks`,
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);

	if (result.id && ctx.db.webhookConfigs) {
		try {
			await ctx.db.webhookConfigs.upsertByEntityId(result.id, { ...result });
		} catch (error) {
			console.warn('Failed to save webhook config to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.webhooks.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteWebhook: FigmaEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksDelete']>(
		`v2/webhooks/${input.webhook_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (result.id && ctx.db.webhookConfigs) {
		try {
			await ctx.db.webhookConfigs.upsertByEntityId(result.id, {
				...result,
				id: result.id,
			});
		} catch (error) {
			console.warn(
				'Failed to update deleted webhook config in database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.webhooks.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: FigmaEndpoints['webhooksGet'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksGet']>(
		`v2/webhooks/${input.webhook_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.webhookConfigs) {
		try {
			await ctx.db.webhookConfigs.upsertByEntityId(result.id, { ...result });
		} catch (error) {
			console.warn('Failed to save webhook config to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.webhooks.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: FigmaEndpoints['webhooksList'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksList']>(
		`v2/webhooks`,
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	if (result.webhooks && ctx.db.webhookConfigs) {
		try {
			for (const webhook of result.webhooks) {
				if (webhook.id) {
					await ctx.db.webhookConfigs.upsertByEntityId(webhook.id, {
						...webhook,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save webhook configs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.webhooks.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getRequests: FigmaEndpoints['webhooksGetRequests'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['webhooksGetRequests']
	>(`v2/webhooks/${input.webhook_id}/requests`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'figma.webhooks.getRequests',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: FigmaEndpoints['webhooksUpdate'] = async (ctx, input) => {
	const { webhook_id, ...body } = input;
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksUpdate']>(
		`v2/webhooks/${webhook_id}`,
		ctx.key,
		{ method: 'PUT', body: { ...body } },
	);

	if (result.id && ctx.db.webhookConfigs) {
		try {
			await ctx.db.webhookConfigs.upsertByEntityId(result.id, { ...result });
		} catch (error) {
			console.warn('Failed to update webhook config in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'figma.webhooks.update',
		{ ...input },
		'completed',
	);
	return result;
};
