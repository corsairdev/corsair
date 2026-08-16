import { z } from 'zod';

/**
 * Locally persisted CircleCI entities.
 *
 * CircleCI splits the same way Loyverse and Habitica did: durable
 * configuration is mirrored, transactional activity is not.
 *
 * **Mirrored.** Projects, contexts (plus their env-var metadata and
 * restrictions), schedules, org groups, and orb URL allow-list entries are
 * all account-owned configuration that changes rarely and is what most other
 * operations need a lookup against.
 *
 * **Not mirrored - transactional.** Pipelines, workflows and jobs are
 * appended continuously and change on every run; mirroring them would copy a
 * moving target rather than help a lookup, the same reasoning Loyverse
 * applied to receipts and Habitica applied to a task's `value`/`history`.
 * Insights and usage-export data are derived reports over that same moving
 * target and are not mirrored for the same reason.
 *
 * **Not mirrored - not account-owned.** The orb registry (orbs, orb
 * versions, namespaces, categories) is a shared public catalogue, not this
 * account's data - the same reasoning that kept Habitica's content catalogue
 * out of the mirror. It is cached implicitly by nothing; every read goes to
 * the API.
 *
 * **Not mirrored - secrets, even in masked form.** Environment variable
 * *values* are never stored, mirrored, or logged, matching what the API
 * itself does: CircleCI never returns a variable's plaintext back, not even
 * immediately after setting it, and returns two different masked shapes
 * depending on the route (`"xxxx" + last 4 chars` on projects,
 * `truncated_value` with just the last 4 on contexts) - see `client.ts` and
 * the entities below for both. A masked fragment is still part of a secret,
 * so only the variable *name* and timestamps are declared as fields; the
 * value fields that do come back are typed but never logged or copied
 * elsewhere in the plugin.
 *
 * Field names match the API's own JSON keys, including the API's own
 * inconsistency between `snake_case` (v2, most fields) and `kebab-case`
 * (schedules specifically - `updated-at`, `created-at`, `project-slug` -
 * confirmed live, not a typo carried over from documentation).
 *
 * Shapes captured live on 2026-08-16 from a real account where noted; a few
 * complex nested objects (`config_source`, `event_source`, `checkout_source`
 * on pipeline definitions and triggers) are declared from the spec rather
 * than a live capture, because seeding them needs a GitHub App integration
 * this development account does not have. Those are `.loose()` records rather
 * than fully-typed shapes, so the plugin never claims certainty it does not
 * have.
 *
 * Only the primary key is required; every other field is nullable and
 * optional, and every object is `.loose()`.
 * Official: https://circleci.com/docs/api/v2/
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

const Id = z.string();

/**
 * VCS connection info embedded in a project.
 * Captured live from `GET /project/{project-slug}`.
 */
export const CircleCIVcsInfo = z
	.object({
		vcs_url: S,
		default_branch: S,
		provider: S,
	})
	.loose();
export type CircleCIVcsInfo = z.infer<typeof CircleCIVcsInfo>;

/**
 * A project - the CircleCI object wrapping one followed repository.
 * Captured live from `GET /project/gh/{org}/{project}`.
 */
export const CircleCIProjectEntity = z
	.object({
		id: Id,
		slug: S,
		name: S,
		organization_name: S,
		organization_id: S,
		organization_slug: S,
		vcs_info: CircleCIVcsInfo.nullable().optional(),
	})
	.loose();
export type CircleCIProjectEntity = z.infer<typeof CircleCIProjectEntity>;

/**
 * An environment variable stored in a context.
 *
 * `truncated_value` is CircleCI's own masking - the last four characters of
 * the real value, never the whole thing. Captured live from
 * `PUT /context/{id}/environment-variable/{name}` and the list route.
 */
export const CircleCIContextEnvVarEntity = z
	.object({
		/** Primary key for this mirror: the variable name is unique per context. */
		variable: Id,
		truncated_value: S,
		context_id: S,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type CircleCIContextEnvVarEntity = z.infer<
	typeof CircleCIContextEnvVarEntity
>;

/**
 * A restriction narrowing which projects, groups or pipeline expressions may
 * use a context.
 *
 * Captured live: creating a context auto-creates one default restriction
 * ("All members", `restriction_type: "group"`) whose `id` equals the org's
 * own id rather than a restriction-specific identifier - worth knowing before
 * assuming `id` always names something unique to the restriction row itself.
 */
export const CircleCIContextRestrictionEntity = z
	.object({
		id: Id,
		context_id: S,
		name: S,
		/** `project`, `expression`, or `group`. */
		restriction_type: S,
		restriction_value: S,
	})
	.loose();
export type CircleCIContextRestrictionEntity = z.infer<
	typeof CircleCIContextRestrictionEntity
>;

/**
 * A context - a named collection of secret environment variables shared
 * across the pipelines of an organization.
 * Captured live from `GET /context/{id}`.
 */
export const CircleCIContextEntity = z
	.object({
		id: Id,
		name: S,
		created_at: S,
		org_id: S,
		environment_variables: z
			.array(CircleCIContextEnvVarEntity)
			.nullable()
			.optional(),
		restrictions: z
			.array(CircleCIContextRestrictionEntity)
			.nullable()
			.optional(),
	})
	.loose();
export type CircleCIContextEntity = z.infer<typeof CircleCIContextEntity>;

/**
 * A project-level environment variable.
 *
 * `value` is masked server-side as `"xxxx" + the real last four characters` -
 * a different mask shape from a context env var's `truncated_value`,
 * confirmed live on both. Never the plaintext, on any route, at any time.
 */
export const CircleCIProjectEnvVarEntity = z
	.object({
		name: Id,
		value: S,
		created_at: S,
	})
	.loose();
export type CircleCIProjectEnvVarEntity = z.infer<
	typeof CircleCIProjectEnvVarEntity
>;

/**
 * The timetable controlling when a schedule fires.
 * Captured live from `POST /project/{project-slug}/schedule`.
 */
export const CircleCIScheduleTimetable = z
	.object({
		'per-hour': N,
		'hours-of-day': z.array(z.number()).nullable().optional(),
		'days-of-week': z.array(z.string()).nullable().optional(),
		'days-of-month': z.array(z.number()).nullable().optional(),
		months: z.array(z.string()).nullable().optional(),
	})
	.loose();
export type CircleCIScheduleTimetable = z.infer<
	typeof CircleCIScheduleTimetable
>;

/**
 * A scheduled pipeline trigger.
 *
 * Field names are **kebab-case** here (`updated-at`, `created-at`,
 * `project-slug`) - confirmed live, not a transcription error. Every other
 * v2 entity in this plugin uses `snake_case`; schedules are the one
 * exception.
 */
export const CircleCIScheduleEntity = z
	.object({
		id: Id,
		name: S,
		description: S,
		'project-slug': S,
		'created-at': S,
		'updated-at': S,
		/** `current` (the caller) or `system`. */
		actor: z.record(z.string(), z.unknown()).nullable().optional(),
		parameters: z.record(z.string(), z.unknown()).nullable().optional(),
		timetable: CircleCIScheduleTimetable.nullable().optional(),
	})
	.loose();
export type CircleCIScheduleEntity = z.infer<typeof CircleCIScheduleEntity>;

/**
 * An organization group.
 *
 * Declared from the spec rather than a live capture: `POST` to create one
 * answered 403 "Permission denied" on the development account, even though
 * reading the (empty) collection succeeds - see `HABITICA-PLAN.md`-style
 * notes in `CIRCLECI-PLAN.md` for why that is recorded as unresolved rather
 * than assumed to be a plan restriction.
 */
export const CircleCIGroupEntity = z
	.object({
		id: Id,
		name: S,
		description: S,
		org_id: S,
	})
	.loose();
export type CircleCIGroupEntity = z.infer<typeof CircleCIGroupEntity>;

/**
 * A URL orb allow-list entry - a permitted URL prefix for URL-referenced
 * (rather than registry-referenced) orbs in this organization's pipelines.
 *
 * `POST` returns only `{id, message}`, not the fields below - confirmed live
 * by creating and immediately deleting a real entry. The rest of this shape
 * (`name`, `prefix`, `auth`) is declared from the spec's request body, which
 * documents them as round-tripping on a subsequent read; that read was not
 * exercised live in the same pass.
 */
export const CircleCIOrbAllowlistEntryEntity = z
	.object({
		id: Id,
		name: S,
		prefix: S,
		/** `github-oauth`, `bitbucket-oauth`, `github-app`, or `none`. */
		auth: S,
	})
	.loose();
export type CircleCIOrbAllowlistEntryEntity = z.infer<
	typeof CircleCIOrbAllowlistEntryEntity
>;

/**
 * Where a pipeline definition's config, or a trigger's events, come from.
 *
 * Left as an opaque record rather than fully typed. The real shape is a
 * `oneOf` keyed by `provider` (`github_app` | `github_server` | `circleci` for
 * config sources; those three plus `webhook` | `schedule` for trigger event
 * sources), each requiring different nested fields - and none of it was
 * captured live, because populating it needs a GitHub App integration this
 * development account does not have. An opaque record says exactly that
 * plainly, rather than a fully-typed union asserting a shape nobody has seen
 * come back from the API.
 */
const CircleCISourceRef = z.record(z.string(), z.unknown());

/**
 * A pipeline definition - a named, reusable pairing of a config file location
 * with the VCS source it should be checked out from.
 * Declared from the spec; not live-captured (see `CircleCISourceRef`).
 */
export const CircleCIPipelineDefinitionEntity = z
	.object({
		id: Id,
		name: S,
		description: S,
		config_source: CircleCISourceRef.nullable().optional(),
		checkout_source: CircleCISourceRef.nullable().optional(),
	})
	.loose();
export type CircleCIPipelineDefinitionEntity = z.infer<
	typeof CircleCIPipelineDefinitionEntity
>;

// No Trigger entity here. The v2 spec's "Trigger" tag (what causes a pipeline
// definition to run) has 5 routes, but none of the 65 catalog operations use
// any of them - the catalog's own "trigger" operation
// (`CIRCLECI_TRIGGER_PIPELINE`) is a different concept entirely, starting a
// pipeline RUN, not managing a Trigger resource. An earlier draft added this
// entity because the spec has the tag, not because anything asked for it, and
// it stayed unreferenced by every endpoint. Removed rather than left as a
// schema that mirrors nothing.
