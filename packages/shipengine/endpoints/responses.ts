import { z } from 'zod';

/**
 * ShipEngine's live API returns more than its OpenAPI contract lists: extra
 * fields (`description`, `send_rates`, `tax_identifiers`...), nulls in fields the
 * contract marks as non-null strings, list envelopes without `request_id`, and
 * enum values added after the contract was published. The strict generated
 * schemas stay the documented contract (inputs and docs use them); responses are
 * parsed with a lenient copy so a read never fails on a field the caller did not
 * ask about.
 */
export type ShipEngineResponse<T> = T extends readonly (infer Item)[]
	? ShipEngineResponse<Item>[]
	: T extends string
		? T | (string & {})
		: T extends object
			? {
					[K in keyof T]?: ShipEngineResponse<T[K]> | null;
				} & {
					// `unknown` because ShipEngine may add response fields the contract does not list yet.
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
	// Format checks (ShipEngine id patterns, min lengths, date-time) describe what
	// ShipEngine accepts; responses carry values such as `batch_id: ""`.
	if (schema instanceof z.ZodString) return z.string();
	if (schema instanceof z.ZodNumber) return z.number();
	// Booleans, JSON values and `undefined` are kept as generated.
	return schema instanceof z.ZodType ? schema : z.unknown();
}
