import { z } from 'zod';

// Pipedrive's OpenAPI marks fields non-null and closes enums that real accounts break
// (live run 11-23: null colors and timestamps, `data: null` on empty lists, field types
// missing from the spec). Catalog responses are parsed through a relaxed copy of the
// generated schema: any property may be null or missing, enum literals also accept their
// base type, number formats are not enforced, and objects keep unknown keys. Inputs keep
// the strict generated schema.
export type RelaxedResponse<T> = T extends string
	? string
	: T extends number
		? number
		: T extends boolean
			? boolean
			: T extends readonly (infer U)[]
				? RelaxedResponse<U>[]
				: T extends object
					? { [K in keyof T]?: RelaxedResponse<T[K]> | null } & {
							[key: string]: unknown;
						}
					: T;

const relaxedSchemas = new WeakMap<z.core.$ZodType, z.ZodType>();

function baseOfLiteral(
	// `unknown` because literal values can be any JSON primitive.
	value: unknown,
): z.ZodType | undefined {
	if (typeof value === 'string') return z.string();
	if (typeof value === 'number') return z.number();
	if (typeof value === 'boolean') return z.boolean();
	return undefined;
}

function relax(schema: z.core.$ZodType): z.ZodType {
	const cached = relaxedSchemas.get(schema);
	if (cached) return cached;
	const result = buildRelaxed(schema);
	relaxedSchemas.set(schema, result);
	return result;
}

function buildRelaxed(schema: z.core.$ZodType): z.ZodType {
	if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
		const inner = relax(schema.unwrap());
		return schema instanceof z.ZodOptional
			? inner.optional()
			: inner.nullable();
	}
	if (schema instanceof z.ZodObject) {
		const shape: Record<string, z.ZodType> = {};
		for (const [key, value] of Object.entries(schema.shape)) {
			shape[key] = relax(value).nullable().optional();
		}
		const catchall = schema._zod.def.catchall;
		const keepsUnknownKeys =
			catchall === undefined || catchall instanceof z.ZodNever;
		return keepsUnknownKeys
			? z.object(shape).passthrough()
			: z.object(shape).catchall(relax(catchall));
	}
	if (schema instanceof z.ZodArray) {
		return z.array(relax(schema.element));
	}
	if (schema instanceof z.ZodUnion) {
		const options: readonly z.core.$ZodType[] = schema.options;
		if (options.every((option) => option instanceof z.ZodLiteral)) {
			// An enum: keep its documented values and accept each base type once.
			const values = options.flatMap((option) =>
				option instanceof z.ZodLiteral ? [...option.values] : [],
			);
			const baseTypes = new Map<string, z.ZodType>();
			for (const value of values) {
				const base = baseOfLiteral(value);
				if (base) baseTypes.set(typeof value, base);
			}
			return [...baseTypes.values()].reduce<z.ZodType>(
				(union, base) => union.or(base),
				schema,
			);
		}
		const relaxedOptions = options.map((option) => relax(option));
		return relaxedOptions.reduce((union, option) => union.or(option));
	}
	if (schema instanceof z.ZodLiteral) {
		const bases = [...schema.values]
			.map((value) => baseOfLiteral(value))
			.filter((base): base is z.ZodType => base !== undefined);
		return bases.reduce<z.ZodType>((union, base) => union.or(base), schema);
	}
	if (schema instanceof z.ZodString) return z.string();
	if (schema instanceof z.ZodNumber) return z.number();
	if (schema instanceof z.ZodRecord) {
		return z.record(schema.keyType, relax(schema.valueType));
	}
	if (schema instanceof z.ZodLazy) {
		const getter = schema._zod.def.getter;
		return z.lazy(() => relax(getter()));
	}
	// Booleans, unknown values and nulls pass through unchanged.
	return schema instanceof z.ZodType ? schema : z.unknown();
}

export function relaxResponseSchema<S extends z.ZodType>(
	schema: S,
): z.ZodType<RelaxedResponse<z.output<S>>> {
	// The relaxed copy accepts every value the generated schema does plus nulls and new enum values.
	return relax(schema) as z.ZodType<RelaxedResponse<z.output<S>>>;
}
