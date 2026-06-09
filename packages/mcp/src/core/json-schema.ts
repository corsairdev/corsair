import { z } from 'zod';
import type { ZodRawShape } from 'zod';
import * as z4mini from 'zod/v4-mini';

/** Convert a Zod v4 raw shape to JSON Schema for tool parameter definitions. */
export function shapeToJsonSchema(shape: ZodRawShape): Record<string, unknown> {
	return z4mini.toJSONSchema(z.object(shape), {
		target: 'draft-7',
		io: 'input',
	}) as Record<string, unknown>;
}
