/**
 * RocketReach is the source of truth for every profile, company and credit
 * balance this plugin reads. Its data changes constantly and a lookup costs a
 * credit, so a cached copy would be both stale and a reason to spend a credit
 * again. Nothing is persisted and no entities are declared.
 */
export const RocketReachSchema = {
	version: '1.0.0',
	entities: {},
} as const;
