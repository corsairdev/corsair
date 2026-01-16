import { BaseProviders } from '../constants';
import type {
	BoundWebhook,
	BoundWebhookTree,
	RawWebhookRequest,
	WebhookRequest,
	WebhookResponse,
} from '../core';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WebhookFilterHeaders {
	[key: string]: string | string[] | undefined;
}

export interface WebhookFilterBody {
	[key: string]: unknown;
}

export type WebhookFilterResult = {
	/** The plugin that matched the webhook (e.g. 'slack', 'linear'), or null if no match */
	plugin: string | null;
	/** The path to the matched webhook handler (e.g. 'channels.created'), or null if no match */
	action: string | null;
	/** The parsed request body */
	body: unknown;
	/** The response from the webhook handler, if one was executed */
	response?: WebhookResponse<unknown>;
};

/**
 * A plugin namespace on the corsair instance that may have webhooks.
 */
type PluginWithWebhooks = {
	webhooks?: BoundWebhookTree;
};

/**
 * The corsair instance type - a record of plugin namespaces.
 */
type CorsairInstance = Record<string, PluginWithWebhooks | undefined>;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks if a value is a bound webhook object with match and handler.
 */
function isBoundWebhook(value: unknown): value is BoundWebhook<any, any> {
	return (
		value !== null &&
		typeof value === 'object' &&
		'match' in value &&
		'handler' in value &&
		typeof (value as Record<string, unknown>).match === 'function' &&
		typeof (value as Record<string, unknown>).handler === 'function'
	);
}

/**
 * Result from finding a matching webhook.
 */
type MatchedWebhook = {
	webhook: BoundWebhook<any, any>;
	path: string[];
};

/**
 * Recursively searches through a webhooks tree to find a matching webhook.
 * Returns the first webhook whose match function returns true.
 */
function findMatchingWebhook(
	webhooks: BoundWebhookTree,
	rawRequest: RawWebhookRequest,
	path: string[] = [],
): MatchedWebhook | null {
	for (const [key, value] of Object.entries(webhooks)) {
		if (isBoundWebhook(value)) {
			// It's a webhook - check if it matches
			if (value.match(rawRequest)) {
				return { webhook: value, path: [...path, key] };
			}
		} else if (value && typeof value === 'object') {
			// It's a nested object - recurse into it
			const found = findMatchingWebhook(value as BoundWebhookTree, rawRequest, [
				...path,
				key,
			]);
			if (found) {
				return found;
			}
		}
	}
	return null;
}

/**
 * Normalizes headers to lowercase keys with string values.
 */
function normalizeHeaders(
	headers: WebhookFilterHeaders,
): Record<string, string | undefined> {
	const normalized: Record<string, string | undefined> = {};
	for (const [key, value] of Object.entries(headers)) {
		normalized[key.toLowerCase()] = Array.isArray(value) ? value[0] : value;
	}
	return normalized;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filters an incoming webhook request through all plugins in a corsair instance.
 *
 * Goes through each enabled plugin to find a matching webhook handler.
 * If a match is found, the handler is executed and the result is returned.
 *
 * @param corsair - The corsair instance (returned from createCorsair)
 * @param headers - The HTTP headers from the webhook request
 * @param body - The request body (string or parsed object)
 * @returns The filter result with plugin, action, body, and optional response
 *
 * @example
 * ```ts
 * const corsair = createCorsair({
 *   plugins: [slack({ ... }), linear({ ... })],
 * });
 *
 * // In your webhook endpoint handler:
 * const result = await filterWebhook(corsair, req.headers, req.body);
 *
 * if (result.plugin) {
 *   console.log(`Handled by ${result.plugin}.${result.action}`);
 * }
 * ```
 */
export async function filterWebhook(
	corsair: CorsairInstance,
	headers: WebhookFilterHeaders,
	body: WebhookFilterBody | string,
): Promise<WebhookFilterResult> {
	const normalizedHeaders = normalizeHeaders(headers);
	const parsedBody: WebhookFilterBody =
		typeof body === 'string' ? JSON.parse(body) : body;

	const rawRequest: RawWebhookRequest = {
		headers: normalizedHeaders,
		body: parsedBody,
	};

	// Known plugin IDs to check
	const pluginIds = BaseProviders;

	for (const pluginId of pluginIds.options) {
		const plugin = corsair[pluginId];

		// Skip if plugin is not enabled or has no webhooks
		if (!plugin || !plugin.webhooks) {
			continue;
		}

		const matched = findMatchingWebhook(plugin.webhooks, rawRequest);

		if (matched) {
			const action = matched.path.join('.');

			const webhookRequest: WebhookRequest = {
				payload: parsedBody,
				headers: normalizedHeaders,
				rawBody: typeof body === 'string' ? body : undefined,
			};

			try {
				const response = await matched.webhook.handler(webhookRequest);
				return {
					plugin: pluginId,
					action,
					body: parsedBody,
					response,
				};
			} catch (error) {
				console.error(
					`Error executing webhook handler for ${pluginId}.${action}:`,
					error,
				);
				return {
					plugin: pluginId,
					action,
					body: parsedBody,
					response: {
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				};
			}
		}
	}

	return {
		plugin: null,
		action: null,
		body: parsedBody,
	};
}
