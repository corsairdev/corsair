import { BaseProviders } from '../core/constants';
import type {
	BoundWebhook,
	BoundWebhookTree,
	RawWebhookRequest,
	WebhookResponse,
} from '../core/webhooks';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WebhookHeaders {
	[key: string]: string | string[] | undefined;
}

export interface WebhookBody {
	[key: string]: unknown;
}

export type WebhookFilterResult = {
	/** The plugin that matched the webhook (e.g. 'slack', 'linear'), or null if no match */
	plugin: (typeof BaseProviders)[number] | null;
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
function isBoundWebhook(value: unknown): value is BoundWebhook {
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
	webhook: BoundWebhook;
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
	headers: WebhookHeaders,
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
 * @param query - The query parameters from the webhook request (optional)
 * @returns The filter result with plugin, action, body, and optional response
 *
 * @example
 * ```ts
 * const corsair = createCorsair({
 *   plugins: [slack({ ... }), linear({ ... })],
 * });
 *
 * // In your webhook endpoint handler:
 * const result = await filterWebhook(corsair, req.headers, req.body, req.query);
 *
 * if (result.plugin) {
 *   console.log(`Handled by ${result.plugin}.${result.action}`);
 * }
 * ```
 */
export async function filterWebhook(
	corsair: CorsairInstance,
	headers: WebhookHeaders,
	body: WebhookBody | string,
	query?: {
		tenantId?: string;
		[x: string]: string | string[] | undefined;
	},
): Promise<WebhookFilterResult> {
	const normalizedHeaders = normalizeHeaders(headers);
	const parsedBody =
		typeof body === 'string' ? (JSON.parse(body) satisfies WebhookBody) : body;

	const rawRequest = {
		headers: normalizedHeaders,
		body: parsedBody,
	} satisfies RawWebhookRequest;

	const tenantId = query?.tenantId || 'default';

	const tenantScopedCorsair = corsair.withTenant
		? corsair.withTenant(tenantId)
		: corsair;

	// Known plugin IDs to check
	const pluginIds = BaseProviders;

	for (const pluginId of pluginIds) {
		const plugin = tenantScopedCorsair[pluginId];

		// Skip if plugin is not enabled or has no webhooks
		if (!plugin || !plugin.webhooks) {
			continue;
		}

		// First, check the plugin-level pluginWebhookMatcher if it exists
		// This is a quick check to see if the webhook is even for this plugin
		if (
			plugin.pluginWebhookMatcher &&
			!plugin.pluginWebhookMatcher(rawRequest)
		) {
			// Plugin has a matcher but it didn't match - skip to next plugin
			continue;
		}

		// If no pluginWebhookMatcher defined, or if it matched, search individual webhooks
		const matched = findMatchingWebhook(plugin.webhooks, rawRequest);

		if (matched) {
			const action = matched.path.join('.');

			const webhookRequest = {
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
					response: response.returnToSender
						? { success: true, data: response.data }
						: { success: true },
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
