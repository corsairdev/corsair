/**
 * Storyblok is the system of record for the content, so mirroring it here would
 * duplicate a large, frequently edited dataset without a use for the copy.
 * `entities` stays empty for that reason.
 */
export const StoryblokSchema = {
	version: '1.0.0',
	entities: {},
} as const;
