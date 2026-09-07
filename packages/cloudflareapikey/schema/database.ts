import { z } from 'zod';

const ZoneAccountSchema = z.object({ id: z.string() }).loose().optional();

export const CloudflareZone = z.object({
	id: z.string(),
	name: z.string(),
	status: z.string().optional(),
	paused: z.boolean().optional(),
	type: z.string().optional(),
	account: ZoneAccountSchema,
	name_servers: z.array(z.string()).optional(),
	vanity_name_servers: z.array(z.string()).optional(),
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

export const CloudflareDnssec = z.object({
	id: z.string(),
	zone_id: z.string(),
	status: z.string().optional(),
	algorithm: z.string().optional(),
	digest: z.string().optional(),
	digest_algorithm: z.string().optional(),
	ds: z.string().optional(),
	flags: z.number().optional(),
	key_tag: z.number().optional(),
	key_type: z.string().optional(),
	public_key: z.string().optional(),
	modified_on: z.coerce.date().nullable().optional(),
});

export const CloudflareLockdown = z.object({
	id: z.string(),
	zone_id: z.string(),
	urls: z.array(z.string()),
	configurations: z.array(z.record(z.string(), z.unknown())),
	description: z.string().optional(),
	paused: z.boolean().optional(),
	priority: z.number().optional(),
	created_on: z.coerce.date().nullable().optional(),
	modified_on: z.coerce.date().nullable().optional(),
});

export const CloudflareRuleset = z.object({
	id: z.string(),
	zone_id: z.string().optional(),
	account_id: z.string().optional(),
	name: z.string(),
	description: z.string().optional(),
	kind: z.string(),
	version: z.string().optional(),
	last_updated: z.coerce.date().nullable().optional(),
	phase: z.string(),
	rules: z.array(z.record(z.string(), z.unknown())).optional(),
});

export const CloudflareR2Object = z.object({
	id: z.string(),
	account_id: z.string(),
	bucket_name: z.string(),
	key: z.string(),
	etag: z.string().optional(),
	size: z.string().optional(),
	storage_class: z.string().optional(),
	version: z.string().optional(),
	uploaded: z.coerce.date().nullable().optional(),
});
