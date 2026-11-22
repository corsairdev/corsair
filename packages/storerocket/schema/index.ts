/**
 * Storerocket has no read models Corsair should persist: locations and
 * special-hours rules are read live and the API is the source of truth for
 * the widget. So no entities are declared.
 */
export const StorerocketSchema = {
	version: '1.0.0',
	entities: {},
} as const;
