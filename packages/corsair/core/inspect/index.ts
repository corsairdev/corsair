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
				const fieldTypeName = (
					(val as { _def: Record<string, unknown> })._def.typeName as
						| string
						| undefined
				);
				if (fieldTypeName !== 'ZodOptional' && fieldTypeName !== 'ZodNullable') {
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

export type CorsairInspectMethods = {
	/**
	 * Returns all available endpoint paths for every registered plugin.
	 * Keys are plugin IDs, values are arrays of full-form paths (plugin.group.method).
	 *
	 * @example
	 * corsair.get_methods()
	 * // { slack: ['slack.channels.list', 'slack.messages.post', ...], github: ['github.issues.list', ...] }
	 */
	get_methods(): Record<string, string[]>;
	/**
	 * Returns all available endpoint paths for a specific plugin.
	 * Paths are full-form (plugin.group.method) so they can be passed directly to get_schema().
	 *
	 * @example
	 * corsair.get_methods('slack')
	 * // ['slack.channels.list', 'slack.channels.get', 'slack.messages.post', ...]
	 */
	get_methods(plugin: string): string[];
	/**
	 * Returns schema and metadata for a specific endpoint.
	 * Pass the full dot-path including the plugin ID: 'slack.channels.list'.
	 * If the method is not found, returns an empty result with `availableMethods` listing all valid paths.
	 *
	 * @example
	 * corsair.get_schema('slack.channels.list')
	 * // { description: '...', riskLevel: 'read', input: { type: 'object', ... }, output: { ... } }
	 *
	 * corsair.get_schema('slack.invalid')
	 * // { availableMethods: { slack: ['slack.channels.list', ...], ... } }
	 */
	get_schema(method: string): EndpointSchemaResult;
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
		return paths.map((path) => `${found.id}.${path}`);
	}
	const result: Record<string, string[]> = {};
	for (const p of plugins) {
		if (!p.endpoints) continue;
		const paths: string[] = [];
		walkEndpointTree(p.endpoints as Record<string, unknown>, [], paths);
		result[p.id] = paths.map((path) => `${p.id}.${path}`);
	}
	return result;
}

function getSchema(
	plugins: readonly CorsairPlugin[],
	method: string,
): EndpointSchemaResult {
	const dotIndex = method.indexOf('.');
	if (dotIndex !== -1) {
		const pluginId = method.slice(0, dotIndex);
		const endpointPath = method.slice(dotIndex + 1);
		const plugin = plugins.find((p) => p.id === pluginId);

		if (plugin) {
			const meta = (
				plugin.endpointMeta as Record<string, EndpointMetaEntry> | undefined
			)?.[endpointPath];
			const schemas = plugin.endpointSchemas?.[endpointPath];

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

// ─────────────────────────────────────────────────────────────────────────────
// Factory — binds inspect methods to a fixed plugin list
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates the get_methods / get_schema functions bound to a specific plugin list.
 * Used by both single-tenant and multi-tenant client builders.
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
	};
}
