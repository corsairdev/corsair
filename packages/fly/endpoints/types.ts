import type { z } from 'zod';
import { operations } from './operations';

const byPath = (
	pick: (definition: { input: z.ZodType; output: z.ZodType }) => z.ZodType,
) =>
	Object.fromEntries(
		Object.entries(operations).flatMap(([group, entries]) =>
			Object.entries(entries).map(([name, definition]) => [
				`${group}.${name}`,
				pick(definition),
			]),
		),
	);

/** Input and output schemas keyed by `group.operation`, defined beside each operation. */
export const FlyEndpointInputSchemas = byPath((definition) => definition.input);
export const FlyEndpointOutputSchemas = byPath(
	(definition) => definition.output,
);
