import { ActiveCampaignSchema } from './schema';
import {
	ActiveCampaignContact,
	ActiveCampaignContactList,
	ActiveCampaignContactTag,
	ActiveCampaignField,
	ActiveCampaignFieldOption,
	ActiveCampaignFieldRel,
	ActiveCampaignFieldValue,
	ActiveCampaignGroupMember,
	ActiveCampaignList,
	ActiveCampaignTag,
} from './schema/database';

/**
 * Keys captured from a live ActiveCampaign account on 2026-08-13.
 *
 * These are the exact key sets the API returned, not the documented ones. If
 * ActiveCampaign adds a field, this test fails and the schema is updated -
 * which is the point: it stops the schema drifting away from what the API
 * actually sends.
 */
const CAPTURED_KEYS = {
	contact: [
		'accountContacts', 'adate', 'anonymized', 'best_send_hour', 'bounced_date',
		'bounced_hard', 'bounced_soft', 'cdate', 'created_by', 'created_timestamp',
		'created_utc_timestamp', 'deleted', 'deleted_at', 'edate', 'email',
		'email_domain', 'email_local', 'firstName', 'gravatar', 'hash', 'id', 'ip',
		'lastName', 'last_click_date', 'last_mpp_open_date', 'last_open_date',
		'links', 'mpp_tracking', 'organization', 'orgid', 'orgname', 'phone',
		'rating_tstamp', 'scoreValues', 'segmentio_id', 'sentcnt', 'sms_consent',
		'sms_consent_updated_at', 'socialdata_lastcheck', 'ua', 'udate',
		'updated_by', 'updated_timestamp', 'updated_utc_timestamp', 'whatsapp_id',
		'whatsapp_username',
	],
	tag: [
		'cdate', 'created_by', 'created_timestamp', 'deleted', 'description', 'id',
		'links', 'subscriber_count', 'tag', 'tagType', 'updated_by',
		'updated_timestamp',
	],
	contactTag: [
		'cdate', 'contact', 'created_by', 'created_timestamp', 'id', 'links', 'tag',
		'updated_by', 'updated_timestamp',
	],
	fieldValue: [
		'cdate', 'contact', 'created_by', 'field', 'id', 'links', 'owner', 'udate',
		'updated_by', 'value',
	],
	fieldOption: [
		'cdate', 'field', 'id', 'isdefault', 'label', 'links', 'orderid', 'udate',
		'value',
	],
	fieldRel: ['cdate', 'dorder', 'field', 'id', 'links', 'relid'],
	groupMember: ['group_id', 'id', 'links', 'ordernum', 'rel_id'],
} as const;

function declaredKeys(schema: {
	shape?: Record<string, unknown>;
	def?: { shape?: Record<string, unknown> };
}): string[] {
	const shape = schema.shape ?? schema.def?.shape ?? {};
	return Object.keys(shape).sort();
}

describe('ActiveCampaign entity schemas', () => {
	it('registers ten entities', () => {
		const entities = Object.keys(ActiveCampaignSchema.entities).sort();
		expect(entities).toEqual([
			'contactLists',
			'contactTags',
			'contacts',
			'fieldOptions',
			'fieldRels',
			'fieldValues',
			'fields',
			'groupMembers',
			'lists',
			'tags',
		]);
		expect(entities).toHaveLength(10);
	});

	it.each([
		['contact', ActiveCampaignContact, CAPTURED_KEYS.contact],
		['tag', ActiveCampaignTag, CAPTURED_KEYS.tag],
		['contactTag', ActiveCampaignContactTag, CAPTURED_KEYS.contactTag],
		['fieldValue', ActiveCampaignFieldValue, CAPTURED_KEYS.fieldValue],
		['fieldOption', ActiveCampaignFieldOption, CAPTURED_KEYS.fieldOption],
		['fieldRel', ActiveCampaignFieldRel, CAPTURED_KEYS.fieldRel],
		['groupMember', ActiveCampaignGroupMember, CAPTURED_KEYS.groupMember],
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
	const ALL_ENTITIES = [
		['contact', ActiveCampaignContact],
		['list', ActiveCampaignList],
		['tag', ActiveCampaignTag],
		['field', ActiveCampaignField],
		['contactList', ActiveCampaignContactList],
		['contactTag', ActiveCampaignContactTag],
		['fieldValue', ActiveCampaignFieldValue],
		['fieldOption', ActiveCampaignFieldOption],
		['fieldRel', ActiveCampaignFieldRel],
		['groupMember', ActiveCampaignGroupMember],
	] as const;

	it.each(ALL_ENTITIES)(
		'parses an %s row carrying only an id',
		(_name, schema) => {
			expect(schema.safeParse({ id: '1' }).success).toBe(true);
		},
	);

	it.each(ALL_ENTITIES)('rejects an %s row with no id', (_name, schema) => {
		expect(schema.safeParse({}).success).toBe(false);
	});

	/**
	 * groupMembers is the one resource observed returning real JSON numbers.
	 * A string-only id would reject every row it sends.
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

	/**
	 * ActiveCampaign returns every scalar as a string, including ids and
	 * counts. A schema expecting numbers would reject every real row.
	 */
	it('models numeric-looking fields as strings', () => {
		const parsed = ActiveCampaignTag.parse({
			id: '1',
			tag: 'corsair-recon',
			subscriber_count: '0',
			deleted: '0',
		});
		expect(parsed.id).toBe('1');
		expect(parsed.subscriber_count).toBe('0');
	});

	/** Loose objects keep fields ActiveCampaign adds later. */
	it('preserves unknown fields rather than stripping them', () => {
		const parsed = ActiveCampaignContact.parse({
			id: '1',
			a_field_added_next_year: 'kept',
		}) as Record<string, unknown>;
		expect(parsed.a_field_added_next_year).toBe('kept');
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
});
