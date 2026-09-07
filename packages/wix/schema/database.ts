import { z } from 'zod';

export const WixContact = z
	.object({
		id: z.string().optional(),
		// Live 2026-09-08: contacts v4 returns `revision` as a number
		// (docs say int64-encoded string for some APIs). Accept both and
		// normalize to string so downstream code sees a stable type.
		revision: z.union([z.string(), z.number().transform(String)]).optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
	})
	.loose();

export type WixContact = z.infer<typeof WixContact>;

export const WixProduct = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		name: z.string().optional(),
		slug: z.string().optional(),
		// Verified from Query Products docs: narrow filterable/sortable set.
		// All optional because `fields` projection can omit them.
		// https://dev.wix.com/docs/api-reference/business-solutions/stores/catalog-v3/products-v3/query-products
		visible: z.boolean().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
	})
	.loose();

export type WixProduct = z.infer<typeof WixProduct>;

/**
 * Minimal inventory-item shape verified from Query Inventory Items docs.
 * Inventory tracks either `quantity` (integer) or `inStock` (boolean) —
 * both optional here because the API returns one of them depending on
 * `trackQuantity`. All optional: cursor queries with `fields` projection
 * can omit any of them.
 * https://dev.wix.com/docs/api-reference/business-solutions/stores/catalog-v3/inventory-items-v3/query-inventory-items
 */
export const WixInventoryItem = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		variantId: z.string().optional(),
		productId: z.string().optional(),
		locationId: z.string().optional(),
		trackQuantity: z.boolean().optional(),
		inStock: z.boolean().optional(),
		quantity: z.number().int().optional(),
		availabilityStatus: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
	})
	.loose();

export type WixInventoryItem = z.infer<typeof WixInventoryItem>;

/**
 * Minimal coupon shape verified from Query Coupons docs.
 * Real responses nest `code`/`name`/`active` under `specification`:
 * `coupons[]: { id, specification: { code, name, active, ... }, expired }`.
 * `code` is unique max-20 string, `active`/`expired` are booleans.
 * All optional: list queries can return partial projections.
 * https://dev.wix.com/docs/api-reference/business-solutions/coupons/coupons/query-coupons
 */
export const WixCoupon = z
	.object({
		id: z.string().optional(),
		expired: z.boolean().optional(),
		specification: z
			.looseObject({
				code: z.string().optional(),
				name: z.string().optional(),
				active: z.boolean().optional(),
			})
			.optional(),
	})
	.loose();

export type WixCoupon = z.infer<typeof WixCoupon>;

export const WixOrder = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();

export type WixOrder = z.infer<typeof WixOrder>;

/**
 * Update-specific order contract for bulk-update inputs.
 * The bulk-update route documents field removal via `null`
 * ("To remove a field, pass null"), so updatable typed fields accept
 * `null` here. Response schemas (`WixOrder`) stay non-nullable:
 * Wix never returns `null` status on reads. `id` stays a plain string —
 * it identifies the order and is never itself removable.
 */
export const WixOrderUpdate = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		status: z.union([z.string(), z.null()]).optional(),
	})
	.loose();

export type WixOrderUpdate = z.infer<typeof WixOrderUpdate>;

/**
 * Minimal booking-category shape verified from Query Categories docs.
 * `categories[]: { id, name, revision, createdDate, updatedDate }`.
 * All optional: paging/projection can omit any of them.
 * https://dev.wix.com/docs/api-reference/business-solutions/bookings/services/categories-v2/query-categories
 */
export const WixBookingCategory = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		name: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
	})
	.loose();

export type WixBookingCategory = z.infer<typeof WixBookingCategory>;

/**
 * Minimal site-folder shape verified from Query Folders docs.
 * `folders[]: { id, name, createdDate, updatedDate, siteCount, parentId }`.
 * All optional: paging/projection can omit any of them.
 * https://dev.wix.com/docs/api-reference/account-level/sites/site-folders/query-folders
 */
export const WixSiteFolder = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
		siteCount: z.number().int().optional(),
		parentId: z.string().optional(),
	})
	.loose();

export type WixSiteFolder = z.infer<typeof WixSiteFolder>;

/**
 * Minimal email-campaign shape verified from List Campaigns docs.
 * `campaigns[]: { campaignId, title, status, visibilityStatus, ... }`.
 * `campaignId` is the GUID (not `id`). All optional: list can omit fields.
 * https://dev.wix.com/docs/api-reference/business-management/marketing/emails/email-marketing/campaign/list-campaigns
 */
export const WixCampaign = z
	.object({
		campaignId: z.string().optional(),
		title: z.string().optional(),
		status: z.string().optional(),
		visibilityStatus: z.string().optional(),
		dateCreated: z.string().optional(),
		dateUpdated: z.string().optional(),
	})
	.loose();

export type WixCampaign = z.infer<typeof WixCampaign>;

/**
 * Minimal form-schema shape verified from Query Deleted Forms docs.
 * `forms[]: { id, namespace, name, revision }`.
 * Requires namespace `$eq` filter, trash-bin only. All optional.
 * https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/query-deleted-forms
 */
export const WixForm = z
	.object({
		id: z.string().optional(),
		namespace: z.string().optional(),
		name: z.string().optional(),
		revision: z.string().optional(),
	})
	.loose();

export type WixForm = z.infer<typeof WixForm>;

/**
 * Minimal form-submission shape verified from Query Submissions By Namespace.
 * `submissions[]: { id, formId, namespace, status }`.
 * Status enum: PENDING|CONFIRMED|PAYMENT_WAITING|PAYMENT_CANCELED.
 * All optional: keep as strings to avoid brittle enums.
 * https://dev.wix.com/docs/api-reference/crm/forms/form-submissions/query-submissions-by-namespace
 */
export const WixFormSubmission = z
	.object({
		id: z.string().optional(),
		formId: z.string().optional(),
		namespace: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();

export type WixFormSubmission = z.infer<typeof WixFormSubmission>;

/**
 * Minimal location shape verified from List Locations docs.
 * `locations[]: { id, name, status, timeZone, ... }`.
 * Status enum ACTIVE|INACTIVE kept as string. All optional.
 * https://dev.wix.com/docs/api-reference/business-management/locations/list-locations
 */
export const WixLocation = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		timeZone: z.string().optional(),
	})
	.loose();

export type WixLocation = z.infer<typeof WixLocation>;

/**
 * Minimal moderation-rule shape verified from Query Rules docs.
 * `rules[]: { id, namespace, name, enabled }`.
 * All optional: queries can return partial projections.
 * https://dev.wix.com/docs/api-reference/crm/community/feedback-moderation/moderation-rules/query-rules
 */
export const WixModerationRule = z
	.object({
		id: z.string().optional(),
		namespace: z.string().optional(),
		name: z.string().optional(),
		enabled: z.boolean().optional(),
	})
	.loose();

export type WixModerationRule = z.infer<typeof WixModerationRule>;

/**
 * Minimal tax-group shape verified from Query Tax Groups docs.
 * `taxGroups[]: { id, name, revision }`. All optional.
 * https://dev.wix.com/docs/api-reference/business-solutions/e-commerce/extensions/tax/tax-groups/query-tax-groups
 */
export const WixTaxGroup = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		revision: z.string().optional(),
	})
	.loose();

export type WixTaxGroup = z.infer<typeof WixTaxGroup>;

/**
 * Minimal manual-tax-mapping shape verified via Wix SDK typings
 * (REST docs gateway-mapped). Real key is `manualTaxMappings[]`:
 * `{ id, taxGroupId, taxRate (decimal string like "0.05"), ... }`.
 * `taxRate` kept as string: docs show decimal-string, not number.
 * All optional.
 * List: https://dev.wix.com/docs/api-reference/business-solutions/e-commerce/extensions/tax/manual-tax-mappings/list-manual-tax-mappings
 * Query: https://dev.wix.com/docs/api-reference/business-solutions/e-commerce/extensions/tax/manual-tax-mappings/query-manual-tax-mappings
 */
export const WixManualTaxMapping = z
	.object({
		id: z.string().optional(),
		taxGroupId: z.string().optional(),
		taxRate: z.string().optional(),
	})
	.loose();

export type WixManualTaxMapping = z.infer<typeof WixManualTaxMapping>;

/**
 * Minimal custom-field shape verified via Members SDK typings.
 * Real key is `fields[]`: `{ id, name, key, ... }`. All optional.
 */
export const WixCustomField = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		key: z.string().optional(),
	})
	.loose();

export type WixCustomField = z.infer<typeof WixCustomField>;

/**
 * Minimal currency shape. ISO 4217 `code` (e.g. "USD") is the stable
 * identifier across Wix currency responses. All optional.
 */
export const WixCurrency = z
	.object({
		code: z.string().optional(),
		symbol: z.string().optional(),
	})
	.loose();

export type WixCurrency = z.infer<typeof WixCurrency>;

/**
 * Minimal brand shape. `brand.name` is a documented filterable field in
 * Stores catalog v3 (max 50 chars). All optional.
 * https://dev.wix.com/docs/api-reference/business-solutions/stores/catalog-v3/products-v3/supported-filters-and-sorting
 */
export const WixBrand = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

export type WixBrand = z.infer<typeof WixBrand>;

/**
 * Minimal group-request shape verified via Groups SDK typings.
 * Real key is `groupRequests[]`: `{ id, status, ... }`.
 * Status enum PENDING|APPROVED|REJECTED|CANCELED kept as string.
 * All optional.
 */
export const WixGroupRequest = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();

export type WixGroupRequest = z.infer<typeof WixGroupRequest>;

/**
 * Minimal extended-booking shape. Real items are nested:
 * `extendedBookings[]: { booking?: { id, status, ... }, ... }`.
 * Only `booking.id`/`booking.status` are load-bearing; rest is opt-in
 * enrichment. All optional, loose for forward-compat.
 */
export const WixExtendedBooking = z
	.object({
		booking: z
			.looseObject({
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.optional(),
	})
	.loose();

export type WixExtendedBooking = z.infer<typeof WixExtendedBooking>;
