import type { FormFieldSchema } from 'corsair';
import { z } from 'zod';

/**
 * Converts the machine-readable schema from Corsair's `getStructuredSchema`
 * into a Zod schema, so a Corsair operation can back a Mastra `createTool`
 * `inputSchema`. Applies the field's `description` and `optional` flag on top of
 * its base type.
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
