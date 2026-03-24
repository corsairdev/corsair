import { logEventFromContext } from '../../utils/events';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const create: FigmaEndpoints['webhooksCreate'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksCreate']>(
		`v2/webhooks`,
		ctx.key,
		{
			method: 'POST',
			body: {
				event_type: input.event_type,
				endpoint: input.endpoint,
				passcode: input.passcode,
				status: input.status,
				context: input.context,
				context_id: input.context_id,
				team_id: input.team_id,
				description: input.description,
			},
		},
	);

	if (result.id && ctx.db.webhookConfigs) {
		try {
			await ctx.db.webhookConfigs.upsertByEntityId(result.id, {
				id: result.id,
				status: result.status,
				context: result.context,
				team_id: result.team_id,
				endpoint: result.endpoint,
				passcode: result.passcode,
				client_id: result.client_id,
				context_id: result.context_id,
				event_type: result.event_type,
				description: result.description,
			});
		} catch (error) {
			console.warn('Failed to save webhook config to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.webhooks.create', { ...input }, 'completed');
	return result;
};

export const deleteWebhook: FigmaEndpoints['webhooksDelete'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksDelete']>(
		`v2/webhooks/${input.webhook_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'figma.webhooks.delete', { ...input }, 'completed');
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
			await ctx.db.webhookConfigs.upsertByEntityId(result.id, {
				id: result.id,
				status: result.status,
				context: result.context,
				team_id: result.team_id,
				endpoint: result.endpoint,
				passcode: result.passcode,
				client_id: result.client_id,
				context_id: result.context_id,
				event_type: result.event_type,
				description: result.description,
			});
		} catch (error) {
			console.warn('Failed to save webhook config to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.webhooks.get', { ...input }, 'completed');
	return result;
};

export const list: FigmaEndpoints['webhooksList'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksList']>(
		`v2/webhooks`,
		ctx.key,
		{
			method: 'GET',
			query: { context: input.context, context_id: input.context_id },
		},
	);

	if (result.webhooks && ctx.db.webhookConfigs) {
		try {
			for (const webhook of result.webhooks) {
				if (webhook.id) {
					await ctx.db.webhookConfigs.upsertByEntityId(webhook.id, {
						id: webhook.id,
						status: webhook.status,
						context: webhook.context,
						team_id: webhook.team_id,
						endpoint: webhook.endpoint,
						passcode: webhook.passcode,
						client_id: webhook.client_id,
						context_id: webhook.context_id,
						event_type: webhook.event_type,
						description: webhook.description,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save webhook configs to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.webhooks.list', { ...input }, 'completed');
	return result;
};

export const getRequests: FigmaEndpoints['webhooksGetRequests'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksGetRequests']>(
		`v2/webhooks/${input.webhook_id}/requests`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'figma.webhooks.getRequests', { ...input }, 'completed');
	return result;
};

export const update: FigmaEndpoints['webhooksUpdate'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['webhooksUpdate']>(
		`v2/webhooks/${input.webhook_id}`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				event_type: input.event_type,
				endpoint: input.endpoint,
				passcode: input.passcode,
				status: input.status,
				description: input.description,
			},
		},
	);

	if (result.id && ctx.db.webhookConfigs) {
		try {
			await ctx.db.webhookConfigs.upsertByEntityId(result.id, {
				id: result.id,
				status: result.status,
				context: result.context,
				team_id: result.team_id,
				endpoint: result.endpoint,
				passcode: result.passcode,
				client_id: result.client_id,
				context_id: result.context_id,
				event_type: result.event_type,
				description: result.description,
			});
		} catch (error) {
			console.warn('Failed to update webhook config in database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.webhooks.update', { ...input }, 'completed');
	return result;
};
