import type { z } from 'zod';

/**
 * Validates an endpoint's input against its zod schema at runtime. The Corsair
 * binder passes caller args straight through, so each endpoint enforces its
 * own contract before any request leaves.
 */
export function parseEndpointInput<SchemaT extends z.ZodType>(
	schema: SchemaT,
	input: unknown,
): z.output<SchemaT> {
	return schema.parse(input);
}
