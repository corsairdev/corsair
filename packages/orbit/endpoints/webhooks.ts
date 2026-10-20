import { z } from 'zod';
import type { OrbitContext } from '../index';
import { callOrbit, omitUndefined } from './call';
import type { OrbitEndpointInputs } from './types';
import {
	CreateWebhookInput,
	DeleteResult,
	TestWebhookInput,
	WebhookEndpoint,
	WebhookIdInput,
	WebhookList,
	WebhookTest,
} from './types';

export const WebhooksApi = {
	create: (ctx: OrbitContext, input: OrbitEndpointInputs['createWebhook']) =>
		callOrbit(
			ctx,
			'webhooks.create',
			CreateWebhookInput,
			WebhookEndpoint,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/webhooks',
				body: omitUndefined(validated),
			}),
			() => ({ created: 'webhook' }),
		),
	list: (ctx: OrbitContext, input: OrbitEndpointInputs['listWebhooks']) =>
		callOrbit(
			ctx,
			'webhooks.list',
			z.object({}),
			WebhookList,
			input,
			() => ({ method: 'GET', url: '/v3/webhooks' }),
			() => ({ list: 'webhooks' }),
		),
	delete: (ctx: OrbitContext, input: OrbitEndpointInputs['deleteWebhook']) =>
		callOrbit(
			ctx,
			'webhooks.delete',
			WebhookIdInput,
			DeleteResult,
			input,
			(validated) => ({
				method: 'DELETE',
				url: '/v3/webhooks/{webhook_id}',
				path: { webhook_id: validated.webhook_id },
			}),
			(validated) => ({ webhookId: validated.webhook_id }),
		),
	test: (ctx: OrbitContext, input: OrbitEndpointInputs['testWebhook']) =>
		callOrbit(
			ctx,
			'webhooks.test',
			TestWebhookInput,
			WebhookTest,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/webhooks/{webhook_id}/test',
				path: { webhook_id: validated.webhook_id },
				body: omitUndefined({ event_type: validated.event_type }),
			}),
			(validated) => ({ webhookId: validated.webhook_id }),
		),
};
