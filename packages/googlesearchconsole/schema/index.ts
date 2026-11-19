/**
 * Search Console is read live: every query, inspection and sitemap read is
 * answered by Google at the moment of the call, and the data it reports changes
 * daily. Nothing is mirrored locally, so there are no entities.
 */
export const GoogleSearchConsoleSchema = {
	version: '1.0.0',
	entities: {},
} as const;
