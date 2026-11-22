import { z } from 'zod';

/*
 * The model schemas are generated from Intuit's model catalog, which lists
 * only some of each entity's fields and models several fields with the wrong
 * shape (single objects that arrive as arrays, enums Intuit extends). They stay
 * the documented contract in `endpointSchemas` and the docs. At runtime:
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
const requestCache = new WeakMap<AnySchema, AnySchema>();
const inputCache = new WeakMap<AnySchema, AnySchema>();

// Each def is read through `_zod.def` because zod has no public visitor; the cast narrows it per type below.
type Def = { type: string } & Record<string, unknown>;
function defOf(schema: AnySchema): Def {
	return (schema as unknown as { _zod: { def: Def } })._zod.def;
}

const leaf = {
	string: () => z.union([z.string(), z.number()]),
	number: () => z.union([z.number(), z.string()]),
	boolean: () => z.union([z.boolean(), z.string()]),
};

function lenient(schema: AnySchema, top: boolean): AnySchema {
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
					top && name !== 'time' && defOf(field).type !== 'optional';
				fields[name] = required ? inner : inner.nullish();
			}
			const object = z.looseObject(fields);
			out = top ? object : z.union([object, z.array(object)]);
			break;
		}
		case 'array': {
			const item = lenient((schema as z.ZodArray<AnySchema>).element, false);
			out = z.union([z.array(item), item]);
			break;
		}
		case 'union': {
			const options = (def.options as AnySchema[]).map((option) =>
				lenient(option, top),
			);
			out = z.union(options as [AnySchema, AnySchema, ...AnySchema[]]);
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
			out = lenient(def.innerType as AnySchema, top).nullish();
			break;
		case 'record':
			out = z.record(z.string(), lenient(def.valueType as AnySchema, false));
			break;
		case 'enum':
		case 'literal':
			out = z.union([z.string(), z.number(), z.boolean()]);
			break;
		case 'string':
		case 'number':
		case 'boolean':
			out = leaf[def.type]();
			break;
		default:
			out = schema;
	}
	if (!top) lenientCache.set(schema, out);
	return out;
}

/** Lenient copy of an operation's documented response schema, used to parse what QuickBooks returns. */
export function responseSchema(schema: AnySchema): AnySchema {
	let cached = responseCache.get(schema);
	if (!cached) {
		cached = lenient(schema, true);
		responseCache.set(schema, cached);
	}
	return cached;
}

function looseBody(schema: AnySchema, nested: boolean): AnySchema {
	const cached = requestCache.get(schema);
	if (cached && nested) return cached;
	const def = defOf(schema);
	let out: AnySchema;
	switch (def.type) {
		case 'object': {
			const shape = (schema as z.ZodObject).shape as Record<string, AnySchema>;
			const fields: Record<string, AnySchema> = {};
			for (const [name, field] of Object.entries(shape)) {
				const inner = looseBody(field, true);
				fields[name] = nested && name === 'Id' ? inner.optional() : inner;
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
	bodyKeys: readonly string[] = ['body'],
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
