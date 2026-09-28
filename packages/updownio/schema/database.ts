import { z } from 'zod';

/**
 * Entity shapes mirror the models documented in the updown.io API reference.
 * Every field below appears in the example responses on that page. Objects are
 * `.loose()` because updown.io adds fields without versioning the endpoints.
 * https://updown.io/api
 */

/**
 * TLS certificate state for a check, as tested by updown.io.
 * Official: GET /api/checks -> `ssl`
 * https://updown.io/api
 */
export const UpdownIOCheckSsl = z
	.object({
		tested_at: z.string().nullable().optional(),
		expires_at: z.string().nullable().optional(),
		valid: z.boolean().nullable().optional(),
		error: z.string().nullable().optional(),
	})
	.loose();
export type UpdownIOCheckSsl = z.infer<typeof UpdownIOCheckSsl>;

/**
 * Registered-domain expiry state for a check.
 * Official: GET /api/checks -> `domain`
 * https://updown.io/api
 */
export const UpdownIOCheckDomain = z
	.object({
		tested_at: z.string().nullable().optional(),
		expires_at: z.string().nullable().optional(),
		remaining_days: z.number().nullable().optional(),
		source: z.string().nullable().optional(),
	})
	.loose();
export type UpdownIOCheckDomain = z.infer<typeof UpdownIOCheckDomain>;

/**
 * A monitoring check: one URL updown.io polls on a fixed period, together with
 * its current up/down state and uptime history.
 * Official: GET /api/checks
 * https://updown.io/api
 */
export const UpdownIOCheck = z
	.object({
		token: z.string(),
		url: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		alias: z.string().nullable().optional(),
		last_status: z.number().int().nullable().optional(),
		uptime: z.number().nullable().optional(),
		down: z.boolean().nullable().optional(),
		down_since: z.string().nullable().optional(),
		up_since: z.string().nullable().optional(),
		error: z.string().nullable().optional(),
		period: z.number().int().nullable().optional(),
		apdex_t: z.number().nullable().optional(),
		string_match: z.string().nullable().optional(),
		enabled: z.boolean().nullable().optional(),
		published: z.boolean().nullable().optional(),
		disabled_locations: z.array(z.string()).nullable().optional(),
		recipients: z.array(z.string()).nullable().optional(),
		last_check_at: z.string().nullable().optional(),
		next_check_at: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		mute_until: z.string().nullable().optional(),
		favicon_url: z.string().nullable().optional(),
		custom_headers: z.record(z.string(), z.unknown()).nullable().optional(),
		http_verb: z.string().nullable().optional(),
		http_body: z.string().nullable().optional(),
		ssl: UpdownIOCheckSsl.nullable().optional(),
		domain: UpdownIOCheckDomain.nullable().optional(),
	})
	.loose();
export type UpdownIOCheck = z.infer<typeof UpdownIOCheck>;

/**
 * A monitoring server. The API returns these keyed by location abbreviation
 * (for example `tok` for Tokyo).
 * Official: GET /api/nodes
 * https://updown.io/api
 */
export const UpdownIONode = z
	.object({
		ip: z.string().nullable().optional(),
		ip6: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		lat: z.number().nullable().optional(),
		lng: z.number().nullable().optional(),
	})
	.loose();
export type UpdownIONode = z.infer<typeof UpdownIONode>;
