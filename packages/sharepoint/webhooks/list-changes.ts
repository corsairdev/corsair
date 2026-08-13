import {
	extractMicrosoftGraphValidationToken,
	logEventFromContext,
} from 'corsair/core';
import type { SharepointWebhooks } from '../index';
import {
	createSharepointMatch,
	verifySharepointWebhookSignature,
} from './types';

export const listChanged: SharepointWebhooks['listChanged'] = {
	match: createSharepointMatch('listChanged'),

	handler: async (ctx, request) => {
		const validationToken = extractMicrosoftGraphValidationToken({
			headers: request.headers,
			payload: request.payload,
			query: request.query,
		});
		if (validationToken) {
			return {
				success: true,
				returnToSender: { validationToken },
				statusCode: 200,
				responseHeaders: {
					'Content-Type': 'text/plain; charset=utf-8',
				},
			};
		}

		// ctx.key resolves the plugin option first and then the Hub-stored webhook
		// signature (see the keyBuilder in ../index.ts), matching the other Graph
		// plugins. Reading the option directly missed Hub-managed subscriptions.
		const verification = verifySharepointWebhookSignature(request, ctx.key);
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
