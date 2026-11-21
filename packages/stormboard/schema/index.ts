/**
 * Stormboard has no read models Corsair should persist: storms and ideas
 * are read live from the workspace, and the API is the source of truth. So
 * no entities are declared.
 */
export const StormboardSchema = {
	version: '1.0.0',
	entities: {},
} as const;
