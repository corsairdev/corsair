import type { ZodTypeAny } from 'zod';
import { BaseProviders } from '../constants';
import type { CorsairPlugin, EndpointMetaEntry } from '../plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Zod → JSON Schema Converter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a Zod schema to a plain JSON Schema-compatible object.
 * Used to produce human-readable type information for get_schema().
 */
function zodToJsonSchema(schema: ZodTypeAny): unknown {
	// Access Zod internals via a generic cast — avoids importing internal Zod types
	const def = (schema as { _def: Record<string, unknown> })._def;
	const typeName = def.typeName as string | undefined;

	switch (typeName) {
		case 'ZodString':
			return { type: 'string' };
		case 'ZodNumber':
			return { type: 'number' };
		case 'ZodBoolean':
			return { type: 'boolean' };
		case 'ZodNull':
			return { type: 'null' };
		case 'ZodUnknown':
		case 'ZodAny':
			return {};
		case 'ZodLiteral':
			return { const: def.value };
		case 'ZodEnum':
			return { enum: def.values as unknown[] };
		case 'ZodOptional':
			// Optional is reflected in the parent object's required[] array, not here
			return zodToJsonSchema(def.innerType as ZodTypeAny);
		case 'ZodNullable': {
			const inner = zodToJsonSchema(def.innerType as ZodTypeAny);
			return { anyOf: [inner, { type: 'null' }] };
		}
		case 'ZodArray':
			return { type: 'array', items: zodToJsonSchema(def.type as ZodTypeAny) };
		case 'ZodRecord':
			return {
				type: 'object',
				additionalProperties: zodToJsonSchema(def.valueType as ZodTypeAny),
			};
		case 'ZodObject': {
			const shape = (def.shape as () => Record<string, ZodTypeAny>)();
			const properties: Record<string, unknown> = {};
			const required: string[] = [];
			for (const [key, val] of Object.entries(shape)) {
				properties[key] = zodToJsonSchema(val);
				const fieldTypeName = (val as { _def: Record<string, unknown> })._def
					.typeName as string | undefined;
				if (
					fieldTypeName !== 'ZodOptional' &&
					fieldTypeName !== 'ZodNullable'
				) {
					required.push(key);
				}
			}
			const result: Record<string, unknown> = { type: 'object', properties };
			if (required.length > 0) result.required = required;
			return result;
		}
		case 'ZodUnion':
			return { anyOf: (def.options as ZodTypeAny[]).map(zodToJsonSchema) };
		case 'ZodIntersection':
			return {
				allOf: [
					zodToJsonSchema(def.left as ZodTypeAny),
					zodToJsonSchema(def.right as ZodTypeAny),
				],
			};
		case 'ZodEffects':
			// .refine(), .transform(), etc. — unwrap to the inner schema
			return zodToJsonSchema(def.schema as ZodTypeAny);
		default:
			return { type: (typeName ?? 'unknown').replace('Zod', '').toLowerCase() };
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API Types
// ─────────────────────────────────────────────────────────────────────────────

export type EndpointSchemaResult = {
	/** Human-readable description of what this endpoint does. */
	description?: string;
	/** Risk classification: 'read' | 'write' | 'destructive' */
	riskLevel?: 'read' | 'write' | 'destructive';
	/** Whether this action cannot be undone. */
	irreversible?: boolean;
	/** JSON Schema representation of the input arguments object. */
	input?: unknown;
	/** JSON Schema representation of the response object. */
	output?: unknown;
	/**
	 * Present when the requested method was not found.
	 * Lists all available full-form paths so the caller can pick a valid one.
	 */
	availableMethods?: Record<string, string[]>;
};

export type WebhookSchemaResult = {
	/** Human-readable description of what triggers this webhook. */
	description?: string;
	/** JSON Schema for the webhook payload — the type of `request.payload` in the before hook. */
	payload?: unknown;
	/** JSON Schema for the webhook response data — the type of `response.data` in the after hook. */
	response?: unknown;
	/**
	 * Ready-to-copy code example showing exactly how to configure this webhook,
	 * including response.data type as an inline comment.
	 */
	usage?: string;
	/**
	 * Present when the requested webhook path was not found.
	 * Lists all available webhook dot-paths per plugin so the caller can self-correct.
	 */
	availableWebhooks?: Record<string, string[]>;
};

export type ListOperationsOptions = {
	/**
	 * Filter to a specific plugin by its ID (e.g. 'slack', 'github').
	 * - If the plugin is known but not added to the Corsair instance, a plain string message is returned.
	 * - If the string is completely unrecognised, returns all API endpoints as a fallback.
	 */
	plugin?: string;
	/**
	 * Whether to list API endpoints or webhooks.
	 * Defaults to 'api' when not provided.
	 */
	type?: 'api' | 'webhooks';
};

export type CorsairInspectMethods = {
	/**
	 * Lists available operations (API endpoints or webhooks) for the configured plugins.
	 *
	 * - No options → all API endpoint paths across every plugin, keyed by plugin ID
	 * - `{ type: 'webhooks' }` → all webhook paths across every plugin, keyed by plugin ID
	 * - `{ plugin: 'slack' }` → Slack API endpoint paths as a flat array
	 * - `{ plugin: 'slack', type: 'webhooks' }` → Slack webhook paths as a flat array
	 * - If the plugin is known but not configured, returns a plain string message.
	 * - If the plugin string is completely unrecognised, returns all API endpoints (same as no options).
	 *
	 * API paths use the format `plugin.api.group.method` (e.g. `slack.api.messages.post`).
	 * Webhook paths use the format `plugin.webhooks.group.event` (e.g. `slack.webhooks.messages.message`).
	 * All paths can be passed directly to `get_schema()`.
	 *
	 * @example
	 * corsair.list_operations()
	 * // { slack: ['slack.api.channels.list', 'slack.api.messages.post', ...], ... }
	 *
	 * corsair.list_operations({ plugin: 'slack' })
	 * // ['slack.api.channels.list', 'slack.api.messages.post', ...]
	 *
	 * corsair.list_operations({ plugin: 'slack', type: 'webhooks' })
	 * // ['slack.webhooks.messages.message', 'slack.webhooks.channels.created', ...]
	 *
	 * corsair.list_operations({ plugin: 'unknown' })
	 * // "unknown isn't configured in the Corsair instance."
	 */
	list_operations(
		options?: ListOperationsOptions,
	): Record<string, string[]> | string[] | string;
	/**
	 * Returns schema and metadata for a specific API endpoint or webhook.
	 * The path format determines which kind of schema is returned:
	 * - API path (`plugin.api.group.method`) → `EndpointSchemaResult`
	 * - Webhook path (`plugin.webhooks.group.event`) → `WebhookSchemaResult`
	 *
	 * Casing is ignored — the path is lowercased before lookup.
	 * If the path is not found, returns an object with available paths for self-correction.
	 *
	 * @example
	 * corsair.get_schema('slack.api.channels.list')
	 * // { description: '...', riskLevel: 'read', input: { type: 'object', ... }, output: { ... } }
	 *
	 * corsair.get_schema('slack.webhooks.messages.message')
	 * // { description: '...', usage: '...', payload: { ... }, response: { ... } }
	 *
	 * corsair.get_schema('slack.api.invalid')
	 * // { availableMethods: { slack: ['slack.api.channels.list', ...], ... } }
	 */
	get_schema(path: string): EndpointSchemaResult | WebhookSchemaResult;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree Walker
// ─────────────────────────────────────────────────────────────────────────────

function walkEndpointTree(
	tree: Record<string, unknown>,
	pathParts: string[],
	result: string[],
): void {
	for (const [key, value] of Object.entries(tree)) {
		const current = [...pathParts, key];
		if (typeof value === 'function') {
			result.push(current.join('.'));
		} else if (value !== null && typeof value === 'object') {
			walkEndpointTree(value as Record<string, unknown>, current, result);
		}
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Tree Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if a value is a webhook leaf (has both `match` and `handler` functions).
 * Mirrors the isWebhook guard in core/webhooks/bind.ts without importing it.
 */
function isWebhookLeaf(
	value: unknown,
): value is { match: unknown; handler: unknown } {
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
 * Recursively collects all webhook leaf paths in a webhook tree.
 * Preserves original key casing so paths can be used as object keys in webhookHooks config.
 */
function walkWebhookTree(
	tree: Record<string, unknown>,
	pathParts: string[],
	result: string[],
): void {
	for (const [key, value] of Object.entries(tree)) {
		const current = [...pathParts, key];
		if (isWebhookLeaf(value)) {
			result.push(current.join('.'));
		} else if (value !== null && typeof value === 'object') {
			walkWebhookTree(value as Record<string, unknown>, current, result);
		}
	}
}

/**
 * Walks a webhook tree with a normalised (lowercased) path and returns the original-cased
 * key segments when found. Used to reconstruct the exact key names for usage examples.
 * Returns null if the path does not resolve to a webhook leaf.
 */
function resolveWebhookPathOriginalCase(
	tree: Record<string, unknown>,
	normalizedParts: string[],
): string[] | null {
	if (normalizedParts.length === 0) return null;
	const [head, ...tail] = normalizedParts;

	const entry = Object.entries(tree).find(([k]) => k.toLowerCase() === head);
	if (!entry) return null;
	const [originalKey, value] = entry;

	if (tail.length === 0) {
		return isWebhookLeaf(value) ? [originalKey] : null;
	}

	if (value !== null && typeof value === 'object' && !isWebhookLeaf(value)) {
		const rest = resolveWebhookPathOriginalCase(
			value as Record<string, unknown>,
			tail,
		);
		if (rest !== null) return [originalKey, ...rest];
	}

	return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Usage Example Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a ready-to-copy code snippet showing how to configure a specific webhook.
 * The response.data type (if available) is embedded as an inline comment inside the after hook.
 *
 * @param pluginId       Plugin ID (e.g. 'slack')
 * @param pathParts      Original-cased path segments (e.g. ['messages', 'message'])
 * @param responseSchema JSON Schema for response.data, or null if no schema registered
 */
function buildWebhookUsageExample(
	pluginId: string,
	pathParts: string[],
	responseSchema: unknown | null,
): string {
	const lines: string[] = [];

	lines.push(`${pluginId}({`);
	lines.push(`    webhookHooks: {`);

	// Open nested key blocks
	for (let i = 0; i < pathParts.length; i++) {
		const indent = '    '.repeat(i + 2);
		lines.push(`${indent}${pathParts[i]}: {`);
	}

	// Hook body — indented one level deeper than the innermost key
	const hookIndent = '    '.repeat(pathParts.length + 2);
	const bodyIndent = hookIndent + '    ';

	lines.push(`${hookIndent}before(ctx, args) {`);
	lines.push(`${bodyIndent}return { ctx, args };`);
	lines.push(`${hookIndent}},`);

	lines.push(`${hookIndent}after(ctx, response) {`);
	if (responseSchema !== null) {
		const json = JSON.stringify(responseSchema, null, 2);
		const commentLines = json
			.split('\n')
			.map((l, i) =>
				i === 0
					? `${bodyIndent}// response.data: ${l}`
					: `${bodyIndent}// ${l}`,
			);
		lines.push(...commentLines);
	} else {
		lines.push(
			`${bodyIndent}// response.data: unknown (register webhookSchemas to see the type)`,
		);
	}
	lines.push(`${hookIndent}},`);

	// Close nested key blocks (innermost first)
	for (let i = pathParts.length - 1; i >= 0; i--) {
		const indent = '    '.repeat(i + 2);
		lines.push(`${indent}},`);
	}

	lines.push(`    },`);
	lines.push(`})`);

	return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Known Plugin Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Set of all plugin IDs that ship with the corsair package.
 * Derived from BaseProviders (core/constants.ts) — the single source of truth.
 * Used to distinguish "valid but not configured" from "completely unknown" plugin strings.
 */
const KNOWN_PLUGIN_IDS = new Set<string>(BaseProviders);

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

function listOperations(
	plugins: readonly CorsairPlugin[],
	options?: ListOperationsOptions,
): Record<string, string[]> | string[] | string {
	const type = options?.type ?? 'api';
	const pluginId = options?.plugin;

	if (pluginId !== undefined) {
		const found = plugins.find((p) => p.id === pluginId);
		if (!found) {
			// Known plugin (exists in the package) but not added to this instance
			if (KNOWN_PLUGIN_IDS.has(pluginId)) {
				return `This plugin (${pluginId}) is not configured. Please add it to the Corsair instance to see its associated methods.`;
			}
			// Completely unknown string — fall through to return all API endpoints
			return listOperations(plugins);
		}
		if (type === 'webhooks') {
			if (!found.webhooks) return [];
			const paths: string[] = [];
			walkWebhookTree(found.webhooks as Record<string, unknown>, [], paths);
			return paths.map((path) => `${found.id}.webhooks.${path}`);
		} else {
			if (!found.endpoints) return [];
			const paths: string[] = [];
			walkEndpointTree(found.endpoints as Record<string, unknown>, [], paths);
			return paths.map((path) => `${found.id}.api.${path.toLowerCase()}`);
		}
	}

	const result: Record<string, string[]> = {};
	if (type === 'webhooks') {
		for (const p of plugins) {
			if (!p.webhooks) continue;
			const paths: string[] = [];
			walkWebhookTree(p.webhooks as Record<string, unknown>, [], paths);
			result[p.id] = paths.map((path) => `${p.id}.webhooks.${path}`);
		}
	} else {
		for (const p of plugins) {
			if (!p.endpoints) continue;
			const paths: string[] = [];
			walkEndpointTree(p.endpoints as Record<string, unknown>, [], paths);
			result[p.id] = paths.map((path) => `${p.id}.api.${path.toLowerCase()}`);
		}
	}
	return result;
}

/**
 * Case-insensitive lookup in an endpoint record (endpointMeta or endpointSchemas).
 * Keys in those records use camelCase (e.g. 'channels.getHistory') while the
 * normalised path coming from the agent is fully lowercased.
 */
function findEndpointCaseInsensitive<T>(
	record: Record<string, T> | undefined,
	lowercasedPath: string,
): T | undefined {
	if (!record) return undefined;
	for (const [key, value] of Object.entries(record)) {
		if (key.toLowerCase() === lowercasedPath) return value;
	}
	return undefined;
}

function getSchema(
	plugins: readonly CorsairPlugin[],
	path: string,
): EndpointSchemaResult | WebhookSchemaResult {
	// Normalise casing so the agent can call with any capitalisation
	const normalised = path.toLowerCase();
	const dotIndex = normalised.indexOf('.');
	if (dotIndex !== -1) {
		const pluginId = normalised.slice(0, dotIndex);
		const remainder = normalised.slice(dotIndex + 1);
		const plugin = plugins.find((p) => p.id === pluginId);

		if (plugin) {
			// ── Webhook path: plugin.webhooks.group.event ──────────────────────────
			if (remainder.startsWith('webhooks.')) {
				const webhookPathNormalised = remainder.slice(9); // strip 'webhooks.'

				if (plugin.webhooks) {
					const originalPathParts = resolveWebhookPathOriginalCase(
						plugin.webhooks as Record<string, unknown>,
						webhookPathNormalised.split('.'),
					);

					if (originalPathParts !== null) {
						const originalPath = originalPathParts.join('.');
						const schemas = findEndpointCaseInsensitive(
							plugin.webhookSchemas,
							originalPath.toLowerCase(),
						);

						const responseSchema = schemas?.response
							? zodToJsonSchema(schemas.response)
							: null;

						return {
							description: schemas?.description,
							payload: schemas?.payload
								? zodToJsonSchema(schemas.payload)
								: undefined,
							response: responseSchema ?? undefined,
							usage: buildWebhookUsageExample(
								pluginId,
								originalPathParts,
								responseSchema,
							),
						};
					}
				}

				// Invalid webhook path — return available webhooks for self-correction
				return {
					availableWebhooks: listOperations(plugins, {
						type: 'webhooks',
					}) as Record<string, string[]>,
				};
			}

			// ── API endpoint path: plugin.api.group.method ─────────────────────────
			let endpointPath = remainder;
			if (endpointPath.startsWith('api.')) {
				endpointPath = endpointPath.slice(4);
			}

			const meta = findEndpointCaseInsensitive(
				plugin.endpointMeta as Record<string, EndpointMetaEntry> | undefined,
				endpointPath,
			);
			const schemas = findEndpointCaseInsensitive(
				plugin.endpointSchemas,
				endpointPath,
			);

			if (meta || schemas) {
				return {
					description: meta?.description,
					riskLevel: meta?.riskLevel,
					irreversible: meta?.irreversible,
					input: schemas?.input ? zodToJsonSchema(schemas.input) : undefined,
					output: schemas?.output ? zodToJsonSchema(schemas.output) : undefined,
				};
			}
		}
	}

	// Invalid or unknown path — return all available API methods for self-correction
	return {
		availableMethods: listOperations(plugins) as Record<string, string[]>,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory — binds inspect methods to a fixed plugin list
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates the list_operations / get_schema functions bound to a specific plugin list.
 * Used by both single-tenant and multi-tenant client builders.
 */
export function buildInspectMethods(
	plugins: readonly CorsairPlugin[],
): CorsairInspectMethods {
	return {
		list_operations(options?: ListOperationsOptions) {
			return listOperations(plugins, options);
		},
		get_schema(path: string) {
			return getSchema(plugins, path);
		},
	};
}
