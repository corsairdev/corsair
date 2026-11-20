/**
 * No local entities. Browsers, profiles and the rest live in Kernel and change
 * by the second (a browser bills until it is deleted), so every read goes to
 * the API rather than a cached copy.
 */
export const KernelSchema = {
	version: '1.0.0',
	entities: {},
} as const;
