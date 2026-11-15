/**
 * Renderform is the source of truth for every template and render result, and a
 * result's `href` is what a caller shares or stores anyway. The render cache is
 * also Renderform's own, keyed by `version`, so keeping a second copy here would
 * duplicate a mechanism that already exists. Nothing is persisted and no entities
 * are declared.
 */
export const RenderformSchema = {
	version: '1.0.0',
	entities: {},
} as const;
