import type { ZodType } from 'zod';

/**
 * Builds a schema on first call and caches it. The plugin has 237 operations
 * over a large generated model set; building them all at import cost ~40 MB
 * of heap in every process that loads the plugin.
 */
export function lazySchema<T extends ZodType>(build: () => T): () => T {
	let cached: T | undefined;
	return () => {
		cached ??= build();
		return cached;
	};
}

/** An `endpointSchemas` entry whose `input` and `output` are built when read. */
export function lazySchemaEntry<I extends ZodType, O extends ZodType>(
	input: () => I,
	output: () => O,
): { readonly input: I; readonly output: O } {
	return {
		get input() {
			return input();
		},
		get output() {
			return output();
		},
	};
}
