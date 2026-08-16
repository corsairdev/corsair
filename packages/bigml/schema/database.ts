import { z } from 'zod';

/**
 * Locally persisted BigML entities. Every BigML resource is keyed by its own
 * `resource` field - a compound `{type}/{hex24}` string (e.g.
 * `project/000000000000000000000abc`), confirmed live: it is globally unique
 * across the account, not scoped to a project the way some other providers'
 * ids are scoped to a parent, so every entity here caches under its bare
 * `resource` value.
 *
 * Field names and the base envelope shape are taken from live captures
 * against a real account (`GET /project`, `GET /source`), not guessed from
 * docs - BigML's own docs site is a JS-rendered SPA with no static reference
 * to transcribe from. Every entity is `.loose()`; only `resource` is
 * required.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

const Resource = z.string();

/**
 * Every BigML resource's processing status - confirmed live on both
 * projects and sources. `code` follows BigML's documented lifecycle
 * (5 = FINISHED, -1 = FAULTY, among others); `progress` and `elapsed` are
 * present on some resource types and not others, so both stay optional.
 */
const StatusSchema = z
	.object({
		code: N,
		message: S,
		progress: N,
		elapsed: N,
	})
	.loose()
	.nullable()
	.optional();

/**
 * Fields observed on every BigML resource captured live (projects and
 * sources alike): the account/organization envelope BigML wraps every
 * resource in, regardless of its specific type. Spread into every entity
 * below rather than duplicated.
 */
const CommonResourceFields = {
	resource: Resource,
	name: S,
	category: N,
	code: N,
	created: S,
	updated: S,
	creator: S,
	description: S,
	private: B,
	project: S,
	shared: B,
	tags: z.array(z.string()).nullable().optional(),
	status: StatusSchema,
	type: N,
};

/**
 * A project - the top-level container most other BigML resources reference
 * via their own `project` field. Captured live from `GET /project` and
 * `GET /project/{id}`.
 */
export const BigmlProjectEntity = z
	.object({
		...CommonResourceFields,
		configuration: S,
		configuration_status: B,
		execution_id: S,
		execution_status: B,
		manage_permission: z.array(z.unknown()).nullable().optional(),
		name_options: S,
		/**
		 * Per-resource-type counts (`stats.models.count`, `stats.datasets.count`,
		 * ...) - captured verbatim but left `.loose()`/`z.unknown()` per key
		 * rather than enumerating every one of BigML's ~30 resource-type stat
		 * buckets by name, the same treatment BigMailer gives a nested shape
		 * BigML's own docs do not publish a fixed key list for.
		 */
		stats: z.record(z.string(), z.unknown()).nullable().optional(),
		user_metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		webhook: z.unknown().nullable().optional(),
	})
	.loose();
export type BigmlProjectEntity = z.infer<typeof BigmlProjectEntity>;

/**
 * A data source - confirmed live from `GET /source` (list) and
 * `GET /source/{id}` (single, which additionally returns `fields`,
 * `fields_preview`, `formats`, `sources`, `sources_count`, `types` beyond
 * what the list envelope carries - both captured here since this entity
 * mirrors both operations' responses).
 */
export const BigmlSourceEntity = z
	.object({
		...CommonResourceFields,
		charset: S,
		closed: B,
		configuration: S,
		configuration_status: B,
		content_type: S,
		disable_autolabel: B,
		disable_datetime: B,
		field_types: z.record(z.string(), z.unknown()).nullable().optional(),
		fields: z.record(z.string(), z.unknown()).nullable().optional(),
		fields_meta: z.record(z.string(), z.unknown()).nullable().optional(),
		fields_preview: z.array(z.unknown()).nullable().optional(),
		file_name: S,
		format: S,
		formats: z.record(z.string(), z.unknown()).nullable().optional(),
		image_analysis: z.unknown().nullable().optional(),
		image_id: S,
		item_analysis: z.unknown().nullable().optional(),
		md5: S,
		origin: S,
		original_format: S,
		parent_sources: z.array(z.string()).nullable().optional(),
		size: N,
		source_parser: z.record(z.string(), z.unknown()).nullable().optional(),
		sources: z.array(z.string()).nullable().optional(),
		sources_count: N,
		subscription: B,
		term_analysis: z.unknown().nullable().optional(),
		types: z.array(z.string()).nullable().optional(),
	})
	.loose();
export type BigmlSourceEntity = z.infer<typeof BigmlSourceEntity>;

/**
 * An external data connector (a live database/warehouse connection - MySQL,
 * PostgreSQL, Elasticsearch, etc.). The `connection` object's accepted
 * *input* keys were confirmed live via BigML's own validation error
 * (`endpoints/types.ts`'s `ExternalConnectorConnectionInputSchema`).
 *
 * **`connection` echoes back a plaintext credential.** Confirmed live: a
 * connector created with `password`/`user` in its `connection` object
 * returns that same `password` in cleartext on every subsequent GET and in
 * the LIST envelope - this is BigML's own API behaviour, not a bug in this
 * plugin. `endpoints/external-connectors.ts` therefore never caches this
 * entity locally (the same "do not mirror" treatment BigMailer gives
 * account users, for a credential-exposure reason rather than an
 * identity/configuration-split one), and `logging.ts` deny-lists
 * `connection` by name so no audit event can carry it either. This type
 * exists for the tool's direct return value only, which callers need to see
 * the connector's real configuration - not for anything durable.
 */
export const BigmlExternalConnectorEntity = z
	.object({
		...CommonResourceFields,
		connection: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type BigmlExternalConnectorEntity = z.infer<
	typeof BigmlExternalConnectorEntity
>;

/**
 * A saved configuration (a reusable set of resource-creation defaults).
 * Not observed live - the account used to build this integration had none -
 * so this is `CommonResourceFields` plus the one BigML-documented field
 * (`configurations`, the actual key/value defaults) rather than an invented
 * shape.
 */
export const BigmlConfigurationEntity = z
	.object({
		...CommonResourceFields,
		configurations: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type BigmlConfigurationEntity = z.infer<typeof BigmlConfigurationEntity>;

/**
 * Every other BigML resource type in this catalog's scope is list/read-only
 * here (no create/update/delete), and none had live data in the account used
 * to build this integration (a fresh account with only its onboarding
 * project and sources populated). Rather than fabricate per-type fields for
 * anomalies, clusters, models, predictions, and the ~30 other computed-
 * resource types this catalog lists, they share one conservative entity: the
 * common envelope every BigML resource carries, confirmed live on projects
 * and sources, `.loose()` so any type-specific field a real account returns
 * still passes through uncached-but-undropped on the raw API response even
 * though it is not individually typed here. Splitting these into per-type
 * schemas with real fields is exactly what a live pass against a populated
 * account should do next.
 */
export const BigmlGenericResourceEntity = z
	.object({
		...CommonResourceFields,
	})
	.loose();
export type BigmlGenericResourceEntity = z.infer<
	typeof BigmlGenericResourceEntity
>;
