/**
 * Ragic is the system of record for the sheets this plugin reads and writes. Its
 * records change from the Ragic interface as well as the API, and a form's field
 * set differs per account, so a cached copy would be both stale and untyped.
 * Nothing is persisted and no entities are declared.
 */
export const RagicSchema = {
	version: '1.0.0',
	entities: {},
} as const;
