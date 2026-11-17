import { z } from 'zod';

/**
 * The generated schemas mirror GetProspect's OpenAPI contract: required fields,
 * closed enums, id patterns, email and date-time formats. That contract stays
 * the documented shape (inputs and docs use it). Responses are parsed with a
 * lenient copy built here, so a read does not fail when the live API sends a
 * null, drops a field, adds an enum value or formats a value differently from
 * the contract.
 */
export type GetProspectResponse<T> = T extends readonly (infer Item)[]
	? GetProspectResponse<Item>[]
	: T extends string
		? T | (string & {})
		: T extends object
			? {
					[K in keyof T]?: GetProspectResponse<T[K]> | null;
				} & {
					// `unknown` because GetProspect may add response fields the contract does not list yet.
					[key: string]: unknown;
				}
			: T;

function isStringLiteralUnion(options: readonly z.core.$ZodType[]): boolean {
	return options.every(
		(option) =>
			option instanceof z.ZodLiteral &&
			[...option.values].every((value) => typeof value === 'string'),
	);
}

function literalBase(schema: z.ZodLiteral): z.ZodType {
	const [value] = [...schema.values];
	if (typeof value === 'number') return z.number();
	if (typeof value === 'boolean') return z.boolean();
	return z.string();
}

/** Builds the lenient response copy of one generated output schema. */
export function toResponseSchema(schema: z.core.$ZodType): z.ZodType {
	if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
		return toResponseSchema(schema.unwrap()).nullish();
	}
	if (schema instanceof z.ZodDefault) {
		return toResponseSchema(schema.unwrap()).nullish();
	}
	if (schema instanceof z.ZodObject) {
		const shape: Record<string, z.ZodType> = {};
		for (const [key, value] of Object.entries(schema.shape)) {
			shape[key] = toResponseSchema(value).nullish();
		}
		return z.looseObject(shape);
	}
	if (schema instanceof z.ZodArray) {
		return z.array(toResponseSchema(schema.element));
	}
	if (schema instanceof z.ZodRecord) {
		return z.record(z.string(), toResponseSchema(schema.valueType));
	}
	if (schema instanceof z.ZodUnion) {
		const options: readonly z.core.$ZodType[] = schema.options;
		if (isStringLiteralUnion(options)) return z.string();
		return z.union(options.map((option) => toResponseSchema(option)));
	}
	if (schema instanceof z.ZodEnum) return z.string();
	if (schema instanceof z.ZodLiteral) return literalBase(schema);
	// String formats (email, url, ISO date-time, id patterns) and number bounds
	// describe what GetProspect documents, not what every response carries.
	if (schema._zod.def.type === 'string') return z.string();
	if (schema._zod.def.type === 'number') return z.number();
	// Booleans, JSON values and `undefined` are kept as generated.
	return schema instanceof z.ZodType ? schema : z.unknown();
}
