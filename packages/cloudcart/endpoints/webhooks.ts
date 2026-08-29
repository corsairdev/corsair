import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateWebhookInputSchema,
	DeleteWebhookInputSchema,
	GetWebhookInputSchema,
	ListWebhooksInputSchema,
	UpdateWebhookInputSchema,
} from './types';

export const createWebhook: CloudcartEndpoints['createWebhook'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.webhooks.createWebhook',
		inputSchema: CreateWebhookInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createWebhook,
		method: 'POST',
		path: 'webhooks',
	});

export const getWebhook: CloudcartEndpoints['getWebhook'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.webhooks.getWebhook',
		inputSchema: GetWebhookInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getWebhook,
		path: (parsed) => `webhooks/${pathId(parsed.id)}`,
	});

export const listWebhooks: CloudcartEndpoints['listWebhooks'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.webhooks.listWebhooks',
		inputSchema: ListWebhooksInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listWebhooks,
		path: 'webhooks',
	});

export const updateWebhook: CloudcartEndpoints['updateWebhook'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.webhooks.updateWebhook',
		inputSchema: UpdateWebhookInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateWebhook,
		method: 'PATCH',
		path: (parsed) => `webhooks/${pathId(parsed.id)}`,
	});

export const deleteWebhook: CloudcartEndpoints['deleteWebhook'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.webhooks.deleteWebhook',
		inputSchema: DeleteWebhookInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteWebhook,
		method: 'DELETE',
		path: (parsed) => `webhooks/${pathId(parsed.id)}`,
	});
