import { z } from 'zod';

/**
 * Locally persisted Doppler entities.
 *
 * **Mirrored.** Projects, environments, configs, webhooks, and the workplace
 * itself are account-owned configuration that changes rarely and is what
 * most other operations need a lookup against - the same split CircleCI,
 * Loyverse and Habitica all used.
 *
 * **Not mirrored - secrets, in any shape.** Every secret-reading route on
 * this API returns the actual live value (`raw`/`computed`), not a masked
 * fragment the way CircleCI's env vars are - Doppler's whole product is
 * secrets, so there is no partial-exposure version of this data to even
 * consider caching. No `secrets` entity exists in this schema at all, on
 * purpose - not "declared narrower," genuinely absent.
 *
 * **Not mirrored - a raw credential appears once, at creation.** Creating a
 * service token returns `key` - the full, usable token, in plaintext, the
 * one and only time the API ever sends it. Mirroring service token
 * *metadata* would risk a future edit accidentally widening the schema to
 * capture `key` too (every entity here is `.loose()`, which does not strip
 * an undeclared field - see `endpoints/service-tokens.ts` for where that
 * field is actually stripped before anything downstream sees it). Given
 * that risk and no real efficiency case for caching token metadata, no
 * `serviceTokens` entity exists either. The same reasoning excludes Doppler
 * Share responses (`password` is the link's decryption key).
 *
 * **Not mirrored - transactional.** Activity logs, config logs, and dynamic
 * secret leases are appended continuously and meaningful only against a
 * time range or a specific id - mirroring them would copy a moving target.
 *
 * **Not mirrored - identity/access, not configuration data.** Workplace
 * users, project members, groups, invites, roles and permissions are about
 * *who* can act, not *what* is configured - a different kind of data than
 * the "reference data" this mirror is for, and several of these families
 * (groups, change requests) are plan-gated on the development account used
 * to build this plugin, so their shape is declared from the docs rather
 * than a live capture.
 *
 * Field names match the API's own JSON keys, including the API's own
 * inconsistency between `snake_case` (most fields) and `camelCase`
 * (`inheritedBy` on configs, every field on a webhook) - confirmed live, not
 * a typo carried over from documentation.
 *
 * Shapes captured live on 2026-08-16 from a real account (`corsair` project,
 * `dev`/`dev_personal`/`stg`/`prd` configs) unless noted otherwise.
 *
 * Only the primary key is required; every other field is nullable and
 * optional, and every object is `.loose()`.
 * Official: https://docs.doppler.com/reference/api
 */

const S = z.string().nullable().optional();
const B = z.boolean().nullable().optional();

const Id = z.string();

/**
 * A project - the top-level container for environments and configs.
 * Captured live from `GET /v3/projects/project`.
 */
export const DopplerProjectEntity = z
	.object({
		id: Id,
		slug: S,
		name: S,
		description: S,
		created_at: S,
	})
	.loose();
export type DopplerProjectEntity = z.infer<typeof DopplerProjectEntity>;

/**
 * An environment (dev/stg/prd, or a custom one) within a project.
 * Captured live from `GET /v3/environments/environment`.
 */
export const DopplerEnvironmentEntity = z
	.object({
		id: Id,
		slug: S,
		name: S,
		project: S,
		initial_fetch_at: S,
		created_at: S,
		personal_configs: B,
	})
	.loose();
export type DopplerEnvironmentEntity = z.infer<typeof DopplerEnvironmentEntity>;

/**
 * A config - the branch-level container secrets actually live in
 * (`dev`, `dev_feature_x`, ...). Captured live from `GET /v3/configs/config`.
 *
 * `inheritedBy` is camelCase - confirmed live, the one field on this entity
 * that breaks from the API's otherwise-consistent snake_case.
 *
 * `slug` is a second, opaque, globally-unique identifier distinct from
 * `name` (`name` repeats across projects, `slug` does not) - confirmed live
 * on a re-verification pass, not present in the earlier capture this entity
 * was first built from. `name` stays the primary key (it, not `slug`, is
 * what every route's `config` parameter addresses), but `slug` is durable
 * and worth keeping rather than silently dropped.
 */
export const DopplerConfigEntity = z
	.object({
		name: Id,
		slug: S,
		project: S,
		environment: S,
		root: B,
		inheritable: B,
		inheriting: B,
		inherits: z.array(z.unknown()).nullable().optional(),
		inheritedBy: z.array(z.unknown()).nullable().optional(),
		locked: B,
		initial_fetch_at: S,
		last_fetch_at: S,
		created_at: S,
	})
	.loose();
export type DopplerConfigEntity = z.infer<typeof DopplerConfigEntity>;

/**
 * A project webhook - Doppler's own outbound notification resource, the
 * analog of Habitica's outbound webhooks and CircleCI's own webhook family.
 * Captured live by creating and immediately deleting a real entry.
 *
 * All fields are camelCase, confirmed live - unlike almost everything else
 * in this API.
 */
export const DopplerWebhookEntity = z
	.object({
		id: Id,
		name: S,
		url: S,
		enabled: B,
		hasSecret: B,
		authentication: z.unknown().nullable().optional(),
		enabledConfigs: z.array(z.unknown()).nullable().optional(),
		canManage: B,
	})
	.loose();
export type DopplerWebhookEntity = z.infer<typeof DopplerWebhookEntity>;

/**
 * The workplace itself - a singleton per account. Captured live from
 * `GET /v3/workplace`.
 */
export const DopplerWorkplaceEntity = z
	.object({
		id: Id,
		name: S,
		billing_email: S,
		security_email: S,
	})
	.loose();
export type DopplerWorkplaceEntity = z.infer<typeof DopplerWorkplaceEntity>;
