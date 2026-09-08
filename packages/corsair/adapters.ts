import { z } from 'zod';
import type { AnyCorsairInstance, FormFieldSchema } from './inspect';
import { getInputSchema, getStructuredSchema, listOperations } from './inspect';

/**
 * Converts a {@link getStructuredSchema} field into a Zod schema for a tool's
 * input. LangChain and LlamaIndex both accept a Zod v4 schema directly, so no
 * JSON Schema conversion is needed.
 */
export function formFieldToZod(field: FormFieldSchema): z.ZodTypeAny {
	let schema = baseType(field);
	if (field.description) schema = schema.describe(field.description);
	if (field.optional) schema = schema.optional();
	return schema;
}

/** Maps one {@link FormFieldSchema} `kind` to its base Zod type, recursing into objects and arrays. */
function baseType(field: FormFieldSchema): z.ZodTypeAny {
	switch (field.kind) {
		case 'string':
			return field.enum && field.enum.length > 0
				? z.enum(field.enum as [string, ...string[]])
				: z.string();
		case 'number':
			return z.number();
		case 'boolean':
			return z.boolean();
		case 'literal':
			return z.literal(field.value);
		case 'object': {
			const shape: Record<string, z.ZodTypeAny> = {};
			for (const [key, value] of Object.entries(field.fields)) {
				shape[key] = formFieldToZod(value);
			}
			return z.object(shape);
		}
		case 'array':
			return z.array(formFieldToZod(field.items));
		case 'unknown':
			return z.unknown();
	}
}

/** A Corsair operation as a framework-agnostic tool: a Zod input schema plus a bound `execute`. */
export interface CorsairOperationTool {
	/**
	 * LLM-facing function name: the operation path with every character outside
	 * `[A-Za-z0-9_-]` replaced by `_`, so it satisfies the OpenAI function-calling
	 * name constraint (dotted paths are rejected there).
	 */
	name: string;
	/** The original dotted operation path, e.g. `slack.api.channels.list`. */
	operation: string;
	/** The operation's description, falling back to the operation path. */
	description: string;
	/** Zod schema for the operation input; an empty object when it takes none. */
	schema: z.ZodTypeAny;
	/**
	 * Runs the operation with the given (already parsed) args, returning its raw result.
	 * The result type is `unknown` because each Corsair plugin returns a distinct shape;
	 * adapters serialize it to string for model consumption.
	 */
	execute: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface BuildCorsairToolsOptions {
	/** Restrict discovery to one plugin (toolkit), e.g. `'slack'`. */
	plugin?: string;
	/**
	 * Build exactly these dotted operation paths instead of discovering them.
	 * Takes precedence over `plugin`.
	 */
	operations?: string[];
	/**
	 * Pin every operation to one Corsair tenant (for multi-tenant instances). The
	 * instance is scoped once via `withTenant`; single-tenant instances ignore it.
	 */
	tenantId?: string;
}

/**
 * Turns a Corsair instance's API operations into framework-agnostic
 * {@link CorsairOperationTool}s. Discovery, schema conversion and invocation all
 * run against the (optionally tenant-scoped) instance, so an adapter only has to
 * map each result onto its framework's tool primitive.
 */
export function buildCorsairTools(
	corsair: AnyCorsairInstance,
	options?: BuildCorsairToolsOptions,
): CorsairOperationTool[] {
	const instance = options?.tenantId
		? scopeInstance(corsair, options.tenantId)
		: corsair;

	const operations =
		options?.operations ??
		parseOperationPaths(
			listOperations(instance, { plugin: options?.plugin, type: 'api' }),
		);

	return operations.map((operation) => {
		const structured = getStructuredSchema(instance, operation);
		// raw schema preserves constraints; structured is the lossy fallback
		const rawInput = getInputSchema(instance, operation);
		const inputSchema =
			rawInput ??
			(structured?.input ? formFieldToZod(structured.input) : z.object({}));
		return {
			name: sanitizeToolName(operation),
			operation,
			description: structured?.description ?? operation,
			schema: inputSchema,
			execute: (args) => invokeOperation(instance, operation, args ?? {}),
		};
	});
}

/** Splits `listOperations`' newline listing into individual operation paths. */
function parseOperationPaths(listing: string): string[] {
	return listing
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);
}

function sanitizeToolName(operation: string): string {
	return operation.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/** Scopes the Corsair instance to a tenant when it supports `withTenant`, else returns it as-is. */
function scopeInstance(
	corsair: AnyCorsairInstance,
	tenantId: string,
): AnyCorsairInstance {
	const withTenant = (
		corsair as { withTenant?: (id: string) => AnyCorsairInstance }
	).withTenant;
	return typeof withTenant === 'function'
		? withTenant.call(corsair, tenantId)
		: corsair;
}

/**
 * Invokes an operation by dotted path (e.g. `slack.api.channels.list`), bound to
 * the namespace that owns the method.
 */
async function invokeOperation(
	instance: unknown,
	path: string,
	args: Record<string, unknown>,
): Promise<unknown> {
	const segments = path.split('.');
	const method = segments.pop();
	if (!method) throw new Error(`Invalid operation path: ${path}`);
	let target: Record<string, unknown> | undefined = instance as Record<
		string,
		unknown
	>;
	for (const segment of segments) {
		target = target?.[segment] as Record<string, unknown> | undefined;
		if (target == null) throw new Error(`Unknown operation path: ${path}`);
	}
	const fn = target[method];
	if (typeof fn !== 'function')
		throw new Error(`Operation is not callable: ${path}`);
	return (fn as (a: Record<string, unknown>) => unknown).call(target, args);
}
