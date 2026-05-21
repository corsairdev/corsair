import type { AnyCorsairInstance } from 'corsair';
import { formatDocSchemaShape, getSchema } from 'corsair';

export { formatDocSchemaShape };

/**
 * Plain-text schema for a Corsair operation path, with `// description` notes
 * on each top-level input/output field (from Zod `.describe()`).
 */
export function formatGetSchemaResponse(
	corsair: AnyCorsairInstance,
	path: string,
): string {
	return getSchema(corsair, path);
}
