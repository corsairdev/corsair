import { logEventFromContext } from 'corsair/core';
import { makeTwittrApiRequest } from '../client';
import type { TwittrApiEndpoints } from '../index';
import type { TwittrApiEndpointOutputs } from './types';

export const getPlan: TwittrApiEndpoints['monitorsGetPlan'] = async (
	ctx,
	_input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['monitorsGetPlan']
	>('/monitors', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'twittrapi.monitors.getPlan', {}, 'completed');
	return response;
};

export const listAccounts: TwittrApiEndpoints['monitorsListAccounts'] = async (
	ctx,
	_input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['monitorsListAccounts']
	>('/monitors/accounts', ctx.key, { method: 'GET' });

	if (response.data && ctx.db.monitoredAccounts) {
		for (const account of response.data) {
			try {
				await ctx.db.monitoredAccounts.upsertByEntityId(
					account.userId,
					account,
				);
			} catch {
				// best-effort
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.monitors.listAccounts',
		{},
		'completed',
	);
	return response;
};

export const addAccounts: TwittrApiEndpoints['monitorsAddAccounts'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['monitorsAddAccounts']
	>('/monitors/accounts', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	await logEventFromContext(
		ctx,
		'twittrapi.monitors.addAccounts',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateAccount: TwittrApiEndpoints['monitorsUpdateAccount'] =
	async (ctx, input) => {
		const response = await makeTwittrApiRequest<
			TwittrApiEndpointOutputs['monitorsUpdateAccount']
		>(`/monitors/accounts/${encodeURIComponent(input.usernameOrId)}`, ctx.key, {
			method: 'PATCH',
			body: { filters: input.filters },
		});

		await logEventFromContext(
			ctx,
			'twittrapi.monitors.updateAccount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const removeAccount: TwittrApiEndpoints['monitorsRemoveAccount'] =
	async (ctx, input) => {
		const response = await makeTwittrApiRequest<
			TwittrApiEndpointOutputs['monitorsRemoveAccount']
		>(`/monitors/accounts/${encodeURIComponent(input.usernameOrId)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'twittrapi.monitors.removeAccount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listWebhooks: TwittrApiEndpoints['monitorsListWebhooks'] = async (
	ctx,
	_input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['monitorsListWebhooks']
	>('/monitors/webhooks', ctx.key, { method: 'GET' });

	if (response.webhooks && ctx.db.monitorWebhooks) {
		for (const webhook of response.webhooks) {
			try {
				await ctx.db.monitorWebhooks.upsertByEntityId(
					String(webhook.id),
					webhook,
				);
			} catch {
				// best-effort
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.monitors.listWebhooks',
		{},
		'completed',
	);
	return response;
};

export const createWebhook: TwittrApiEndpoints['monitorsCreateWebhook'] =
	async (ctx, input) => {
		const response = await makeTwittrApiRequest<
			TwittrApiEndpointOutputs['monitorsCreateWebhook']
		>('/monitors/webhooks', ctx.key, {
			method: 'POST',
			body: { ...input },
		});

		if (response.webhook && ctx.db.monitorWebhooks) {
			try {
				await ctx.db.monitorWebhooks.upsertByEntityId(
					String(response.webhook.id),
					response.webhook,
				);
			} catch {
				// best-effort
			}
		}

		await logEventFromContext(
			ctx,
			'twittrapi.monitors.createWebhook',
			{ url: input.url },
			'completed',
		);
		return response;
	};

export const getWebhook: TwittrApiEndpoints['monitorsGetWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['monitorsGetWebhook']
	>(
		`/monitors/webhooks/${encodeURIComponent(String(input.webhookId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'twittrapi.monitors.getWebhook',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateWebhook: TwittrApiEndpoints['monitorsUpdateWebhook'] =
	async (ctx, input) => {
		const { webhookId, ...body } = input;
		const response = await makeTwittrApiRequest<
			TwittrApiEndpointOutputs['monitorsUpdateWebhook']
		>(`/monitors/webhooks/${encodeURIComponent(String(webhookId))}`, ctx.key, {
			method: 'PATCH',
			body: { ...body },
		});

		await logEventFromContext(
			ctx,
			'twittrapi.monitors.updateWebhook',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteWebhook: TwittrApiEndpoints['monitorsDeleteWebhook'] =
	async (ctx, input) => {
		const response = await makeTwittrApiRequest<
			TwittrApiEndpointOutputs['monitorsDeleteWebhook']
		>(
			`/monitors/webhooks/${encodeURIComponent(String(input.webhookId))}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);

		await logEventFromContext(
			ctx,
			'twittrapi.monitors.deleteWebhook',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testWebhook: TwittrApiEndpoints['monitorsTestWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['monitorsTestWebhook']
	>(
		`/monitors/webhooks/${encodeURIComponent(String(input.webhookId))}/test`,
		ctx.key,
		{ method: 'POST', body: {} },
	);

	await logEventFromContext(
		ctx,
		'twittrapi.monitors.testWebhook',
		{ ...input },
		'completed',
	);
	return response;
};

export const getEvents: TwittrApiEndpoints['monitorsGetEvents'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['monitorsGetEvents']
	>('/monitors/events', ctx.key, {
		method: 'GET',
		query: { since: input.since, limit: input.limit },
	});

	if (response.data && ctx.db.monitorEvents) {
		for (const event of response.data) {
			try {
				await ctx.db.monitorEvents.upsertByEntityId(event.id, event);
			} catch {
				// best-effort
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.monitors.getEvents',
		{ ...input },
		'completed',
	);
	return response;
};

export const getDeliveries: TwittrApiEndpoints['monitorsGetDeliveries'] =
	async (ctx, input) => {
		const response = await makeTwittrApiRequest<
			TwittrApiEndpointOutputs['monitorsGetDeliveries']
		>('/monitors/deliveries', ctx.key, {
			method: 'GET',
			query: { limit: input.limit },
		});

		await logEventFromContext(
			ctx,
			'twittrapi.monitors.getDeliveries',
			{ ...input },
			'completed',
		);
		return response;
	};
