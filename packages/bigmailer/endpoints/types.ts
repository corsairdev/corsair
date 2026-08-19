import { z } from 'zod';
import {
	BigmailerBrandEntity,
	BigmailerBrandPropertyEntity,
	BigmailerBulkCampaignEntity,
	BigmailerConnectionEntity,
	BigmailerContactEntity,
	BigmailerFieldEntity,
	BigmailerListEntity,
	BigmailerMessageTypeEntity,
	BigmailerSegmentEntity,
	BigmailerSenderEntity,
	BigmailerSuppressionListEntity,
	BigmailerTemplateEntity,
	BigmailerTransactionalCampaignEntity,
} from '../schema/database';

/**
 * Input and output schemas for all 57 catalog BigMailer operations: brands,
 * brand properties, fields, lists, connections, message types, senders,
 * contacts, segments, suppression lists, templates, bulk campaigns,
 * transactional campaigns, users, and the `/me` user-info check.
 *
 * Route method/path/params for every operation here were confirmed from
 * `docs.bigmailer.io/reference/<slug>.md` (fetched live this session), not
 * guessed. All resources below except brands and users themselves are
 * scoped to a brand via a `brand_id` path parameter, confirmed live from
 * each `/reference/*.md` page's own request-parameter table (e.g.
 * `deletefield.md`'s literal `DELETE /brands/{brand_id}/fields/{field_id}`
 * path template). Contacts, segments, suppression lists and templates went
 * through a second, more thorough verification pass after the rest of the
 * plugin was built - several fields/methods/paths this file first modelled
 * by analogy turned out to be wrong (contacts' three independent `*_op`
 * params rather than one combined `op`, `upsertContact`'s distinct
 * `POST .../contacts/upsert` path, suppression-list uploads being
 * multipart rather than a JSON body, `POST`-not-PUT/PATCH on segments' and
 * templates' update routes) - each correction is documented at its own
 * declaration with what was wrong and how it was confirmed.
 *
 * Outputs for entities this plugin mirrors reuse the entity definitions in
 * `schema/database.ts` directly, so the mirrored shape and the returned
 * shape cannot drift.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const Id = z.string();

/** For a payload this plugin does not model field by field. */
const OpaqueObject = z.record(z.string(), z.unknown());

/**
 * A cursor-paginated envelope - confirmed live on every `/reference/*.md`
 * list-endpoint page this session fetched: `{<key>: [...], has_more,
 * cursor, total}`. Unlike Doppler's page-number envelopes, BigMailer list
 * routes use `limit`/`cursor` pagination throughout.
 *
 * `key` is typed as a generic `K extends string`, not plain `string`, for
 * the same reason Doppler's `types.ts` types its own `PagedList` this way -
 * a bare `string` collapses to an index signature that erases which field
 * is the array.
 */
const CursorList = <T extends z.ZodTypeAny, K extends string>(
	item: T,
	key: K,
) =>
	z
		.object({
			[key]: z.array(item),
			has_more: z.boolean().nullable().optional(),
			cursor: z.string().nullable().optional(),
			total: N,
		} as { [P in K]: z.ZodArray<T> } & {
			has_more: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
			cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
			total: typeof N;
		})
		.loose();

/** Shared `limit`/`cursor` query params on every list endpoint. */
const CursorPageParams = {
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
};

/* -------------------------------------------------------------------------- */
/*                                    Brands                                  */
/* -------------------------------------------------------------------------- */

const BrandsListInputSchema = z.object({ ...CursorPageParams });
export type BrandsListInput = z.infer<typeof BrandsListInputSchema>;

/**
 * Field-by-field from `createbrand.md`'s own request-body schema, not
 * inferred from the response. `bounce_danger_percent` defaults to `8`
 * server-side and `max_soft_bounces` to `12` - left `.optional()` (not
 * forced) so omitting them still lets those documented defaults apply,
 * matching how Doppler's `environmentsCreate.personalConfigs` handles a
 * documented server-side default.
 */
const BrandsCreateInputSchema = z.object({
	name: z.string().min(1).max(50),
	fromName: z.string().optional(),
	fromEmail: z.email().optional(),
	bounceDangerPercent: z.number().int().min(1).max(15).optional(),
	maxSoftBounces: z.number().int().min(0).max(20).optional(),
	url: z.string().optional(),
	unsubscribeText: z.string().optional(),
	contactLimit: z.number().int().min(0).max(1_000_000_000).optional(),
	/** Base64-encoded JPEG/PNG/GIF, per the spec's own `byte`-format field. */
	logo: z.string().optional(),
	connectionId: z.string().optional(),
});
export type BrandsCreateInput = z.infer<typeof BrandsCreateInputSchema>;

const BrandsGetInputSchema = z.object({ brandId: z.string() });
export type BrandsGetInput = z.infer<typeof BrandsGetInputSchema>;

const BrandsUpdateInputSchema = z.object({
	brandId: z.string(),
	name: z.string().min(1).max(50).optional(),
	fromName: z.string().optional(),
	fromEmail: z.email().optional(),
	bounceDangerPercent: z.number().int().min(1).max(15).optional(),
	maxSoftBounces: z.number().int().min(0).max(20).optional(),
	url: z.string().optional(),
	unsubscribeText: z.string().optional(),
	contactLimit: z.number().int().min(0).max(1_000_000_000).optional(),
	logo: z.string().optional(),
	connectionId: z.string().optional(),
});
export type BrandsUpdateInput = z.infer<typeof BrandsUpdateInputSchema>;

/* -------------------------------------------------------------------------- */
/*                               Brand properties                             */
/* -------------------------------------------------------------------------- */

const BrandPropertiesListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
});
export type BrandPropertiesListInput = z.infer<
	typeof BrandPropertiesListInputSchema
>;

const BrandPropertiesCreateInputSchema = z.object({
	brandId: z.string(),
	name: z.string().min(1).max(50),
	mergeTagName: z.string().max(50).optional(),
	isHtml: z.boolean().optional(),
	stringValue: z.string().max(100_000).optional(),
});
export type BrandPropertiesCreateInput = z.infer<
	typeof BrandPropertiesCreateInputSchema
>;

const BrandPropertiesGetInputSchema = z.object({
	brandId: z.string(),
	brandPropertyId: z.string(),
});
export type BrandPropertiesGetInput = z.infer<
	typeof BrandPropertiesGetInputSchema
>;

const BrandPropertiesUpdateInputSchema = z.object({
	brandId: z.string(),
	brandPropertyId: z.string(),
	name: z.string().min(1).max(50).optional(),
	mergeTagName: z.string().max(50).optional(),
	isHtml: z.boolean().optional(),
	stringValue: z.string().max(100_000).optional(),
});
export type BrandPropertiesUpdateInput = z.infer<
	typeof BrandPropertiesUpdateInputSchema
>;

const BrandPropertiesDeleteInputSchema = z.object({
	brandId: z.string(),
	brandPropertyId: z.string(),
});
export type BrandPropertiesDeleteInput = z.infer<
	typeof BrandPropertiesDeleteInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                    Fields                                  */
/* -------------------------------------------------------------------------- */

const BigmailerFieldTypeSchema = z.enum(['text', 'date', 'integer']);

const FieldsListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
});
export type FieldsListInput = z.infer<typeof FieldsListInputSchema>;

const FieldsCreateInputSchema = z.object({
	brandId: z.string(),
	name: z.string().min(1).max(50),
	type: BigmailerFieldTypeSchema,
	mergeTagName: z.string().max(50).optional(),
	sampleValue: z.string().max(50).optional(),
});
export type FieldsCreateInput = z.infer<typeof FieldsCreateInputSchema>;

const FieldsGetInputSchema = z.object({
	brandId: z.string(),
	fieldId: z.string(),
});
export type FieldsGetInput = z.infer<typeof FieldsGetInputSchema>;

/**
 * `type` is deliberately not settable here - `updatefield.md`'s own request
 * body only lists `name`/`mergeTagName`/`sampleValue`; a field's data type
 * is fixed at creation.
 */
const FieldsUpdateInputSchema = z.object({
	brandId: z.string(),
	fieldId: z.string(),
	name: z.string().min(1).max(50).optional(),
	mergeTagName: z.string().max(50).optional(),
	sampleValue: z.string().max(50).optional(),
});
export type FieldsUpdateInput = z.infer<typeof FieldsUpdateInputSchema>;

const FieldsDeleteInputSchema = z.object({
	brandId: z.string(),
	fieldId: z.string(),
});
export type FieldsDeleteInput = z.infer<typeof FieldsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                    Lists                                   */
/* -------------------------------------------------------------------------- */

const ListsListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
});
export type ListsListInput = z.infer<typeof ListsListInputSchema>;

const ListsCreateInputSchema = z.object({
	brandId: z.string(),
	name: z.string().min(1).max(50),
});
export type ListsCreateInput = z.infer<typeof ListsCreateInputSchema>;

const ListsGetInputSchema = z.object({
	brandId: z.string(),
	listId: z.string(),
});
export type ListsGetInput = z.infer<typeof ListsGetInputSchema>;

const ListsUpdateInputSchema = z.object({
	brandId: z.string(),
	listId: z.string(),
	name: z.string().min(1).max(50),
});
export type ListsUpdateInput = z.infer<typeof ListsUpdateInputSchema>;

const ListsDeleteInputSchema = z.object({
	brandId: z.string(),
	listId: z.string(),
});
export type ListsDeleteInput = z.infer<typeof ListsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                 Connections                                */
/* -------------------------------------------------------------------------- */

/** Account-level, not brand-scoped - confirmed live: `GET /v1/connections` (no `brand_id` in the path). */
const ConnectionsListInputSchema = z.object({
	...CursorPageParams,
});
export type ConnectionsListInput = z.infer<typeof ConnectionsListInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                Message types                               */
/* -------------------------------------------------------------------------- */

const MessageTypesListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
	/** Confirmed live from `listmessagetypes.md`: filters results to this type; defaults to `user` server-side. */
	type: z.enum(['all', 'account', 'user']).optional(),
});
export type MessageTypesListInput = z.infer<typeof MessageTypesListInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                   Senders                                  */
/* -------------------------------------------------------------------------- */

const SendersListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
});
export type SendersListInput = z.infer<typeof SendersListInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                   Contacts                                 */
/* -------------------------------------------------------------------------- */

const FieldValueInputSchema = z.object({
	name: z.string(),
	string: z.string().optional(),
	date: z.string().optional(),
	integer: z.number().optional(),
});

/**
 * `updateContact`'s three independent `*_op` query params - confirmed live
 * from `updatecontact.md`'s own OpenAPI `parameters` array, not a single
 * combined `op` (that was this file's earlier, unverified guess). Each
 * defaults to `replace` server-side: an update that supplies e.g. `listIds`
 * without also setting `listIdsOp: 'add'` **wipes** the contact's existing
 * list membership down to just what was supplied, rather than appending to
 * it. Left optional and un-forced here (the provider's own documented
 * default, not a hidden unsafe one the way Harvest's `send_thank_you` was),
 * but callers should pass `'add'` explicitly whenever the intent is
 * additive.
 */
const ContactListOp = z.enum(['add', 'remove', 'replace']).optional();

const ContactsListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
	/** Confirmed live from `listcontacts.md`: restricts results to members of this list. */
	listId: z.string().optional(),
});
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

const ContactsCreateInputSchema = z.object({
	brandId: z.string(),
	email: z.email(),
	fieldValues: z.array(FieldValueInputSchema).optional(),
	listIds: z.array(z.string()).optional(),
	unsubscribeAll: z.boolean().optional(),
	unsubscribeIds: z.array(z.string()).optional(),
	/**
	 * Validates deliverability before adding, consuming a paid validation
	 * credit - confirmed from `createcontact.md`'s own `validate` query
	 * parameter, `default: false`. Left optional and un-forced: the
	 * provider's own default is already the safe, no-charge behaviour (unlike
	 * Harvest's `send_thank_you`, where the documented default was the
	 * *unsafe* one), so omitting this param cannot surprise a caller with an
	 * unexpected charge.
	 */
	validate: z.boolean().optional(),
});
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

/**
 * `contactId` accepts either the contact's UUID or its email address -
 * confirmed live from every contact-scoped operation's own `ContactIdParam`
 * description ("ID or email address of the contact"). Because of this, it is
 * never passed to `auditPayload` as an identifier key in `contacts.ts` - an
 * email typed into this field would otherwise reach the event log under the
 * key `contactId` rather than `email`, defeating a deny-list keyed on the
 * literal name `email` alone.
 */
const ContactsGetInputSchema = z.object({
	brandId: z.string(),
	contactId: z.string(),
});
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

const ContactsUpdateInputSchema = z
	.object({
		brandId: z.string(),
		contactId: z.string(),
		email: z.email().optional(),
		fieldValues: z.array(FieldValueInputSchema).optional(),
		listIds: z.array(z.string()).optional(),
		unsubscribeAll: z.boolean().optional(),
		unsubscribeIds: z.array(z.string()).optional(),
		fieldValuesOp: ContactListOp,
		listIdsOp: ContactListOp,
		unsubscribeIdsOp: ContactListOp,
	})
	.superRefine((input, ctx) => {
		// BigMailer defaults an omitted *_op to `replace`, which wipes the
		// contact's existing values. Require the paired op whenever the array is
		// supplied so a partial update can't silently clobber data.
		const pairs = [
			['listIds', 'listIdsOp'],
			['unsubscribeIds', 'unsubscribeIdsOp'],
			['fieldValues', 'fieldValuesOp'],
		] as const;
		for (const [arrayKey, opKey] of pairs) {
			if (input[arrayKey] !== undefined && input[opKey] === undefined) {
				ctx.addIssue({
					code: 'custom',
					path: [opKey],
					message: `${opKey} is required when ${arrayKey} is provided; BigMailer defaults to 'replace', which removes existing values`,
				});
			}
		}
	});
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;

const ContactsDeleteInputSchema = z.object({
	brandId: z.string(),
	contactId: z.string(),
});
export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;

/** `deleteContact`'s response echoes the deleted contact's real `id` - confirmed live from its own OpenAPI response schema - which `contacts.ts`'s `remove` needs to evict the correct cache row when the caller addressed the contact by email rather than id. */
const ContactDeleteResultSchema = z.object({ id: S }).loose();

/**
 * `POST .../contacts/upsert` - a distinct path from get/update/delete's
 * `.../contacts/{contactId}`, confirmed live from `upsertcontact.md`'s own
 * path template. Identifies the contact purely by the required `email` in
 * the body ("If the specified email does not exist, a new contact is
 * created. If the specified email exists, the existing contact is
 * updated.") - there is no `contactId` path parameter on this operation at
 * all, unlike the earlier, unverified version of this schema assumed.
 */
const ContactsUpsertInputSchema = z.object({
	brandId: z.string(),
	email: z.email(),
	fieldValues: z.array(FieldValueInputSchema).optional(),
	listIds: z.array(z.string()).optional(),
	unsubscribeAll: z.boolean().optional(),
	unsubscribeIds: z.array(z.string()).optional(),
	/** Same documented `default: false`, same safe-to-omit reasoning as `ContactsCreateInputSchema.validate` above. */
	validate: z.boolean().optional(),
});
export type ContactsUpsertInput = z.infer<typeof ContactsUpsertInputSchema>;

const ContactsCreateBatchInputSchema = z.object({
	brandId: z.string(),
	contacts: z
		.array(
			z.object({
				email: z.email(),
				fieldValues: z.array(FieldValueInputSchema).optional(),
				listIds: z.array(z.string()).optional(),
				unsubscribeAll: z.boolean().optional(),
				unsubscribeIds: z.array(z.string()).optional(),
				/** Echoed back on the batch's `results` entries so callers can correlate outcomes to the input they sent - never interpreted by BigMailer itself. */
				customId: z.string().optional(),
			}),
		)
		.min(1)
		.max(1000),
	/**
	 * `createcontactbatch.md`'s own request-body schema declares `validate` as
	 * a plain `boolean` with no stated default - unlike the single-contact
	 * create/upsert operations, which explicitly default to `false`. Rather
	 * than rely on an unstated server-side default (the exact class of gap
	 * the Harvest `send_thank_you` lesson warns about), this plugin pins it to
	 * `false` itself whenever the caller does not supply a value - see the
	 * `?? false` in `contacts.ts`'s `createBatch`.
	 */
	validate: z.boolean().optional(),
});
export type ContactsCreateBatchInput = z.infer<
	typeof ContactsCreateBatchInputSchema
>;

const ContactsGetBatchInputSchema = z.object({
	brandId: z.string(),
	batchId: z.string(),
});
export type ContactsGetBatchInput = z.infer<typeof ContactsGetBatchInputSchema>;

const ContactBatchResultSchema = z
	.object({
		email: S,
		id: S,
		custom_id: S,
		success: z.boolean().nullable().optional(),
		code: S,
		message: S,
	})
	.loose();

/**
 * A batch's processing status is a moving target - the same "not mirrored,
 * transactional" reasoning Doppler applies to activity/config logs - so it
 * is modelled here for the caller's own use but never cached (see
 * `schema/database.ts`).
 */
const ContactBatchSchema = z
	.object({
		id: Id,
		status: S,
		num_created: N,
		num_new_not_created: N,
		num_updated: N,
		num_validation_credits_used: N,
		created: N,
		completed: N,
		results: z.array(ContactBatchResultSchema).nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                   Segments                                 */
/* -------------------------------------------------------------------------- */

const SegmentConditionInputSchema = z.record(z.string(), z.unknown());

const SegmentsListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
});
export type SegmentsListInput = z.infer<typeof SegmentsListInputSchema>;

const SegmentsCreateInputSchema = z.object({
	brandId: z.string(),
	name: z.string(),
	operator: z.enum(['all', 'any']),
	conditions: z.array(SegmentConditionInputSchema),
});
export type SegmentsCreateInput = z.infer<typeof SegmentsCreateInputSchema>;

const SegmentsGetInputSchema = z.object({
	brandId: z.string(),
	segmentId: z.string(),
});
export type SegmentsGetInput = z.infer<typeof SegmentsGetInputSchema>;

const SegmentsUpdateInputSchema = z.object({
	brandId: z.string(),
	segmentId: z.string(),
	name: z.string().optional(),
	operator: z.enum(['all', 'any']).optional(),
	conditions: z.array(SegmentConditionInputSchema).optional(),
});
export type SegmentsUpdateInput = z.infer<typeof SegmentsUpdateInputSchema>;

const SegmentsDeleteInputSchema = z.object({
	brandId: z.string(),
	segmentId: z.string(),
});
export type SegmentsDeleteInput = z.infer<typeof SegmentsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/*                               Suppression lists                            */
/* -------------------------------------------------------------------------- */

const SuppressionListsListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
});
export type SuppressionListsListInput = z.infer<
	typeof SuppressionListsListInputSchema
>;

/**
 * `POST .../suppression-lists` (note the hyphen - confirmed live from this
 * operation's own OpenAPI path template; the underscore `suppression_lists`
 * an earlier, unverified version of this file assumed does not exist).
 * Confirmed `multipart/form-data` with a single required `file` field
 * (`type: string, format: binary`) - not a JSON body with a base64 `file`
 * string the way brands' `logo` works, contrary to this schema's earlier
 * guess by analogy. There is no `file_name` request field at all; the
 * `file_name` the entity later reports is derived server-side from the
 * upload, not supplied by the caller. `file` is still accepted here as a
 * base64 string at the endpoint boundary (matching this repo's convention
 * for binary input, e.g. Loyverse's item-image upload) and decoded to a
 * `Blob` in `suppression-lists.ts`, which is what actually goes out as the
 * multipart part.
 */
const SuppressionListsCreateInputSchema = z.object({
	brandId: z.string(),
	/** Base64-encoded CSV content - email addresses in the first column of each row. */
	file: z.string(),
});
export type SuppressionListsCreateInput = z.infer<
	typeof SuppressionListsCreateInputSchema
>;

const SuppressionListsGetInputSchema = z.object({
	brandId: z.string(),
	suppressionListId: z.string(),
});
export type SuppressionListsGetInput = z.infer<
	typeof SuppressionListsGetInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                  Templates                                 */
/* -------------------------------------------------------------------------- */

const BigmailerTemplateTypeSchema = z.enum(['email', 'page']);

const TemplatesListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
});
export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

const TemplatesCreateInputSchema = z.object({
	brandId: z.string(),
	name: z.string().min(1).max(50),
	type: BigmailerTemplateTypeSchema,
	sharedWithAccount: z.boolean().optional(),
	html: z.string().optional(),
});
export type TemplatesCreateInput = z.infer<typeof TemplatesCreateInputSchema>;

const TemplatesGetInputSchema = z.object({
	brandId: z.string(),
	templateId: z.string(),
});
export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;

const TemplatesUpdateInputSchema = z.object({
	brandId: z.string(),
	templateId: z.string(),
	name: z.string().min(1).max(50).optional(),
	type: BigmailerTemplateTypeSchema.optional(),
	sharedWithAccount: z.boolean().optional(),
	html: z.string().optional(),
});
export type TemplatesUpdateInput = z.infer<typeof TemplatesUpdateInputSchema>;

const TemplatesDeleteInputSchema = z.object({
	brandId: z.string(),
	templateId: z.string(),
});
export type TemplatesDeleteInput = z.infer<typeof TemplatesDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                Bulk campaigns                              */
/* -------------------------------------------------------------------------- */

const CampaignAddressInputSchema = z.object({
	email: z.email(),
	name: z.string().optional(),
});

/** Fields shared by bulk-campaign create and update, per `createbulkcampaign.md`/`updatebulkcampaign.md`'s near-identical `CreateUpdateBulkCampaignProperties` body. */
const BulkCampaignWritableFields = {
	name: z.string().optional(),
	subject: z.string().optional(),
	from: CampaignAddressInputSchema.optional(),
	recipientName: z.string().optional(),
	replyTo: CampaignAddressInputSchema.optional(),
	linkParams: z.string().optional(),
	preview: z.string().optional(),
	autoText: z.boolean().optional(),
	html: z.string().optional(),
	text: z.string().optional(),
	templateId: z.string().optional(),
	trackOpens: z.boolean().optional(),
	trackClicks: z.boolean().optional(),
	trackTextClicks: z.boolean().optional(),
	segmentId: z.string().optional(),
	messageTypeId: z.string().optional(),
	listIds: z.array(z.string()).optional(),
	excludedListIds: z.array(z.string()).optional(),
	scheduledFor: z.number().optional(),
	throttlingType: z.enum(['none', 'burst']).optional(),
	throttlingAmount: z.number().int().min(1000).max(1_000_000).optional(),
	throttlingPeriod: z
		.union([z.literal(900), z.literal(1800), z.literal(3600), z.literal(7200)])
		.optional(),
	suppressionListId: z.string().optional(),
	/**
	 * "Set to true to activate sending or scheduling" - confirmed live from
	 * `createbulkcampaign.md`. Left `.optional()`, never forced: omitting it
	 * is the safe, non-sending default (the campaign stays a draft), the
	 * same reasoning Harvest's `send_thank_you` lesson calls for on any
	 * boolean that can trigger an outbound send - here the risk runs the
	 * other way (an omitted value is inert, not a hidden `true`), so no
	 * explicit `?? false` is needed the way Harvest's was.
	 */
	ready: z.boolean().optional(),
};

const BulkCampaignsListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
});
export type BulkCampaignsListInput = z.infer<
	typeof BulkCampaignsListInputSchema
>;

const BulkCampaignsCreateInputSchema = z.object({
	brandId: z.string(),
	...BulkCampaignWritableFields,
	name: z.string(),
});
export type BulkCampaignsCreateInput = z.infer<
	typeof BulkCampaignsCreateInputSchema
>;

const BulkCampaignsGetInputSchema = z.object({
	brandId: z.string(),
	campaignId: z.string(),
});
export type BulkCampaignsGetInput = z.infer<typeof BulkCampaignsGetInputSchema>;

const BulkCampaignsUpdateInputSchema = z.object({
	brandId: z.string(),
	campaignId: z.string(),
	...BulkCampaignWritableFields,
});
export type BulkCampaignsUpdateInput = z.infer<
	typeof BulkCampaignsUpdateInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                            Transactional campaigns                         */
/* -------------------------------------------------------------------------- */

/** Fields shared by transactional-campaign create and update, per `createtransactionalcampaign.md`/`updatetransactionalcampaign.md`. */
const TransactionalCampaignWritableFields = {
	name: z.string().optional(),
	subject: z.string().optional(),
	from: CampaignAddressInputSchema.optional(),
	recipientName: z.string().optional(),
	replyTo: CampaignAddressInputSchema.optional(),
	linkParams: z.string().optional(),
	preview: z.string().optional(),
	autoText: z.boolean().optional(),
	html: z.string().optional(),
	text: z.string().optional(),
	templateId: z.string().optional(),
	trackOpens: z.boolean().optional(),
	trackClicks: z.boolean().optional(),
	trackTextClicks: z.boolean().optional(),
	messageTypeId: z.string().optional(),
	/** "ID of a list contacts sent the transactional campaign should be added to" - confirmed live from `createtransactionalcampaign.md`. */
	listId: z.string().optional(),
	/**
	 * "The campaign will not be sent or scheduled until activated by setting
	 * ready to true" - confirmed live from `updatetransactionalcampaign.md`.
	 * Same non-forced, safe-by-omission treatment as bulk campaigns' `ready`.
	 */
	ready: z.boolean().optional(),
};

const TransactionalCampaignsListInputSchema = z.object({
	brandId: z.string(),
	...CursorPageParams,
});
export type TransactionalCampaignsListInput = z.infer<
	typeof TransactionalCampaignsListInputSchema
>;

const TransactionalCampaignsCreateInputSchema = z.object({
	brandId: z.string(),
	...TransactionalCampaignWritableFields,
	name: z.string(),
});
export type TransactionalCampaignsCreateInput = z.infer<
	typeof TransactionalCampaignsCreateInputSchema
>;

const TransactionalCampaignsGetInputSchema = z.object({
	brandId: z.string(),
	campaignId: z.string(),
});
export type TransactionalCampaignsGetInput = z.infer<
	typeof TransactionalCampaignsGetInputSchema
>;

const TransactionalCampaignsUpdateInputSchema = z.object({
	brandId: z.string(),
	campaignId: z.string(),
	...TransactionalCampaignWritableFields,
});
export type TransactionalCampaignsUpdateInput = z.infer<
	typeof TransactionalCampaignsUpdateInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                    Users                                   */
/* -------------------------------------------------------------------------- */

/** An account user's permission level - the fuller-permission roles (`brand_manager`/`campaign_manager`/`campaign_viewer`/`template_manager`) can be scoped to `allowedBrands`, per `createuser.md`. */
const BigmailerUserRoleSchema = z.enum([
	'admin',
	'account_manager',
	'brand_manager',
	'campaign_manager',
	'campaign_viewer',
	'template_manager',
]);

const UsersListInputSchema = z.object({ ...CursorPageParams });
export type UsersListInput = z.infer<typeof UsersListInputSchema>;

/**
 * Account-level, not brand-scoped - confirmed live from `listusers.md`/
 * `getuser.md`/`updateuser.md`/`deleteuser.md`'s consistent flat
 * `/users`/`/users/{user_id}` paths (no `brand_id` anywhere). `createuser.md`
 * itself never rendered a literal path line in anything this session could
 * fetch (checked twice, including a raw-quote-only request); `POST /users`
 * is used here rather than a summarizer-suggested
 * `/accounts/{account_id}/users` because it is the only form consistent with
 * the other four confirmed operations on this exact resource, and no
 * `account_id` concept appears anywhere else in this plugin. Still
 * unverified live - creating a real user sends a real invitation email, so
 * this was deliberately never exercised against a live account either;
 * flagged for verification once that can be done without emailing someone.
 */
const UsersCreateInputSchema = z.object({
	email: z.email(),
	role: BigmailerUserRoleSchema,
	/** Only relevant if `role` is `brand_manager`/`campaign_manager`/`campaign_viewer`/`template_manager`, per `createuser.md`. */
	allowedBrands: z.array(z.string()).optional(),
	invitationMessage: z.string().optional(),
});
export type UsersCreateInput = z.infer<typeof UsersCreateInputSchema>;

const UsersGetInputSchema = z.object({ userId: z.string() });
export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

const UsersUpdateInputSchema = z.object({
	userId: z.string(),
	email: z.email().optional(),
	role: BigmailerUserRoleSchema.optional(),
	allowedBrands: z.array(z.string()).optional(),
});
export type UsersUpdateInput = z.infer<typeof UsersUpdateInputSchema>;

const UsersDeleteInputSchema = z.object({ userId: z.string() });
export type UsersDeleteInput = z.infer<typeof UsersDeleteInputSchema>;

const BigmailerUserSchema = z
	.object({
		id: Id,
		email: S,
		role: S,
		allowed_brands: z.array(z.string()).nullable().optional(),
		/** Confirmed live: matches the catalog's "activation status". */
		is_activated: z.boolean().nullable().optional(),
		/** Confirmed live, undocumented in the catalog prose but present on every account's own user. */
		is_owner: z.boolean().nullable().optional(),
		created: N,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                     Auth                                   */
/* -------------------------------------------------------------------------- */

/**
 * `GET /me` - stated in `docs.bigmailer.io/docs/getting-started-api` as "a
 * test endpoint...to verify configuration," not itself present in the
 * OpenAPI-derived `llms.txt` endpoint index. Modelled as an opaque object,
 * the same treatment Doppler's `authMe` (also undocumented field-by-field)
 * uses.
 */
const AuthMeInputSchema = z.object({});
export type AuthMeInput = z.infer<typeof AuthMeInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                  Registries                                */
/* -------------------------------------------------------------------------- */

export type BigmailerEndpointInputs = {
	brandsList: BrandsListInput;
	brandsCreate: BrandsCreateInput;
	brandsGet: BrandsGetInput;
	brandsUpdate: BrandsUpdateInput;

	brandPropertiesList: BrandPropertiesListInput;
	brandPropertiesCreate: BrandPropertiesCreateInput;
	brandPropertiesGet: BrandPropertiesGetInput;
	brandPropertiesUpdate: BrandPropertiesUpdateInput;
	brandPropertiesDelete: BrandPropertiesDeleteInput;

	fieldsList: FieldsListInput;
	fieldsCreate: FieldsCreateInput;
	fieldsGet: FieldsGetInput;
	fieldsUpdate: FieldsUpdateInput;
	fieldsDelete: FieldsDeleteInput;

	listsList: ListsListInput;
	listsCreate: ListsCreateInput;
	listsGet: ListsGetInput;
	listsUpdate: ListsUpdateInput;
	listsDelete: ListsDeleteInput;

	connectionsList: ConnectionsListInput;

	messageTypesList: MessageTypesListInput;

	sendersList: SendersListInput;

	contactsList: ContactsListInput;
	contactsCreate: ContactsCreateInput;
	contactsGet: ContactsGetInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
	contactsUpsert: ContactsUpsertInput;
	contactsCreateBatch: ContactsCreateBatchInput;
	contactsGetBatch: ContactsGetBatchInput;

	segmentsList: SegmentsListInput;
	segmentsCreate: SegmentsCreateInput;
	segmentsGet: SegmentsGetInput;
	segmentsUpdate: SegmentsUpdateInput;
	segmentsDelete: SegmentsDeleteInput;

	suppressionListsList: SuppressionListsListInput;
	suppressionListsCreate: SuppressionListsCreateInput;
	suppressionListsGet: SuppressionListsGetInput;

	templatesList: TemplatesListInput;
	templatesCreate: TemplatesCreateInput;
	templatesGet: TemplatesGetInput;
	templatesUpdate: TemplatesUpdateInput;
	templatesDelete: TemplatesDeleteInput;

	bulkCampaignsList: BulkCampaignsListInput;
	bulkCampaignsCreate: BulkCampaignsCreateInput;
	bulkCampaignsGet: BulkCampaignsGetInput;
	bulkCampaignsUpdate: BulkCampaignsUpdateInput;

	transactionalCampaignsList: TransactionalCampaignsListInput;
	transactionalCampaignsCreate: TransactionalCampaignsCreateInput;
	transactionalCampaignsGet: TransactionalCampaignsGetInput;
	transactionalCampaignsUpdate: TransactionalCampaignsUpdateInput;

	usersList: UsersListInput;
	usersCreate: UsersCreateInput;
	usersGet: UsersGetInput;
	usersUpdate: UsersUpdateInput;
	usersDelete: UsersDeleteInput;

	authMe: AuthMeInput;
};

export type BigmailerEndpointOutputs = {
	brandsList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerBrandEntity, 'data'>>
	>;
	brandsCreate: z.infer<typeof BigmailerBrandEntity>;
	brandsGet: z.infer<typeof BigmailerBrandEntity>;
	brandsUpdate: z.infer<typeof BigmailerBrandEntity>;

	brandPropertiesList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerBrandPropertyEntity, 'data'>>
	>;
	brandPropertiesCreate: z.infer<typeof BigmailerBrandPropertyEntity>;
	brandPropertiesGet: z.infer<typeof BigmailerBrandPropertyEntity>;
	brandPropertiesUpdate: z.infer<typeof BigmailerBrandPropertyEntity>;
	brandPropertiesDelete: void;

	fieldsList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerFieldEntity, 'data'>>
	>;
	fieldsCreate: z.infer<typeof BigmailerFieldEntity>;
	fieldsGet: z.infer<typeof BigmailerFieldEntity>;
	fieldsUpdate: z.infer<typeof BigmailerFieldEntity>;
	fieldsDelete: void;

	listsList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerListEntity, 'data'>>
	>;
	listsCreate: z.infer<typeof BigmailerListEntity>;
	listsGet: z.infer<typeof BigmailerListEntity>;
	listsUpdate: z.infer<typeof BigmailerListEntity>;
	listsDelete: void;

	connectionsList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerConnectionEntity, 'data'>>
	>;

	messageTypesList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerMessageTypeEntity, 'data'>>
	>;

	sendersList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerSenderEntity, 'data'>>
	>;

	contactsList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerContactEntity, 'data'>>
	>;
	contactsCreate: z.infer<typeof BigmailerContactEntity>;
	contactsGet: z.infer<typeof BigmailerContactEntity>;
	contactsUpdate: z.infer<typeof BigmailerContactEntity>;
	contactsDelete: z.infer<typeof ContactDeleteResultSchema>;
	contactsUpsert: z.infer<typeof BigmailerContactEntity>;
	contactsCreateBatch: z.infer<typeof ContactBatchSchema>;
	contactsGetBatch: z.infer<typeof ContactBatchSchema>;

	segmentsList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerSegmentEntity, 'data'>>
	>;
	segmentsCreate: z.infer<typeof BigmailerSegmentEntity>;
	segmentsGet: z.infer<typeof BigmailerSegmentEntity>;
	segmentsUpdate: z.infer<typeof BigmailerSegmentEntity>;
	segmentsDelete: z.infer<typeof DeletedIdResult>;

	suppressionListsList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerSuppressionListEntity, 'data'>>
	>;
	suppressionListsCreate: z.infer<typeof BigmailerSuppressionListEntity>;
	suppressionListsGet: z.infer<typeof BigmailerSuppressionListEntity>;

	templatesList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerTemplateEntity, 'data'>>
	>;
	templatesCreate: z.infer<typeof BigmailerTemplateEntity>;
	templatesGet: z.infer<typeof BigmailerTemplateEntity>;
	templatesUpdate: z.infer<typeof BigmailerTemplateEntity>;
	templatesDelete: z.infer<typeof DeletedIdResult>;

	bulkCampaignsList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerBulkCampaignEntity, 'data'>>
	>;
	bulkCampaignsCreate: z.infer<typeof BigmailerBulkCampaignEntity>;
	bulkCampaignsGet: z.infer<typeof BigmailerBulkCampaignEntity>;
	bulkCampaignsUpdate: z.infer<typeof BigmailerBulkCampaignEntity>;

	transactionalCampaignsList: z.infer<
		ReturnType<
			typeof CursorList<typeof BigmailerTransactionalCampaignEntity, 'data'>
		>
	>;
	transactionalCampaignsCreate: z.infer<
		typeof BigmailerTransactionalCampaignEntity
	>;
	transactionalCampaignsGet: z.infer<
		typeof BigmailerTransactionalCampaignEntity
	>;
	transactionalCampaignsUpdate: z.infer<
		typeof BigmailerTransactionalCampaignEntity
	>;

	usersList: z.infer<
		ReturnType<typeof CursorList<typeof BigmailerUserSchema, 'data'>>
	>;
	usersCreate: z.infer<typeof BigmailerUserSchema>;
	usersGet: z.infer<typeof BigmailerUserSchema>;
	usersUpdate: z.infer<typeof BigmailerUserSchema>;
	usersDelete: void;

	authMe: z.infer<typeof OpaqueObject>;
};

export const BigmailerEndpointInputSchemas = {
	brandsList: BrandsListInputSchema,
	brandsCreate: BrandsCreateInputSchema,
	brandsGet: BrandsGetInputSchema,
	brandsUpdate: BrandsUpdateInputSchema,

	brandPropertiesList: BrandPropertiesListInputSchema,
	brandPropertiesCreate: BrandPropertiesCreateInputSchema,
	brandPropertiesGet: BrandPropertiesGetInputSchema,
	brandPropertiesUpdate: BrandPropertiesUpdateInputSchema,
	brandPropertiesDelete: BrandPropertiesDeleteInputSchema,

	fieldsList: FieldsListInputSchema,
	fieldsCreate: FieldsCreateInputSchema,
	fieldsGet: FieldsGetInputSchema,
	fieldsUpdate: FieldsUpdateInputSchema,
	fieldsDelete: FieldsDeleteInputSchema,

	listsList: ListsListInputSchema,
	listsCreate: ListsCreateInputSchema,
	listsGet: ListsGetInputSchema,
	listsUpdate: ListsUpdateInputSchema,
	listsDelete: ListsDeleteInputSchema,

	connectionsList: ConnectionsListInputSchema,

	messageTypesList: MessageTypesListInputSchema,

	sendersList: SendersListInputSchema,

	contactsList: ContactsListInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsUpsert: ContactsUpsertInputSchema,
	contactsCreateBatch: ContactsCreateBatchInputSchema,
	contactsGetBatch: ContactsGetBatchInputSchema,

	segmentsList: SegmentsListInputSchema,
	segmentsCreate: SegmentsCreateInputSchema,
	segmentsGet: SegmentsGetInputSchema,
	segmentsUpdate: SegmentsUpdateInputSchema,
	segmentsDelete: SegmentsDeleteInputSchema,

	suppressionListsList: SuppressionListsListInputSchema,
	suppressionListsCreate: SuppressionListsCreateInputSchema,
	suppressionListsGet: SuppressionListsGetInputSchema,

	templatesList: TemplatesListInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,

	bulkCampaignsList: BulkCampaignsListInputSchema,
	bulkCampaignsCreate: BulkCampaignsCreateInputSchema,
	bulkCampaignsGet: BulkCampaignsGetInputSchema,
	bulkCampaignsUpdate: BulkCampaignsUpdateInputSchema,

	transactionalCampaignsList: TransactionalCampaignsListInputSchema,
	transactionalCampaignsCreate: TransactionalCampaignsCreateInputSchema,
	transactionalCampaignsGet: TransactionalCampaignsGetInputSchema,
	transactionalCampaignsUpdate: TransactionalCampaignsUpdateInputSchema,

	usersList: UsersListInputSchema,
	usersCreate: UsersCreateInputSchema,
	usersGet: UsersGetInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	usersDelete: UsersDeleteInputSchema,

	authMe: AuthMeInputSchema,
} as const;

const EmptyResult = z.void();

/**
 * `deleteSegment`/`deleteTemplate` also return `{id: string(uuid)}`, not an
 * empty body - same finding, same fix, as `ContactDeleteResultSchema` above
 * (`deletesegment.md`/`deletetemplate.md`'s own `response200` schemas name
 * it explicitly). Kept as its own const rather than reusing
 * `ContactDeleteResultSchema` so the name at each call site says what it is.
 */
const DeletedIdResult = z.object({ id: z.string().optional() }).loose();

export const BigmailerEndpointOutputSchemas = {
	brandsList: CursorList(BigmailerBrandEntity, 'data'),
	brandsCreate: BigmailerBrandEntity,
	brandsGet: BigmailerBrandEntity,
	brandsUpdate: BigmailerBrandEntity,

	brandPropertiesList: CursorList(BigmailerBrandPropertyEntity, 'data'),
	brandPropertiesCreate: BigmailerBrandPropertyEntity,
	brandPropertiesGet: BigmailerBrandPropertyEntity,
	brandPropertiesUpdate: BigmailerBrandPropertyEntity,
	brandPropertiesDelete: EmptyResult,

	fieldsList: CursorList(BigmailerFieldEntity, 'data'),
	fieldsCreate: BigmailerFieldEntity,
	fieldsGet: BigmailerFieldEntity,
	fieldsUpdate: BigmailerFieldEntity,
	fieldsDelete: EmptyResult,

	listsList: CursorList(BigmailerListEntity, 'data'),
	listsCreate: BigmailerListEntity,
	listsGet: BigmailerListEntity,
	listsUpdate: BigmailerListEntity,
	listsDelete: EmptyResult,

	connectionsList: CursorList(BigmailerConnectionEntity, 'data'),

	messageTypesList: CursorList(BigmailerMessageTypeEntity, 'data'),

	sendersList: CursorList(BigmailerSenderEntity, 'data'),

	contactsList: CursorList(BigmailerContactEntity, 'data'),
	contactsCreate: BigmailerContactEntity,
	contactsGet: BigmailerContactEntity,
	contactsUpdate: BigmailerContactEntity,
	contactsDelete: ContactDeleteResultSchema,
	contactsUpsert: BigmailerContactEntity,
	contactsCreateBatch: ContactBatchSchema,
	contactsGetBatch: ContactBatchSchema,

	segmentsList: CursorList(BigmailerSegmentEntity, 'data'),
	segmentsCreate: BigmailerSegmentEntity,
	segmentsGet: BigmailerSegmentEntity,
	segmentsUpdate: BigmailerSegmentEntity,
	segmentsDelete: DeletedIdResult,

	suppressionListsList: CursorList(BigmailerSuppressionListEntity, 'data'),
	suppressionListsCreate: BigmailerSuppressionListEntity,
	suppressionListsGet: BigmailerSuppressionListEntity,

	templatesList: CursorList(BigmailerTemplateEntity, 'data'),
	templatesCreate: BigmailerTemplateEntity,
	templatesGet: BigmailerTemplateEntity,
	templatesUpdate: BigmailerTemplateEntity,
	templatesDelete: DeletedIdResult,

	bulkCampaignsList: CursorList(BigmailerBulkCampaignEntity, 'data'),
	bulkCampaignsCreate: BigmailerBulkCampaignEntity,
	bulkCampaignsGet: BigmailerBulkCampaignEntity,
	bulkCampaignsUpdate: BigmailerBulkCampaignEntity,

	transactionalCampaignsList: CursorList(
		BigmailerTransactionalCampaignEntity,
		'data',
	),
	transactionalCampaignsCreate: BigmailerTransactionalCampaignEntity,
	transactionalCampaignsGet: BigmailerTransactionalCampaignEntity,
	transactionalCampaignsUpdate: BigmailerTransactionalCampaignEntity,

	usersList: CursorList(BigmailerUserSchema, 'data'),
	usersCreate: BigmailerUserSchema,
	usersGet: BigmailerUserSchema,
	usersUpdate: BigmailerUserSchema,
	usersDelete: EmptyResult,

	authMe: OpaqueObject,
} as const;
