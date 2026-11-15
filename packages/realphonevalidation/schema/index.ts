/**
 * RealPhoneValidation returns a disposition, not an account record: the same
 * number can be connected today and disconnected next month, and its services
 * deliberately allow up to 5% unknown answers. Caching one would present a stale
 * verdict as current, which for a TCPA or fraud decision is worse than no answer.
 * Nothing is persisted and no entities are declared.
 */
export const RealPhoneValidationSchema = {
	version: '1.0.0',
	entities: {},
} as const;
