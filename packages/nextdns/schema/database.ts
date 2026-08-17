import { z } from 'zod';

/**
 * The one entity in this catalog with a stable identity worth caching: a
 * profile id is what nearly every other one of the 71 operations is scoped
 * to. Everything nested under a profile (denylist, allowlist, security/
 * privacy/parentalControl settings, analytics, logs) is mutable
 * configuration state or a query against history, not a separate durable
 * record - so only the profile identity itself is persisted here, matching
 * this repo's College Football Data plugin's "cache the reference data,
 * not the query results" reasoning.
 *
 * Field list from a live `GET /profiles` response captured 2026-08-17
 * against a real account.
 */
export const NextDNSProfileEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		fingerprint: z.string().nullable().optional(),
		role: z.string().nullable().optional(),
	})
	.loose();
export type NextDNSProfileEntity = z.infer<typeof NextDNSProfileEntity>;
