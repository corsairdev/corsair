import { BaseProviders } from '../core/constants';
import { tryGetCorsairInternal } from '../core/utils/corsair-instance';
import type {
	BoundWebhook,
	BoundWebhookTree,
	CorsairWebhookTenantMatcher,
	RawWebhookRequest,
	WebhookResponse,
} from '../core/webhooks';
import { resolveTenantFromWebhookLink } from './tenant-links';

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
	/** HTTP response headers to set on the outgoing HTTP response (e.g. for Asana X-Hook-Secret handshake) */
	responseHeaders?: Record<string, string>;
};

/**
 * A plugin namespace on the corsair instance that may have webhooks.
 */
type PluginWithWebhooks = {
	webhooks?: BoundWebhookTree;
	/** Plugin-level matcher to quickly check if a webhook is for this plugin */
	pluginWebhookMatcher?: (request: RawWebhookRequest) => boolean;
	/** Extracts the external tenant lookup key for this plugin's webhook */
	pluginTenantWebhookMatcher?: CorsairWebhookTenantMatcher;
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

function buildGoogleChannelBody(
	headers: Record<string, string | undefined>,
): Record<string, unknown> | null {
	const resourceUri = headers['x-goog-resource-uri'];
	const channelId = headers['x-goog-channel-id'];
	if (!resourceUri || !channelId) return null;

	const notification: Record<string, string> = {
		resourceId: headers['x-goog-resource-id'] || '',
		resourceState: headers['x-goog-resource-state'] || '',
		resourceUri,
		channelId,
		channelExpiration: headers['x-goog-channel-expiration'] || '',
	};

	if (resourceUri.includes('/drive/')) {
		notification.kind = 'drive#change';
	}

	const data = Buffer.from(JSON.stringify(notification)).toString('base64');

	return {
		message: {
			data,
			messageId: headers['x-goog-message-number'] || '',
		},
	};
}

/**
 * The tenant a delivery belongs to, for the plugin that matched it, when its
 * URL names none on a multi-tenant instance: the plugin's tenant matcher reads
 * the provider's account id from the delivery, and the stored webhook link maps
 * it to a tenant (the lookup the tunnel does with Hub's routing). `failed`
 * means the lookup itself errored, which must not be read as "no link".
 */
async function resolveTenantForPlugin(
	corsair: CorsairInstance,
	pluginId: string,
	request: RawWebhookRequest,
): Promise<{ tenantId?: string; failed?: true }> {
	const internal = tryGetCorsairInternal(corsair);
	if (!internal?.multiTenancy || !internal.database) return {};
	const plugin = internal.plugins.find((p) => p.id === pluginId);
	const tenantMatch = plugin?.pluginTenantWebhookMatcher?.(request);
	if (!tenantMatch) return {};
	try {
		const tenantId = await resolveTenantFromWebhookLink({
			database: internal.database,
			kek: internal.kek,
			pluginId,
			match: tenantMatch,
		});
		return tenantId ? { tenantId } : {};
	} catch {
		return { failed: true };
	}
}

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
 * const result = await processWebhook(corsair, req.headers, req.body, req.query);
 *
 * if (result.plugin) {
 *   console.log(`Handled by ${result.plugin}.${result.action}`);
 * }
 * ```
 */
export async function processWebhook(
	corsair: CorsairInstance,
	headers: WebhookHeaders,
	body: WebhookBody | string,
	query?: {
		tenantId?: string;
		[x: string]: string | string[] | undefined;
	},
	options?: {
		/**
		 * Authoritative plugin id for hub-verified deliveries (Hub routed the
		 * event by its per-plugin endpoint, so the id is trusted). Bypasses
		 * shape-matching, which cannot distinguish MS Graph siblings — their
		 * notification bodies are identical and some pluginWebhookMatchers are
		 * wildcards.
		 */
		plugin?: string;
		/** Hub already verified the provider signature; skip app-side re-verify. */
		hubVerified?: boolean;
	},
): Promise<WebhookFilterResult> {
	const normalizedHeaders = normalizeHeaders(headers);
	let parsedBody =
		typeof body === 'string' ? (JSON.parse(body) satisfies WebhookBody) : body;

	const isEmptyBody =
		!parsedBody ||
		(typeof parsedBody === 'object' && Object.keys(parsedBody).length === 0);

	if (isEmptyBody && normalizedHeaders['x-goog-resource-uri']) {
		parsedBody = buildGoogleChannelBody(normalizedHeaders) || parsedBody;
	}

	const rawRequest = {
		headers: normalizedHeaders,
		body: parsedBody,
		...(query ? { query } : {}),
	} satisfies RawWebhookRequest;

	// Matching runs under the tenant the URL names, or `default`. When the URL
	// names none, the tenant is looked up below for the plugin that matched.
	const explicitTenantId = query?.tenantId;
	const tenantScopedCorsair = corsair.withTenant
		? corsair.withTenant(explicitTenantId || 'default')
		: corsair;

	// Known plugin IDs to check — or exactly the hub-identified one
	const hintedPlugin = options?.plugin as
		| (typeof BaseProviders)[number]
		| undefined;
	const pluginIds = hintedPlugin ? [hintedPlugin] : BaseProviders;

	for (const pluginId of pluginIds) {
		const plugin = tenantScopedCorsair[pluginId];

		// Skip if plugin is not enabled or has no webhooks
		if (!plugin || !plugin.webhooks) {
			continue;
		}

		// First, check the plugin-level pluginWebhookMatcher if it exists
		// This is a quick check to see if the webhook is even for this plugin.
		// Skipped when hub already identified the plugin — Hub's routing is
		// authoritative; matchers only exist to guess.
		if (
			!hintedPlugin &&
			plugin.pluginWebhookMatcher &&
			!plugin.pluginWebhookMatcher(rawRequest)
		) {
			// Plugin has a matcher but it didn't match - skip to next plugin
			continue;
		}

		// If no pluginWebhookMatcher defined, or if it matched, search individual webhooks
		let matched = findMatchingWebhook(plugin.webhooks, rawRequest);

		if (!matched) continue;

		if (!explicitTenantId && corsair.withTenant) {
			const resolved = await resolveTenantForPlugin(
				corsair,
				pluginId,
				rawRequest,
			);
			if (resolved.failed) {
				// A failed lookup is not "no link": running the default tenant's
				// handler could act on, or acknowledge, another tenant's delivery.
				return {
					plugin: pluginId,
					action: matched.path.join('.'),
					body: parsedBody,
					response: {
						success: false,
						error: 'Could not look up the tenant for this delivery',
						statusCode: 500,
					},
				};
			}
			if (resolved.tenantId) {
				const scoped = corsair.withTenant(resolved.tenantId)[pluginId];
				matched =
					(scoped?.webhooks &&
						findMatchingWebhook(scoped.webhooks, rawRequest)) ||
					matched;
			}
		}

		const action = matched.path.join('.');

		const webhookRequest = {
			payload: parsedBody,
			headers: normalizedHeaders,
			rawBody: typeof body === 'string' ? body : JSON.stringify(body),
			...(query ? { query } : {}),
			...(options?.hubVerified ? { hubVerified: true } : {}),
		};

		try {
			const response = await matched.webhook.handler(webhookRequest);

			const returnToSenderObjectExists = !!Object.keys(
				response.returnToSender || {},
			)?.length;

			// A handler that refused the delivery (a wrong secret, a failed
			// signature check) says so with success: false. Report that, with
			// its error and status, instead of a success the sender never earned.
			if (response.success === false) {
				return {
					plugin: pluginId,
					action,
					body: parsedBody,
					response: {
						success: false,
						...(response.error ? { error: response.error } : {}),
						...(response.statusCode ? { statusCode: response.statusCode } : {}),
					},
					...(response.responseHeaders && {
						responseHeaders: response.responseHeaders,
					}),
				};
			}

			return {
				plugin: pluginId,
				action,
				body: parsedBody,
				response: returnToSenderObjectExists
					? { ...response?.returnToSender, success: true }
					: { success: true },
				...(response.responseHeaders && {
					responseHeaders: response.responseHeaders,
				}),
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
					// A handler that threw failed on our side, not on the sender's:
					// a 5xx keeps the delivery retryable.
					statusCode: 500,
				},
			};
		}
	}

	return {
		plugin: null,
		action: null,
		body: null,
	};
}
