/**
 * RudderStack is the source of truth for every transformation, library and
 * revision this plugin touches. A revision's code changes whenever anyone edits it
 * in the dashboard, and publishing is a deliberate act, so a cached copy would be
 * misleading. Nothing is persisted and no entities are declared.
 */
export const RudderStackTransformationSchema = {
	version: '1.0.0',
	entities: {},
} as const;
