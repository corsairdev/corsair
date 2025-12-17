import type { DBFieldAttribute } from './type';

/**
 * A schema fragment that an integration/plugin can contribute.
 *
 * Mirrors Better Auth's plugin schema merge model:
 * - keys are logical table keys (e.g. "slackMember")
 * - modelName can override the final DB table/model name
 * - fields are merged with core + other plugins by key
 */
export type CorsairPluginDBSchema = {
	[table in string]: {
		fields: {
			[field: string]: DBFieldAttribute;
		};
		disableMigration?: boolean | undefined;
		modelName?: string | undefined;
	};
};

export type CorsairDBPlugin = {
	id: string;
	/**
	 * Schema the plugin needs. This will be merged into the core tables.
	 */
	schema?: CorsairPluginDBSchema | undefined;
	/**
	 * Optional type inference hook for consumers.
	 */
	$Infer?: Record<string, any> | undefined;
};
