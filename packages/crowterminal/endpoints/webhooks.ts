import type { CrowterminalContext } from '..';
import { pathSegment } from '../client';
import { callCrowterminal } from './shared';
import type {
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
} from './types';
import {
	CreateWebhookInputSchema,
	CreateWebhookResponseSchema,
	DeleteWebhookInputSchema,
	DeleteWebhookResponseSchema,
	ListWebhooksInputSchema,
	ListWebhooksResponseSchema,
	TestWebhookInputSchema,
	TestWebhookResponseSchema,
	UpdateWebhookInputSchema,
	UpdateWebhookResponseSchema,
} from './types';

const webhookPath = (webhookId: string) =>
	`/api/agent/webhooks/${pathSegment(webhookId)}`;

/** The response carries the signing secret, generated if none was supplied. */
export const create = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['webhooksCreate'],
): Promise<CrowterminalEndpointOutputs['webhooksCreate']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.webhooks.create',
			method: 'POST',
			inputSchema: CreateWebhookInputSchema,
			outputSchema: CreateWebhookResponseSchema,
			path: () => '/api/agent/webhooks',
			body: (i) => ({ ...i }),
		},
		input,
	);

export const list = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['webhooksList'],
): Promise<CrowterminalEndpointOutputs['webhooksList']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.webhooks.list',
			inputSchema: ListWebhooksInputSchema,
			outputSchema: ListWebhooksResponseSchema,
			path: () => '/api/agent/webhooks',
		},
		input,
	);

export const update = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['webhooksUpdate'],
): Promise<CrowterminalEndpointOutputs['webhooksUpdate']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.webhooks.update',
			method: 'PATCH',
			inputSchema: UpdateWebhookInputSchema,
			outputSchema: UpdateWebhookResponseSchema,
			path: (i) => webhookPath(i.webhookId),
			body: ({ webhookId: _webhookId, ...rest }) => ({ ...rest }),
		},
		input,
	);

export const deleteWebhook = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['webhooksDelete'],
): Promise<CrowterminalEndpointOutputs['webhooksDelete']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.webhooks.delete',
			method: 'DELETE',
			inputSchema: DeleteWebhookInputSchema,
			outputSchema: DeleteWebhookResponseSchema,
			path: (i) => webhookPath(i.webhookId),
		},
		input,
	);

/** Sends a test payload to a URL that need not be registered yet. */
export const test = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['webhooksTest'],
): Promise<CrowterminalEndpointOutputs['webhooksTest']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.webhooks.test',
			method: 'POST',
			inputSchema: TestWebhookInputSchema,
			outputSchema: TestWebhookResponseSchema,
			path: () => '/api/agent/webhooks/test',
			body: (i) => ({ ...i }),
		},
		input,
	);
