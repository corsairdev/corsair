import { z } from 'zod';

/*
 * The model schemas are generated from Intuit's model catalog, which lists
 * only some of each entity's fields and models several fields with the wrong
 * shape (single objects that arrive as arrays, enums Intuit extends). Output
 * schemas stay the documented contract in `endpointSchemas` and the docs; the
 * published input schemas are the request checks below. At runtime:
 * - responses are parsed with a lenient copy, so a QuickBooks record that
 *   carries a field or shape the catalog lacks still reaches the caller
 *   (above all after a write that already happened);
 * - request bodies keep their documented fields and types but accept the other
 *   fields Intuit documents for the entity, and nested line `Id`s are optional
 *   because QuickBooks assigns them on create.
 */

type AnySchema = z.ZodType;

const lenientCache = new WeakMap<AnySchema, AnySchema>();
const responseCache = new WeakMap<AnySchema, AnySchema>();
const writeResponseCache = new WeakMap<AnySchema, AnySchema>();
const requestCache = new WeakMap<AnySchema, AnySchema>();
const inputCache = new WeakMap<AnySchema, AnySchema>();

// Each def is read through `_zod.def` because zod has no public visitor; the cast narrows it per type below.
type Def = { type: string } & Record<string, unknown>;
function defOf(schema: AnySchema): Def {
	return (schema as unknown as { _zod: { def: Def } })._zod.def;
}

// Provider-defined leaf value; the catalog types several references and amounts as plain strings or numbers.
const anyLeaf = z.unknown();

function lenient(
	schema: AnySchema,
	top: boolean,
	requireEnvelope = true,
): AnySchema {
	if (!top) {
		const cached = lenientCache.get(schema);
		if (cached) return cached;
	}
	const def = defOf(schema);
	let out: AnySchema;
	switch (def.type) {
		case 'object': {
			const shape = (schema as z.ZodObject).shape as Record<string, AnySchema>;
			const fields: Record<string, AnySchema> = {};
			for (const [name, field] of Object.entries(shape)) {
				const inner = lenient(field, false);
				// The envelope key (`Invoice`, `QueryResponse`) stays required; `time` and everything below may be absent.
				const required =
					top &&
					requireEnvelope &&
					name !== 'time' &&
					defOf(field).type !== 'optional';
				fields[name] = required ? inner : inner.nullish();
			}
			out = z.looseObject(fields);
			break;
		}
		case 'array': {
			const item = lenient((schema as z.ZodArray<AnySchema>).element, false);
			// A list QuickBooks sends as one bare item comes back wrapped, matching the declared type.
			out = z.preprocess(
				(value) =>
					value === undefined || value === null || Array.isArray(value)
						? value
						: [value],
				z.array(item),
			);
			break;
		}
		case 'union': {
			const options = def.options as AnySchema[];
			out = top
				? z.union(
						options.map((option) => lenient(option, top, requireEnvelope)) as [
							AnySchema,
							AnySchema,
							...AnySchema[],
						],
					)
				: lenientUnion(options);
			break;
		}
		case 'lazy': {
			const getter = def.getter as () => AnySchema;
			out = z.lazy(() => lenient(getter(), false));
			break;
		}
		case 'optional':
		case 'nullable':
		case 'default':
		case 'prefault':
		case 'readonly':
		case 'catch':
			out = lenient(def.innerType as AnySchema, top, requireEnvelope).nullish();
			break;
		case 'record':
			out = z.record(z.string(), lenient(def.valueType as AnySchema, false));
			break;
		case 'enum':
		case 'literal':
		case 'string':
		case 'number':
		case 'boolean':
			// A whole response that is one value (a download URL) keeps its check.
			out = top ? schema : anyLeaf;
			break;
		default:
			out = schema;
	}
	if (!top) lenientCache.set(schema, out);
	return out;
}

function objectKeys(schema: AnySchema): string[] {
	const def = defOf(schema);
	if (def.type === 'object') return Object.keys((schema as z.ZodObject).shape);
	if (def.type === 'optional' || def.type === 'nullable') {
		return objectKeys(def.innerType as AnySchema);
	}
	return [];
}

/**
 * Lenient union: alternatives become loose, so zod's "first that parses" would
 * always pick the first one (a CDC row `{ Customer: [...] }` would land in the
 * empty or `Account` alternative). Try first the alternatives whose own keys
 * (not shared by every alternative) appear in the value, then the rest in order.
 */
function lenientUnion(options: AnySchema[]): AnySchema {
	const loose = options.map((option) => lenient(option, false));
	const keys = options.map(objectKeys);
	const shared = keys.reduce<string[]>(
		(common, list, index) =>
			index === 0 ? list : common.filter((key) => list.includes(key)),
		[],
	);
	const own = keys.map((list) => list.filter((key) => !shared.includes(key)));
	// unknown because the value is untrusted provider JSON until an alternative parses it.
	return z.unknown().transform((value, context) => {
		const present =
			value && typeof value === 'object' && !Array.isArray(value)
				? Object.keys(value)
				: [];
		const order = loose
			.map((_, index) => index)
			.sort(
				(a, b) =>
					Number((own[b] ?? []).some((key) => present.includes(key))) -
					Number((own[a] ?? []).some((key) => present.includes(key))),
			);
		for (const index of order) {
			const parsed = loose[index]?.safeParse(value);
			if (parsed?.success) return parsed.data;
		}
		context.addIssue({
			code: 'custom',
			message: 'The value matches none of the documented shapes',
		});
		return z.NEVER;
	});
}

/**
 * Lenient copy of an operation's documented response schema, used to parse
 * what QuickBooks returns. Reads keep their envelope key (`Invoice`,
 * `QueryResponse`) required; after a write (POST) nothing is required, so a
 * change QuickBooks already made always reaches the caller.
 */
export function responseSchema(
	schema: AnySchema,
	requireEnvelope = true,
): AnySchema {
	const cache = requireEnvelope ? responseCache : writeResponseCache;
	let cached = cache.get(schema);
	if (!cached) {
		cached = lenient(schema, true, requireEnvelope);
		cache.set(schema, cached);
	}
	return cached;
}

function isRequired(field: AnySchema | undefined): boolean {
	return field !== undefined && defOf(field).type !== 'optional';
}

function looseBody(schema: AnySchema, nested: boolean): AnySchema {
	const cached = requestCache.get(schema);
	if (cached && nested) return cached;
	const def = defOf(schema);
	let out: AnySchema;
	switch (def.type) {
		case 'object': {
			const shape = (schema as z.ZodObject).shape as Record<string, AnySchema>;
			// A body that names an existing record (update, sparse update, delete) needs only
			// Id, SyncToken and its fixed flags (`sparse: true`); QuickBooks validates the
			// rest of the entity itself. Without `sparse`, a sparse update would run as a
			// full update and clear the fields it leaves out.
			const identifiesRecord =
				!nested && isRequired(shape.Id) && isRequired(shape.SyncToken);
			const fields: Record<string, AnySchema> = {};
			for (const [name, field] of Object.entries(shape)) {
				const inner = looseBody(field, true);
				const keepsRequired =
					name === 'Id' ||
					name === 'SyncToken' ||
					defOf(field).type === 'literal';
				// Line and address Ids are assigned by QuickBooks; a nested { Id, SyncToken }
				// reference (a recurring template to delete) still needs its Id.
				const namesNestedRecord =
					nested && isRequired(shape.Id) && isRequired(shape.SyncToken);
				const optional =
					(nested && name === 'Id' && !namesNestedRecord) ||
					(identifiesRecord && !keepsRequired);
				fields[name] = optional ? inner.optional() : inner;
			}
			out = z.looseObject(fields);
			break;
		}
		case 'array':
			out = z.array(looseBody((schema as z.ZodArray<AnySchema>).element, true));
			break;
		case 'union': {
			const options = (def.options as AnySchema[]).map((option) =>
				looseBody(option, nested),
			);
			out = z.union(options as [AnySchema, AnySchema, ...AnySchema[]]);
			break;
		}
		case 'lazy': {
			const getter = def.getter as () => AnySchema;
			out = z.lazy(() => looseBody(getter(), true));
			break;
		}
		case 'optional':
			out = looseBody(def.innerType as AnySchema, nested).optional();
			break;
		case 'nullable':
			out = looseBody(def.innerType as AnySchema, nested).nullable();
			break;
		default:
			out = schema;
	}
	if (nested) requestCache.set(schema, out);
	return out;
}

/**
 * Copy of an operation's input schema whose top level stays strict (realm, ids,
 * query params) while the listed body fields accept the entity's other
 * documented fields.
 */
export function requestSchema(
	schema: AnySchema,
	// `metadata` is the Attachable sent with an upload.
	bodyKeys: readonly string[] = ['body', 'metadata'],
): AnySchema {
	const cached = inputCache.get(schema);
	if (cached) return cached;
	const def = defOf(schema);
	if (def.type !== 'object') return schema;
	const shape = (schema as z.ZodObject).shape as Record<string, AnySchema>;
	if (!bodyKeys.some((key) => key in shape)) return schema;
	const fields: Record<string, AnySchema> = {};
	for (const [name, field] of Object.entries(shape)) {
		fields[name] = bodyKeys.includes(name) ? looseBody(field, false) : field;
	}
	const out = z.strictObject(fields);
	inputCache.set(schema, out);
	return out;
}
