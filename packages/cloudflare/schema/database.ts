import { z } from 'zod';

/** Zone account metadata from the API; extra keys allowed by Cloudflare. */
const ZoneAccountSchema = z.object({ id: z.string() }).passthrough().optional();

export const CloudflareZone = z.object({
	id: z.string(),
	name: z.string(),
	status: z.string().optional(),
	paused: z.boolean().optional(),
	type: z.string().optional(),
	account: ZoneAccountSchema,
	name_servers: z.array(z.string()).optional(),
	created_on: z.coerce.date().nullable().optional(),
	modified_on: z.coerce.date().nullable().optional(),
	activated_on: z.coerce.date().nullable().optional(),
});

export const CloudflareDnsRecord = z.object({
	id: z.string(),
	zone_id: z.string(),
	zone_name: z.string().optional(),
	type: z.string(),
	name: z.string(),
	content: z.string(),
	proxiable: z.boolean().optional(),
	proxied: z.boolean().optional(),
	ttl: z.number().optional(),
	priority: z.number().optional(),
	locked: z.boolean().optional(),
	created_on: z.coerce.date().nullable().optional(),
	modified_on: z.coerce.date().nullable().optional(),
});

/** Script list/upload metadata only — never store full source (see workers.scripts.get). */
export const CloudflareWorkerScript = z.object({
	id: z.string(),
	account_id: z.string().optional(),
	created_on: z.coerce.date().nullable().optional(),
	modified_on: z.coerce.date().nullable().optional(),
});

export const CloudflareWorkerRoute = z.object({
	id: z.string(),
	zone_id: z.string(),
	pattern: z.string(),
	script: z.string().optional(),
});

/** Rules array entries vary by phase; stored as loose records for search. */
export const CloudflareRuleset = z.object({
	id: z.string(),
	zone_id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	kind: z.string(),
	version: z.string().optional(),
	last_updated: z.coerce.date().nullable().optional(),
	phase: z.string(),
	rules: z.array(z.record(z.unknown())).optional(),
});
