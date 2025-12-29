import type { CorsairPluginDBSchema } from './schema/types';

export type CorsairPlugin = {
	id: string;

	/**
	 * Plugin-provided schema additions (tables/fields).
	 */
	schema?: CorsairPluginDBSchema | undefined;

	/**
	 * Runtime surface area the plugin adds to the `corsair()` instance.
	 *
	 * Return an object that will be shallow-merged onto the instance.
	 */
	setup?: (ctx: { options: any }) => Record<string, any>;

	/**
	 * Type-only surface. This is never used at runtime.
	 */
	$Infer?: Record<string, any>;
};
