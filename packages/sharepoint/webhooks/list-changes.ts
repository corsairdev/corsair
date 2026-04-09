import { logEventFromContext } from 'corsair/core';
import type { SharepointWebhooks } from '..';
import {
	createSharepointMatch,
	verifySharepointWebhookSignature,
} from './types';

export const listChanged: SharepointWebhooks['listChanged'] = {
	match: createSharepointMatch('listChanged'),

	handler: async (ctx, request) => {
		// SharePoint subscription validation handshake:
		// Respond with the validationtoken to confirm the endpoint
		// RawWebhookRequest does not include url; cast through unknown to access the framework-extended url field
		const url = (request as unknown as { url?: string }).url ?? '';
		if (url.includes('validationtoken')) {
			const params = new URLSearchParams(url.split('?')[1] ?? '');
			const token = params.get('validationtoken') ?? '';
			return {
				success: true,
				data: {
					subscriptionId: '',
					resource: '',
					siteUrl: '',
					webId: '',
					tenantId: '',
					receivedAt: new Date(),
				},
				statusCode: 200,
				// Return raw validation token text — the framework forwards this to SharePoint
				headers: { 'Content-Type': 'text/plain' },
				rawBody: token,
				// rawBody and headers are framework extensions not in the base WebhookResponse type; cast through unknown
			} as unknown as ReturnType<typeof listChanged.handler>;
		}

		const clientState = ctx.options?.webhookClientState;
		const verification = verifySharepointWebhookSignature(request, clientState);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook verification failed',
			};
		}

		const notifications = request.payload?.value ?? [];
		if (notifications.length === 0) {
			return {
				success: true,
				data: undefined,
			};
		}

		// Use the first notification as the representative event
		const first = notifications[0]!;
		const corsairEntityId = first.subscriptionId;

		await logEventFromContext(
			ctx,
			'sharepoint.webhook.listChanged',
			{
				subscriptionId: first.subscriptionId,
				resource: first.resource,
				siteUrl: first.siteUrl,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: {
				subscriptionId: first.subscriptionId,
				resource: first.resource,
				siteUrl: first.siteUrl,
				webId: first.webId,
				tenantId: first.tenantId,
				receivedAt: new Date(),
			},
		};
	},
};
