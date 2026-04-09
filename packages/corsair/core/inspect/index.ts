import type { ZodTypeAny } from 'zod';
import type { CorsairPluginSchema } from '../../db/orm';
import { BaseProviders } from '../constants';
import type { CorsairPlugin, EndpointMetaEntry } from '../plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Zod → TypeScript-style type string converters
// ─────────────────────────────────────────────────────────────────────────────

const INDENT = '  ';

/**
 * Produces a compact single-line TypeScript-like type string.
 * Used for array item types, union members, and simple inline fields.
 *
 * Optional fields in objects are rendered with a "?" suffix on the key.
 * Enums render as pipe-separated values: full | none
 */
function zodToInlineType(schema: ZodTypeAny): string {
	const def = (schema as { _def: Record<string, unknown> })._def;
	const typeName = def.typeName as string | undefined;

	switch (typeName) {
		case 'ZodString':
			return 'string';
		case 'ZodNumber':
			return 'number';
		case 'ZodBoolean':
			return 'boolean';
		case 'ZodNull':
			return 'null';
		case 'ZodUnknown':
		case 'ZodAny':
			return 'any';
		case 'ZodLiteral':
			return String(def.value);
		case 'ZodEnum':
			return (def.values as unknown[]).map((v) => String(v)).join(' | ');
		case 'ZodOptional':
			return zodToInlineType(def.innerType as ZodTypeAny);
		case 'ZodNullable':
			return `${zodToInlineType(def.innerType as ZodTypeAny)} | null`;
		case 'ZodArray': {
			const itemType = def.type as ZodTypeAny;
			const itemDef = (itemType as { _def: Record<string, unknown> })._def;
			const isUnion = itemDef.typeName === 'ZodUnion';
			const inner = zodToInlineType(itemType);
			return `${isUnion ? `(${inner})` : inner}[]`;
		}
		case 'ZodRecord':
			return '{}';
		case 'ZodObject': {
			const shape = (def.shape as () => Record<string, ZodTypeAny>)();
			const entries = Object.entries(shape);
			if (entries.length === 0) return '{}';
			const fields = entries.map(([key, val]) => {
				const ft = (val as { _def: Record<string, unknown> })._def.typeName as
					| string
					| undefined;
				const optional = ft === 'ZodOptional' || ft === 'ZodNullable';
				return `${optional ? key + '?' : key}: ${zodToInlineType(val)}`;
			});
			return `{ ${fields.join(', ')} }`;
		}
		case 'ZodUnion':
			return (def.options as ZodTypeAny[]).map(zodToInlineType).join(' | ');
		case 'ZodIntersection':
			return `${zodToInlineType(def.left as ZodTypeAny)} & ${zodToInlineType(def.right as ZodTypeAny)}`;
		case 'ZodEffects':
			return zodToInlineType(def.schema as ZodTypeAny);
		default:
			return (typeName ?? 'unknown').replace('Zod', '').toLowerCase();
	}
}

/**
 * Produces a multi-line, indented TypeScript-like type block for objects.
 * Non-object schemas fall back to zodToInlineType.
 * Direct object-valued fields are expanded recursively; everything else is inlined.
 */
function zodToExpandedType(schema: ZodTypeAny, depth: number): string {
	const def = (schema as { _def: Record<string, unknown> })._def;
	const typeName = def.typeName as string | undefined;

	if (typeName === 'ZodOptional' || typeName === 'ZodEffects') {
		return zodToExpandedType(
			(typeName === 'ZodOptional' ? def.innerType : def.schema) as ZodTypeAny,
			depth,
		);
	}
	if (typeName !== 'ZodObject') return zodToInlineType(schema);

	const shape = (def.shape as () => Record<string, ZodTypeAny>)();
	const entries = Object.entries(shape);
	if (entries.length === 0) return '{}';

	const pad = INDENT.repeat(depth + 1);
	const closePad = INDENT.repeat(depth);
	const lines: string[] = [];

	for (const [key, val] of entries) {
		const valDef = (val as { _def: Record<string, unknown> })._def;
		const ft = valDef.typeName as string | undefined;
		const optional = ft === 'ZodOptional' || ft === 'ZodNullable';
		const k = optional ? `${key}?` : key;

		// Unwrap optional/nullable to check whether the inner type is an object worth expanding
		const innerVal =
			ft === 'ZodOptional' || ft === 'ZodNullable'
				? (valDef.innerType as ZodTypeAny)
				: val;
		const innerDef = (innerVal as { _def: Record<string, unknown> })?._def;
		const innerTypeName = innerDef?.typeName as string | undefined;
		const description = innerDef?.description as string | undefined;
		const comment = description ? `  // ${description}` : '';

		if (innerTypeName === 'ZodObject') {
			lines.push(
				`${pad}${k}: ${zodToExpandedType(innerVal, depth + 1)}${comment}`,
			);
		} else {
			lines.push(`${pad}${k}: ${zodToInlineType(val)}${comment}`);
		}
	}

	return `{\n${lines.join('\n')}\n${closePad}}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// DB Entity Helpers
// ─────────────────────────────────────────────────────────────────────────────

const STRING_OPERATORS = ['equals', 'contains', 'startsWith', 'endsWith', 'in'];
const NUMBER_OPERATORS = ['equals', 'gt', 'gte', 'lt', 'lte', 'in'];
const BOOLEAN_OPERATORS = ['equals'];
const DATE_OPERATORS = ['equals', 'before', 'after', 'between'];

type DbFieldType = 'string' | 'number' | 'boolean' | 'date';

/**
 * Unwraps Optional/Nullable/Default/Effects wrappers to find the primitive leaf type.
 * Returns null for complex types (objects, arrays, unions) that are not directly filterable.
 */
function getSchemaLeafType(schema: ZodTypeAny): DbFieldType | null {
	const def = (schema as { _def: Record<string, unknown> })._def;
	const typeName = def.typeName as string | undefined;
	switch (typeName) {
		case 'ZodOptional':
		case 'ZodNullable':
		case 'ZodDefault':
			return getSchemaLeafType(def.innerType as ZodTypeAny);
		case 'ZodEffects':
			// Covers z.coerce.date() and other transforms
			return getSchemaLeafType(def.schema as ZodTypeAny);
		case 'ZodString':
			return 'string';
		case 'ZodNumber':
			return 'number';
		case 'ZodBoolean':
			return 'boolean';
		case 'ZodDate':
			return 'date';
		default:
			return null;
	}
}

/**
 * Derives the filterable fields from a Zod object schema.
 * Only flat primitive fields (string, number, boolean, date) are included.
 * Nested objects and arrays are skipped — the ORM does not support filtering into them.
 */
function buildFilterableFields(
	schema: ZodTypeAny,
): Record<string, { type: DbFieldType; operators: string[] }> {
	const def = (schema as { _def: Record<string, unknown> })._def;
	const typeName = def.typeName as string | undefined;

	if (
		typeName === 'ZodOptional' ||
		typeName === 'ZodNullable' ||
		typeName === 'ZodDefault'
	) {
		return buildFilterableFields(def.innerType as ZodTypeAny);
	}
	if (typeName === 'ZodEffects') {
		return buildFilterableFields(def.schema as ZodTypeAny);
	}
	if (typeName !== 'ZodObject') return {};

	const shape = (def.shape as () => Record<string, ZodTypeAny>)();
	const result: Record<string, { type: DbFieldType; operators: string[] }> = {};
	for (const [key, fieldSchema] of Object.entries(shape)) {
		const leafType = getSchemaLeafType(fieldSchema);
		if (leafType === 'string') {
			result[key] = { type: 'string', operators: STRING_OPERATORS };
		} else if (leafType === 'number') {
			result[key] = { type: 'number', operators: NUMBER_OPERATORS };
		} else if (leafType === 'boolean') {
			result[key] = { type: 'boolean', operators: BOOLEAN_OPERATORS };
		} else if (leafType === 'date') {
			result[key] = { type: 'date', operators: DATE_OPERATORS };
		}
		// Nested objects, arrays, unions — not filterable via ORM, omit them
	}
	return result;
}

/**
 * Case-insensitive lookup for an entity name in a schema's entities map.
 * Entity names are camelCase (e.g. 'userGroups') but agent paths are lowercased.
 */
function findEntityCaseInsensitive(
	entities: Record<string, ZodTypeAny>,
	lowercasedName: string,
): [string, ZodTypeAny] | undefined {
	for (const [key, schema] of Object.entries(entities)) {
		if (key.toLowerCase() === lowercasedName) return [key, schema];
	}
	return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API Types
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated get_schema now returns a plain string. This type is kept for backwards compatibility. */
export type EndpointSchemaResult = {
	description?: string;
	riskLevel?: 'read' | 'write' | 'destructive';
	irreversible?: boolean;
	input?: unknown;
	output?: unknown;
	availableMethods?: Record<string, string[]>;
};

export type ListOperationsOptions = {
	/**
	 * Filter to a specific plugin by its ID (e.g. 'slack', 'github').
	 * - If the plugin is known but not added to the Corsair instance, a plain string message is returned.
	 * - If the string is completely unrecognised, returns all API endpoints as a fallback.
	 */
	plugin?: string;
	/**
	 * Whether to list API endpoints, webhooks, or database entities.
	 * - 'api' (default) — lists callable API endpoint paths
	 * - 'webhooks' — lists receivable webhook event paths
	 * - 'db' — lists searchable database entity paths (one .search per entity type)
	 */
	type?: 'api' | 'webhooks' | 'db';
};

export type CorsairInspectMethods = {
	/**
	 * Lists available operations (API endpoints, webhooks, or database entities) for the configured plugins.
	 *
	 * - No options → all API endpoint paths across every plugin, keyed by plugin ID
	 * - `{ type: 'webhooks' }` → all webhook paths across every plugin, keyed by plugin ID
	 * - `{ type: 'db' }` → all searchable DB entity paths across every plugin, keyed by plugin ID
	 * - `{ plugin: 'slack' }` → Slack API endpoint paths as a flat array
	 * - `{ plugin: 'slack', type: 'webhooks' }` → Slack webhook paths as a flat array
	 * - `{ plugin: 'slack', type: 'db' }` → Slack DB entity search paths as a flat array
	 * - If the plugin is known but not configured, returns a plain string message.
	 * - If the plugin string is completely unrecognised, returns all API endpoints (same as no options).
	 *
	 * API paths use the format `plugin.api.group.method` (e.g. `slack.api.messages.post`).
	 * Webhook paths use the format `plugin.webhooks.group.event` (e.g. `slack.webhooks.messages.message`).
	 * DB paths use the format `plugin.db.entityType.search` (e.g. `slack.db.messages.search`).
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
	 * corsair.list_operations({ plugin: 'slack', type: 'db' })
	 * // ['slack.db.messages.search', 'slack.db.channels.search', 'slack.db.users.search', ...]
	 *
	 * corsair.list_operations({ plugin: 'unknown' })
	 * // "unknown isn't configured in the Corsair instance."
	 */
	list_operations(
		options?: ListOperationsOptions,
	): Record<string, string[]> | string[] | string;
	/**
	 * Returns a plain-text TypeScript-style type declaration for a specific operation path.
	 * The path format determines which kind of schema is returned:
	 * - API path (`plugin.api.group.method`) → description, risk level, input/output types
	 * - Webhook path (`plugin.webhooks.group.event`) → description, payload/response types, usage snippet
	 * - DB path (`plugin.db.entityType.search`) → description, filterable fields with operators
	 *
	 * Casing is ignored — the path is lowercased before lookup.
	 * If the path is not found, returns a list of available paths for self-correction.
	 *
	 * @example
	 * corsair.get_schema('slack.api.messages.post')
	 * // "Post a message to a channel  [write]\n\ninput {\n  channel: string\n  text?: string\n  ..."
	 *
	 * corsair.get_schema('slack.api.invalid')
	 * // "Path not found. Available operations:\n  slack: slack.api.channels.list, ..."
	 */
	get_schema(path: string): string;
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
 * @param pluginId         Plugin ID (e.g. 'slack')
 * @param pathParts        Original-cased path segments (e.g. ['messages', 'message'])
 * @param responseTypeStr  Inline type string for response.data, or null if no schema registered
 */
function buildWebhookUsageExample(
	pluginId: string,
	pathParts: string[],
	responseTypeStr: string | null,
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
	lines.push(
		responseTypeStr !== null
			? `${bodyIndent}// response.data: ${responseTypeStr}`
			: `${bodyIndent}// response.data: unknown (register webhookSchemas to see the type)`,
	);
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
		}
		if (type === 'db') {
			const entities = (
				found.schema as
					| CorsairPluginSchema<Record<string, ZodTypeAny>>
					| undefined
			)?.entities;
			if (!entities) return [];
			return Object.keys(entities).map(
				(entityName) => `${found.id}.db.${entityName}.search`,
			);
		}
		if (!found.endpoints) return [];
		const paths: string[] = [];
		walkEndpointTree(found.endpoints as Record<string, unknown>, [], paths);
		return paths.map((path) => `${found.id}.api.${path}`);
	}

	const result: Record<string, string[]> = {};
	if (type === 'webhooks') {
		for (const p of plugins) {
			if (!p.webhooks) continue;
			const paths: string[] = [];
			walkWebhookTree(p.webhooks as Record<string, unknown>, [], paths);
			result[p.id] = paths.map((path) => `${p.id}.webhooks.${path}`);
		}
	} else if (type === 'db') {
		for (const p of plugins) {
			const entities = (
				p.schema as CorsairPluginSchema<Record<string, ZodTypeAny>> | undefined
			)?.entities;
			if (!entities) continue;
			result[p.id] = Object.keys(entities).map(
				(entityName) => `${p.id}.db.${entityName}.search`,
			);
		}
	} else {
		for (const p of plugins) {
			if (!p.endpoints) continue;
			const paths: string[] = [];
			walkEndpointTree(p.endpoints as Record<string, unknown>, [], paths);
			result[p.id] = paths.map((path) => `${p.id}.api.${path}`);
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

function formatAvailablePaths(
	paths: Record<string, string[]> | string[] | string,
	label: string,
): string {
	if (typeof paths === 'string') return paths;
	if (Array.isArray(paths)) return `${label}:\n  ${paths.join(', ')}`;
	return (
		`${label}:\n` +
		Object.entries(paths)
			.map(([plugin, list]) => `  ${plugin}: ${list.join(', ')}`)
			.join('\n')
	);
}

function getSchema(plugins: readonly CorsairPlugin[], path: string): string {
	// Normalise casing so the agent can call with any capitalisation
	const normalised = path.toLowerCase();
	const dotIndex = normalised.indexOf('.');
	if (dotIndex !== -1) {
		const pluginId = normalised.slice(0, dotIndex);
		const remainder = normalised.slice(dotIndex + 1);
		const plugin = plugins.find((p) => p.id === pluginId);

		if (plugin) {
			// ── DB search path: plugin.db.entityType.search ────────────────────────
			if (remainder.startsWith('db.')) {
				const dbPath = remainder.slice(3); // strip 'db.'
				const lastDot = dbPath.lastIndexOf('.');
				if (lastDot !== -1) {
					const entityNameLower = dbPath.slice(0, lastDot);
					const method = dbPath.slice(lastDot + 1);
					const entities = (
						plugin.schema as
							| CorsairPluginSchema<Record<string, ZodTypeAny>>
							| undefined
					)?.entities;
					if (method === 'search' && entities) {
						const entry = findEntityCaseInsensitive(entities, entityNameLower);
						if (entry) {
							const [entityName, entitySchema] = entry;
							const fields = buildFilterableFields(entitySchema);
							const lines: string[] = [
								`Search ${pluginId} ${entityName} stored in the local database.`,
								`Pass limit and offset as numbers for pagination.`,
								'',
								'filters {',
								`  entity_id: string  [${STRING_OPERATORS.join(', ')}]`,
							];
							for (const [field, info] of Object.entries(fields)) {
								lines.push(
									`  ${field}?: ${info.type}  [${info.operators.join(', ')}]`,
								);
							}
							lines.push('}');
							return lines.join('\n');
						}
					}
				}
				return formatAvailablePaths(
					listOperations(plugins, { type: 'db' }),
					'Path not found. Available db operations',
				);
			}

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

						const responseTypeStr = schemas?.response
							? zodToInlineType(schemas.response)
							: null;

						const parts: string[] = [];
						if (schemas?.description) parts.push(schemas.description);
						if (schemas?.payload) {
							parts.push(`payload ${zodToExpandedType(schemas.payload, 0)}`);
						}
						if (responseTypeStr) {
							parts.push(`response: ${responseTypeStr}`);
						}
						parts.push(
							`usage:\n${buildWebhookUsageExample(pluginId, originalPathParts, responseTypeStr)}`,
						);
						return parts.join('\n\n');
					}
				}

				return formatAvailablePaths(
					listOperations(plugins, { type: 'webhooks' }),
					'Path not found. Available webhooks',
				);
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
				const parts: string[] = [];

				// Header: description + risk tags
				const tags = [
					meta?.riskLevel ? `[${meta.riskLevel}]` : '',
					meta?.irreversible ? '[irreversible]' : '',
				]
					.filter(Boolean)
					.join(' ');
				const header = [meta?.description, tags].filter(Boolean).join('  ');
				if (header) parts.push(header);

				if (schemas?.input) {
					parts.push(`input ${zodToExpandedType(schemas.input, 0)}`);
				}
				if (schemas?.output) {
					parts.push(`output ${zodToExpandedType(schemas.output, 0)}`);
				}
				return parts.join('\n\n');
			}
		}
	}

	// Invalid or unknown path — list all available API methods for self-correction
	return formatAvailablePaths(
		listOperations(plugins),
		'Path not found. Available operations',
	);
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
		get_schema(path: string): string {
			return getSchema(plugins, path);
		},
	};
}
