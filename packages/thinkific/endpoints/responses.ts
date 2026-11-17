import { z } from 'zod';

/**
 * Thinkific's OpenAPI export marks no field nullable and lists every field it returns, but the API
 * sends `null` for unset values (`next_page`, `completed_at`, `avatar_url`, a coupon's `note`),
 * decimals as strings (`"49.0"`) and fields the export leaves out. The generated schemas stay
 * the documented contract (inputs and the generated docs use them); responses are parsed with a
 * lenient copy so a read, or a write that already happened, never fails on a field the caller
 * did not ask about. Values are returned as Thinkific sent them.
 */
type ThinkificScalar<T> = T extends boolean
	? boolean
	: T extends number
		? number | string
		: T extends string
			? string | number
			: T;

export type ThinkificResponse<T> = T extends undefined
	? undefined
	: T extends readonly (infer Item)[]
		? ThinkificResponse<Item>[]
		: T extends string | number | boolean
			? ThinkificScalar<T>
			: T extends object
				? {
						[K in keyof T]?: ThinkificResponse<T[K]> | null;
					} & {
						// `unknown` because Thinkific returns fields its OpenAPI export does not list.
						[key: string]: unknown;
					}
				: T;

const stringLike = z.union([z.string(), z.number()]);
const numberLike = z.union([z.number(), z.string()]);

/**
 * Operations documented without a response body (204, or 201/200 with no content). The status
 * already says the write landed, so an empty string, `null` or a small body is not an error.
 */
const noContent = z.unknown().transform(() => undefined);

/** Builds the lenient response copy of one generated output schema. */
export function toThinkificResponseSchema(schema: z.core.$ZodType): z.ZodType {
	if (schema instanceof z.ZodUndefined) return noContent;
	if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
		return toThinkificResponseSchema(schema.unwrap()).nullish();
	}
	if (schema instanceof z.ZodObject) {
		const shape: Record<string, z.ZodType> = {};
		for (const [key, value] of Object.entries(schema.shape)) {
			shape[key] = toThinkificResponseSchema(value).nullish();
		}
		return z.looseObject(shape);
	}
	if (schema instanceof z.ZodArray) {
		return z.array(toThinkificResponseSchema(schema.element));
	}
	if (schema instanceof z.ZodRecord) {
		return z.record(z.string(), toThinkificResponseSchema(schema.valueType));
	}
	if (schema instanceof z.ZodUnion) {
		const options: readonly z.core.$ZodType[] = schema.options;
		return z.union(options.map((option) => toThinkificResponseSchema(option)));
	}
	const type = schema._zod.def.type;
	if (type === 'number') return numberLike;
	// Strings, datetimes and enums: Thinkific adds enum values and sends numbers in some string fields.
	if (type === 'string' || type === 'enum' || type === 'literal') {
		return stringLike;
	}
	// Booleans and JSON values are kept as generated. `z.unknown()` is only the fallback for a
	// non-Zod input, which accepts any value the way the generated schema would have.
	return schema instanceof z.ZodType ? schema : z.unknown();
}

const responseSchemas = new WeakMap<z.core.$ZodType, z.ZodType>();

/** Parses one Thinkific response with the lenient copy of the operation's output schema. */
export function parseThinkificResponse<Output>(
	operation: string,
	// The generated output schema; `Output` is its documented output type.
	schema: z.core.$ZodType,
	// `unknown` because the provider response is untrusted until the schema parses it.
	value: unknown,
): ThinkificResponse<Output> {
	let lenient = responseSchemas.get(schema);
	if (!lenient) {
		lenient = toThinkificResponseSchema(schema);
		responseSchemas.set(schema, lenient);
	}
	const result = lenient.safeParse(value);
	if (!result.success) {
		// Paths only: response values hold learner names, emails and order data.
		const paths = result.error.issues
			.slice(0, 5)
			.map((issue) => issue.path.join('.') || '(root)')
			.join(', ');
		throw new Error(
			`Thinkific returned an unexpected response for ${operation} at ${paths}`,
		);
	}
	// The lenient schema is built from `schema`, so its output has the ThinkificResponse<Output> shape.
	return result.data as ThinkificResponse<Output>;
}
