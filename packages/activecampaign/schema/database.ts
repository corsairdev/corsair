import { z } from 'zod';

/**
 * Locally persisted ActiveCampaign entities.
 *
 * Field names match official JSON keys.
 * Docs: https://developers.activecampaign.com/reference/overview
 *
 * Each field is labeled from the official attribute table / example payload,
 * or as live-observed when this account (2026-08-14) returned a key the docs
 * example omits. Only the primary key is required: ActiveCampaign omits or
 * nulls fields depending on plan, permissions and enabled features.
 *
 * Almost every scalar is a JSON string, including ids (`"1"`), counts (`"0"`)
 * and flags (`"0"` / `"1"`). Newer camelCase resources (`groupMembers`,
 * `dealCustomFieldMeta`, `accountCustomFieldMeta`) return real JSON numbers.
 * Create vs list also disagrees on a few CRM fields (`deal.value` is an
 * integer on POST and a string on GET) — those are unions so a create
 * response is not skipped by the mirror.
 *
 * `schema.test.ts` asserts every captured key is declared here.
 */

/** Nullable-optional string — the shape of nearly every ActiveCampaign field. */
const S = z.string().nullable().optional();
/**
 * Observed as a JSON number on at least one endpoint (or as a string on
 * another). Accepts either so one representation cannot reject the other.
 */
const SN = z.union([z.string(), z.number()]).nullable().optional();
/** Real JSON boolean, or the `"0"`/`"1"`/`1` forms ActiveCampaign also sends. */
const Flag = z
	.union([z.boolean(), z.string(), z.number()])
	.nullable()
	.optional();
/** Sideloaded relation arrays and the `links` object are shape-unstable. */
const Unknown = z.unknown().nullable().optional();

/**
 * A contact. Official:
 * https://developers.activecampaign.com/reference/list-all-contacts
 * Live 2026-08-14: 46 keys. Docs example omits orgname, anonymized, deleted_at,
 * created/updated timestamps, mpp_tracking, last_*_date, sms_consent and
 * whatsapp_* — those are live-observed.
 */
export const ActiveCampaignContact = z
	.object({
		/** Unique id of the contact. */
		id: z.string(),
		/** Email address of the contact. */
		email: S,
		/** First name. */
		firstName: S,
		/** Last name. */
		lastName: S,
		/** Phone number. */
		phone: S,
		/** Organization id (deprecated; use account-contact). Official example. */
		orgid: S,
		/** Organization name. Live-observed 2026-08-14. */
		orgname: S,
		/** Organization id when set, otherwise null. Official example. */
		organization: S,
		/** Creation date. */
		cdate: S,
		/** Last update date. */
		udate: S,
		/** Last activity date. */
		adate: S,
		/** Last email date. */
		edate: S,
		/** Contact hash. */
		hash: S,
		/** Last known IP. */
		ip: S,
		/** Last known user agent. */
		ua: S,
		/** Gravatar flag (`"0"` / `"1"` / `"3"`). */
		gravatar: S,
		/** Soft-deleted flag. */
		deleted: S,
		/** Deletion timestamp. Live-observed 2026-08-14. */
		deleted_at: S,
		/** Anonymized flag. Live-observed 2026-08-14. */
		anonymized: S,
		/** Local part of the email. */
		email_local: S,
		/** Domain part of the email. */
		email_domain: S,
		/** Segment.io identifier. */
		segmentio_id: S,
		/** Hard bounce count. */
		bounced_hard: S,
		/** Soft bounce count. */
		bounced_soft: S,
		/** Last bounce date. */
		bounced_date: S,
		/** Emails sent to this contact. */
		sentcnt: S,
		/** Lead-scoring timestamp. */
		rating_tstamp: S,
		/** Last social-data enrichment check. */
		socialdata_lastcheck: S,
		/** Creating user id. Live-observed 2026-08-14. */
		created_by: S,
		/** Updating user id. Live-observed 2026-08-14. */
		updated_by: S,
		created_utc_timestamp: S,
		updated_utc_timestamp: S,
		created_timestamp: S,
		updated_timestamp: S,
		/** Machine-open tracking flag. Live-observed 2026-08-14. */
		mpp_tracking: S,
		last_click_date: S,
		last_open_date: S,
		last_mpp_open_date: S,
		best_send_hour: S,
		sms_consent: S,
		sms_consent_updated_at: S,
		whatsapp_id: S,
		whatsapp_username: S,
		/** Sideloaded score values. */
		scoreValues: Unknown,
		/** Sideloaded account-contact ids. */
		accountContacts: Unknown,
		links: Unknown,
	})
	.loose();

/**
 * A mailing list. Official:
 * https://developers.activecampaign.com/reference/create-new-list
 * Live 2026-08-14: 52 keys.
 */
export const ActiveCampaignList = z
	.object({
		/** Unique id of the list. */
		id: z.string(),
		/** List name. */
		name: S,
		/** URL-safe list identifier. */
		stringid: S,
		/** Owning user id. */
		userid: S,
		/** Owning user id (duplicate of userid on some payloads). */
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
		/** Official default is true; this plugin sends false on create. */
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

/**
 * A list-to-user-group permission grant. Reference data: it says which group
 * may add, edit, delete or import against a given list.
 */
export const ActiveCampaignListGroup = z
	.object({
		id: z.string(),
		list: S,
		group: S,
		p_list_add: S,
		p_list_edit: S,
		p_list_delete: S,
		p_list_filter: S,
		p_list_sync: S,
		p_message_add: S,
		p_message_edit: S,
		p_message_delete: S,
		p_message_send: S,
		p_subscriber_add: S,
		p_subscriber_edit: S,
		p_subscriber_delete: S,
		p_subscriber_import: S,
		p_subscriber_approve: S,
		links: Unknown,
	})
	.loose();

// ---------------------------------------------------------------------------
// CRM: deals
//
// Official list example: https://developers.activecampaign.com/reference/list-all-deals
// Official create example: https://developers.activecampaign.com/reference/create-a-deal-new
// Live 2026-08-14: deal, dealGroup and dealStage shapes captured after seeding
// a pipeline. Create vs list disagree on types for value/status/isDisabled.
// ---------------------------------------------------------------------------

/**
 * A deal. Official list example + live GET 2026-08-14.
 * POST /deals returns `value` and `status` as JSON numbers; GET returns
 * strings. `isDisabled` is a boolean on a full row and `1` on a permission-
 * limited row.
 */
export const ActiveCampaignDeal = z
	.object({
		/** Unique id of the deal. */
		id: z.string(),
		/** Deal title. */
		title: S,
		description: S,
		/** Value in cents. Integer on create, string on list. */
		value: SN,
		/** 3-letter ISO currency, lowercased. */
		currency: S,
		/** 0 open, 1 won, 2 lost. Integer on create, string on list. */
		status: SN,
		/** Primary contact id. */
		contact: S,
		organization: S,
		/** Pipeline (dealGroup) id. */
		group: S,
		/** Stage id. */
		stage: S,
		/** Owner user id. */
		owner: S,
		percent: SN,
		nextdate: S,
		cdate: S,
		mdate: S,
		edate: S,
		hash: S,
		nextdealid: S,
		nexttaskid: S,
		activitycount: S,
		winProbability: SN,
		winProbabilityMdate: S,
		/** False on a full row; `1` when pipeline permission is missing. */
		isDisabled: Flag,
		account: SN,
		customerAccount: SN,
		fields: Unknown,
		customFieldSaveStatus: Unknown,
		links: Unknown,
	})
	.loose();

/**
 * A pipeline (deal group). Official create-pipeline + live GET 2026-08-14.
 */
export const ActiveCampaignDealGroup = z
	.object({
		/** Unique id of the pipeline. */
		id: z.string(),
		title: S,
		currency: S,
		allgroups: S,
		allusers: S,
		autoassign: S,
		source: S,
		count: S,
		stages: Unknown,
		win_probability_initialize_date: S,
		cdate: S,
		udate: S,
		links: Unknown,
	})
	.loose();

/**
 * A pipeline stage. Official create-deal sideload + live GET 2026-08-14.
 */
export const ActiveCampaignDealStage = z
	.object({
		/** Unique id of the stage. */
		id: z.string(),
		title: S,
		group: S,
		order: S,
		width: S,
		color: S,
		dealOrder: S,
		cardRegion1: S,
		cardRegion2: S,
		cardRegion3: S,
		cardRegion4: S,
		cardRegion5: S,
		cdate: S,
		udate: S,
		links: Unknown,
	})
	.loose();

/** Shape not captured. */
export const ActiveCampaignDealTask = z
	.object({
		id: z.string(),
		title: S,
		note: S,
		relid: S,
		reltype: S,
		dealtasktype: S,
		duedate: S,
		done: S,
		status: S,
		owner: S,
		cdate: S,
		edate: S,
		links: Unknown,
	})
	.loose();

/** Captured 2026-08-13: 13 keys. */
export const ActiveCampaignDealTaskType = z
	.object({
		id: z.string(),
		title: S,
		defduration: S,
		display_order: S,
		status: S,
		cdate: S,
		udate: S,
		created_by: S,
		updated_by: S,
		created_utc_timestamp: S,
		updated_utc_timestamp: S,
		outcomes: Unknown,
		links: Unknown,
	})
	.loose();

/** Captured 2026-08-13: 5 keys. */
export const ActiveCampaignDealRole = z
	.object({
		id: z.string(),
		title: S,
		created_timestamp: S,
		updated_timestamp: S,
		links: Unknown,
	})
	.loose();

/** A task outcome. Live GET 2026-08-14. */
export const ActiveCampaignTaskOutcome = z
	.object({
		id: z.string(),
		title: S,
		sentiment: S,
		disabled: S,
		created_by: S,
		updated_by: S,
		created_utc_timestamp: S,
		updated_utc_timestamp: S,
		dealTasktype_ids: Unknown,
		links: Unknown,
	})
	.loose();

/**
 * A custom field definition for deals.
 *
 * Captured 2026-08-13: 17 keys, camelCase, and it returns real JSON numbers
 * for `isFormVisible`, `isRequired`, `displayOrder`, `knownFieldId` and
 * `hideFieldFlag` - see the note at the top of this file.
 */
export const ActiveCampaignDealCustomFieldMeta = z
	.object({
		id: z.coerce.string(),
		fieldLabel: S,
		fieldType: S,
		fieldDefault: S,
		fieldDefaultCurrency: S,
		fieldOptions: Unknown,
		isFormVisible: SN,
		isRequired: SN,
		displayOrder: SN,
		knownFieldId: SN,
		hideFieldFlag: SN,
		personalization: S,
		createdBy: SN,
		updatedBy: SN,
		createdTimestamp: S,
		updatedTimestamp: S,
		links: Unknown,
	})
	.loose();

/** Same shape as the deal variant. Captured 2026-08-13: 17 keys. */
export const ActiveCampaignAccountCustomFieldMeta =
	ActiveCampaignDealCustomFieldMeta;

// ---------------------------------------------------------------------------
// CRM: accounts
// Official: https://developers.activecampaign.com/reference/list-all-accounts
// Live 2026-08-14: list row plus create extras (fields, customFieldSaveStatus).
// ---------------------------------------------------------------------------

/**
 * A CRM account (organization). Official list example + live GET 2026-08-14.
 * `contactCount` / `dealCount` are strings; omitted unless `count_deals=true`.
 */
export const ActiveCampaignAccount = z
	.object({
		/** Unique id of the account. */
		id: z.coerce.string(),
		/** Account name. Must be unique. */
		name: S,
		accountUrl: S,
		owner: S,
		contactCount: SN,
		dealCount: SN,
		createdTimestamp: S,
		updatedTimestamp: S,
		fields: Unknown,
		customFieldSaveStatus: Unknown,
		links: Unknown,
	})
	.loose();

/** Shape not captured. */
export const ActiveCampaignAccountContact = z
	.object({
		id: z.coerce.string(),
		contact: S,
		account: S,
		jobTitle: S,
		createdTimestamp: S,
		updatedTimestamp: S,
		links: Unknown,
	})
	.loose();

// ---------------------------------------------------------------------------
// Content: notes, campaigns, messages, templates, forms, personalizations
// ---------------------------------------------------------------------------

/**
 * A note. Official create-note + live GET 2026-08-14.
 * `owner` is `{ type, id }`, not a string.
 */
export const ActiveCampaignNote = z
	.object({
		id: z.string(),
		note: S,
		reltype: S,
		relid: S,
		cdate: S,
		mdate: S,
		userid: S,
		user: S,
		is_draft: S,
		owner: Unknown,
		links: Unknown,
	})
	.loose();

/** Shape not captured - the trial account has sent no campaigns. */
export const ActiveCampaignCampaign = z
	.object({
		id: z.string(),
		name: S,
		type: S,
		status: S,
		sdate: S,
		mdate: S,
		ldate: S,
		send_amt: S,
		total_amt: S,
		opens: S,
		uniqueopens: S,
		linkclicks: S,
		uniquelinkclicks: S,
		subscriberclicks: S,
		unsubscribes: S,
		hardbounces: S,
		softbounces: S,
		links: Unknown,
	})
	.loose();

/** Captured 2026-08-13: 28 keys. */
export const ActiveCampaignMessage = z
	.object({
		id: z.string(),
		name: S,
		subject: S,
		preheader_text: S,
		fromname: S,
		fromemail: S,
		reply2: S,
		html: S,
		text: S,
		htmlfetch: S,
		textfetch: S,
		charset: S,
		encoding: S,
		format: S,
		language_code: S,
		priority: S,
		source: S,
		hidden: S,
		user: S,
		userid: S,
		cdate: S,
		mdate: S,
		ed_instanceid: S,
		ed_version: S,
		has_predictive_content: S,
		preview_data: Unknown,
		preview_mime: S,
		links: Unknown,
	})
	.loose();

/** Shape not captured. */
export const ActiveCampaignTemplate = z
	.object({
		id: z.string(),
		name: S,
		subject: S,
		content: S,
		categoryid: S,
		userid: S,
		cdate: S,
		mdate: S,
		links: Unknown,
	})
	.loose();

/** Shape not captured. */
export const ActiveCampaignSavedResponse = z
	.object({
		id: z.string(),
		title: S,
		subject: S,
		body: S,
		userid: S,
		cdate: S,
		mdate: S,
		links: Unknown,
	})
	.loose();

/** Shape not captured. */
export const ActiveCampaignForm = z
	.object({
		id: z.string(),
		name: S,
		action: S,
		layout: S,
		style: S,
		cdate: S,
		udate: S,
		links: Unknown,
	})
	.loose();

/** A personalization variable. Shape not captured. */
export const ActiveCampaignPersonalization = z
	.object({
		id: z.string(),
		name: S,
		tag: S,
		content: S,
		format: S,
		locked: S,
		cdate: S,
		udate: S,
		links: Unknown,
	})
	.loose();

// ---------------------------------------------------------------------------
// Automations and segments
// ---------------------------------------------------------------------------

/** Shape not captured. */
export const ActiveCampaignAutomation = z
	.object({
		id: z.string(),
		name: S,
		status: S,
		entered: S,
		exited: S,
		cdate: S,
		mdate: S,
		links: Unknown,
	})
	.loose();

/** Captured 2026-08-13: 11 keys. */
export const ActiveCampaignSegment = z
	.object({
		id: z.string(),
		name: S,
		logic: S,
		hidden: S,
		seriesid: S,
		segmentid_v2: S,
		created_by: S,
		updated_by: S,
		created_timestamp: S,
		updated_timestamp: S,
		links: Unknown,
	})
	.loose();

// ---------------------------------------------------------------------------
// E-commerce reference data
//
// Orders, order products and order activities are deliberately not mirrored:
// they are transactional, appended continuously, and only meaningful against a
// date range. Connections and customers are reference data and are mirrored.
// ---------------------------------------------------------------------------

/**
 * A Deep Data connection. Official create-connection + live GET 2026-08-14.
 * `isInternal` and `listId` are integers on create, strings on list.
 */
export const ActiveCampaignConnection = z
	.object({
		id: z.string(),
		service: S,
		serviceName: S,
		externalid: S,
		name: S,
		logoUrl: S,
		linkUrl: S,
		status: S,
		syncStatus: S,
		connectionType: S,
		isInternal: SN,
		listId: SN,
		planTier: S,
		lastSync: S,
		sync_request_time: S,
		sync_start_time: S,
		credentialExpiration: S,
		disconnectDate: S,
		cdate: S,
		udate: S,
		links: Unknown,
	})
	.loose();

/** Shape not captured. */
export const ActiveCampaignEcomCustomer = z
	.object({
		id: z.string(),
		connectionid: S,
		externalid: S,
		email: S,
		totalRevenue: S,
		totalOrders: S,
		totalProducts: S,
		avgRevenuePerOrder: S,
		avgProductCategory: S,
		acceptsMarketing: S,
		links: Unknown,
	})
	.loose();

// ---------------------------------------------------------------------------
// Account administration
// ---------------------------------------------------------------------------

/** Captured 2026-08-13: 12 keys. */
export const ActiveCampaignUser = z
	.object({
		id: z.string(),
		username: S,
		email: S,
		firstName: S,
		lastName: S,
		phone: S,
		signature: S,
		lang: S,
		localZoneid: S,
		mfaEnabled: SN,
		roles: Unknown,
		links: Unknown,
	})
	.loose();

/**
 * A permission group. Captured 2026-08-13 with 99 keys, nearly all of them
 * individual `pg*` permission flags. Only the identifying fields are declared;
 * the rest are preserved by `.loose()` rather than transcribed, because the
 * flag set changes whenever ActiveCampaign ships a feature.
 */
export const ActiveCampaignGroup = z
	.object({
		id: z.string(),
		title: S,
		descript: S,
		p_admin: S,
		sdate: S,
		unsubscribelink: S,
		optinconfirm: S,
		socialdata: S,
		reqApproval: S,
		links: Unknown,
	})
	.loose();

/** Captured 2026-08-13: 14 keys. */
export const ActiveCampaignGroupLimit = z
	.object({
		id: z.string(),
		group: S,
		groupid: S,
		limitContact: S,
		limitList: S,
		limitCampaign: S,
		limitCampaignType: S,
		limitMail: S,
		limitMailType: S,
		limitUser: S,
		limitAttachment: S,
		abuseRatio: S,
		forceSenderInfo: S,
		links: Unknown,
	})
	.loose();

/**
 * A company address. Live POST+GET 2026-08-14.
 * Official JSON key is `companyName`, not `company`. `isDefault` is an
 * integer on create and a string on list. `allgroup` is the list key.
 */
export const ActiveCampaignAddress = z
	.object({
		id: z.string(),
		companyName: S,
		address1: S,
		address2: S,
		city: S,
		state: S,
		district: S,
		zip: S,
		country: S,
		isDefault: SN,
		allgroup: S,
		smsName: S,
		created_by: S,
		updated_by: S,
		created_timestamp: S,
		updated_timestamp: S,
		links: Unknown,
	})
	.loose();

/**
 * A calendar feed. Live GET 2026-08-14.
 */
export const ActiveCampaignCalendar = z
	.object({
		id: z.string(),
		title: S,
		type: S,
		token: S,
		userid: S,
		notification: S,
		cdate: S,
		mdate: S,
		links: Unknown,
	})
	.loose();

/** Captured 2026-08-13: 8 keys. */
export const ActiveCampaignScore = z
	.object({
		id: z.string(),
		name: S,
		descript: S,
		reltype: S,
		status: S,
		cdate: S,
		mdate: S,
		links: Unknown,
	})
	.loose();

/** Captured 2026-08-13: 24 keys. */
export const ActiveCampaignBranding = z
	.object({
		id: z.string(),
		siteName: S,
		groupid: S,
		siteLogo: S,
		siteLogoSmall: S,
		favicon: S,
		copyright: S,
		license: S,
		help: S,
		version: S,
		headerHtmlValue: S,
		headerTextValue: S,
		footerHtmlValue: S,
		footerTextValue: S,
		publicTemplateCss: S,
		publicTemplateHtm: S,
		adminTemplateCss: S,
		adminTemplateHtm: S,
		admin_template_css_backup: S,
		admin_template_htm_backup: S,
		zendeskWidgetEnabled: S,
		created_timestamp: S,
		updated_timestamp: S,
		links: Unknown,
	})
	.loose();

/** A custom object schema. Shape not captured. */
export const ActiveCampaignCustomObjectSchema = z
	.object({
		id: z.coerce.string(),
		slug: S,
		name: S,
		description: S,
		labels: Unknown,
		fields: Unknown,
		relationships: Unknown,
		createdTimestamp: S,
		updatedTimestamp: S,
		links: Unknown,
	})
	.loose();

/**
 * A webhook subscription. Official create-webhook + live GET 2026-08-14.
 */
export const ActiveCampaignWebhook = z
	.object({
		id: z.string(),
		name: S,
		url: S,
		events: Unknown,
		sources: Unknown,
		listid: S,
		cdate: S,
		state: S,
		deactivated_date: S,
		links: Unknown,
	})
	.loose();

/** A whitelisted event-tracking event name. Shape not captured. */
export const ActiveCampaignEventTrackingEvent = z
	.object({
		id: z.string(),
		name: S,
		links: Unknown,
	})
	.loose();

export type ActiveCampaignContact = z.infer<typeof ActiveCampaignContact>;
export type ActiveCampaignListGroup = z.infer<typeof ActiveCampaignListGroup>;
export type ActiveCampaignDeal = z.infer<typeof ActiveCampaignDeal>;
export type ActiveCampaignDealGroup = z.infer<typeof ActiveCampaignDealGroup>;
export type ActiveCampaignDealStage = z.infer<typeof ActiveCampaignDealStage>;
export type ActiveCampaignDealTask = z.infer<typeof ActiveCampaignDealTask>;
export type ActiveCampaignDealTaskType = z.infer<
	typeof ActiveCampaignDealTaskType
>;
export type ActiveCampaignDealRole = z.infer<typeof ActiveCampaignDealRole>;
export type ActiveCampaignTaskOutcome = z.infer<
	typeof ActiveCampaignTaskOutcome
>;
export type ActiveCampaignDealCustomFieldMeta = z.infer<
	typeof ActiveCampaignDealCustomFieldMeta
>;
export type ActiveCampaignAccount = z.infer<typeof ActiveCampaignAccount>;
export type ActiveCampaignAccountContact = z.infer<
	typeof ActiveCampaignAccountContact
>;
export type ActiveCampaignNote = z.infer<typeof ActiveCampaignNote>;
export type ActiveCampaignCampaign = z.infer<typeof ActiveCampaignCampaign>;
export type ActiveCampaignMessage = z.infer<typeof ActiveCampaignMessage>;
export type ActiveCampaignTemplate = z.infer<typeof ActiveCampaignTemplate>;
export type ActiveCampaignSavedResponse = z.infer<
	typeof ActiveCampaignSavedResponse
>;
export type ActiveCampaignForm = z.infer<typeof ActiveCampaignForm>;
export type ActiveCampaignPersonalization = z.infer<
	typeof ActiveCampaignPersonalization
>;
export type ActiveCampaignAutomation = z.infer<typeof ActiveCampaignAutomation>;
export type ActiveCampaignSegment = z.infer<typeof ActiveCampaignSegment>;
export type ActiveCampaignConnection = z.infer<typeof ActiveCampaignConnection>;
export type ActiveCampaignEcomCustomer = z.infer<
	typeof ActiveCampaignEcomCustomer
>;
export type ActiveCampaignUser = z.infer<typeof ActiveCampaignUser>;
export type ActiveCampaignGroup = z.infer<typeof ActiveCampaignGroup>;
export type ActiveCampaignGroupLimit = z.infer<typeof ActiveCampaignGroupLimit>;
export type ActiveCampaignAddress = z.infer<typeof ActiveCampaignAddress>;
export type ActiveCampaignCalendar = z.infer<typeof ActiveCampaignCalendar>;
export type ActiveCampaignScore = z.infer<typeof ActiveCampaignScore>;
export type ActiveCampaignBranding = z.infer<typeof ActiveCampaignBranding>;
export type ActiveCampaignCustomObjectSchema = z.infer<
	typeof ActiveCampaignCustomObjectSchema
>;
export type ActiveCampaignWebhook = z.infer<typeof ActiveCampaignWebhook>;
export type ActiveCampaignEventTrackingEvent = z.infer<
	typeof ActiveCampaignEventTrackingEvent
>;
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
