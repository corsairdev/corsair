import { z } from 'zod';
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
} from '../schema/database';

/**
 * Input and output schemas, one pair per operation.
 *
 * Outputs reuse the entity definitions from `schema/database.ts` so the
 * persisted shape and the returned shape cannot drift apart.
 *
 * Inputs are enumerated from ActiveCampaign's documented request-parameter
 * tables. They cannot be derived from captured responses - a response says
 * nothing about which parameters an endpoint accepts.
 */

/**
 * Every REST collection shares this envelope: rows under a resource-named key
 * and the count under `meta.total`. `total` is a string, like every other
 * scalar ActiveCampaign returns.
 *
 * @see https://developers.activecampaign.com/reference/pagination
 */
const Meta = z
	.object({ total: z.union([z.string(), z.number()]).nullable().optional() })
	.loose()
	.nullable()
	.optional();

/**
 * Pagination accepted by every list operation. ActiveCampaign defaults to 20
 * rows and caps at 100.
 */
const PaginationInput = {
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
};

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export const ContactsListInput = z.object({
	...PaginationInput,
	email: z.email().optional(),
	search: z.string().optional(),
	listid: z.string().optional(),
	tagid: z.string().optional(),
	segmentid: z.string().optional(),
	status: z.number().int().optional(),
	/**
	 * ActiveCampaign documents `id_greater` with `orders[id]=ASC` as the
	 * performant way to page a large contact collection, because `offset`
	 * degrades on big lists. Exposed so callers can opt into it.
	 */
	id_greater: z.string().optional(),
	orders_id: z.enum(['ASC', 'DESC']).optional(),
});

export const ContactsListOutput = z
	.object({ contacts: z.array(ActiveCampaignContact), meta: Meta })
	.loose();

export const ContactsGetInput = z.object({ id: z.string() });

/**
 * A single-contact GET sideloads related collections alongside the contact.
 * They are modelled as unknown because their shapes belong to resources this
 * PR does not implement; typing them from an unverified guess would be worse
 * than declaring them unmodelled.
 */
export const ContactsGetOutput = z
	.object({
		contact: ActiveCampaignContact,
		contactLists: z.unknown().optional(),
		fieldValues: z.unknown().optional(),
		geoIps: z.unknown().optional(),
		deals: z.unknown().optional(),
		accountContacts: z.unknown().optional(),
	})
	.loose();

export const ContactsFindInput = z.object({ email: z.email() });
export const ContactsFindOutput = ContactsListOutput;

export const ContactsCreateOrUpdateInput = z.object({
	email: z.email(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	phone: z.string().optional(),
	fieldValues: z
		.array(z.object({ field: z.string(), value: z.string() }))
		.optional(),
});

export const ContactsCreateOrUpdateOutput = z
	.object({ contact: ActiveCampaignContact })
	.loose();

export const ContactsUpdateInput = z.object({
	id: z.string(),
	email: z.email().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	phone: z.string().optional(),
	fieldValues: z
		.array(z.object({ field: z.string(), value: z.string() }))
		.optional(),
});

export const ContactsUpdateOutput = ContactsCreateOrUpdateOutput;

export const ContactsDeleteInput = z.object({ id: z.string() });
export const ContactsDeleteOutput = z.object({ id: z.string() }).loose();

const ContactSubResourceInput = z.object({ id: z.string(), ...PaginationInput });

export const ContactsGetListsInput = ContactSubResourceInput;
export const ContactsGetListsOutput = z
	.object({ contactLists: z.array(ActiveCampaignContactList), meta: Meta })
	.loose();

export const ContactsGetTagsInput = ContactSubResourceInput;
export const ContactsGetTagsOutput = z
	.object({ contactTags: z.array(ActiveCampaignContactTag), meta: Meta })
	.loose();

export const ContactsGetFieldValuesInput = ContactSubResourceInput;
/** Field-value rows belong to a resource group outside this PR's scope. */
export const ContactsGetFieldValuesOutput = z
	.object({ fieldValues: z.array(z.unknown()), meta: Meta })
	.loose();

export const ContactsGetAutomationsInput = ContactSubResourceInput;
export const ContactsGetAutomationsOutput = z
	.object({ contactAutomations: z.array(z.unknown()), meta: Meta })
	.loose();

export const ContactsGetGeoIpsInput = ContactSubResourceInput;
export const ContactsGetGeoIpsOutput = z
	.object({ geoIps: z.array(z.unknown()), meta: Meta })
	.loose();

export const ContactsGetScoreValuesInput = ContactSubResourceInput;
export const ContactsGetScoreValuesOutput = z
	.object({ scoreValues: z.array(z.unknown()), meta: Meta })
	.loose();

export const ContactsGetDealsInput = ContactSubResourceInput;
export const ContactsGetDealsOutput = z
	.object({ deals: z.array(z.unknown()), meta: Meta })
	.loose();

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------

export const ListsListInput = z.object({
	...PaginationInput,
	name: z.string().optional(),
});

export const ListsListOutput = z
	.object({ lists: z.array(ActiveCampaignList), meta: Meta })
	.loose();

export const ListsGetInput = z.object({ id: z.string() });
export const ListsGetOutput = z.object({ list: ActiveCampaignList }).loose();

export const ListsCreateInput = z.object({
	name: z.string().min(1),
	/** URL-safe identifier ActiveCampaign requires alongside the display name. */
	stringid: z.string().min(1),
	sender_url: z.string().min(1),
	sender_reminder: z.string().min(1),
	send_last_broadcast: z.boolean().optional(),
	carboncopy: z.string().optional(),
	subscription_notify: z.string().optional(),
	unsubscription_notify: z.string().optional(),
	user: z.string().optional(),
});

export const ListsCreateOutput = ListsGetOutput;

export const ListsDeleteInput = z.object({ id: z.string() });
export const ListsDeleteOutput = z.object({ id: z.string() }).loose();

export const ContactListsListInput = z.object({ ...PaginationInput });
export const ContactListsListOutput = ContactsGetListsOutput;

/**
 * Subscribe or unsubscribe a contact.
 *
 * ActiveCampaign models both directions as a status on the contact-list
 * association: 1 subscribes, 2 unsubscribes. The association row survives an
 * unsubscribe, which is what preserves the audit trail.
 */
export const ListsUpdateSubscriptionInput = z.object({
	list: z.string(),
	contact: z.string(),
	status: z.union([z.literal(1), z.literal(2)]),
});

export const ListsUpdateSubscriptionOutput = z
	.object({ contactList: ActiveCampaignContactList })
	.loose();

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export const TagsListInput = z.object({
	...PaginationInput,
	search: z.string().optional(),
});

export const TagsListOutput = z
	.object({ tags: z.array(ActiveCampaignTag), meta: Meta })
	.loose();

export const TagsGetInput = z.object({ id: z.string() });
export const TagsGetOutput = z.object({ tag: ActiveCampaignTag }).loose();

export const TagsCreateInput = z.object({
	tag: z.string().min(1),
	tagType: z.enum(['contact', 'template']),
	description: z.string().optional(),
});

export const TagsCreateOutput = TagsGetOutput;

export const TagsUpdateInput = z.object({
	id: z.string(),
	tag: z.string().min(1).optional(),
	tagType: z.enum(['contact', 'template']).optional(),
	description: z.string().optional(),
});

export const TagsUpdateOutput = TagsGetOutput;

export const TagsDeleteInput = z.object({ id: z.string() });
export const TagsDeleteOutput = z.object({ id: z.string() }).loose();

export const TagsAddToContactInput = z.object({
	contact: z.string(),
	tag: z.string(),
});

export const TagsAddToContactOutput = z
	.object({ contactTag: ActiveCampaignContactTag })
	.loose();

/**
 * Takes the contactTag association id, not the tag id - deleting by tag id
 * would remove the tag itself.
 */
export const TagsRemoveFromContactInput = z.object({ id: z.string() });
export const TagsRemoveFromContactOutput = z.object({ id: z.string() }).loose();

export const ContactTagsListInput = z.object({ ...PaginationInput });
export const ContactTagsListOutput = ContactsGetTagsOutput;

// ---------------------------------------------------------------------------
// Custom field definitions
// ---------------------------------------------------------------------------

export const FieldsListInput = z.object({ ...PaginationInput });
export const FieldsListOutput = z
	.object({ fields: z.array(ActiveCampaignField), meta: Meta })
	.loose();

export const FieldsGetInput = z.object({ id: z.string() });
export const FieldsGetOutput = z.object({ field: ActiveCampaignField }).loose();

// ---------------------------------------------------------------------------
// Custom field definitions: create, update, delete
// ---------------------------------------------------------------------------

/**
 * ActiveCampaign's custom field types. `dropdown`, `listbox`, `radio` and
 * `checkbox` are the four that accept options; the others do not.
 */
const FieldType = z.enum([
	'text',
	'textarea',
	'date',
	'datetime',
	'dropdown',
	'listbox',
	'radio',
	'checkbox',
	'hidden',
]);

export const FieldsCreateInput = z.object({
	title: z.string().min(1),
	type: FieldType,
	descript: z.string().optional(),
	/** Personalisation tag, e.g. %INDUSTRY%. Generated when omitted. */
	perstag: z.string().optional(),
	defval: z.string().optional(),
	isrequired: z.boolean().optional(),
	visible: z.boolean().optional(),
	ordernum: z.number().int().optional(),
});

export const FieldsCreateOutput = FieldsGetOutput;

export const FieldsUpdateInput = z.object({
	id: z.string(),
	title: z.string().min(1).optional(),
	type: FieldType.optional(),
	descript: z.string().optional(),
	perstag: z.string().optional(),
	defval: z.string().optional(),
	isrequired: z.boolean().optional(),
	visible: z.boolean().optional(),
	ordernum: z.number().int().optional(),
});

export const FieldsUpdateOutput = FieldsGetOutput;

export const FieldsDeleteInput = z.object({ id: z.string() });
export const FieldsDeleteOutput = z.object({ id: z.string() }).loose();

/**
 * Options are created in bulk against an existing field. The field must exist
 * first, and only the four option-bearing field types accept them.
 */
export const FieldOptionsCreateBulkInput = z.object({
	options: z
		.array(
			z.object({
				field: z.string(),
				label: z.string().min(1),
				value: z.string(),
				orderid: z.number().int().optional(),
				isdefault: z.boolean().optional(),
			}),
		)
		.min(1),
});

export const FieldOptionsCreateBulkOutput = z
	.object({ fieldOptions: z.array(ActiveCampaignFieldOption) })
	.loose();

// ---------------------------------------------------------------------------
// Custom field values
// ---------------------------------------------------------------------------

export const FieldValuesListInput = z.object({ ...PaginationInput });
export const FieldValuesListOutput = z
	.object({ fieldValues: z.array(ActiveCampaignFieldValue), meta: Meta })
	.loose();

export const FieldValuesGetInput = z.object({ id: z.string() });
export const FieldValuesGetOutput = z
	.object({ fieldValue: ActiveCampaignFieldValue })
	.loose();

/**
 * Sets a field value on a contact.
 *
 * `useDefaults` asks ActiveCampaign to apply the field's configured default
 * when the value is blank. It is sent explicitly rather than omitted so the
 * behaviour is the caller's decision rather than inherited from the provider.
 */
export const FieldValuesSetForContactInput = z.object({
	contact: z.string(),
	field: z.string(),
	value: z.string(),
	useDefaults: z.boolean().optional(),
});

export const FieldValuesSetForContactOutput = FieldValuesGetOutput;

export const FieldValuesUpdateInput = z.object({
	id: z.string(),
	value: z.string(),
	useDefaults: z.boolean().optional(),
});

export const FieldValuesUpdateOutput = FieldValuesGetOutput;

export const FieldValuesDeleteInput = z.object({ id: z.string() });
export const FieldValuesDeleteOutput = z.object({ id: z.string() }).loose();

// ---------------------------------------------------------------------------
// Field relationships (field <-> list)
// ---------------------------------------------------------------------------

export const FieldRelsListInput = z.object({ ...PaginationInput });
export const FieldRelsListOutput = z
	.object({ fieldRels: z.array(ActiveCampaignFieldRel), meta: Meta })
	.loose();

export const FieldRelsCreateInput = z.object({
	field: z.string(),
	/** The related list id. `0` associates the field with every list. */
	relid: z.string(),
});

export const FieldRelsCreateOutput = z
	.object({ fieldRel: ActiveCampaignFieldRel })
	.loose();

export const FieldRelsDeleteInput = z.object({ id: z.string() });
export const FieldRelsDeleteOutput = z.object({ id: z.string() }).loose();

// ---------------------------------------------------------------------------
// Field groups (field <-> display group)
// ---------------------------------------------------------------------------

export const GroupMembersListInput = z.object({ ...PaginationInput });
export const GroupMembersListOutput = z
	.object({ groupMembers: z.array(ActiveCampaignGroupMember), meta: Meta })
	.loose();

export const GroupMembersCreateInput = z.object({
	/** The field relationship id, not the field id. */
	rel_id: z.string(),
	group_id: z.string(),
	ordernum: z.number().int().optional(),
});

export const GroupMembersCreateOutput = z
	.object({ groupMember: ActiveCampaignGroupMember })
	.loose();

export const GroupMembersUpdateInput = z.object({
	id: z.string(),
	rel_id: z.string().optional(),
	group_id: z.string().optional(),
	ordernum: z.number().int().optional(),
});

export const GroupMembersUpdateOutput = GroupMembersCreateOutput;

export const GroupMembersDeleteInput = z.object({ id: z.string() });
export const GroupMembersDeleteOutput = z.object({ id: z.string() }).loose();

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const ActiveCampaignEndpointInputSchemas = {
	contactsList: ContactsListInput,
	contactsGet: ContactsGetInput,
	contactsFind: ContactsFindInput,
	contactsCreateOrUpdate: ContactsCreateOrUpdateInput,
	contactsUpdate: ContactsUpdateInput,
	contactsDelete: ContactsDeleteInput,
	contactsGetLists: ContactsGetListsInput,
	contactsGetTags: ContactsGetTagsInput,
	contactsGetFieldValues: ContactsGetFieldValuesInput,
	contactsGetAutomations: ContactsGetAutomationsInput,
	contactsGetGeoIps: ContactsGetGeoIpsInput,
	contactsGetScoreValues: ContactsGetScoreValuesInput,
	contactsGetDeals: ContactsGetDealsInput,
	listsList: ListsListInput,
	listsGet: ListsGetInput,
	listsCreate: ListsCreateInput,
	listsDelete: ListsDeleteInput,
	listsUpdateSubscription: ListsUpdateSubscriptionInput,
	contactListsList: ContactListsListInput,
	tagsList: TagsListInput,
	tagsGet: TagsGetInput,
	tagsCreate: TagsCreateInput,
	tagsUpdate: TagsUpdateInput,
	tagsDelete: TagsDeleteInput,
	tagsAddToContact: TagsAddToContactInput,
	tagsRemoveFromContact: TagsRemoveFromContactInput,
	contactTagsList: ContactTagsListInput,
	fieldsList: FieldsListInput,
	fieldsGet: FieldsGetInput,
	fieldsCreate: FieldsCreateInput,
	fieldsUpdate: FieldsUpdateInput,
	fieldsDelete: FieldsDeleteInput,
	fieldOptionsCreateBulk: FieldOptionsCreateBulkInput,
	fieldValuesList: FieldValuesListInput,
	fieldValuesGet: FieldValuesGetInput,
	fieldValuesSetForContact: FieldValuesSetForContactInput,
	fieldValuesUpdate: FieldValuesUpdateInput,
	fieldValuesDelete: FieldValuesDeleteInput,
	fieldRelsList: FieldRelsListInput,
	fieldRelsCreate: FieldRelsCreateInput,
	fieldRelsDelete: FieldRelsDeleteInput,
	groupMembersList: GroupMembersListInput,
	groupMembersCreate: GroupMembersCreateInput,
	groupMembersUpdate: GroupMembersUpdateInput,
	groupMembersDelete: GroupMembersDeleteInput,
} as const;

export const ActiveCampaignEndpointOutputSchemas = {
	contactsList: ContactsListOutput,
	contactsGet: ContactsGetOutput,
	contactsFind: ContactsFindOutput,
	contactsCreateOrUpdate: ContactsCreateOrUpdateOutput,
	contactsUpdate: ContactsUpdateOutput,
	contactsDelete: ContactsDeleteOutput,
	contactsGetLists: ContactsGetListsOutput,
	contactsGetTags: ContactsGetTagsOutput,
	contactsGetFieldValues: ContactsGetFieldValuesOutput,
	contactsGetAutomations: ContactsGetAutomationsOutput,
	contactsGetGeoIps: ContactsGetGeoIpsOutput,
	contactsGetScoreValues: ContactsGetScoreValuesOutput,
	contactsGetDeals: ContactsGetDealsOutput,
	listsList: ListsListOutput,
	listsGet: ListsGetOutput,
	listsCreate: ListsCreateOutput,
	listsDelete: ListsDeleteOutput,
	listsUpdateSubscription: ListsUpdateSubscriptionOutput,
	contactListsList: ContactListsListOutput,
	tagsList: TagsListOutput,
	tagsGet: TagsGetOutput,
	tagsCreate: TagsCreateOutput,
	tagsUpdate: TagsUpdateOutput,
	tagsDelete: TagsDeleteOutput,
	tagsAddToContact: TagsAddToContactOutput,
	tagsRemoveFromContact: TagsRemoveFromContactOutput,
	contactTagsList: ContactTagsListOutput,
	fieldsList: FieldsListOutput,
	fieldsGet: FieldsGetOutput,
	fieldsCreate: FieldsCreateOutput,
	fieldsUpdate: FieldsUpdateOutput,
	fieldsDelete: FieldsDeleteOutput,
	fieldOptionsCreateBulk: FieldOptionsCreateBulkOutput,
	fieldValuesList: FieldValuesListOutput,
	fieldValuesGet: FieldValuesGetOutput,
	fieldValuesSetForContact: FieldValuesSetForContactOutput,
	fieldValuesUpdate: FieldValuesUpdateOutput,
	fieldValuesDelete: FieldValuesDeleteOutput,
	fieldRelsList: FieldRelsListOutput,
	fieldRelsCreate: FieldRelsCreateOutput,
	fieldRelsDelete: FieldRelsDeleteOutput,
	groupMembersList: GroupMembersListOutput,
	groupMembersCreate: GroupMembersCreateOutput,
	groupMembersUpdate: GroupMembersUpdateOutput,
	groupMembersDelete: GroupMembersDeleteOutput,
} as const;

export type ActiveCampaignEndpointInputs = {
	[K in keyof typeof ActiveCampaignEndpointInputSchemas]: z.infer<
		(typeof ActiveCampaignEndpointInputSchemas)[K]
	>;
};

export type ActiveCampaignEndpointOutputs = {
	[K in keyof typeof ActiveCampaignEndpointOutputSchemas]: z.infer<
		(typeof ActiveCampaignEndpointOutputSchemas)[K]
	>;
};
