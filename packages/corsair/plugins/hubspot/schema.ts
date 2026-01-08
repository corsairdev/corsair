/**
 * Default database schema for HubSpot plugin
 * This defines the structure of tables that can be created for HubSpot data
 */

export const hubspotDefaultSchema = {
	contacts: {
		id: 'string',
		properties: 'string', // JSON string
		created_at: 'string',
		updated_at: 'string',
		archived: 'boolean',
	} as const,
	companies: {
		id: 'string',
		properties: 'string', // JSON string
		created_at: 'string',
		updated_at: 'string',
		archived: 'boolean',
	} as const,
	deals: {
		id: 'string',
		properties: 'string', // JSON string
		created_at: 'string',
		updated_at: 'string',
		archived: 'boolean',
	} as const,
	tickets: {
		id: 'string',
		properties: 'string', // JSON string
		created_at: 'string',
		updated_at: 'string',
		archived: 'boolean',
	} as const,
	engagements: {
		id: 'string',
		engagement: 'string', // JSON string
		associations: 'string', // JSON string
		metadata: 'string', // JSON string
		created_at: 'string',
	} as const,
} as const;

export type HubSpotDefaultSchema = typeof hubspotDefaultSchema;

/**
 * Schema override options for each table
 */
export type HubSpotSchemaOverrideValue<
	TTableName extends keyof HubSpotDefaultSchema,
> =
	| boolean
	| ((
			dbSchema: HubSpotDefaultSchema,
	  ) => Record<string, string | boolean | number>);

/**
 * Schema override configuration
 */
export type HubSpotSchemaOverride = {
	[K in keyof HubSpotDefaultSchema]?: HubSpotSchemaOverrideValue<K>;
};

/**
 * Resolved schema after applying overrides
 */
export type ResolvedHubSpotSchema<TOverride extends HubSpotSchemaOverride> = {
	[K in keyof HubSpotDefaultSchema]: TOverride[K] extends false
		? never
		: TOverride[K] extends true
			? HubSpotDefaultSchema[K]
			: TOverride[K] extends (schema: HubSpotDefaultSchema) => infer R
				? R extends Record<string, string | boolean | number>
					? R
					: HubSpotDefaultSchema[K]
				: HubSpotDefaultSchema[K];
};

