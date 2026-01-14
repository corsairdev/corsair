import type { Providers } from '../core';
import type { LinearWebhookEvent } from '../plugins/linear/webhooks/types';
import type { SlackWebhookPayload } from '../plugins/slack/webhooks/types';

export interface WebhookFilterHeaders {
	[key: string]: string | string[] | undefined;
}

export interface WebhookFilterBody {
	[key: string]: unknown;
}

export type WebhookFilterResult =
	| {
			resource: 'slack';
			action: string | null;
			body: SlackWebhookPayload;
	  }
	| {
			resource: 'linear';
			action: string | null;
			body: LinearWebhookEvent;
	  }
	| {
			resource: null;
			action: null;
			body: unknown;
	  };

export function filterWebhook(
	headers: WebhookFilterHeaders,
	body: WebhookFilterBody | string,
): WebhookFilterResult {
	const normalizedHeaders: Record<string, string | undefined> = {};
	for (const [key, value] of Object.entries(headers)) {
		normalizedHeaders[key.toLowerCase()] = Array.isArray(value)
			? value[0]
			: value;
	}

	const parsedBody: WebhookFilterBody =
		typeof body === 'string' ? JSON.parse(body) : body;

	if (normalizedHeaders['x-slack-signature'] || normalizedHeaders['x-slack-request-timestamp']) {
		const eventType =
			parsedBody.type === 'event_callback' &&
			typeof parsedBody.event === 'object' &&
			parsedBody.event !== null &&
			'type' in parsedBody.event
				? (parsedBody.event.type as string)
				: parsedBody.type === 'url_verification'
					? 'url_verification'
					: null;

		return {
			resource: 'slack',
			action: eventType,
			body: parsedBody  as SlackWebhookPayload,
		};
	}

	if (normalizedHeaders['linear-signature'] || normalizedHeaders['linear-delivery']) {
		const eventType = typeof parsedBody.type === 'string' ? parsedBody.type : null;
		const action = typeof parsedBody.action === 'string' ? parsedBody.action : null;

		const combinedAction =
			eventType && action
				? `${eventType}${action.charAt(0).toUpperCase() + action.slice(1)}`
				: eventType || action || null;

		return {
			resource: 'linear',
			action: combinedAction,
			body: parsedBody as LinearWebhookEvent,
		};
	}



	return {
		resource: null,
		action: null,
		body: parsedBody,
	};
}
