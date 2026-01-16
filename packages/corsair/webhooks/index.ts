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
	/** Plugin-level matcher to quickly check if a webhook is for this plugin */
	pluginWebhookMatcher?: (request: RawWebhookRequest) => boolean;
};

/**
 * The corsair instance type - a record of plugin namespaces.
 */
type CorsairInstance = Record<string, PluginWithWebhooks | undefined> & {
	withTenant?: (tenantId: string) => CorsairInstance;
};

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

	// TODO: Extract webhook credentials from headers/body and match against database
	// to find the associated tenant ID. For now, using default tenant.
	// This should:
	// 1. Extract webhook credentials from the request (headers, body, or URL params)
	// 2. Query the database to find matching webhook configuration
	// 3. Get the tenant ID from the webhook configuration
	// 4. Use corsair.withTenant(tenantId) to get tenant-scoped instance
	const tenantScopedCorsair = corsair.withTenant
		? corsair.withTenant('default')
		: corsair;

	// Known plugin IDs to check
	const pluginIds = BaseProviders;

	for (const pluginId of pluginIds.options) {
		const plugin = tenantScopedCorsair[pluginId];

		// Skip if plugin is not enabled or has no webhooks
		if (!plugin || !plugin.webhooks) {
			continue;
		}

		// First, check the plugin-level pluginWebhookMatcher if it exists
		// This is a quick check to see if the webhook is even for this plugin
		if (plugin.pluginWebhookMatcher && !plugin.pluginWebhookMatcher(rawRequest)) {
			// Plugin has a matcher but it didn't match - skip to next plugin
			continue;
		}

		// If no pluginWebhookMatcher defined, or if it matched, search individual webhooks
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

/**

->demeter
    -> using Corsair
		-> customer a
			-> sign in with slack 
		-> customer b
			-> sign in with slack 

corsair db

corsair_providers: 1 row
	id: 123abc
	name: slack
	config: {}

corsair_connections: 2 rows
	id: 1
	tenant_id: 60 demeter sets this; this lets demeter know who this tenant is in demeter's db
	connection_id: 123abc
	config: {
		botToken: xxx-xxx-xxx
		webhookCredentials: xxx-xxx-xxa
	}

	id: 2
	tenant_id: 43 demeter sets this; this lets demeter know who this tenant is in demeter's db
	connection_id: 123abc
	config: {
		botToken: xxy-xxy-yxx
		webhookCredentials: xxx-xxx-xxb
	}

corsair_resources
	id: 244
	tenant_id: 60

api.joindemeter.com/webhooks

notification comes in:
	slack message updated

- is this for customer a or customer b? which tenant is this for?
- which plugin is this for? this is for slack
- which webhook is this for inside the plugin? this is for message updated


 */
