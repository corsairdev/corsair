import { z } from 'zod';

/**
 * Entity schemas for the ActiveCampaign local mirror.
 *
 * Field lists are transcribed from responses captured against a live
 * ActiveCampaign account on 2026-08-13, not from the documentation.
 *
 * Almost every scalar ActiveCampaign returns is a JSON string, including
 * numeric ids ("1"), counts ("0") and booleans ("0" / "1"), so those fields
 * are modelled as strings rather than the types the documentation implies.
 *
 * `groupMembers` is the documented exception and was found by capture, not by
 * reading: it returns real JSON numbers for `id`, `rel_id`, `group_id` and
 * `ordernum`. Anything that could be either is modelled as a union, and its
 * entity id is coerced, because the store keys on strings.
 *
 * `schema.test.ts` asserts that every captured key is declared here.
 *
 * Only the primary key is required. ActiveCampaign omits or nulls fields
 * depending on plan, enabled features and permissions - a stricter schema
 * would reject valid rows, and a rejected row is a lost row. Every object is
 * `.loose()` so that fields added by ActiveCampaign later are preserved
 * instead of being stripped.
 */

/** Nullable, optional string - the shape of nearly every ActiveCampaign field. */
const S = z.string().nullable().optional();
/**
 * A field that has been observed as a JSON number on at least one endpoint.
 * Accepts either representation so one resource returning numbers cannot
 * reject rows that another returns as strings.
 */
const SN = z.union([z.string(), z.number()]).nullable().optional();
/** Sideloaded relation arrays and the `links` object are shape-unstable. */
const Unknown = z.unknown().nullable().optional();

/**
 * A contact. Reference data: contacts are the entity every other resource in
 * this plugin points at, and they are updated in place rather than appended.
 */
export const ActiveCampaignContact = z
	.object({
		id: z.string(),
		email: S,
		firstName: S,
		lastName: S,
		phone: S,
		orgid: S,
		orgname: S,
		organization: S,
		cdate: S,
		udate: S,
		adate: S,
		edate: S,
		hash: S,
		ip: S,
		ua: S,
		gravatar: S,
		deleted: S,
		deleted_at: S,
		anonymized: S,
		email_local: S,
		email_domain: S,
		segmentio_id: S,
		bounced_hard: S,
		bounced_soft: S,
		bounced_date: S,
		sentcnt: S,
		rating_tstamp: S,
		socialdata_lastcheck: S,
		created_by: S,
		updated_by: S,
		created_utc_timestamp: S,
		updated_utc_timestamp: S,
		created_timestamp: S,
		updated_timestamp: S,
		mpp_tracking: S,
		last_click_date: S,
		last_open_date: S,
		last_mpp_open_date: S,
		best_send_hour: S,
		sms_consent: S,
		sms_consent_updated_at: S,
		whatsapp_id: S,
		whatsapp_username: S,
		scoreValues: Unknown,
		accountContacts: Unknown,
		links: Unknown,
	})
	.loose();

/**
 * A mailing list. Reference data - lists are created once and reused.
 */
export const ActiveCampaignList = z
	.object({
		id: z.string(),
		name: S,
		stringid: S,
		userid: S,
		user: S,
		description: S,
		cdate: S,
		udate: S,
		channel: S,
		private: S,
		deletestamp: S,
		active_subscribers: S,
		non_deleted_subscribers: S,
		subscription_notify: S,
		unsubscription_notify: S,
		require_name: S,
		get_unsubscribe_reason: S,
		to_name: S,
		optinoptout: S,
		optinmessageid: S,
		optoutconf: S,
		carboncopy: S,
		fulladdress: S,
		sender_name: S,
		sender_addr1: S,
		sender_addr2: S,
		sender_city: S,
		sender_state: S,
		sender_zip: S,
		sender_country: S,
		sender_phone: S,
		sender_url: S,
		sender_reminder: S,
		send_last_broadcast: S,
		analytics_domains: S,
		analytics_source: S,
		analytics_ua: S,
		twitter_token: S,
		twitter_token_secret: S,
		facebook_session: S,
		p_use_tracking: S,
		p_use_analytics_read: S,
		p_use_analytics_link: S,
		p_use_twitter: S,
		p_use_facebook: S,
		p_embed_image: S,
		p_use_captcha: S,
		created_by: S,
		updated_by: S,
		created_timestamp: S,
		updated_timestamp: S,
		links: Unknown,
	})
	.loose();

/**
 * A tag. Reference data - tags are a controlled vocabulary applied to
 * contacts.
 */
export const ActiveCampaignTag = z
	.object({
		id: z.string(),
		tag: S,
		tagType: S,
		description: S,
		subscriber_count: S,
		deleted: S,
		cdate: S,
		created_by: S,
		updated_by: S,
		created_timestamp: S,
		updated_timestamp: S,
		links: Unknown,
	})
	.loose();

/**
 * A custom field *definition* (not a value). Reference data: the account's
 * field schema, which the agent needs in order to interpret field values.
 */
export const ActiveCampaignField = z
	.object({
		id: z.string(),
		title: S,
		descript: S,
		type: S,
		perstag: S,
		defval: S,
		isrequired: S,
		show_in_list: S,
		visible: S,
		service: S,
		ordernum: S,
		rows: S,
		cols: S,
		cdate: S,
		udate: S,
		created_by: S,
		updated_by: S,
		created_timestamp: S,
		updated_timestamp: S,
		options: Unknown,
		relations: Unknown,
		links: Unknown,
	})
	.loose();

/**
 * A contact's membership of a list, including subscription status. Mirrored
 * because membership is the state an agent segments on; it is updated in place
 * rather than appended.
 */
export const ActiveCampaignContactList = z
	.object({
		id: z.string(),
		contact: S,
		list: S,
		status: S,
		form: S,
		seriesid: S,
		sdate: S,
		udate: S,
		responder: S,
		sync: S,
		unsubreason: S,
		campaign: S,
		message: S,
		first_name: S,
		last_name: S,
		ip4Sub: S,
		ip4Unsub: S,
		ip4_last: S,
		sourceid: S,
		autosyncLog: S,
		unsubscribeAutomation: S,
		automation: S,
		channel: S,
		created_by: S,
		updated_by: S,
		created_timestamp: S,
		updated_timestamp: S,
		links: Unknown,
	})
	.loose();

/**
 * The association between a contact and a tag.
 */
export const ActiveCampaignContactTag = z
	.object({
		id: z.string(),
		contact: S,
		tag: S,
		cdate: S,
		created_by: S,
		updated_by: S,
		created_timestamp: S,
		updated_timestamp: S,
		links: Unknown,
	})
	.loose();

/**
 * A custom field *value* on a contact. Mirrored because agents segment on it -
 * it is updated in place, not appended, so it is reference data rather than a
 * transaction log.
 */
export const ActiveCampaignFieldValue = z
	.object({
		id: z.string(),
		contact: S,
		field: S,
		value: S,
		owner: S,
		cdate: S,
		udate: S,
		created_by: S,
		updated_by: S,
		links: Unknown,
	})
	.loose();

/**
 * One selectable option on a dropdown, radio, checkbox or listbox field.
 */
export const ActiveCampaignFieldOption = z
	.object({
		id: z.string(),
		field: S,
		label: S,
		value: S,
		orderid: S,
		isdefault: S,
		cdate: S,
		udate: S,
		links: Unknown,
	})
	.loose();

/**
 * The association between a custom field and a list.
 */
export const ActiveCampaignFieldRel = z
	.object({
		id: z.string(),
		field: S,
		relid: S,
		dorder: S,
		cdate: S,
		links: Unknown,
	})
	.loose();

/**
 * The association between a custom field and the display group it appears in.
 *
 * The one resource observed returning real JSON numbers rather than strings -
 * see the note at the top of this file. `id` is coerced because the local
 * store keys entities by string.
 */
export const ActiveCampaignGroupMember = z
	.object({
		id: z.coerce.string(),
		rel_id: SN,
		group_id: SN,
		ordernum: SN,
		links: Unknown,
	})
	.loose();

export type ActiveCampaignContact = z.infer<typeof ActiveCampaignContact>;
export type ActiveCampaignFieldValue = z.infer<typeof ActiveCampaignFieldValue>;
export type ActiveCampaignFieldOption = z.infer<
	typeof ActiveCampaignFieldOption
>;
export type ActiveCampaignFieldRel = z.infer<typeof ActiveCampaignFieldRel>;
export type ActiveCampaignGroupMember = z.infer<
	typeof ActiveCampaignGroupMember
>;
export type ActiveCampaignList = z.infer<typeof ActiveCampaignList>;
export type ActiveCampaignTag = z.infer<typeof ActiveCampaignTag>;
export type ActiveCampaignField = z.infer<typeof ActiveCampaignField>;
export type ActiveCampaignContactList = z.infer<
	typeof ActiveCampaignContactList
>;
export type ActiveCampaignContactTag = z.infer<typeof ActiveCampaignContactTag>;
