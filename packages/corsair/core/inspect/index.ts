import type { ZodTypeAny } from 'zod';
import type { CorsairPluginSchema } from '../../db/orm';
import { BaseProviders } from '../constants';
import type {
	CorsairPlugin,
	EndpointJob,
	EndpointMetaEntry,
	EndpointRiskLevel,
} from '../plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Zod → TypeScript-style type string converters
// ─────────────────────────────────────────────────────────────────────────────

const INDENT = '  ';

type ZodDef = Record<string, unknown>;

function getZodDef(schema: ZodTypeAny): ZodDef {
	const zodSchema = schema as unknown as { _def?: ZodDef; def?: ZodDef };
	return zodSchema._def ?? zodSchema.def ?? {};
}

function getZodTypeName(def: ZodDef): string | undefined {
	const typeName = def.typeName as string | undefined;
	if (typeName) return typeName;
	const type = def.type as string | undefined;
	if (!type) return undefined;
	return `Zod${type
		.split('_')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('')}`;
}

function getZodInner(def: ZodDef): ZodTypeAny | undefined {
	return (def.innerType ?? def.schema ?? def.out ?? def.in) as
		| ZodTypeAny
		| undefined;
}

/** Input-side schema for pipes/effects — used when rendering TypeScript-like types. */
function getZodSchemaForTypeDisplay(
	def: ZodDef,
	typeName: string | undefined,
): ZodTypeAny | undefined {
	switch (typeName) {
		case 'ZodPipe':
			return (def.in ?? def.innerType) as ZodTypeAny | undefined;
		case 'ZodEffects':
			return (def.schema ?? def.innerType) as ZodTypeAny | undefined;
		case 'ZodTransform':
			return (def.schema ?? def.innerType ?? def.in) as ZodTypeAny | undefined;
		default:
			return getZodInner(def);
	}
}

function getZodArrayItem(def: ZodDef): ZodTypeAny | undefined {
	const type = def.type;
	return (def.element ?? (typeof type === 'string' ? undefined : type)) as
		| ZodTypeAny
		| undefined;
}

function getZodShape(
	schema: ZodTypeAny,
	def: ZodDef,
): Record<string, ZodTypeAny> {
	const shape = def.shape ?? (schema as unknown as { shape?: unknown }).shape;
	return (typeof shape === 'function' ? shape() : shape) as Record<
		string,
		ZodTypeAny
	>;
}

function getZodOptions(def: ZodDef): unknown[] {
	if (Array.isArray(def.options)) return def.options;
	if (Array.isArray(def.values)) return def.values;
	if (
		def.entries !== null &&
		typeof def.entries === 'object' &&
		!Array.isArray(def.entries)
	) {
		return Object.values(def.entries);
	}
	return [];
}

function getZodDescription(
	schema: ZodTypeAny,
	def: ZodDef,
): string | undefined {
	return (
		(schema as unknown as { description?: string }).description ??
		(def.description as string | undefined)
	);
}

/** Walks optional/nullable/effect wrappers outward→inward to find `.describe()` text. */
function collectZodDescription(schema: ZodTypeAny): string | undefined {
	let current: ZodTypeAny | undefined = schema;
	while (current) {
		const def = getZodDef(current);
		const description = getZodDescription(current, def);
		if (description) return description;
		const typeName = getZodTypeName(def);
		if (
			isOptionalish(typeName) ||
			typeName === 'ZodPipe' ||
			typeName === 'ZodEffects' ||
			typeName === 'ZodTransform'
		) {
			current = getZodSchemaForTypeDisplay(def, typeName);
			continue;
		}
		break;
	}
	return undefined;
}

function isOptionalish(typeName: string | undefined): boolean {
	return (
		typeName === 'ZodOptional' ||
		typeName === 'ZodNullable' ||
		typeName === 'ZodDefault' ||
		typeName === 'ZodCatch'
	);
}

/**
 * True when a rendered type has a top-level `|` or `&`, i.e. it must be wrapped
 * in parentheses before `[]` or `&` is appended (`(a | b)[]`, not `a | b[]`).
 */
function needsGrouping(type: string): boolean {
	let depth = 0;
	let quote: string | undefined;
	for (let i = 0; i < type.length; i++) {
		const ch = type[i] as string;
		if (quote) {
			if (ch === quote) quote = undefined;
			continue;
		}
		if (ch === '"' || ch === "'") quote = ch;
		else if (ch === '(' || ch === '{' || ch === '[' || ch === '<') depth++;
		else if (ch === ')' || ch === '}' || ch === ']' || ch === '>') depth--;
		else if (depth === 0 && (ch === '|' || ch === '&')) return true;
	}
	return false;
}

function group(type: string): string {
	return needsGrouping(type) ? `(${type})` : type;
}

/** Enum and literal values render bare (`full | none`); the empty string renders as `""`. */
// unknown: zod enum and literal values can be any primitive (string, number,
// boolean, bigint, null), and String() formats each one.
function formatLiteralValue(value: unknown): string {
	return value === '' ? '""' : String(value);
}

/** The schema a `z.lazy()` stands for (zod 4 `def.getter`, zod 3 `def.getter`). */
function getZodLazyTarget(def: ZodDef): ZodTypeAny | undefined {
	const getter = def.getter;
	return typeof getter === 'function'
		? (getter as () => ZodTypeAny)()
		: undefined;
}

/**
 * Lazy schemas being rendered right now. A recursive schema (Qdrant's prefetch
 * holds more prefetches) renders its shape once and `(recursive)` where it
 * refers to itself, instead of recursing forever or printing `lazy`.
 */
const lazyInProgress = new Set<ZodTypeAny>();

/** Splits a rendered type on its top-level `|`. */
function topLevelMembers(type: string): string[] {
	const members: string[] = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < type.length; i++) {
		const ch = type[i];
		if (ch === '(' || ch === '{' || ch === '[' || ch === '<') depth++;
		else if (ch === ')' || ch === '}' || ch === ']' || ch === '>') depth--;
		else if (depth === 0 && ch === '|') {
			members.push(type.slice(start, i).trim());
			start = i + 1;
		}
	}
	members.push(type.slice(start).trim());
	return members;
}

const JSON_VALUE_MEMBERS = [
	'string',
	'number',
	'boolean',
	'null',
	'(recursive)[]',
	'Record<string, (recursive)>',
];

/** The usual recursive "any JSON value" schema reads better by name. */
function nameJsonValue(type: string): string {
	const members = new Set(topLevelMembers(type));
	return members.size === JSON_VALUE_MEMBERS.length &&
		JSON_VALUE_MEMBERS.every((m) => members.has(m))
		? 'JsonValue'
		: type;
}

function renderLazy<T>(
	schema: ZodTypeAny,
	render: (target: ZodTypeAny) => T,
	onRecursion: T,
): T {
	if (lazyInProgress.has(schema)) return onRecursion;
	const target = getZodLazyTarget(getZodDef(schema));
	if (!target) return onRecursion;
	lazyInProgress.add(schema);
	try {
		return render(target);
	} finally {
		lazyInProgress.delete(schema);
	}
}

/**
 * True for `.optional()`, also under `.nullable()` (`.nullish()`,
 * `.optional().nullable()`). `.nullable()` alone keeps a key required, and a
 * `.default()` stays as it was rendered before (not optional).
 */
function hasOptionalWrapper(schema: ZodTypeAny): boolean {
	let current: ZodTypeAny | undefined = schema;
	while (current) {
		const def = getZodDef(current);
		const typeName = getZodTypeName(def);
		if (typeName === 'ZodOptional') return true;
		if (typeName !== 'ZodNullable') return false;
		current = getZodInner(def);
	}
	return false;
}

/**
 * Produces a compact single-line TypeScript-like type string.
 * Used for array item types, union members, and simple inline fields.
 *
 * Optional fields in objects are rendered with a "?" suffix on the key.
 * Enums render as pipe-separated values: full | none
 */
function zodToInlineType(schema: ZodTypeAny): string {
	const def = getZodDef(schema);
	const typeName = getZodTypeName(def);

	switch (typeName) {
		case 'ZodString':
			return 'string';
		case 'ZodNumber':
			return 'number';
		case 'ZodBoolean':
			return 'boolean';
		case 'ZodDate':
			return 'Date';
		case 'ZodNull':
			return 'null';
		case 'ZodUnknown':
		case 'ZodAny':
			return 'any';
		case 'ZodLiteral': {
			const values = 'value' in def ? [def.value] : getZodOptions(def);
			return values.length > 0
				? values.map(formatLiteralValue).join(' | ')
				: 'unknown';
		}
		case 'ZodEnum':
			return getZodOptions(def).map(formatLiteralValue).join(' | ');
		case 'ZodOptional': {
			const inner = getZodInner(def);
			return inner ? zodToInlineType(inner) : 'unknown';
		}
		case 'ZodNullable': {
			const inner = getZodInner(def);
			return `${inner ? zodToInlineType(inner) : 'unknown'} | null`;
		}
		case 'ZodDefault':
		case 'ZodCatch': {
			const inner = getZodInner(def);
			return inner ? zodToInlineType(inner) : 'unknown';
		}
		case 'ZodArray': {
			const itemType = getZodArrayItem(def);
			if (!itemType) return 'unknown[]';
			return `${group(zodToInlineType(itemType))}[]`;
		}
		case 'ZodRecord': {
			const keyType = def.keyType as ZodTypeAny | undefined;
			const valueType = def.valueType as ZodTypeAny | undefined;
			const key = keyType ? zodToInlineType(keyType) : 'string';
			const value = valueType ? zodToInlineType(valueType) : 'any';
			return `Record<${key}, ${value}>`;
		}
		case 'ZodLazy':
			return renderLazy(
				schema,
				(target) => nameJsonValue(zodToInlineType(target)),
				'(recursive)',
			);
		case 'ZodTuple': {
			const items = Array.isArray(def.items) ? def.items : [];
			const rest = def.rest as ZodTypeAny | undefined | null;
			const rendered = items.map((item) => zodToInlineType(item as ZodTypeAny));
			if (rest) rendered.push(`...${group(zodToInlineType(rest))}[]`);
			return `[${rendered.join(', ')}]`;
		}
		case 'ZodObject': {
			const shape = getZodShape(schema, def);
			const entries = Object.entries(shape);
			if (entries.length === 0) return '{}';
			const fields = entries.map(
				([key, val]) =>
					`${hasOptionalWrapper(val) ? `${key}?` : key}: ${zodToInlineType(val)}`,
			);
			return `{ ${fields.join(', ')} }`;
		}
		case 'ZodUnion':
			return getZodOptions(def)
				.map((option) => zodToInlineType(option as ZodTypeAny))
				.join(' | ');
		case 'ZodIntersection':
			return `${group(zodToInlineType(def.left as ZodTypeAny))} & ${group(zodToInlineType(def.right as ZodTypeAny))}`;
		case 'ZodPipe':
		case 'ZodTransform':
		case 'ZodEffects': {
			const inner = getZodSchemaForTypeDisplay(def, typeName);
			return inner ? zodToInlineType(inner) : 'unknown';
		}
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
	const def = getZodDef(schema);
	const typeName = getZodTypeName(def);

	if (isOptionalish(typeName)) {
		const inner = getZodInner(def);
		return inner ? zodToExpandedType(inner, depth) : 'unknown';
	}
	if (typeName !== 'ZodObject') return zodToInlineType(schema);

	const shape = getZodShape(schema, def);
	const entries = Object.entries(shape);
	if (entries.length === 0) return '{}';

	const pad = INDENT.repeat(depth + 1);
	const closePad = INDENT.repeat(depth);
	const lines: string[] = [];

	for (const [key, val] of entries) {
		const valDef = getZodDef(val);
		const ft = getZodTypeName(valDef);
		const k = hasOptionalWrapper(val) ? `${key}?` : key;

		// Unwrap optional/nullable to check whether the inner type is an object worth expanding
		const innerVal =
			ft === 'ZodOptional' || ft === 'ZodNullable'
				? (getZodInner(valDef) ?? val)
				: val;
		const innerDef = getZodDef(innerVal);
		const innerTypeName = getZodTypeName(innerDef);
		const description = collectZodDescription(val);
		const comment = description ? `  // ${description}` : '';
		const nullable = ft === 'ZodNullable';

		if (innerTypeName === 'ZodObject') {
			lines.push(
				`${pad}${k}: ${zodToExpandedType(innerVal, depth + 1)}${nullable ? ' | null' : ''}${comment}`,
			);
		} else {
			lines.push(`${pad}${k}: ${zodToInlineType(val)}${comment}`);
		}
	}

	return `{\n${lines.join('\n')}\n${closePad}}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Structured Form Schema (JSON-serializable, for UI form generation)
// ─────────────────────────────────────────────────────────────────────────────

export type FormFieldSchema =
	| { kind: 'string'; optional: boolean; description?: string; enum?: string[] }
	| { kind: 'number'; optional: boolean; description?: string }
	| { kind: 'boolean'; optional: boolean; description?: string }
	| {
			kind: 'literal';
			optional: boolean;
			description?: string;
			value: string | number | boolean;
	  }
	| {
			kind: 'object';
			optional: boolean;
			description?: string;
			fields: Record<string, FormFieldSchema>;
	  }
	| {
			kind: 'array';
			optional: boolean;
			description?: string;
			items: FormFieldSchema;
	  }
	| { kind: 'unknown'; optional: boolean; description?: string };

function zodToFormSchema(schema: ZodTypeAny): FormFieldSchema {
	const def = getZodDef(schema);
	const typeName = getZodTypeName(def);
	const description = getZodDescription(schema, def);

	switch (typeName) {
		case 'ZodString':
			return { kind: 'string', optional: false, description };
		case 'ZodNumber':
			return { kind: 'number', optional: false, description };
		case 'ZodBoolean':
			return { kind: 'boolean', optional: false, description };
		case 'ZodLiteral': {
			const raw = def.value ?? getZodOptions(def)[0];
			const val: string | number | boolean =
				typeof raw === 'string' ||
				typeof raw === 'number' ||
				typeof raw === 'boolean'
					? raw
					: String(raw ?? '');
			return {
				kind: 'literal',
				optional: false,
				description,
				value: val,
			};
		}
		case 'ZodEnum': {
			const values = getZodOptions(def).map((v) => String(v));
			return { kind: 'string', optional: false, description, enum: values };
		}
		case 'ZodOptional': {
			const inner = getZodInner(def);
			const base = inner
				? zodToFormSchema(inner)
				: { kind: 'unknown' as const, optional: false };
			return {
				...base,
				optional: true,
				description: description ?? base.description,
			};
		}
		case 'ZodNullable': {
			const inner = getZodInner(def);
			const base = inner
				? zodToFormSchema(inner)
				: { kind: 'unknown' as const, optional: false };
			return {
				...base,
				optional: true,
				description: description ?? base.description,
			};
		}
		case 'ZodDefault':
		case 'ZodCatch': {
			const inner = getZodInner(def);
			return inner
				? { ...zodToFormSchema(inner), description }
				: { kind: 'unknown', optional: false, description };
		}
		case 'ZodArray': {
			const itemType = getZodArrayItem(def);
			return {
				kind: 'array',
				optional: false,
				description,
				items: itemType
					? zodToFormSchema(itemType)
					: { kind: 'unknown', optional: false },
			};
		}
		case 'ZodObject': {
			const shape = getZodShape(schema, def);
			const fields: Record<string, FormFieldSchema> = {};
			for (const [key, val] of Object.entries(shape)) {
				fields[key] = zodToFormSchema(val);
			}
			return { kind: 'object', optional: false, description, fields };
		}
		case 'ZodRecord':
			return { kind: 'unknown', optional: false, description };
		case 'ZodUnion': {
			// For unions, try to pick the first object or fall back to unknown
			const options = getZodOptions(def);
			for (const opt of options) {
				const optDef = getZodDef(opt as ZodTypeAny);
				if (getZodTypeName(optDef) === 'ZodObject') {
					return { ...zodToFormSchema(opt as ZodTypeAny), description };
				}
			}
			return { kind: 'unknown', optional: false, description };
		}
		case 'ZodIntersection':
		case 'ZodPipe':
		case 'ZodTransform':
		case 'ZodEffects': {
			const inner = getZodInner(def);
			return inner
				? { ...zodToFormSchema(inner), description }
				: { kind: 'unknown', optional: false, description };
		}
		default:
			return { kind: 'unknown', optional: false, description };
	}
}

export function getStructuredSchema(
	plugins: readonly CorsairPlugin[],
	path: string,
): {
	input: FormFieldSchema | null;
	output: FormFieldSchema | null;
	description?: string;
} | null {
	const normalised = path.toLowerCase();
	const dotIndex = normalised.indexOf('.');
	if (dotIndex === -1) return null;

	const pluginId = normalised.slice(0, dotIndex);
	const remainder = normalised.slice(dotIndex + 1);
	const plugin = plugins.find((p) => p.id === pluginId);
	if (!plugin) return null;

	// Only API endpoints have structured input schemas
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

	if (!meta && !schemas) return null;

	return {
		input: schemas?.input ? zodToFormSchema(schemas.input) : null,
		output: schemas?.output ? zodToFormSchema(schemas.output) : null,
		description: meta?.description,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// DB Entity Helpers
// ─────────────────────────────────────────────────────────────────────────────

const STRING_OPERATORS = ['equals', 'contains', 'startsWith', 'endsWith', 'in'];
const NUMBER_OPERATORS = ['equals', 'gt', 'gte', 'lt', 'lte', 'in'];
const BOOLEAN_OPERATORS = ['equals'];
const DATE_OPERATORS = ['equals', 'before', 'after', 'between'];

type DbFieldType = 'string' | 'number' | 'boolean' | 'date';

// unknown: a literal can hold any primitive; typeof picks its filter type.
function literalLeafType(value: unknown): DbFieldType | null {
	if (typeof value === 'string') return 'string';
	if (typeof value === 'number') return 'number';
	if (typeof value === 'boolean') return 'boolean';
	return null;
}

/** The one leaf type every value shares, or null when they differ or one has none. */
function sameLeafType(types: (DbFieldType | null)[]): DbFieldType | null {
	const first = types[0];
	if (!first) return null;
	return types.every((t) => t === first) ? first : null;
}

/**
 * Unwraps Optional/Nullable/Default wrappers to find the primitive leaf type.
 * Enums, literals and unions whose members all share one primitive type count as
 * that type: the ORM's typed `data` filter accepts them (`'open' | 'closed'`
 * extends string). Objects, arrays and mixed unions return null.
 */
function getSchemaLeafType(schema: ZodTypeAny): DbFieldType | null {
	const def = getZodDef(schema);
	const typeName = getZodTypeName(def);
	switch (typeName) {
		case 'ZodOptional':
		case 'ZodNullable':
		case 'ZodDefault':
		case 'ZodCatch': {
			const inner = getZodInner(def);
			return inner ? getSchemaLeafType(inner) : null;
		}
		case 'ZodString':
			return 'string';
		case 'ZodNumber':
			return 'number';
		case 'ZodBoolean':
			return 'boolean';
		case 'ZodDate':
			return 'date';
		case 'ZodEnum':
		case 'ZodLiteral': {
			const values = 'value' in def ? [def.value] : getZodOptions(def);
			return sameLeafType(values.map(literalLeafType));
		}
		case 'ZodUnion':
			return sameLeafType(
				getZodOptions(def)
					.filter(
						(o) => getZodTypeName(getZodDef(o as ZodTypeAny)) !== 'ZodNull',
					)
					.map((o) => getSchemaLeafType(o as ZodTypeAny)),
			);
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
	const def = getZodDef(schema);
	const typeName = getZodTypeName(def);

	if (isOptionalish(typeName)) {
		const inner = getZodInner(def);
		return inner ? buildFilterableFields(inner) : {};
	}
	if (typeName !== 'ZodObject') return {};

	const shape = getZodShape(schema, def);
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
		// Nested objects, arrays, mixed unions — not filterable via ORM, omit them
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
 * Response shape is documented separately (e.g. generated webhooks MDX); the after hook is left empty.
 *
 * @param pluginId   Plugin ID (e.g. 'slack')
 * @param pathParts  Original-cased path segments (e.g. ['messages', 'message'])
 */
function buildWebhookUsageExample(
	pluginId: string,
	pathParts: string[],
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

export function listOperations(
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

/**
 * `list_operations` paths look like `spotify.api.player.addToQueue`. Strip the plugin id and
 * optional `api.` prefix. Preserves camelCase on the remainder for docs (`player.addToQueue`).
 * Lookup keys for `endpointMeta` / `endpointSchemas` remain case-insensitive.
 */
function apiEndpointShortPathAndLookupKey(
	fullPath: string,
	pluginId: string,
): { shortPath: string; lookupKey: string } {
	const lower = fullPath.toLowerCase();
	const pid = pluginId.toLowerCase();
	if (!lower.startsWith(`${pid}.`)) {
		const remainder = lower.slice(pluginId.length + 1);
		let ep = remainder.startsWith('.') ? remainder.slice(1) : remainder;
		if (ep.startsWith('api.')) {
			ep = ep.slice(4);
		}
		return { shortPath: ep, lookupKey: ep };
	}
	let rest = fullPath.slice(pluginId.length + 1);
	if (rest.toLowerCase().startsWith('api.')) {
		rest = rest.slice(4);
	}
	return { shortPath: rest, lookupKey: rest.toLowerCase() };
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

export function getSchema(
	plugins: readonly CorsairPlugin[],
	path: string,
): string {
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
							parts.push(
								`payload ${formatDocSchemaShape(zodToDocSchemaShape(schemas.payload))}`,
							);
						}
						if (responseTypeStr) {
							parts.push(`response: ${responseTypeStr}`);
						}
						parts.push(
							`usage:\n${buildWebhookUsageExample(pluginId, originalPathParts)}`,
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
					parts.push(
						`input ${formatDocSchemaShape(zodToDocSchemaShape(schemas.input))}`,
					);
				}
				if (schemas?.output) {
					parts.push(
						`output ${formatDocSchemaShape(zodToDocSchemaShape(schemas.output))}`,
					);
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
// Docs-only introspection (structured I/O for documentation generators)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One row in an input/output table — typically a top-level Zod object property.
 * Nested shapes are collapsed into {@link DocSchemaFieldRow.type} via `zodToInlineType`
 * so tables stay scannable.
 */
export type DocSchemaFieldRow = {
	key: string;
	optional: boolean;
	/** TypeScript-like type string (nested objects stay on one line) */
	type: string;
	description?: string;
};

/**
 * Either an object broken out as field rows, or a single inline type (arrays, unions, etc.).
 */
export type DocSchemaShape =
	| { kind: 'object'; fields: DocSchemaFieldRow[] }
	| { kind: 'inline'; type: string };

export type DocsApiEndpoint = {
	path: string;
	/** Dot path after `plugin.api.` (e.g. `messages.post`) */
	shortPath: string;
	description?: string;
	riskLevel?: EndpointRiskLevel;
	irreversible?: boolean;
	/** The long job this operation starts, when its plugin declares one. */
	job?: EndpointJob;
	input: DocSchemaShape;
	output: DocSchemaShape;
};

export type DocsWebhook = {
	path: string;
	description?: string;
	payload: DocSchemaShape;
	responseType?: string;
	/** Ready-to-paste `webhookHooks` snippet (same idea as `get_schema` text output) */
	usageExample: string;
};

export type DocsDbFilterField = {
	field: string;
	type: 'string' | 'number' | 'boolean' | 'date';
	operators: readonly string[];
};

export type DocsDbEntity = {
	path: string;
	entityName: string;
	/** Always includes the synthetic `entity_id` row first, then entity filter fields */
	filters: DocsDbFilterField[];
};

export type PluginDocsIntrospection = {
	pluginId: string;
	api: DocsApiEndpoint[];
	webhooks: DocsWebhook[];
	db: DocsDbEntity[];
};

export type IntrospectPluginForDocsResult =
	| { ok: true; data: PluginDocsIntrospection }
	| { ok: false; error: string };

function unwrapZodForDocs(schema: ZodTypeAny): ZodTypeAny {
	let current = schema;
	for (;;) {
		const def = getZodDef(current);
		const typeName = getZodTypeName(def);
		if (isOptionalish(typeName)) {
			const inner = getZodInner(def);
			if (!inner) return current;
			current = inner;
			continue;
		}
		if (typeName === 'ZodLazy') {
			const target = getZodLazyTarget(def);
			if (!target || target === current) return current;
			current = target;
			continue;
		}
		return current;
	}
}

/** The value a `.default()` on the way in supplies, if there is one. */
// unknown: a default is whatever the field's own type is (number, string,
// array, object); callers only JSON.stringify it.
function findDefault(schema: ZodTypeAny): { value: unknown } | undefined {
	let current: ZodTypeAny | undefined = schema;
	while (current) {
		const def = getZodDef(current);
		const typeName = getZodTypeName(def);
		if (typeName === 'ZodDefault') {
			const raw = def.defaultValue;
			// zod 3 stores a function; zod 4 a value (read through a getter).
			return { value: typeof raw === 'function' ? raw() : raw };
		}
		if (!isOptionalish(typeName)) return undefined;
		current = getZodInner(def);
	}
	return undefined;
}

const MAX_DEFAULT_TEXT = 40;

/** `Defaults to 10.` appended to an input description, unless it already says so. */
function describeDefault(
	description: string | undefined,
	// unknown: the default from findDefault, any JSON value; it is only stringified.
	value: unknown,
): string | undefined {
	if (description && /\bdefault/i.test(description)) return description;
	const text = JSON.stringify(value);
	if (text === undefined || text.length > MAX_DEFAULT_TEXT) return description;
	const sentence = `Defaults to ${text}.`;
	if (!description) return sentence;
	const trimmed = description.trimEnd();
	return `${trimmed}${/[.!?]$/.test(trimmed) ? '' : '.'} ${sentence}`;
}

function zodToDocSchemaShape(
	schema: ZodTypeAny | undefined,
	side: 'input' | 'output' = 'output',
): DocSchemaShape {
	if (schema === undefined) {
		return { kind: 'inline', type: 'unknown' };
	}
	const base = unwrapZodForDocs(schema);
	const def = getZodDef(base);
	const typeName = getZodTypeName(def);
	if (typeName === 'ZodObject') {
		const shape = getZodShape(base, def);
		const fields: DocSchemaFieldRow[] = [];
		for (const [key, val] of Object.entries(shape)) {
			let description = collectZodDescription(val);
			// An input with a `.default()` can be left out; say what it falls back to.
			const fallback = side === 'input' ? findDefault(val) : undefined;
			if (fallback) description = describeDefault(description, fallback.value);
			fields.push({
				key,
				// Only `.optional()` (or, on inputs, `.default()`) makes a key optional;
				// `.nullable()` keeps it required and shows up as `| null` instead.
				optional: hasOptionalWrapper(val) || fallback !== undefined,
				type: zodToInlineType(val),
				...(description !== undefined ? { description } : {}),
			});
		}
		return { kind: 'object', fields };
	}
	// zodToInlineType unwraps `.optional()` itself and keeps `| null`.
	return { kind: 'inline', type: zodToInlineType(schema) };
}

/**
 * Renders a {@link DocSchemaShape} as a TypeScript-like block with `// description`
 * comments on each field row. Used by `getSchema`, catalog builders, and hosted MCP.
 */
export function formatDocSchemaShape(
	shape: DocSchemaShape | undefined,
	depth = 0,
): string {
	if (shape === undefined) return '{}';
	if (shape.kind === 'inline') return shape.type;
	if (shape.kind === 'object') {
		if (shape.fields.length === 0) return '{}';
		const pad = INDENT.repeat(depth + 1);
		const closePad = INDENT.repeat(depth);
		const lines = shape.fields.map((field) => {
			const key = field.optional ? `${field.key}?` : field.key;
			const comment = field.description ? `  // ${field.description}` : '';
			return `${pad}${key}: ${field.type}${comment}`;
		});
		return `{\n${lines.join('\n')}\n${closePad}}`;
	}
	return 'unknown';
}

/**
 * Returns structured API, webhook, and DB operation metadata for a single plugin.
 * Intended for **documentation generators** inside the Corsair repo (or tooling that depends
 * on `corsair` as a library). It does not shell out to the CLI and does not require a
 * `corsair.ts` file — pass the same `plugins` array you pass to `createCorsair`.
 *
 * Input/output shapes favour **small tables**: top-level object keys become rows; nested
 * objects are rendered as compact inline types so pages do not overwhelm readers.
 */
export function introspectPluginForDocs(
	plugins: readonly CorsairPlugin[],
	pluginId: string,
): IntrospectPluginForDocsResult {
	const apiListResult = listOperations(plugins, {
		plugin: pluginId,
		type: 'api',
	});
	if (typeof apiListResult === 'string') {
		return { ok: false, error: apiListResult };
	}
	if (!Array.isArray(apiListResult)) {
		return {
			ok: false,
			error:
				'list_operations did not return a path array — pass a configured plugin id.',
		};
	}

	const plugin = plugins.find((p) => p.id === pluginId);
	if (!plugin) {
		return {
			ok: false,
			error: `Plugin "${pluginId}" is not configured on this instance.`,
		};
	}

	const api: DocsApiEndpoint[] = [];
	for (const path of apiListResult) {
		const { shortPath, lookupKey } = apiEndpointShortPathAndLookupKey(
			path,
			pluginId,
		);

		const meta = findEndpointCaseInsensitive(
			plugin.endpointMeta as Record<string, EndpointMetaEntry> | undefined,
			lookupKey,
		);
		const schemas = findEndpointCaseInsensitive(
			plugin.endpointSchemas,
			lookupKey,
		);
		if (!meta && !schemas) continue;

		api.push({
			path,
			shortPath,
			description: meta?.description,
			riskLevel: meta?.riskLevel,
			irreversible: meta?.irreversible,
			...(meta?.job ? { job: meta.job } : {}),
			input: zodToDocSchemaShape(schemas?.input, 'input'),
			output: zodToDocSchemaShape(schemas?.output),
		});
	}
	api.sort((a, b) => a.path.localeCompare(b.path));

	const webhooks: DocsWebhook[] = [];
	const whListResult = listOperations(plugins, {
		plugin: pluginId,
		type: 'webhooks',
	});
	if (Array.isArray(whListResult) && plugin.webhooks) {
		for (const path of whListResult) {
			const normalised = path.toLowerCase();
			const remainder = normalised.slice(pluginId.length + 1);
			const rest = remainder.startsWith('.') ? remainder.slice(1) : remainder;
			if (!rest.startsWith('webhooks.')) continue;
			const webhookPathNormalised = rest.slice(9);
			const originalPathParts = resolveWebhookPathOriginalCase(
				plugin.webhooks as Record<string, unknown>,
				webhookPathNormalised.split('.'),
			);
			if (originalPathParts === null) continue;
			const originalPath = originalPathParts.join('.');
			const ws = findEndpointCaseInsensitive(
				plugin.webhookSchemas,
				originalPath.toLowerCase(),
			);
			const responseTypeStr = ws?.response
				? zodToInlineType(ws.response)
				: undefined;
			webhooks.push({
				path,
				description: ws?.description,
				payload: zodToDocSchemaShape(ws?.payload),
				responseType: responseTypeStr,
				usageExample: buildWebhookUsageExample(pluginId, originalPathParts),
			});
		}
	}
	webhooks.sort((a, b) => a.path.localeCompare(b.path));

	const db: DocsDbEntity[] = [];
	const dbListResult = listOperations(plugins, {
		plugin: pluginId,
		type: 'db',
	});
	const entities = (
		plugin.schema as CorsairPluginSchema<Record<string, ZodTypeAny>> | undefined
	)?.entities;

	if (Array.isArray(dbListResult) && entities) {
		for (const path of dbListResult) {
			const normalised = path.toLowerCase();
			const remainder = normalised.slice(pluginId.length + 1);
			const rest = remainder.startsWith('.') ? remainder.slice(1) : remainder;
			if (!rest.startsWith('db.')) continue;
			const dbPath = rest.slice(3);
			const lastDot = dbPath.lastIndexOf('.');
			if (lastDot === -1) continue;
			const entityNameLower = dbPath.slice(0, lastDot);
			const method = dbPath.slice(lastDot + 1);
			if (method !== 'search') continue;
			const entry = findEntityCaseInsensitive(entities, entityNameLower);
			if (!entry) continue;
			const [entityName, entitySchema] = entry;
			const ff = buildFilterableFields(entitySchema);
			const entityFilters: DocsDbFilterField[] = Object.entries(ff).map(
				([field, info]) => ({
					field,
					type: info.type,
					operators: info.operators,
				}),
			);
			db.push({
				path,
				entityName,
				filters: [
					{
						field: 'entity_id',
						type: 'string',
						operators: STRING_OPERATORS,
					},
					...entityFilters,
				],
			});
		}
	}
	db.sort((a, b) => a.path.localeCompare(b.path));

	return {
		ok: true,
		data: { pluginId, api, webhooks, db },
	};
}
