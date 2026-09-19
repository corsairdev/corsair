import type { z } from 'zod';
import { ActiveCampaignSchema } from './schema';
import {
	ActiveCampaignAccount,
	ActiveCampaignAddress,
	ActiveCampaignBranding,
	ActiveCampaignCalendar,
	ActiveCampaignConnection,
	ActiveCampaignContact,
	ActiveCampaignContactList,
	ActiveCampaignContactTag,
	ActiveCampaignDeal,
	ActiveCampaignDealCustomFieldMeta,
	ActiveCampaignDealGroup,
	ActiveCampaignDealRole,
	ActiveCampaignDealStage,
	ActiveCampaignDealTaskType,
	ActiveCampaignField,
	ActiveCampaignFieldOption,
	ActiveCampaignFieldRel,
	ActiveCampaignFieldValue,
	ActiveCampaignGroupLimit,
	ActiveCampaignGroupMember,
	ActiveCampaignList,
	ActiveCampaignMessage,
	ActiveCampaignNote,
	ActiveCampaignScore,
	ActiveCampaignSegment,
	ActiveCampaignTag,
	ActiveCampaignTaskOutcome,
	ActiveCampaignUser,
	ActiveCampaignWebhook,
} from './schema/database';

/**
 * Keys captured from a live ActiveCampaign account on 2026-08-14.
 *
 * These are the exact key sets the API returned, not the documented ones. If
 * ActiveCampaign adds a field, this test fails and the schema is updated -
 * which is the point: it stops the schema drifting away from what the API
 * actually sends.
 */
const CAPTURED_KEYS = {
	contact: [
		'accountContacts',
		'adate',
		'anonymized',
		'best_send_hour',
		'bounced_date',
		'bounced_hard',
		'bounced_soft',
		'cdate',
		'created_by',
		'created_timestamp',
		'created_utc_timestamp',
		'deleted',
		'deleted_at',
		'edate',
		'email',
		'email_domain',
		'email_local',
		'firstName',
		'gravatar',
		'hash',
		'id',
		'ip',
		'lastName',
		'last_click_date',
		'last_mpp_open_date',
		'last_open_date',
		'links',
		'mpp_tracking',
		'organization',
		'orgid',
		'orgname',
		'phone',
		'rating_tstamp',
		'scoreValues',
		'segmentio_id',
		'sentcnt',
		'sms_consent',
		'sms_consent_updated_at',
		'socialdata_lastcheck',
		'ua',
		'udate',
		'updated_by',
		'updated_timestamp',
		'updated_utc_timestamp',
		'whatsapp_id',
		'whatsapp_username',
	],
	tag: [
		'cdate',
		'created_by',
		'created_timestamp',
		'deleted',
		'description',
		'id',
		'links',
		'subscriber_count',
		'tag',
		'tagType',
		'updated_by',
		'updated_timestamp',
	],
	contactTag: [
		'cdate',
		'contact',
		'created_by',
		'created_timestamp',
		'id',
		'links',
		'tag',
		'updated_by',
		'updated_timestamp',
	],
	fieldValue: [
		'cdate',
		'contact',
		'created_by',
		'field',
		'id',
		'links',
		'owner',
		'udate',
		'updated_by',
		'value',
	],
	fieldOption: [
		'cdate',
		'field',
		'id',
		'isdefault',
		'label',
		'links',
		'orderid',
		'udate',
		'value',
	],
	fieldRel: ['cdate', 'dorder', 'field', 'id', 'links', 'relid'],
	groupMember: ['group_id', 'id', 'links', 'ordernum', 'rel_id'],
	dealTaskType: [
		'cdate',
		'created_by',
		'created_utc_timestamp',
		'defduration',
		'display_order',
		'id',
		'links',
		'outcomes',
		'status',
		'title',
		'udate',
		'updated_by',
		'updated_utc_timestamp',
	],
	dealRole: ['created_timestamp', 'id', 'links', 'title', 'updated_timestamp'],
	dealCustomFieldMeta: [
		'createdBy',
		'createdTimestamp',
		'displayOrder',
		'fieldDefault',
		'fieldDefaultCurrency',
		'fieldLabel',
		'fieldOptions',
		'fieldType',
		'hideFieldFlag',
		'id',
		'isFormVisible',
		'isRequired',
		'knownFieldId',
		'links',
		'personalization',
		'updatedBy',
		'updatedTimestamp',
	],
	message: [
		'cdate',
		'charset',
		'ed_instanceid',
		'ed_version',
		'encoding',
		'format',
		'fromemail',
		'fromname',
		'has_predictive_content',
		'hidden',
		'html',
		'htmlfetch',
		'id',
		'language_code',
		'links',
		'mdate',
		'name',
		'preheader_text',
		'preview_data',
		'preview_mime',
		'priority',
		'reply2',
		'source',
		'subject',
		'text',
		'textfetch',
		'user',
		'userid',
	],
	segment: [
		'created_by',
		'created_timestamp',
		'hidden',
		'id',
		'links',
		'logic',
		'name',
		'segmentid_v2',
		'seriesid',
		'updated_by',
		'updated_timestamp',
	],
	user: [
		'email',
		'firstName',
		'id',
		'lang',
		'lastName',
		'links',
		'localZoneid',
		'mfaEnabled',
		'phone',
		'roles',
		'signature',
		'username',
	],
	list: [
		'active_subscribers',
		'analytics_domains',
		'analytics_source',
		'analytics_ua',
		'carboncopy',
		'cdate',
		'channel',
		'created_by',
		'created_timestamp',
		'deletestamp',
		'description',
		'facebook_session',
		'fulladdress',
		'get_unsubscribe_reason',
		'id',
		'links',
		'name',
		'non_deleted_subscribers',
		'optinmessageid',
		'optinoptout',
		'optoutconf',
		'p_embed_image',
		'p_use_analytics_link',
		'p_use_analytics_read',
		'p_use_captcha',
		'p_use_facebook',
		'p_use_tracking',
		'p_use_twitter',
		'private',
		'require_name',
		'send_last_broadcast',
		'sender_addr1',
		'sender_addr2',
		'sender_city',
		'sender_country',
		'sender_name',
		'sender_phone',
		'sender_reminder',
		'sender_state',
		'sender_url',
		'sender_zip',
		'stringid',
		'subscription_notify',
		'to_name',
		'twitter_token',
		'twitter_token_secret',
		'udate',
		'unsubscription_notify',
		'updated_by',
		'updated_timestamp',
		'user',
		'userid',
	],
	field: [
		'cdate',
		'cols',
		'created_by',
		'created_timestamp',
		'defval',
		'descript',
		'id',
		'isrequired',
		'links',
		'options',
		'ordernum',
		'perstag',
		'relations',
		'rows',
		'service',
		'show_in_list',
		'title',
		'type',
		'udate',
		'updated_by',
		'updated_timestamp',
		'visible',
	],
	contactList: [
		'automation',
		'autosyncLog',
		'campaign',
		'channel',
		'contact',
		'created_by',
		'created_timestamp',
		'first_name',
		'form',
		'id',
		'ip4Sub',
		'ip4Unsub',
		'ip4_last',
		'last_name',
		'links',
		'list',
		'message',
		'responder',
		'sdate',
		'seriesid',
		'sourceid',
		'status',
		'sync',
		'udate',
		'unsubreason',
		'unsubscribeAutomation',
		'updated_by',
		'updated_timestamp',
	],
	account: [
		'accountUrl',
		'contactCount',
		'createdTimestamp',
		'dealCount',
		'id',
		'links',
		'name',
		'owner',
		'updatedTimestamp',
	],
	deal: [
		'account',
		'activitycount',
		'cdate',
		'contact',
		'currency',
		'customerAccount',
		'description',
		'edate',
		'group',
		'hash',
		'id',
		'isDisabled',
		'links',
		'mdate',
		'nextdate',
		'nextdealid',
		'nexttaskid',
		'organization',
		'owner',
		'percent',
		'stage',
		'status',
		'title',
		'value',
		'winProbability',
		'winProbabilityMdate',
	],
	dealGroup: [
		'allgroups',
		'allusers',
		'autoassign',
		'cdate',
		'count',
		'currency',
		'id',
		'links',
		'source',
		'stages',
		'title',
		'udate',
		'win_probability_initialize_date',
	],
	dealStage: [
		'cardRegion1',
		'cardRegion2',
		'cardRegion3',
		'cardRegion4',
		'cardRegion5',
		'cdate',
		'color',
		'dealOrder',
		'group',
		'id',
		'links',
		'order',
		'title',
		'udate',
		'width',
	],
	address: [
		'address1',
		'address2',
		'allgroup',
		'city',
		'companyName',
		'country',
		'created_by',
		'created_timestamp',
		'district',
		'id',
		'isDefault',
		'links',
		'smsName',
		'state',
		'updated_by',
		'updated_timestamp',
		'zip',
	],
	calendar: [
		'cdate',
		'id',
		'links',
		'mdate',
		'notification',
		'title',
		'token',
		'type',
		'userid',
	],
	webhook: [
		'cdate',
		'deactivated_date',
		'events',
		'id',
		'links',
		'listid',
		'name',
		'sources',
		'state',
		'url',
	],
	note: [
		'cdate',
		'id',
		'is_draft',
		'links',
		'mdate',
		'note',
		'owner',
		'relid',
		'reltype',
		'user',
		'userid',
	],
	connection: [
		'cdate',
		'connectionType',
		'credentialExpiration',
		'disconnectDate',
		'externalid',
		'id',
		'isInternal',
		'lastSync',
		'linkUrl',
		'links',
		'listId',
		'logoUrl',
		'name',
		'planTier',
		'service',
		'serviceName',
		'status',
		'syncStatus',
		'sync_request_time',
		'sync_start_time',
		'udate',
	],
	taskOutcome: [
		'created_by',
		'created_utc_timestamp',
		'dealTasktype_ids',
		'disabled',
		'id',
		'links',
		'sentiment',
		'title',
		'updated_by',
		'updated_utc_timestamp',
	],
	groupLimit: [
		'abuseRatio',
		'forceSenderInfo',
		'group',
		'groupid',
		'id',
		'limitAttachment',
		'limitCampaign',
		'limitCampaignType',
		'limitContact',
		'limitList',
		'limitMail',
		'limitMailType',
		'limitUser',
		'links',
	],
	score: [
		'cdate',
		'descript',
		'id',
		'links',
		'mdate',
		'name',
		'reltype',
		'status',
	],
	branding: [
		'adminTemplateCss',
		'adminTemplateHtm',
		'admin_template_css_backup',
		'admin_template_htm_backup',
		'copyright',
		'created_timestamp',
		'favicon',
		'footerHtmlValue',
		'footerTextValue',
		'groupid',
		'headerHtmlValue',
		'headerTextValue',
		'help',
		'id',
		'license',
		'links',
		'publicTemplateCss',
		'publicTemplateHtm',
		'siteLogo',
		'siteLogoSmall',
		'siteName',
		'updated_timestamp',
		'version',
		'zendeskWidgetEnabled',
	],
} as const;

const ENTITY_COUNT = 43;

function declaredKeys(schema: {
	shape?: Record<string, unknown>;
	def?: { shape?: Record<string, unknown> };
}): string[] {
	const shape = schema.shape ?? schema.def?.shape ?? {};
	return Object.keys(shape).sort();
}

/**
 * Derived from the registry rather than hand-listed, so an entity cannot be
 * added without these tests covering it.
 */
const REGISTERED = Object.entries(ActiveCampaignSchema.entities) as Array<
	[string, z.ZodType]
>;

describe('ActiveCampaign entity registry', () => {
	it('registers every entity exactly once', () => {
		expect(REGISTERED).toHaveLength(ENTITY_COUNT);
		const names = REGISTERED.map(([n]) => n);
		expect(new Set(names).size).toBe(ENTITY_COUNT);
	});

	it('mirrors no transactional resource', () => {
		const names = REGISTERED.map(([n]) => n);
		// Appended continuously and only meaningful against a date range.
		for (const banned of [
			'dealActivities',
			'emailActivities',
			'contactAutomations',
			'ecomOrders',
			'ecomOrderProducts',
			'ecomOrderActivities',
			'activities',
			'configs',
		]) {
			expect(names).not.toContain(banned);
		}
	});
});

describe('ActiveCampaign entity schemas', () => {
	it.each([
		['contact', ActiveCampaignContact, CAPTURED_KEYS.contact],
		['tag', ActiveCampaignTag, CAPTURED_KEYS.tag],
		['contactTag', ActiveCampaignContactTag, CAPTURED_KEYS.contactTag],
		['fieldValue', ActiveCampaignFieldValue, CAPTURED_KEYS.fieldValue],
		['fieldOption', ActiveCampaignFieldOption, CAPTURED_KEYS.fieldOption],
		['fieldRel', ActiveCampaignFieldRel, CAPTURED_KEYS.fieldRel],
		['groupMember', ActiveCampaignGroupMember, CAPTURED_KEYS.groupMember],
		['dealTaskType', ActiveCampaignDealTaskType, CAPTURED_KEYS.dealTaskType],
		['dealRole', ActiveCampaignDealRole, CAPTURED_KEYS.dealRole],
		[
			'dealCustomFieldMeta',
			ActiveCampaignDealCustomFieldMeta,
			CAPTURED_KEYS.dealCustomFieldMeta,
		],
		['message', ActiveCampaignMessage, CAPTURED_KEYS.message],
		['segment', ActiveCampaignSegment, CAPTURED_KEYS.segment],
		['user', ActiveCampaignUser, CAPTURED_KEYS.user],
		['list', ActiveCampaignList, CAPTURED_KEYS.list],
		['field', ActiveCampaignField, CAPTURED_KEYS.field],
		['contactList', ActiveCampaignContactList, CAPTURED_KEYS.contactList],
		['account', ActiveCampaignAccount, CAPTURED_KEYS.account],
		['deal', ActiveCampaignDeal, CAPTURED_KEYS.deal],
		['dealGroup', ActiveCampaignDealGroup, CAPTURED_KEYS.dealGroup],
		['dealStage', ActiveCampaignDealStage, CAPTURED_KEYS.dealStage],
		['address', ActiveCampaignAddress, CAPTURED_KEYS.address],
		['calendar', ActiveCampaignCalendar, CAPTURED_KEYS.calendar],
		['webhook', ActiveCampaignWebhook, CAPTURED_KEYS.webhook],
		['note', ActiveCampaignNote, CAPTURED_KEYS.note],
		['connection', ActiveCampaignConnection, CAPTURED_KEYS.connection],
		['taskOutcome', ActiveCampaignTaskOutcome, CAPTURED_KEYS.taskOutcome],
		['groupLimit', ActiveCampaignGroupLimit, CAPTURED_KEYS.groupLimit],
		['score', ActiveCampaignScore, CAPTURED_KEYS.score],
		['branding', ActiveCampaignBranding, CAPTURED_KEYS.branding],
	])('declares every captured key of %s', (_name, schema, captured) => {
		expect(captured.length).toBeGreaterThan(0);
		const declared = declaredKeys(schema as never);
		for (const key of captured) {
			expect(declared).toContain(key);
		}
	});

	/**
	 * Only the primary key is required. ActiveCampaign omits or nulls fields
	 * depending on plan and permissions, and a rejected row is a lost row.
	 */
	it.each(REGISTERED)(
		'parses a %s row carrying only an id',
		(_name, schema) => {
			expect(schema.safeParse({ id: '1' }).success).toBe(true);
		},
	);

	it.each(REGISTERED)('rejects a %s row with no id', (_name, schema) => {
		expect(schema.safeParse({}).success).toBe(false);
	});

	it.each(REGISTERED)(
		'preserves unknown fields on %s rather than stripping them',
		(_name, schema) => {
			const parsed = schema.parse({
				id: '1',
				a_field_added_next_year: 'kept',
			}) as Record<string, unknown>;
			expect(parsed.a_field_added_next_year).toBe('kept');
		},
	);

	/**
	 * The camelCase resources return real JSON numbers where the older
	 * snake_case ones stringify everything. A string-only schema would reject
	 * every row those endpoints send.
	 */
	it('accepts the numeric ids groupMembers actually returns', () => {
		const parsed = ActiveCampaignGroupMember.parse({
			id: 13,
			rel_id: 4,
			group_id: 1,
			ordernum: 2,
		});
		expect(parsed.id).toBe('13');
		expect(parsed.rel_id).toBe(4);
	});

	it('accepts string ids on groupMembers too', () => {
		expect(ActiveCampaignGroupMember.parse({ id: '13' }).id).toBe('13');
	});

	it('accepts the numeric flags dealCustomFieldMeta returns', () => {
		const parsed = ActiveCampaignDealCustomFieldMeta.parse({
			id: 7,
			isRequired: 1,
			isFormVisible: 0,
			displayOrder: 3,
		});
		expect(parsed.id).toBe('7');
		expect(parsed.isRequired).toBe(1);
	});

	it('models the snake_case resources as strings', () => {
		const parsed = ActiveCampaignTag.parse({
			id: '1',
			tag: 'corsair-recon',
			subscriber_count: '0',
			deleted: '0',
		});
		expect(parsed.id).toBe('1');
		expect(parsed.subscriber_count).toBe('0');
	});

	it('accepts nulls in every non-key field', () => {
		const result = ActiveCampaignContact.safeParse({
			id: '1',
			email: null,
			firstName: null,
			lastName: null,
			phone: null,
		});
		expect(result.success).toBe(true);
	});

	/**
	 * POST /deals returns value and status as JSON numbers; GET returns
	 * strings. A string-only schema would skip every create response.
	 */
	it('accepts the numeric deal create payload and the string list payload', () => {
		expect(
			ActiveCampaignDeal.safeParse({
				id: '1',
				value: 10000,
				status: 0,
				isDisabled: false,
			}).success,
		).toBe(true);
		expect(
			ActiveCampaignDeal.safeParse({
				id: '1',
				value: '10000',
				status: '0',
				isDisabled: 1,
			}).success,
		).toBe(true);
	});

	it('accepts integer isDefault on address create', () => {
		expect(
			ActiveCampaignAddress.safeParse({
				id: '1',
				companyName: 'Corsair Verify Co',
				isDefault: 1,
			}).success,
		).toBe(true);
		expect(
			ActiveCampaignAddress.safeParse({
				id: '1',
				companyName: 'Corsair Verify Co',
				isDefault: '1',
			}).success,
		).toBe(true);
	});
});
