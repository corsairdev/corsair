/**
 * Google Photos is read live: every search, album list and media item comes
 * from Google, and a photo library changes constantly. Nothing is mirrored
 * locally, so there are no entities.
 */
export const GooglePhotosSchema = {
	version: '1.0.0',
	entities: {},
} as const;
