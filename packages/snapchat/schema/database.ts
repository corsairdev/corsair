import { z } from 'zod';

/**
 * Organization entity from Snapchat Marketing API.
 * Docs: https://marketingapi.snapchat.com/docs/#organizations
 */
export const SnapchatOrganizationEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		status: z.string().optional(),
		country: z.string().optional(),
		locality: z.string().optional(),
		administrative_district_level_1: z.string().optional(),
		postal_code: z.string().optional(),
		address_line_1: z.string().optional(),
		my_display_name: z.string().optional(),
		my_member_id: z.string().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type SnapchatOrganizationEntity = z.infer<
	typeof SnapchatOrganizationEntity
>;

/**
 * Ad Account entity from Snapchat Marketing API.
 * Docs: https://marketingapi.snapchat.com/docs/#ad-accounts
 */
export const SnapchatAdAccountEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		organization_id: z.string().optional(),
		status: z.string().optional(),
		type: z.string().optional(),
		currency: z.string().optional(),
		timezone: z.string().optional(),
		billing_center_id: z.string().optional(),
		advertiser: z.string().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type SnapchatAdAccountEntity = z.infer<typeof SnapchatAdAccountEntity>;

/**
 * Campaign entity from Snapchat Marketing API.
 * Docs: https://marketingapi.snapchat.com/docs/#campaigns
 */
export const SnapchatCampaignEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		ad_account_id: z.string().optional(),
		status: z.string().optional(),
		objective: z.string().optional(),
		start_time: z.coerce.date().nullable().optional(),
		end_time: z.coerce.date().nullable().optional(),
		daily_budget_micro: z.number().optional(),
		lifetime_budget_micro: z.number().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type SnapchatCampaignEntity = z.infer<typeof SnapchatCampaignEntity>;

/**
 * Ad Squad entity from Snapchat Marketing API.
 * Docs: https://marketingapi.snapchat.com/docs/#ad-squads
 */
export const SnapchatAdSquadEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		campaign_id: z.string().optional(),
		status: z.string().optional(),
		type: z.string().optional(),
		billing_event: z.string().optional(),
		bid_micro: z.number().optional(),
		daily_budget_micro: z.number().optional(),
		targeting: z.record(z.string(), z.unknown()).optional(),
		placement_v2: z.record(z.string(), z.unknown()).optional(),
		start_time: z.coerce.date().nullable().optional(),
		end_time: z.coerce.date().nullable().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type SnapchatAdSquadEntity = z.infer<typeof SnapchatAdSquadEntity>;

/**
 * Ad entity from Snapchat Marketing API.
 * Docs: https://marketingapi.snapchat.com/docs/#ads
 */
export const SnapchatAdEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		ad_squad_id: z.string().optional(),
		creative_id: z.string().optional(),
		status: z.string().optional(),
		type: z.string().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type SnapchatAdEntity = z.infer<typeof SnapchatAdEntity>;

/**
 * Creative entity from Snapchat Marketing API.
 * Docs: https://marketingapi.snapchat.com/docs/#creatives
 */
export const SnapchatCreativeEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		ad_account_id: z.string().optional(),
		type: z.string().optional(),
		top_snap_media_id: z.string().optional(),
		web_view_properties: z.record(z.string(), z.unknown()).optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type SnapchatCreativeEntity = z.infer<typeof SnapchatCreativeEntity>;

/**
 * Media entity from Snapchat Marketing API.
 * Docs: https://marketingapi.snapchat.com/docs/#media
 */
export const SnapchatMediaEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		ad_account_id: z.string().optional(),
		media_status: z.string().optional(),
		type: z.string().optional(),
		download_link: z.string().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type SnapchatMediaEntity = z.infer<typeof SnapchatMediaEntity>;

/**
 * Audience Segment entity from Snapchat Marketing API.
 * Docs: https://marketingapi.snapchat.com/docs/#audience-segments
 */
export const SnapchatSegmentEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		ad_account_id: z.string().optional(),
		source_type: z.string().optional(),
		status: z.string().optional(),
		approximate_number_users: z.number().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type SnapchatSegmentEntity = z.infer<typeof SnapchatSegmentEntity>;

/**
 * Billing Center entity from Snapchat Marketing API.
 * Docs: https://marketingapi.snapchat.com/docs/#billing-centers
 */
export const SnapchatBillingCenterEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		organization_id: z.string().optional(),
		email: z.string().optional(),
		address_line_1: z.string().optional(),
		country: z.string().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type SnapchatBillingCenterEntity = z.infer<
	typeof SnapchatBillingCenterEntity
>;

/**
 * Action record entity for Composio tool execution persistence.
 */
export const SnapchatActionEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		updated_at: z.coerce.date().nullable().optional(),
		created_at: z.coerce.date().nullable().optional(),
		data: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type SnapchatActionEntity = z.infer<typeof SnapchatActionEntity>;
