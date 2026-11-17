import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { logoDevRequest } from '../client';
import type { LogoDevContext } from '../context';
import { requireKey } from './shared';
import type {
	CreateWebhookEndpointInput,
	DeleteWebhookEndpointResponse,
	ListWebhookEndpointsInput,
	ListWebhookEndpointsResponse,
	UpdateWebhookEndpointInput,
	WebhookEndpointIdInput,
	WebhookEndpointResponse,
} from './types';
import {
	CreateWebhookEndpointInputSchema,
	DeleteWebhookEndpointResponseSchema,
	ListWebhookEndpointsInputSchema,
	ListWebhookEndpointsResponseSchema,
	UpdateWebhookEndpointInputSchema,
	WebhookEndpointIdInputSchema,
	WebhookEndpointResponseSchema,
} from './types';

function endpointPath(id: string): string {
	return `/v2/webhook_endpoints/${encodeURIComponent(id)}`;
}

export const listWebhookEndpoints: CorsairEndpoint<
	LogoDevContext,
	ListWebhookEndpointsInput,
	ListWebhookEndpointsResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	ListWebhookEndpointsInputSchema.parse(input ?? {});
	// `unknown` until the schema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, {
		path: '/v2/webhook_endpoints',
	});
	const result = ListWebhookEndpointsResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'logodev.webhookEndpoints.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};

export const getWebhookEndpoint: CorsairEndpoint<
	LogoDevContext,
	WebhookEndpointIdInput,
	WebhookEndpointResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = WebhookEndpointIdInputSchema.parse(input);
	// `unknown` until the schema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, {
		path: endpointPath(parsed.id),
	});
	const result = WebhookEndpointResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'logodev.webhookEndpoints.get',
		{},
		'completed',
	);
	return result;
};

export const createWebhookEndpoint: CorsairEndpoint<
	LogoDevContext,
	CreateWebhookEndpointInput,
	WebhookEndpointResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = CreateWebhookEndpointInputSchema.parse(input);
	// `unknown` until the schema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, {
		method: 'POST',
		path: '/v2/webhook_endpoints',
		body: parsed,
	});
	const result = WebhookEndpointResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'logodev.webhookEndpoints.create',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const updateWebhookEndpoint: CorsairEndpoint<
	LogoDevContext,
	UpdateWebhookEndpointInput,
	WebhookEndpointResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const { id, ...changes } = UpdateWebhookEndpointInputSchema.parse(input);
	// `unknown` until the schema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, {
		method: 'PATCH',
		path: endpointPath(id),
		body: changes,
	});
	const result = WebhookEndpointResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'logodev.webhookEndpoints.update',
		{ id },
		'completed',
	);
	return result;
};

/** Delete an endpoint. The API answers 204 with no body. */
export const deleteWebhookEndpoint: CorsairEndpoint<
	LogoDevContext,
	WebhookEndpointIdInput,
	DeleteWebhookEndpointResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = WebhookEndpointIdInputSchema.parse(input);
	await logoDevRequest<unknown>(key, {
		method: 'DELETE',
		path: endpointPath(parsed.id),
	});
	await logEventFromContext(
		ctx,
		'logodev.webhookEndpoints.delete',
		{ id: parsed.id },
		'completed',
	);
	return DeleteWebhookEndpointResponseSchema.parse({
		id: parsed.id,
		deleted: true,
	});
};
