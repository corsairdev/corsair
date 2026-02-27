import type { ZodTypeAny } from 'zod';
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

export type CorsairInspectMethods = {
	/**
	 * Returns all available endpoint paths for every registered plugin.
	 * Keys are plugin IDs, values are arrays of full-form paths (plugin.api.group.method), all lowercase.
	 *
	 * @example
	 * corsair.get_methods()
	 * // { slack: ['slack.api.channels.list', 'slack.api.messages.post', ...], github: ['github.api.issues.list', ...] }
	 */
	get_methods(): Record<string, string[]>;
	/**
	 * Returns all available endpoint paths for a specific plugin.
	 * Paths are full-form (plugin.api.group.method), all lowercase, and can be passed directly to get_schema().
	 *
	 * @example
	 * corsair.get_methods('slack')
	 * // ['slack.api.channels.list', 'slack.api.channels.get', 'slack.api.messages.post', ...]
	 */
	get_methods(plugin: string): string[];
	/**
	 * Returns schema and metadata for a specific endpoint.
	 * Pass the full dot-path including the plugin ID and 'api' segment: 'slack.api.channels.list'.
	 * Casing is ignored — the method string is lowercased before lookup.
	 * If the method is not found, returns an empty result with `availableMethods` listing all valid paths.
	 *
	 * @example
	 * corsair.get_schema('slack.api.channels.list')
	 * // { description: '...', riskLevel: 'read', input: { type: 'object', ... }, output: { ... } }
	 *
	 * corsair.get_schema('slack.api.channels.getHistory') // casing normalised automatically
	 * // { description: '...', riskLevel: 'read', input: { type: 'object', ... }, output: { ... } }
	 *
	 * corsair.get_schema('slack.api.invalid')
	 * // { availableMethods: { slack: ['slack.api.channels.list', ...], ... } }
	 */
	get_schema(method: string): EndpointSchemaResult;
	/**
	 * Returns all available webhook paths for every registered plugin.
	 * Keys are plugin IDs, values are arrays of full dot-paths (pluginId.group.event).
	 * Pass a path directly to get_webhook_schema() to get its usage example and type info.
	 *
	 * @example
	 * corsair.get_webhooks()
	 * // {
	 * //   slack: ['slack.messages.message', 'slack.channels.created', ...],
	 * //   googlecalendar: ['googlecalendar.onEventChanged', 'googlecalendar.onEventCreated', ...],
	 * // }
	 */
	get_webhooks(): Record<string, string[]>;
	/**
	 * Returns all available webhook paths for a specific plugin.
	 *
	 * @example
	 * corsair.get_webhooks('slack')
	 * // ['slack.messages.message', 'slack.channels.created', ...]
	 */
	get_webhooks(plugin: string): string[];
	/**
	 * Returns a ready-to-copy usage example plus type information for a specific webhook.
	 * Pass the dot-path from get_webhooks(): 'slack.messages.message'.
	 * Casing is ignored — the path is lowercased before lookup.
	 *
	 * The `usage` field is a complete code snippet showing how to configure this webhook
	 * inside the plugin options, with the response.data type embedded as an inline comment.
	 *
	 * If the webhook path is not found, returns `availableWebhooks` for self-correction.
	 *
	 * @example
	 * corsair.get_webhook_schema('slack.messages.message')
	 * // {
	 * //   description: 'Fires when a message is posted',
	 * //   usage: `
	 * //     slack({
	 * //         webhookHooks: {
	 * //             messages: {
	 * //                 message: {
	 * //                     before(ctx, args) {
	 * //                         return { ctx, args };
	 * //                     },
	 * //                     after(ctx, response) {
	 * //                         // response.data:
	 * //                         // { "type": "object", ... }
	 * //                     },
	 * //                 },
	 * //             },
	 * //         },
	 * //     })`,
	 * //   payload: { ... },
	 * //   response: { ... },
	 * // }
	 */
	get_webhook_schema(webhook: string): WebhookSchemaResult;
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
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

function getMethods(
	plugins: readonly CorsairPlugin[],
	plugin?: string,
): Record<string, string[]> | string[] {
	if (plugin !== undefined) {
		const found = plugins.find((p) => p.id === plugin);
		if (!found?.endpoints) return [];
		const paths: string[] = [];
		walkEndpointTree(found.endpoints as Record<string, unknown>, [], paths);
		return paths.map((path) => `${found.id}.api.${path.toLowerCase()}`);
	}
	const result: Record<string, string[]> = {};
	for (const p of plugins) {
		if (!p.endpoints) continue;
		const paths: string[] = [];
		walkEndpointTree(p.endpoints as Record<string, unknown>, [], paths);
		result[p.id] = paths.map((path) => `${p.id}.api.${path.toLowerCase()}`);
	}
	return result;
}

function getWebhooks(
	plugins: readonly CorsairPlugin[],
	plugin?: string,
): Record<string, string[]> | string[] {
	if (plugin !== undefined) {
		const found = plugins.find((p) => p.id === plugin);
		if (!found?.webhooks) return [];
		const paths: string[] = [];
		walkWebhookTree(found.webhooks as Record<string, unknown>, [], paths);
		return paths.map((path) => `${found.id}.${path}`);
	}
	const result: Record<string, string[]> = {};
	for (const p of plugins) {
		if (!p.webhooks) continue;
		const paths: string[] = [];
		walkWebhookTree(p.webhooks as Record<string, unknown>, [], paths);
		result[p.id] = paths.map((path) => `${p.id}.${path}`);
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
	method: string,
): EndpointSchemaResult {
	// Normalise casing so the agent can call with any capitalisation
	const normalised = method.toLowerCase();
	const dotIndex = normalised.indexOf('.');
	if (dotIndex !== -1) {
		const pluginId = normalised.slice(0, dotIndex);
		let remainder = normalised.slice(dotIndex + 1);

		// Strip the optional 'api.' segment (present in the new full-form paths)
		if (remainder.startsWith('api.')) {
			remainder = remainder.slice(4);
		}

		const plugin = plugins.find((p) => p.id === pluginId);

		if (plugin) {
			const meta = findEndpointCaseInsensitive(
				plugin.endpointMeta as Record<string, EndpointMetaEntry> | undefined,
				remainder,
			);
			const schemas = findEndpointCaseInsensitive(
				plugin.endpointSchemas,
				remainder,
			);

			// Valid entry — meta or schemas found
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

	// Invalid or unknown method — return all available methods so the caller can self-correct
	return { availableMethods: getMethods(plugins) as Record<string, string[]> };
}

function getWebhookSchema(
	plugins: readonly CorsairPlugin[],
	webhook: string,
): WebhookSchemaResult {
	// Normalise casing so the agent can call with any capitalisation
	const normalised = webhook.toLowerCase();
	const dotIndex = normalised.indexOf('.');
	if (dotIndex !== -1) {
		const pluginId = normalised.slice(0, dotIndex);
		const webhookPathNormalised = normalised.slice(dotIndex + 1);
		const plugin = plugins.find((p) => p.id === pluginId);

		if (plugin?.webhooks) {
			// Resolve original-cased key segments from the webhook tree
			const originalPathParts = resolveWebhookPathOriginalCase(
				plugin.webhooks as Record<string, unknown>,
				webhookPathNormalised.split('.'),
			);

			if (originalPathParts !== null) {
				// Look up optional schemas using original-cased path (case-insensitive fallback)
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
	}

	// Invalid or unknown webhook — return all available webhooks so the caller can self-correct
	return {
		availableWebhooks: getWebhooks(plugins) as Record<string, string[]>,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory — binds inspect methods to a fixed plugin list
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates the get_methods / get_schema / get_webhooks / get_webhook_schema functions
 * bound to a specific plugin list. Used by both single-tenant and multi-tenant client builders.
 */
export function buildInspectMethods(
	plugins: readonly CorsairPlugin[],
): CorsairInspectMethods {
	return {
		get_methods(plugin?: string) {
			return getMethods(plugins, plugin) as Record<string, string[]> & string[];
		},
		get_schema(method: string) {
			return getSchema(plugins, method);
		},
		get_webhooks(plugin?: string) {
			return getWebhooks(plugins, plugin) as Record<string, string[]> &
				string[];
		},
		get_webhook_schema(webhook: string) {
			return getWebhookSchema(plugins, webhook);
		},
	};
}
