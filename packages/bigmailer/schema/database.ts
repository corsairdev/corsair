import { z } from 'zod';

/**
 * Locally persisted BigMailer entities - thirteen in total: brands and
 * everything brand-scoped (brand properties, fields, lists, connections,
 * message types, senders, contacts, segments, suppression lists, templates,
 * bulk campaigns, transactional campaigns). Account users are deliberately
 * not declared here - see the closing comment in this file for why.
 *
 * **Mirrored.** All thirteen entities below are account-owned configuration
 * that changes rarely and is what most other operations need a lookup
 * against - the same "reference data" split Doppler, CircleCI, Loyverse and
 * Habitica all use. Every field each endpoint's documented response
 * actually returns is kept, not a hand-picked subset - see
 * `.github/PLUGIN_PR_RULES.md` and the Alpha Vantage PR #682 lesson this
 * repo learned from (don't under-persist, don't drop parsed fields).
 *
 * **Not mirrored - `engagement`.** Present on brands and lists, but it is a
 * live, continuously-recomputed aggregate (opens/clicks), the same kind of
 * "moving target" Doppler's activity/config logs are - it is still captured
 * as a field on the entities below (never dropped), just not itself broken
 * out into its own cached resource.
 *
 * Field names, types and constraints are taken verbatim from each
 * endpoint's own `/reference/*.md` page on docs.bigmailer.io (fetched live
 * this session), not guessed. Every entity is `.loose()`; only the primary
 * key is required, everything else `.nullable().optional()`.
 * Official: https://docs.bigmailer.io/reference
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

const Id = z.string();

/** Aggregate open/click metrics, shared verbatim across brands and lists. */
const EngagementSchema = z
	.object({
		num_opened: N,
		percent_opened: N,
		num_clicked: N,
		percent_clicked: N,
	})
	.loose()
	.nullable()
	.optional();

/**
 * A brand - the top-level container every other BigMailer resource lives
 * under. Captured from `GET /v1/brands` and `GET /v1/brands/{brand_id}`.
 */
export const BigmailerBrandEntity = z
	.object({
		id: Id,
		name: S,
		from_name: S,
		from_email: S,
		filter_soft_bounces: B,
		max_soft_bounces: N,
		bounce_danger_percent: N,
		unsubscribe_text: S,
		connection_id: S,
		contact_limit: N,
		num_contacts: N,
		engagement: EngagementSchema,
		url: S,
		created: N,
	})
	.loose();
export type BigmailerBrandEntity = z.infer<typeof BigmailerBrandEntity>;

/**
 * A brand property - a static, brand-wide merge-tag value (e.g. a company
 * address) usable in templates. Unique only within its brand; cache under a
 * `brand:id` composite key. Captured from
 * `GET /v1/brands/{brand_id}/properties/{brand_property_id}`.
 */
export const BigmailerBrandPropertyEntity = z
	.object({
		id: Id,
		name: S,
		merge_tag_name: S,
		is_html: B,
		string_value: S,
		created: N,
	})
	.loose();
export type BigmailerBrandPropertyEntity = z.infer<
	typeof BigmailerBrandPropertyEntity
>;

/**
 * A custom contact field (text/date/integer/email) usable as a merge tag.
 * `email` is a response-only type - `POST` only accepts
 * `text`/`date`/`integer`, confirmed from `createfield.md`'s own body
 * schema (the fourth, `email`, is presumably a built-in system field type).
 * Unique only within its brand; cache under a `brand:id` composite key.
 */
export const BigmailerFieldEntity = z
	.object({
		id: Id,
		name: S,
		type: S,
		merge_tag_name: S,
		sample_value: S,
		created: N,
	})
	.loose();
export type BigmailerFieldEntity = z.infer<typeof BigmailerFieldEntity>;

/**
 * A contact list within a brand. `all` marks the brand's system-created
 * "every contact" list. Unique only within its brand; cache under a
 * `brand:id` composite key.
 */
export const BigmailerListEntity = z
	.object({
		id: Id,
		name: S,
		all: B,
		num_contacts: N,
		engagement: EngagementSchema,
		created: N,
	})
	.loose();
export type BigmailerListEntity = z.infer<typeof BigmailerListEntity>;

/**
 * An email-delivery connection (AWS SES or a supported ESP) for the account.
 * Confirmed live: `GET /v1/connections` is account-level, not brand-scoped
 * (no `brand_id` in the path), and the response wraps results in `data`
 * like every other list endpoint here. No credential is ever returned by
 * this API, only `type`/`name`/`created` - nothing secret-shaped on this
 * entity to strip before caching. `id` is unique account-wide.
 */
export const BigmailerConnectionEntity = z
	.object({
		id: Id,
		type: S,
		name: S,
		created: N,
	})
	.loose();
export type BigmailerConnectionEntity = z.infer<
	typeof BigmailerConnectionEntity
>;

/**
 * A message-type category (`account`/`all`/`user`) used to organize
 * campaigns. Unique only within its brand; cache under a `brand:id`
 * composite key.
 */
export const BigmailerMessageTypeEntity = z
	.object({
		id: Id,
		type: S,
		name: S,
		created: N,
	})
	.loose();
export type BigmailerMessageTypeEntity = z.infer<
	typeof BigmailerMessageTypeEntity
>;

/**
 * A verified sender identity (domain or single email) configured on a
 * brand, including its DNS/bounce-domain verification records. The DNS
 * records here are what the brand owner must publish publicly for
 * verification to succeed - not secret. Unique only within its brand;
 * cache under a `brand:id` composite key.
 */
export const BigmailerSenderEntity = z
	.object({
		id: Id,
		identity_type: S,
		Identity: S,
		BounceDomain: S,
		DnsRecords: z.unknown().nullable().optional(),
		BounceDnsRecords: z.unknown().nullable().optional(),
		share_type: S,
		verified: B,
		bounce_verified: B,
		created: N,
	})
	.loose();
export type BigmailerSenderEntity = z.infer<typeof BigmailerSenderEntity>;

/* -------------------------------------------------------------------------- */
/*                          Phase 2/3 - added below                           */
/* -------------------------------------------------------------------------- */

/**
 * A single typed field value on a contact. The BigMailer docs never publish
 * a formal `FieldValuePayload` schema (checked `createcontact.md`'s own
 * embedded example, which only shows `name` plus one of `string`/`date`/
 * `integer`) - kept `.loose()` and every value key optional rather than
 * guessing which one is actually required per field type.
 */
const FieldValueSchema = z
	.object({
		name: S,
		string: S,
		date: S,
		integer: N,
	})
	.loose();

/**
 * A contact - the fundamental audience record, scoped to a brand. Unique
 * only within its brand (its `id` is a UUID assigned per-brand); cache
 * under a `brand:id` composite key like every other brand-scoped resource
 * (`brand_id` is a real field the API returns on this entity, unlike most
 * others, but the composite cache key still derives from `entityId` for
 * consistency with the rest of the plugin rather than reading it back off
 * the record).
 */
export const BigmailerContactEntity = z
	.object({
		id: Id,
		brand_id: S,
		email: S,
		field_values: z.array(FieldValueSchema).nullable().optional(),
		list_ids: z.array(z.string()).nullable().optional(),
		unsubscribe_all: B,
		unsubscribe_ids: z.array(z.string()).nullable().optional(),
		num_soft_bounces: N,
		num_hard_bounces: N,
		num_complaints: N,
		created: N,
	})
	.loose();
export type BigmailerContactEntity = z.infer<typeof BigmailerContactEntity>;

/**
 * A segment - a saved contact filter (by field value or campaign activity).
 * `conditions` is left `z.unknown()` per-item: its shape varies by
 * `type` (`campaign_activity` vs `field`) and BigMailer's docs show only
 * two worked examples, not a full per-type schema - the same treatment
 * Doppler gives fields it will not over-model from partial documentation.
 * Unique only within its brand; cache under a `brand:id` composite key.
 */
export const BigmailerSegmentEntity = z
	.object({
		id: Id,
		name: S,
		operator: S,
		conditions: z.array(z.unknown()).nullable().optional(),
		created: N,
	})
	.loose();
export type BigmailerSegmentEntity = z.infer<typeof BigmailerSegmentEntity>;

/**
 * A campaign suppression list - an uploaded CSV of addresses to exclude
 * from a specific campaign send (distinct from the account-level
 * suppression list BigMailer maintains automatically). Unique only within
 * its brand; cache under a `brand:id` composite key.
 */
export const BigmailerSuppressionListEntity = z
	.object({
		id: Id,
		file_name: S,
		file_size: N,
		created: N,
	})
	.loose();
export type BigmailerSuppressionListEntity = z.infer<
	typeof BigmailerSuppressionListEntity
>;

/**
 * An email or landing-page template. Unique only within its brand; cache
 * under a `brand:id` composite key.
 */
export const BigmailerTemplateEntity = z
	.object({
		id: Id,
		name: S,
		type: S,
		shared_with_account: B,
		html: S,
		created: N,
	})
	.loose();
export type BigmailerTemplateEntity = z.infer<typeof BigmailerTemplateEntity>;

/** A named `{email, name}` sender/reply-to pair, shared by both campaign kinds. */
const CampaignAddressSchema = z
	.object({ email: S, name: S })
	.loose()
	.nullable()
	.optional();

/**
 * A bulk (marketing) campaign. Its `num_*` engagement counters are a live,
 * continuously-recomputed aggregate the same way brands'/lists'
 * `engagement` is - still captured (never dropped), just understood to be a
 * snapshot rather than a stable value. Unique only within its brand; cache
 * under a `brand:id` composite key.
 */
export const BigmailerBulkCampaignEntity = z
	.object({
		id: Id,
		name: S,
		status: S,
		subject: S,
		from: CampaignAddressSchema,
		recipient_name: S,
		reply_to: CampaignAddressSchema,
		html: S,
		text: S,
		preview: S,
		auto_text: B,
		link_params: S,
		track_opens: B,
		track_clicks: B,
		track_text_clicks: B,
		segment_id: S,
		message_type_id: S,
		suppression_list_id: S,
		list_ids: z.array(z.string()).nullable().optional(),
		excluded_list_ids: z.array(z.string()).nullable().optional(),
		scheduled_for: N,
		throttling_type: S,
		throttling_amount: N,
		throttling_period: N,
		num_sent: N,
		num_rejected: N,
		num_clicks: N,
		num_total_clicks: N,
		num_opens: N,
		num_total_opens: N,
		num_hard_bounces: N,
		num_soft_bounces: N,
		num_complaints: N,
		num_unsubscribes: N,
		started: N,
		sent: N,
		delayed_until: N,
		created: N,
	})
	.loose();
export type BigmailerBulkCampaignEntity = z.infer<
	typeof BigmailerBulkCampaignEntity
>;

/**
 * A transactional campaign (a triggerable, single-recipient email like a
 * password reset). Unique only within its brand; cache under a `brand:id`
 * composite key.
 */
export const BigmailerTransactionalCampaignEntity = z
	.object({
		id: Id,
		name: S,
		status: S,
		subject: S,
		from: CampaignAddressSchema,
		recipient_name: S,
		reply_to: CampaignAddressSchema,
		html: S,
		text: S,
		preview: S,
		auto_text: B,
		link_params: S,
		track_opens: B,
		track_clicks: B,
		track_text_clicks: B,
		message_type_id: S,
		list_id: S,
		num_sent: N,
		num_rejected: N,
		num_clicks: N,
		num_opens: N,
		num_hard_bounces: N,
		num_soft_bounces: N,
		num_complaints: N,
		num_unsubscribes: N,
		started: N,
		sent: N,
		created: N,
	})
	.loose();
export type BigmailerTransactionalCampaignEntity = z.infer<
	typeof BigmailerTransactionalCampaignEntity
>;

/**
 * An account user is not declared as a mirrored entity, and deliberately
 * so - Doppler's `schema/database.ts` excludes workplace users/project
 * members/groups for the same reason: identity/access records describe
 * *who* can act, not *what* is configured, which is a different kind of
 * data than the reference-data mirror in this file is for.
 */
