import { logEventFromContext } from 'corsair/core';
import { makeFilevineRequest, resolveFilevineOrgContext } from '../client';
import type { FilevineEndpoints } from '../index';
import type { FilevineEndpointOutputs } from './types';
import {
	CreateWebhookSubscriptionResponseSchema,
	DeleteWebhookSubscriptionResponseSchema,
	ListWebhookSubscriptionsResponseSchema,
} from './types';

export const list: FilevineEndpoints['listWebhookSubscriptions'] = async (
	ctx,
	_input,
) => {
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, _input.orgId, _input.userId);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['listWebhookSubscriptions']
	>('/fv-app/v2/webhooks/subscriptions', ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'GET',
	});
	const parsed = ListWebhookSubscriptionsResponseSchema.parse(result);
	if (parsed.items && ctx.db.subscriptions) {
		for (const item of parsed.items) {
			try {
				await ctx.db.subscriptions.upsertByEntityId(
					String(item.subscriptionId),
					{
						id: item.subscriptionId,
						subscriptionId: item.subscriptionId,
						name: item.name,
						description: item.description,
						endpoint: item.endpoint,
						signingKey: item.signingKey,
						events: item.events,
						createdDate: item.createdDate,
					},
				);
			} catch {}
		}
	}
	await logEventFromContext(ctx, 'filevine.webhooks.list', {}, 'completed');
	return parsed;
};

export const create: FilevineEndpoints['createWebhookSubscription'] = async (
	ctx,
	input,
) => {
	const { orgId: _orgW, userId: _userW, ...webhookBody } = input;
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, input.orgId, input.userId);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['createWebhookSubscription']
	>('/fv-app/v2/webhooks/subscriptions', ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'POST',
		body: webhookBody as Record<string, unknown>,
	});
	const parsed = CreateWebhookSubscriptionResponseSchema.parse(result);
	if (ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(
				String(parsed.subscriptionId),
				{
					id: parsed.subscriptionId,
					subscriptionId: parsed.subscriptionId,
					name: parsed.name,
					description: parsed.description,
					endpoint: parsed.endpoint,
					signingKey: parsed.signingKey,
					events: parsed.events,
					createdDate: parsed.createdDate,
				},
			);
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.webhooks.create',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const del: FilevineEndpoints['deleteWebhookSubscription'] = async (
	ctx,
	input,
) => {
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, input.orgId, input.userId);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['deleteWebhookSubscription']
	>(`/fv-app/v2/webhooks/subscriptions/${input.subscriptionId}`, ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'DELETE',
	});
	const parsed = DeleteWebhookSubscriptionResponseSchema.parse(result ?? {});
	if (ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.deleteByEntityId(String(input.subscriptionId));
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.webhooks.delete',
		{ ...input },
		'completed',
	);
	return parsed;
};
