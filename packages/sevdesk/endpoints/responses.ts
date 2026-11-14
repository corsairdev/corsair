import { z } from 'zod';

/**
 * Sevdesk's live API does not return the types its OpenAPI document lists: ids,
 * amounts and flags arrive as strings ("12.50", "0"), unset fields arrive as
 * null, and some fields the document types as strings are numbers. The
 * generated schemas stay the documented contract (inputs and the generated docs
 * use them); responses are parsed with a lenient copy so a read never fails on a
 * field the caller did not ask about. Values are returned as Sevdesk sent them.
 */
type SevdeskScalar<T> = T extends boolean
	? boolean | string | number
	: T extends number
		? number | string
		: T extends string
			? string | number
			: T;

export type SevdeskResponse<T> = T extends readonly (infer Item)[]
	? SevdeskResponse<Item>[]
	: T extends string | number | boolean
		? SevdeskScalar<T>
		: T extends object
			? {
					[K in keyof T]?: SevdeskResponse<T[K]> | null;
				} & {
					// `unknown` because Sevdesk returns fields its OpenAPI document does not list.
					[key: string]: unknown;
				}
			: T;

const stringLike = z.union([z.string(), z.number()]);
const numberLike = z.union([z.number(), z.string()]);
const booleanLike = z.union([z.boolean(), z.string(), z.number()]);

function scalarFor(value: unknown): z.ZodType {
	if (typeof value === 'number') return numberLike;
	if (typeof value === 'boolean') return booleanLike;
	return stringLike;
}

function isScalar(schema: z.core.$ZodType): boolean {
	return (
		schema instanceof z.ZodLiteral ||
		schema instanceof z.ZodEnum ||
		schema instanceof z.ZodString ||
		schema instanceof z.ZodNumber ||
		schema instanceof z.ZodBoolean
	);
}

function scalarSchema(schema: z.core.$ZodType): z.ZodType {
	if (schema instanceof z.ZodLiteral) return scalarFor([...schema.values][0]);
	if (schema instanceof z.ZodNumber) return numberLike;
	if (schema instanceof z.ZodBoolean) return booleanLike;
	// Strings, string enums and literal sets: Sevdesk adds values and sends numbers in string fields.
	return stringLike;
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
		if (options.every(isScalar)) {
			const hasNull = options.some(
				(option) => option instanceof z.ZodLiteral && option.values.has(null),
			);
			const kinds = new Set(
				options
					.filter(
						(option) =>
							!(option instanceof z.ZodLiteral && option.values.has(null)),
					)
					.map((option) => scalarSchema(option)),
			);
			const [only] = [...kinds];
			// Mixed numbers and strings stay `string | number`; booleans join only when an option is one.
			const base =
				kinds.size === 1 && only
					? only
					: kinds.has(booleanLike)
						? booleanLike
						: stringLike;
			return hasNull ? base.nullable() : base;
		}
		return z.union(options.map((option) => toResponseSchema(option)));
	}
	if (schema instanceof z.ZodIntersection) {
		// Both sides are checked, so both need the lenient copy (the reset answers and custom field settings use one).
		return z.intersection(
			toResponseSchema(schema.def.left),
			toResponseSchema(schema.def.right),
		);
	}
	if (isScalar(schema)) return scalarSchema(schema);
	// JSON values and `undefined` are kept as generated.
	return schema instanceof z.ZodType ? schema : z.unknown();
}

const responseSchemas = new WeakMap<z.core.$ZodType, z.ZodType>();

/** Parses one Sevdesk response with the lenient copy of the operation's output schema. */
export function parseSevdeskResponse<Output>(
	operation: string,
	schema: z.ZodType<Output>,
	// `unknown` because the provider response is untrusted until the schema parses it.
	value: unknown,
): SevdeskResponse<Output> {
	let lenient = responseSchemas.get(schema);
	if (!lenient) {
		lenient = toResponseSchema(schema);
		responseSchemas.set(schema, lenient);
	}
	const result = lenient.safeParse(value);
	if (!result.success) {
		// Paths only: response values can hold contacts, addresses and amounts.
		const paths = result.error.issues
			.slice(0, 5)
			.map((issue) => issue.path.join('.') || '(root)')
			.join(', ');
		throw new Error(
			`Sevdesk returned an unexpected response for ${operation} at ${paths}`,
		);
	}
	// The lenient schema is built from `schema`, so its output has the SevdeskResponse<Output> shape.
	return result.data as SevdeskResponse<Output>;
}
