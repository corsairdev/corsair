import type { CorsairPlugin, CorsairContext, WebhookRequest } from '../core';
import type { SlackWebhookPayload } from '../plugins/slack/webhooks/types';
import type { LinearWebhookEvent } from '../plugins/linear/webhooks/types';

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

function getWebhookHandler(
	plugin: CorsairPlugin,
	action: string | null,
): any {
	if (!action || !plugin.webhookActionHandler || !plugin.webhooks) {
		return null;
	}

	return plugin.webhookActionHandler(action, plugin.webhooks);
}

export async function filterWebhook(
	headers: WebhookFilterHeaders,
	body: WebhookFilterBody | string,
	plugins?: readonly CorsairPlugin[],
	context?: Record<string, CorsairContext>,
): Promise<WebhookFilterResult> {
	const normalizedHeaders: Record<string, string | undefined> = {};
	for (const [key, value] of Object.entries(headers)) {
		normalizedHeaders[key.toLowerCase()] = Array.isArray(value)
			? value[0]
			: value;
	}

	const parsedBody: WebhookFilterBody =
		typeof body === 'string' ? JSON.parse(body) : body;

	if (plugins && plugins.length > 0) {
		for (const plugin of plugins) {
			if (plugin.webhookMatch) {
				const isMatch = plugin.webhookMatch(normalizedHeaders, parsedBody);
				if (isMatch) {
					const action = plugin.webhookActionMatch
						? plugin.webhookActionMatch(normalizedHeaders, parsedBody)
						: null;

					if (action) {
						const handler = getWebhookHandler(plugin, action);

						if (handler && typeof handler === 'function') {
							const pluginContext =
								context?.[plugin.id]
							
							if(!pluginContext) {
								continue;
							}

							const webhookRequest: WebhookRequest = {
								payload: parsedBody,
								headers: normalizedHeaders,
								rawBody: typeof body === 'string' ? body : undefined,
							};

							try {
								await handler(pluginContext, webhookRequest);
							} catch (error) {
								console.error(
									`Error executing webhook handler for ${plugin.id}.${action}:`,
									error,
								);
							}
						}
					}

					return {
						resource: plugin.id,
						action,
						body: parsedBody,
					};
				}
			}
		}
	}

	return {
		resource: null,
		action: null,
		body: parsedBody,
	};
}
