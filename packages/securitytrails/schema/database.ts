import { z } from 'zod';

/**
 * Entity shapes for the SecurityTrails records worth persisting.
 *
 * Every field is transcribed from the OpenAPI definitions published on
 * https://docs.securitytrails.com (append `.md` to a reference page for the
 * machine-readable version). Nested response objects are flattened into
 * queryable columns, because `upsertByEntityId` replaces the stored `data`
 * blob wholesale rather than merging into it.
 *
 * Only durable intelligence is stored. `ping`, `account/usage`, the scroll
 * cursors and the DSL/SQL statistics aggregates are request-scoped answers that
 * go stale immediately, so they are returned to the caller and never cached.
 */

/**
 * `GET /v1/domain/{hostname}` — current DNS plus the co-occurrence counts
 * SecurityTrails reports alongside each record.
 */
export const SecuritytrailsDomain = z.object({
	/** The queried hostname; also the entity id. */
	id: z.string(),
	hostname: z.string(),
	alexa_rank: z.number().nullable().optional(),
	/** `current_dns.a.values[].ip` */
	ipv4: z.array(z.string()).nullable().optional(),
	/** `current_dns.aaaa.values[].ip` */
	ipv6: z.array(z.string()).nullable().optional(),
	/** `current_dns.mx.values[].host` */
	mail_hosts: z.array(z.string()).nullable().optional(),
	/** `current_dns.ns.values[].nameserver` */
	nameservers: z.array(z.string()).nullable().optional(),
	/** `current_dns.soa.values[].email` */
	soa_emails: z.array(z.string()).nullable().optional(),
	/** `current_dns.txt.values[].value` */
	txt_values: z.array(z.string()).nullable().optional(),
	/** Earliest `first_seen` across the returned record sets. */
	dns_first_seen: z.coerce.date().nullable().optional(),
});
export type SecuritytrailsDomain = z.infer<typeof SecuritytrailsDomain>;

/**
 * `GET /v1/domain/{hostname}/ssl` — one row per (hostname, certificate) pair.
 *
 * A single SAN certificate covers many hostnames, and `hostname` records which
 * lookup produced the row rather than anything about the certificate itself.
 * Keying on the fingerprint alone would therefore make a second lookup
 * overwrite the first row's `hostname`, so the entity id is scoped by host.
 *
 * `not_before` / `not_after` arrive as Unix **seconds**; the endpoint converts
 * them to milliseconds before writing, so these are real dates here.
 */
export const SecuritytrailsCertificate = z.object({
	/** `${hostname}:${sha256}` — see the note above on why it is composite. */
	id: z.string(),
	/** Hostname the lookup was performed for, not a property of the cert. */
	hostname: z.string(),
	dns_names: z.array(z.string()).nullable().optional(),
	sha1: z.string().nullable().optional(),
	sha256: z.string().nullable().optional(),
	issuer_common_name: z.string().nullable().optional(),
	issuer_country: z.array(z.string()).nullable().optional(),
	issuer_organization: z.array(z.string()).nullable().optional(),
	serial_number: z.string().nullable().optional(),
	not_before: z.coerce.date().nullable().optional(),
	not_after: z.coerce.date().nullable().optional(),
});
export type SecuritytrailsCertificate = z.infer<
	typeof SecuritytrailsCertificate
>;

/** `POST /v1/ips/list` — one row per IP returned by a DSL search. */
export const SecuritytrailsIp = z.object({
	/** The IP address, which is the entity id. */
	id: z.string(),
	ip: z.string(),
	ptr: z.string().nullable().optional(),
	ports: z.array(z.number()).nullable().optional(),
	/** The DSL query that surfaced this address. */
	query: z.string().nullable().optional(),
});
export type SecuritytrailsIp = z.infer<typeof SecuritytrailsIp>;

/** `GET /v2/projects` — an Attack Surface Intelligence project. */
export const SecuritytrailsProject = z.object({
	id: z.string(),
	title: z.string(),
	scanning_enabled: z.boolean().nullable().optional(),
	last_scanned_at: z.coerce.date().nullable().optional(),
	inserted_at: z.coerce.date().nullable().optional(),
	max_exposure_score: z.number().nullable().optional(),
});
export type SecuritytrailsProject = z.infer<typeof SecuritytrailsProject>;

/**
 * `GET /v2/company/{domain}/associated-ips` — one row per CIDR block.
 *
 * The provider returns bare `{ cidr }` objects with no identifier, so the id is
 * composed from the company domain and the block to keep rows for different
 * companies from colliding.
 */
export const SecuritytrailsCompanyIpRange = z.object({
	/** `${domain}:${cidr}` */
	id: z.string(),
	domain: z.string(),
	cidr: z.string(),
});
export type SecuritytrailsCompanyIpRange = z.infer<
	typeof SecuritytrailsCompanyIpRange
>;
