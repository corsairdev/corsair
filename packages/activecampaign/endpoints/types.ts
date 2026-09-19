import { z } from 'zod';
import {
	ActiveCampaignAccount,
	ActiveCampaignAccountContact,
	ActiveCampaignAccountCustomFieldMeta,
	ActiveCampaignAddress,
	ActiveCampaignAutomation,
	ActiveCampaignBranding,
	ActiveCampaignCalendar,
	ActiveCampaignCampaign,
	ActiveCampaignConnection,
	ActiveCampaignContact,
	ActiveCampaignContactList,
	ActiveCampaignContactTag,
	ActiveCampaignCustomObjectSchema,
	ActiveCampaignDeal,
	ActiveCampaignDealCustomFieldMeta,
	ActiveCampaignDealGroup,
	ActiveCampaignDealRole,
	ActiveCampaignDealStage,
	ActiveCampaignDealTask,
	ActiveCampaignDealTaskType,
	ActiveCampaignEcomCustomer,
	ActiveCampaignEventTrackingEvent,
	ActiveCampaignField,
	ActiveCampaignFieldOption,
	ActiveCampaignFieldRel,
	ActiveCampaignFieldValue,
	ActiveCampaignForm,
	ActiveCampaignGroup,
	ActiveCampaignGroupLimit,
	ActiveCampaignGroupMember,
	ActiveCampaignList,
	ActiveCampaignListGroup,
	ActiveCampaignMessage,
	ActiveCampaignNote,
	ActiveCampaignPersonalization,
	ActiveCampaignSavedResponse,
	ActiveCampaignScore,
	ActiveCampaignSegment,
	ActiveCampaignTag,
	ActiveCampaignTaskOutcome,
	ActiveCampaignTemplate,
	ActiveCampaignUser,
	ActiveCampaignWebhook,
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

export const ContactsGetInput = z.object({
	id: z.string(),
	automations: z.boolean().optional(),
});

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

const ContactSubResourceInput = z.object({
	id: z.string(),
	...PaginationInput,
});

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
	'multiselect',
	'number',
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
// Contact sub-resources
//
// Every route below was confirmed against a live account on 2026-08-13, but
// the trial account held no rows for any of them, so the row shapes could not
// be captured. They are typed `z.unknown()` deliberately: the envelope key is
// verified, the row shape is not, and inventing one from the documentation is
// exactly the mistake that required a maintainer hand-fix on a previous
// integration. They will be typed when a populated account is available.
// ---------------------------------------------------------------------------

const ContactSubInput = z.object({ id: z.string(), ...PaginationInput });

export const ContactsGetLogsInput = ContactSubInput;
export const ContactsGetLogsOutput = z
	.object({ contactLogs: z.array(z.unknown()), meta: Meta })
	.loose();

export const ContactsGetTrackingLogsInput = ContactSubInput;
export const ContactsGetTrackingLogsOutput = z
	.object({ trackingLogs: z.array(z.unknown()), meta: Meta })
	.loose();

export const ContactsGetGoalsInput = ContactSubInput;
export const ContactsGetGoalsOutput = z
	.object({ contactGoals: z.array(z.unknown()), meta: Meta })
	.loose();

export const ContactsGetAccountContactsInput = ContactSubInput;
export const ContactsGetAccountContactsOutput = z
	.object({ accountContacts: z.array(z.unknown()), meta: Meta })
	.loose();

export const ContactsGetNotesInput = ContactSubInput;
export const ContactsGetNotesOutput = z
	.object({ notes: z.array(z.unknown()), meta: Meta })
	.loose();

/**
 * These three answer with a bare `{}` when the contact has no such record,
 * rather than an envelope with an empty value, so even the envelope key is
 * unconfirmed. Modelled as fully loose objects with optional keys so either
 * response parses.
 */
export const ContactsGetDataInput = z.object({ id: z.string() });
export const ContactsGetDataOutput = z
	.object({ contactDatum: z.unknown().optional() })
	.loose();

export const ContactsGetOrganizationInput = z.object({ id: z.string() });
export const ContactsGetOrganizationOutput = z
	.object({ organization: z.unknown().optional() })
	.loose();

export const ContactsGetPlusAppendInput = z.object({ id: z.string() });
export const ContactsGetPlusAppendOutput = z
	.object({ plusAppend: z.unknown().optional() })
	.loose();

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

export const ActivitiesListInput = z.object({
	...PaginationInput,
	/** Restrict to one contact. Omitted returns account-wide activity. */
	contact: z.string().optional(),
	after: z.string().optional(),
});

export const ActivitiesListOutput = z
	.object({ activities: z.array(z.unknown()), meta: Meta })
	.loose();

// ---------------------------------------------------------------------------
// Bulk contact import
// ---------------------------------------------------------------------------

/**
 * Queues contacts for asynchronous import. ActiveCampaign accepts up to
 * 250 per call with a payload below 400 KB and returns immediately with a
 * batch id; the rows are processed in the background.
 */
export const ImportsCreateBulkInput = z.object({
	contacts: z
		.array(
			z.object({
				email: z.email(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				phone: z.string().optional(),
				customer_acct_name: z.string().optional(),
				tags: z.array(z.string()).optional(),
				fields: z
					.array(z.object({ id: z.number().int(), value: z.string() }))
					.optional(),
				subscribe: z.array(z.object({ listid: z.number().int() })).optional(),
				unsubscribe: z.array(z.object({ listid: z.number().int() })).optional(),
			}),
		)
		.min(1)
		.max(250),
	exclude_automations: z.boolean().optional(),
	/**
	 * Webhook called once the batch finishes. Optional; a batch can also be
	 * polled with `imports.getStatus`.
	 */
	callback: z
		.object({
			url: z.url(),
			requestType: z.enum(['GET', 'POST', 'PUT', 'PATCH']).optional(),
			detailed_results: z
				.union([z.boolean(), z.enum(['true', 'false'])])
				.optional(),
			params: z.record(z.string(), z.unknown()).optional(),
			headers: z.record(z.string(), z.string()).optional(),
		})
		.optional(),
});

export const ImportsCreateBulkOutput = z
	.object({
		Success: z.union([z.string(), z.number()]).nullable().optional(),
		success: z
			.union([z.string(), z.number(), z.boolean()])
			.nullable()
			.optional(),
		batchId: z.string().nullable().optional(),
		queued_contacts: z.number().nullable().optional(),
		queuedContacts: z.number().nullable().optional(),
		message: z.string().nullable().optional(),
	})
	.loose();

export const ImportsListInput = z.object({});
export const ImportsListOutput = z
	.object({
		outstanding: z.array(z.unknown()).optional(),
		recentlyCompleted: z.array(z.unknown()).optional(),
	})
	.loose();

export const ImportsGetStatusInput = z.object({ batchId: z.string() });
export const ImportsGetStatusOutput = z
	.object({
		status: z.unknown().optional(),
		success: z.unknown().optional(),
		failure: z.unknown().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// List group permissions
// ---------------------------------------------------------------------------

export const ListGroupsCreateInput = z.object({
	listid: z.string(),
	groupid: z.string(),
});

export const ListGroupsCreateOutput = z
	.object({ listGroup: ActiveCampaignListGroup })
	.loose();

// ---------------------------------------------------------------------------
// Builders for the standard resource shape
//
// Most v3 resources share one contract, so the schemas are built rather than
// retyped: a paginated collection under a plural key, a single record under a
// singular key, and a delete returning the id it removed.
// ---------------------------------------------------------------------------

/** `{ <key>: Entity[], meta }` */
function listOf<K extends string, T extends z.ZodTypeAny>(key: K, entity: T) {
	return z
		.object({ [key]: z.array(entity), meta: Meta } as Record<K, z.ZodArray<T>>)
		.loose();
}

/** `{ <key>: Entity }` */
function oneOf<K extends string, T extends z.ZodTypeAny>(key: K, entity: T) {
	return z.object({ [key]: entity } as Record<K, T>).loose();
}

const IdInput = z.object({ id: z.string() });
const IdOutput = z.object({ id: z.string() }).loose();
const PageInput = z.object({ ...PaginationInput });

// ---------------------------------------------------------------------------
// CRM: deals
// ---------------------------------------------------------------------------

export const DealsListInput = z.object({
	...PaginationInput,
	search: z.string().optional(),
	search_field: z.enum(['all', 'title', 'contact', 'org']).optional(),
	title: z.string().optional(),
	stage: z.string().optional(),
	group: z.string().optional(),
	status: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
	owner: z.string().optional(),
	nextdate_range: z
		.enum(['upcoming', 'scheduled', 'overdue', 'no-task'])
		.optional(),
	tag: z.string().optional(),
	tasktype: z.string().optional(),
	created_before: z.string().optional(),
	created_after: z.string().optional(),
	updated_before: z.string().optional(),
	updated_after: z.string().optional(),
	organization: z.string().optional(),
	minimum_value: z.number().optional(),
	maximum_value: z.number().optional(),
	score_greater_than: z.number().optional(),
	score_less_than: z.number().optional(),
	score: z.number().optional(),
	order_id: z.enum(['ASC', 'DESC']).optional(),
	order_title: z.enum(['ASC', 'DESC']).optional(),
	order_value: z.enum(['ASC', 'DESC']).optional(),
	order_created: z.enum(['ASC', 'DESC']).optional(),
	order_updated: z.enum(['ASC', 'DESC']).optional(),
	order_contact_name: z.enum(['ASC', 'DESC']).optional(),
	order_contact_orgname: z.enum(['ASC', 'DESC']).optional(),
	order_next_action: z.enum(['ASC', 'DESC']).optional(),
});
export const DealsListOutput = listOf('deals', ActiveCampaignDeal);

export const DealsGetInput = IdInput;
export const DealsGetOutput = oneOf('deal', ActiveCampaignDeal);

export const DealsUpdateInput = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	value: z.number().int().optional(),
	currency: z.string().optional(),
	group: z.string().optional(),
	stage: z.string().optional(),
	owner: z.string().optional(),
	contact: z.string().optional(),
	organization: z.string().optional(),
	status: z.number().int().optional(),
	percent: z.number().int().optional(),
	fields: z
		.array(
			z.object({
				customFieldId: z.number().int(),
				fieldValue: z.union([z.string(), z.number(), z.array(z.string())]),
			}),
		)
		.optional(),
});
export const DealsUpdateOutput = DealsGetOutput;

export const DealsDeleteInput = IdInput;
export const DealsDeleteOutput = IdOutput;

/**
 * Reassigns many deals at once. The whole batch is one request, so a retry
 * re-applies every reassignment - hence non-idempotent.
 */
export const DealsUpdateOwnersBulkInput = z.object({
	deals: z
		.array(z.object({ id: z.number().int(), ownerId: z.number().int() }))
		.min(1),
});
export const DealsUpdateOwnersBulkOutput = z.object({}).loose();

// Pipelines
export const DealGroupsListInput = z.object({
	...PaginationInput,
	title: z.string().optional(),
});
export const DealGroupsListOutput = listOf(
	'dealGroups',
	ActiveCampaignDealGroup,
);
export const DealGroupsGetInput = IdInput;
export const DealGroupsGetOutput = oneOf('dealGroup', ActiveCampaignDealGroup);
export const DealGroupsCreateInput = z.object({
	title: z.string().min(1),
	currency: z.string().optional(),
	allgroups: z.union([z.literal(0), z.literal(1)]).optional(),
	allusers: z.union([z.literal(0), z.literal(1)]).optional(),
	autoassign: z.union([z.literal(0), z.literal(1)]).optional(),
	users: z.array(z.union([z.string(), z.number().int()])).optional(),
	groups: z.array(z.union([z.string(), z.number().int()])).optional(),
});
export const DealGroupsCreateOutput = DealGroupsGetOutput;
export const DealGroupsUpdateInput = DealGroupsCreateInput.partial().extend({
	id: z.string(),
});
export const DealGroupsUpdateOutput = DealGroupsGetOutput;
export const DealGroupsDeleteInput = IdInput;
export const DealGroupsDeleteOutput = IdOutput;

// Stages
export const DealStagesListInput = z.object({
	...PaginationInput,
	title: z.string().optional(),
	group: z.string().optional(),
});
export const DealStagesListOutput = listOf(
	'dealStages',
	ActiveCampaignDealStage,
);
export const DealStagesGetInput = IdInput;
export const DealStagesGetOutput = oneOf('dealStage', ActiveCampaignDealStage);
export const DealStagesCreateInput = z.object({
	title: z.string().min(1),
	group: z.string(),
	order: z.number().int().optional(),
	width: z.number().int().optional(),
	color: z.string().optional(),
	cardRegion1: z.string().optional(),
});
export const DealStagesCreateOutput = DealStagesGetOutput;
export const DealStagesUpdateInput = DealStagesCreateInput.partial().extend({
	id: z.string(),
});
export const DealStagesUpdateOutput = DealStagesGetOutput;
export const DealStagesDeleteInput = IdInput;
export const DealStagesDeleteOutput = IdOutput;

export const DealStagesMoveDealsInput = z.object({
	id: z.string(),
	/** Target stage. Must belong to the same pipeline, or the API answers 422. */
	stage: z.string(),
});
export const DealStagesMoveDealsOutput = z.object({}).loose();

/**
 * Deleting a stage destroys the deals in it unless they are moved first, so
 * `action_type: 'Move'` requires both target ids. Encoded as a refinement
 * rather than left to the caller.
 */
export const DealStagesDeleteWithDealsInput = z
	.object({
		id: z.string(),
		action_type: z.enum(['Move', 'Delete']),
		new_pipeline_id: z.string().optional(),
		new_stage_id: z.string().optional(),
	})
	.refine(
		(v) =>
			v.action_type !== 'Move' ||
			(v.new_pipeline_id !== undefined && v.new_stage_id !== undefined),
		{
			message:
				"action_type 'Move' requires both new_pipeline_id and new_stage_id",
			path: ['new_stage_id'],
		},
	);
export const DealStagesDeleteWithDealsOutput = IdOutput;

// Tasks
export const DealTasksListInput = z.object({
	...PaginationInput,
	title: z.string().optional(),
	reltype: z.string().optional(),
	relid: z.string().optional(),
	status: z.number().int().optional(),
	note: z.string().optional(),
	duedate: z.string().optional(),
	dealTasktype: z.string().optional(),
	userid: z.string().optional(),
	due_after: z.string().optional(),
	due_before: z.string().optional(),
	duedate_range: z.string().optional(),
	assignee_userid: z.string().optional(),
	outcome_id: z.string().optional(),
});
export const DealTasksListOutput = listOf('dealTasks', ActiveCampaignDealTask);
export const DealTasksGetInput = IdInput;
export const DealTasksGetOutput = oneOf('dealTask', ActiveCampaignDealTask);
export const DealTasksCreateInput = z.object({
	title: z.string().nullable().optional(),
	relid: z.string(),
	reltype: z.enum(['Deal', 'Subscriber', 'Account']),
	dealTasktype: z.string(),
	ownerType: z.string().optional(),
	status: z.number().int().optional(),
	note: z.string().optional(),
	duedate: z.string(),
	edate: z.string().optional(),
	assignee: z.string().optional(),
	triggerAutomationOnCreate: z.boolean().optional(),
	doneAutomation: z.boolean().optional(),
	outcomeId: z.string().optional(),
	outcomeInfo: z.string().optional(),
});
export const DealTasksCreateOutput = DealTasksGetOutput;
export const DealTasksUpdateInput = DealTasksCreateInput.partial().extend({
	id: z.string(),
});
export const DealTasksUpdateOutput = DealTasksGetOutput;
export const DealTasksDeleteInput = IdInput;
export const DealTasksDeleteOutput = IdOutput;

export const DealTaskTypesListInput = PageInput;
export const DealTaskTypesListOutput = listOf(
	'dealTasktypes',
	ActiveCampaignDealTaskType,
);
export const DealTaskTypesGetInput = IdInput;
export const DealTaskTypesGetOutput = oneOf(
	'dealTasktype',
	ActiveCampaignDealTaskType,
);
export const DealTaskTypesCreateInput = z.object({
	title: z.string().min(1),
	defduration: z.string().optional(),
	status: z.number().int().optional(),
	display_order: z.number().int().optional(),
	outcomes: z.array(z.string()).optional(),
});
export const DealTaskTypesCreateOutput = DealTaskTypesGetOutput;
export const DealTaskTypesUpdateInput =
	DealTaskTypesCreateInput.partial().extend({ id: z.string() });
export const DealTaskTypesUpdateOutput = DealTaskTypesGetOutput;

export const TaskOutcomesListInput = PageInput;
export const TaskOutcomesListOutput = listOf(
	'taskOutcomes',
	ActiveCampaignTaskOutcome,
);
export const TaskOutcomesGetInput = IdInput;
export const TaskOutcomesGetOutput = oneOf(
	'taskOutcome',
	ActiveCampaignTaskOutcome,
);
export const TaskOutcomesCreateInput = z.object({
	title: z.string().min(1),
	sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
	status: z.number().int().optional(),
	dealTasktypes: z.array(z.string()).optional(),
});
export const TaskOutcomesCreateOutput = TaskOutcomesGetOutput;

// Roles
export const DealRolesListInput = PageInput;
export const DealRolesListOutput = listOf('dealRoles', ActiveCampaignDealRole);
export const DealRolesCreateInput = z.object({ title: z.string().min(1) });
export const DealRolesCreateOutput = oneOf('dealRole', ActiveCampaignDealRole);
export const DealRolesDeleteInput = IdInput;
export const DealRolesDeleteOutput = IdOutput;

// Secondary contacts
export const ContactDealsListInput = z.object({ ...PaginationInput });
export const ContactDealsListOutput = z
	.object({ contactDeals: z.array(z.unknown()), meta: Meta })
	.loose();
export const ContactDealsGetInput = IdInput;
export const ContactDealsGetOutput = z
	.object({ contactDeal: z.unknown() })
	.loose();
export const ContactDealsCreateInput = z.object({
	contact: z.string(),
	deal: z.string(),
	role: z.string().optional(),
	jobTitle: z.string().optional(),
});
export const ContactDealsCreateOutput = ContactDealsGetOutput;
export const ContactDealsUpdateInput = ContactDealsCreateInput.partial().extend(
	{
		id: z.string(),
	},
);
export const ContactDealsUpdateOutput = ContactDealsGetOutput;
export const ContactDealsDeleteInput = IdInput;
export const ContactDealsDeleteOutput = IdOutput;

// Deal custom fields
export const DealCustomFieldMetaListInput = PageInput;
export const DealCustomFieldMetaListOutput = listOf(
	'dealCustomFieldMeta',
	ActiveCampaignDealCustomFieldMeta,
);
export const DealCustomFieldMetaGetInput = IdInput;
export const DealCustomFieldMetaGetOutput = oneOf(
	'dealCustomFieldMetum',
	ActiveCampaignDealCustomFieldMeta,
);
export const DealCustomFieldMetaCreateInput = z.object({
	fieldLabel: z.string().min(1),
	fieldType: z.enum([
		'text',
		'textarea',
		'date',
		'dropdown',
		'multiselect',
		'radio',
		'checkbox',
		'hidden',
		'number',
		'currency',
		'datetime',
	]),
	fieldOptions: z.array(z.string()).optional(),
	fieldDefault: z
		.union([z.string(), z.number(), z.array(z.string())])
		.optional(),
	fieldDefaultCurrency: z.string().optional(),
	isFormVisible: z.number().int().optional(),
	isRequired: z.number().int().optional(),
	displayOrder: z.number().int().optional(),
});
export const DealCustomFieldMetaCreateOutput = DealCustomFieldMetaGetOutput;
export const DealCustomFieldMetaUpdateInput =
	DealCustomFieldMetaCreateInput.partial().extend({ id: z.string() });
export const DealCustomFieldMetaUpdateOutput = DealCustomFieldMetaGetOutput;
export const DealCustomFieldMetaDeleteInput = IdInput;
export const DealCustomFieldMetaDeleteOutput = IdOutput;

export const DealCustomFieldDataListInput = z.object({
	...PaginationInput,
	dealId: z.string().optional(),
});
export const DealCustomFieldDataListOutput = z
	.object({ dealCustomFieldData: z.array(z.unknown()), meta: Meta })
	.loose();
export const DealCustomFieldDataGetInput = IdInput;
export const DealCustomFieldDataGetOutput = z
	.object({ dealCustomFieldDatum: z.unknown() })
	.loose();
export const DealCustomFieldDataUpdateInput = z.object({
	id: z.string(),
	dealId: z.number().int().optional(),
	customFieldId: z.number().int().optional(),
	fieldValue: z.union([z.string(), z.number(), z.array(z.string())]),
	fieldCurrency: z.string().optional(),
});
export const DealCustomFieldDataUpdateOutput = DealCustomFieldDataGetOutput;
export const DealCustomFieldDataDeleteInput = IdInput;
export const DealCustomFieldDataDeleteOutput = IdOutput;

// Activities
export const DealActivitiesListInput = z.object({
	...PaginationInput,
	deal: z.string().optional(),
	exclude: z.string().optional(),
	data_type: z.string().optional(),
	data_id: z.string().optional(),
});
export const DealActivitiesListOutput = z
	.object({ dealActivities: z.array(z.unknown()), meta: Meta })
	.loose();

// ---------------------------------------------------------------------------
// CRM: accounts, account contacts, account custom fields, notes
// ---------------------------------------------------------------------------

export const AccountsListInput = z.object({
	...PaginationInput,
	search: z.string().optional(),
});
export const AccountsListOutput = listOf('accounts', ActiveCampaignAccount);
export const AccountsGetInput = IdInput;
export const AccountsGetOutput = oneOf('account', ActiveCampaignAccount);
export const AccountsCreateInput = z.object({
	name: z.string().min(1),
	accountUrl: z.string().optional(),
	owner: z.string().optional(),
	fields: z
		.array(
			z.object({ customFieldId: z.number().int(), fieldValue: z.string() }),
		)
		.optional(),
});
export const AccountsCreateOutput = AccountsGetOutput;
export const AccountsUpdateInput = AccountsCreateInput.partial().extend({
	id: z.string(),
});
export const AccountsUpdateOutput = AccountsGetOutput;
export const AccountsDeleteInput = IdInput;
export const AccountsDeleteOutput = IdOutput;

/** Account names are unique, so the name is the matching key. */
export const AccountsUpsertInput = AccountsCreateInput;
export const AccountsUpsertOutput = AccountsGetOutput;

export const AccountsDeleteBulkInput = z.object({
	ids: z.array(z.union([z.string(), z.number().int()])).min(1),
});
export const AccountsDeleteBulkOutput = z
	.object({ ids: z.array(z.union([z.string(), z.number().int()])) })
	.loose();

export const AccountContactsListInput = z.object({
	...PaginationInput,
	contact: z.string().optional(),
	account: z.string().optional(),
});
export const AccountContactsListOutput = listOf(
	'accountContacts',
	ActiveCampaignAccountContact,
);
export const AccountContactsGetInput = IdInput;
export const AccountContactsGetOutput = oneOf(
	'accountContact',
	ActiveCampaignAccountContact,
);
export const AccountContactsCreateInput = z.object({
	contact: z.string(),
	account: z.string(),
	jobTitle: z.string().optional(),
});
export const AccountContactsCreateOutput = AccountContactsGetOutput;
export const AccountContactsUpdateInput =
	AccountContactsCreateInput.partial().extend({ id: z.string() });
export const AccountContactsUpdateOutput = AccountContactsGetOutput;
export const AccountContactsDeleteInput = IdInput;
export const AccountContactsDeleteOutput = IdOutput;

export const AccountCustomFieldMetaListInput = PageInput;
export const AccountCustomFieldMetaListOutput = listOf(
	'accountCustomFieldMeta',
	ActiveCampaignAccountCustomFieldMeta,
);
export const AccountCustomFieldMetaGetInput = IdInput;
export const AccountCustomFieldMetaGetOutput = oneOf(
	'accountCustomFieldMetum',
	ActiveCampaignAccountCustomFieldMeta,
);
export const AccountCustomFieldMetaCreateInput = z.object({
	fieldLabel: z.string().min(1),
	fieldType: z.string(),
	fieldOptions: z.array(z.string()).optional(),
	fieldDefault: z.string().optional(),
	fieldDefaultCurrency: z.string().optional(),
	isFormVisible: z.number().int().optional(),
	isRequired: z.number().int().optional(),
	displayOrder: z.number().int().optional(),
});
export const AccountCustomFieldMetaCreateOutput =
	AccountCustomFieldMetaGetOutput;
export const AccountCustomFieldMetaUpdateInput =
	AccountCustomFieldMetaCreateInput.partial().extend({ id: z.string() });
export const AccountCustomFieldMetaUpdateOutput =
	AccountCustomFieldMetaGetOutput;
export const AccountCustomFieldMetaDeleteInput = IdInput;
export const AccountCustomFieldMetaDeleteOutput = IdOutput;

export const AccountCustomFieldDataListInput = z.object({
	...PaginationInput,
	accountId: z.string().optional(),
});
export const AccountCustomFieldDataListOutput = z
	.object({ accountCustomFieldData: z.array(z.unknown()), meta: Meta })
	.loose();
export const AccountCustomFieldDataGetInput = IdInput;
export const AccountCustomFieldDataGetOutput = z
	.object({ accountCustomFieldDatum: z.unknown() })
	.loose();
export const AccountCustomFieldDataCreateInput = z.object({
	accountId: z.number().int(),
	customFieldId: z.number().int(),
	fieldValue: z.string(),
});
export const AccountCustomFieldDataCreateOutput =
	AccountCustomFieldDataGetOutput;
export const AccountCustomFieldDataUpdateInput = z.object({
	id: z.string(),
	fieldValue: z.string(),
});
export const AccountCustomFieldDataUpdateOutput =
	AccountCustomFieldDataGetOutput;
export const AccountCustomFieldDataDeleteInput = IdInput;
export const AccountCustomFieldDataDeleteOutput = IdOutput;

const AccountFieldDatum = z.object({
	accountId: z.number().int(),
	customFieldId: z.number().int(),
	fieldValue: z.string(),
});
export const AccountCustomFieldDataCreateBulkInput = z.object({
	items: z.array(AccountFieldDatum).min(1),
});
export const AccountCustomFieldDataCreateBulkOutput = z.object({}).loose();
export const AccountCustomFieldDataUpdateBulkInput = z.object({
	items: z
		.array(AccountFieldDatum.partial().extend({ id: z.number().int() }))
		.min(1),
});
export const AccountCustomFieldDataUpdateBulkOutput = z.object({}).loose();

export const NotesListInput = z.object({
	...PaginationInput,
	reltype: z.string().optional(),
	relid: z.string().optional(),
});
export const NotesListOutput = listOf('notes', ActiveCampaignNote);
export const NotesGetInput = IdInput;
export const NotesGetOutput = oneOf('note', ActiveCampaignNote);
export const NotesCreateInput = z.object({
	note: z.string().min(1),
	reltype: z.enum(['Subscriber', 'Deal', 'Account']),
	relid: z.string(),
});
export const NotesCreateOutput = NotesGetOutput;
export const NotesUpdateInput = z.object({
	id: z.string(),
	note: z.string().min(1),
});
export const NotesUpdateOutput = NotesGetOutput;
export const NotesDeleteInput = IdInput;
export const NotesDeleteOutput = IdOutput;

/** Resolves the contact by email, then attaches the note to it. */
export const NotesAddToContactInput = z.object({
	email: z.email(),
	note: z.string().min(1),
});
export const NotesAddToContactOutput = NotesGetOutput;

// ---------------------------------------------------------------------------
// Campaigns, messaging, forms, variables, automations, segments
// ---------------------------------------------------------------------------

export const CampaignsListInput = z.object({
	...PaginationInput,
	type: z.string().optional(),
	status: z.string().optional(),
});
export const CampaignsListOutput = listOf('campaigns', ActiveCampaignCampaign);
export const CampaignsGetInput = IdInput;
export const CampaignsGetOutput = oneOf('campaign', ActiveCampaignCampaign);
export const CampaignsCreateInput = z.object({
	type: z.string(),
	name: z.string().min(1),
	status: z.number().int().optional(),
	sdate: z.string().optional(),
	segmentid: z.number().int().optional(),
	p: z.record(z.string(), z.unknown()).optional(),
	m: z.record(z.string(), z.unknown()).optional(),
});
export const CampaignsCreateOutput = CampaignsGetOutput;
export const CampaignsUpdateInput = z.object({
	id: z.string(),
	name: z.string().min(1).optional(),
	status: z.number().int().optional(),
});
export const CampaignsUpdateOutput = CampaignsGetOutput;
export const CampaignsDuplicateInput = IdInput;
export const CampaignsDuplicateOutput = CampaignsGetOutput;

const CampaignSubInput = z.object({ id: z.string(), ...PaginationInput });
export const CampaignsGetLinksInput = CampaignSubInput;
export const CampaignsGetLinksOutput = z
	.object({ links: z.array(z.unknown()), meta: Meta })
	.loose();
export const CampaignsGetMessagesInput = CampaignSubInput;
export const CampaignsGetMessagesOutput = z
	.object({ campaignMessages: z.array(z.unknown()), meta: Meta })
	.loose();
export const CampaignsGetAutomationsInput = CampaignSubInput;
export const CampaignsGetAutomationsOutput = z
	.object({ automations: z.array(z.unknown()), meta: Meta })
	.loose();
export const CampaignsGetAutomationListsInput = CampaignSubInput;
export const CampaignsGetAutomationListsOutput = z
	.object({ campaignLists: z.array(z.unknown()), meta: Meta })
	.loose();
export const CampaignsGetUserInput = CampaignSubInput;
export const CampaignsGetUserOutput = z.object({ user: z.unknown() }).loose();

export const MessagesListInput = PageInput;
export const MessagesListOutput = listOf('messages', ActiveCampaignMessage);
export const MessagesGetInput = IdInput;
export const MessagesGetOutput = oneOf('message', ActiveCampaignMessage);
export const MessagesCreateInput = z.object({
	subject: z.string().min(1),
	fromname: z.string().min(1),
	fromemail: z.email(),
	reply2: z.email(),
	html: z.string().optional(),
	text: z.string().optional(),
	name: z.string().optional(),
	format: z.enum(['html', 'text', 'mime']).optional(),
	user: z.string().optional(),
	preheader_text: z.string().optional(),
});
export const MessagesCreateOutput = MessagesGetOutput;
export const MessagesUpdateInput = MessagesCreateInput.partial().extend({
	id: z.string(),
});
export const MessagesUpdateOutput = MessagesGetOutput;
export const MessagesDeleteInput = IdInput;
export const MessagesDeleteOutput = IdOutput;

export const SavedResponsesListInput = PageInput;
export const SavedResponsesListOutput = listOf(
	'savedResponses',
	ActiveCampaignSavedResponse,
);
export const SavedResponsesGetInput = IdInput;
export const SavedResponsesGetOutput = oneOf(
	'savedResponse',
	ActiveCampaignSavedResponse,
);
export const SavedResponsesCreateInput = z.object({
	title: z.string().min(1),
	subject: z.string().min(1),
	body: z.string().min(1),
	userid: z.string().optional(),
});
export const SavedResponsesCreateOutput = SavedResponsesGetOutput;
export const SavedResponsesUpdateInput =
	SavedResponsesCreateInput.partial().extend({ id: z.string() });
export const SavedResponsesUpdateOutput = SavedResponsesGetOutput;
export const SavedResponsesDeleteInput = IdInput;
export const SavedResponsesDeleteOutput = IdOutput;

export const FormsListInput = PageInput;
export const FormsListOutput = listOf('forms', ActiveCampaignForm);
export const FormsGetInput = IdInput;
export const FormsGetOutput = oneOf('form', ActiveCampaignForm);
export const FormsDeleteInput = IdInput;
export const FormsDeleteOutput = IdOutput;

/** Recording an opt-in is a consent action, so the form is required. */
export const FormsCreateOptinInput = z.object({
	formid: z.string(),
	email: z.email(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
});
export const FormsCreateOptinOutput = z.object({}).loose();

export const PersonalizationsListInput = PageInput;
export const PersonalizationsListOutput = listOf(
	'personalizations',
	ActiveCampaignPersonalization,
);
export const PersonalizationsGetInput = IdInput;
export const PersonalizationsGetOutput = oneOf(
	'personalization',
	ActiveCampaignPersonalization,
);
export const PersonalizationsCreateInput = z.object({
	name: z.string().min(1),
	tag: z.string().min(1),
	content: z.string(),
	format: z.string().optional(),
	lists: z.array(z.string()).optional(),
});
export const PersonalizationsCreateOutput = PersonalizationsGetOutput;
export const PersonalizationsUpdateInput =
	PersonalizationsCreateInput.partial().extend({ id: z.string() });
export const PersonalizationsUpdateOutput = PersonalizationsGetOutput;
export const PersonalizationsDeleteInput = IdInput;
export const PersonalizationsDeleteOutput = IdOutput;
export const PersonalizationsDeleteBulkInput = z.object({
	ids: z.array(z.union([z.string(), z.number().int()])).min(1),
});
export const PersonalizationsDeleteBulkOutput = z
	.object({ ids: z.array(z.union([z.string(), z.number().int()])) })
	.loose();
export const PersonalizationsLockInput = IdInput;
export const PersonalizationsLockOutput = PersonalizationsGetOutput;
export const PersonalizationsUnlockInput = IdInput;
export const PersonalizationsUnlockOutput = PersonalizationsGetOutput;

export const TemplatesGetInput = IdInput;
export const TemplatesGetOutput = oneOf('template', ActiveCampaignTemplate);
export const TemplatesCreateShareLinkInput = IdInput;
export const TemplatesCreateShareLinkOutput = z.object({}).loose();

export const AutomationsListInput = PageInput;
export const AutomationsListOutput = listOf(
	'automations',
	ActiveCampaignAutomation,
);

export const ContactAutomationsListInput = PageInput;
export const ContactAutomationsListOutput = z
	.object({ contactAutomations: z.array(z.unknown()), meta: Meta })
	.loose();
export const ContactAutomationsGetInput = IdInput;
export const ContactAutomationsGetOutput = z
	.object({ contactAutomation: z.unknown() })
	.loose();
export const ContactAutomationsEntryCountsInput = IdInput;
export const ContactAutomationsEntryCountsOutput = z.object({}).loose();

/**
 * Automations cannot be created through the API - only through the UI - so the
 * automation must already exist.
 */
export const ContactAutomationsAddInput = z.object({
	email: z.email(),
	automation_id: z.string(),
});
export const ContactAutomationsAddOutput = ContactAutomationsGetOutput;

/**
 * A contact can hold several enrolments in one automation. `all` removes every
 * run, `last` removes only the most recent.
 */
export const ContactAutomationsRemoveInput = z.object({
	email: z.email(),
	automation_id: z.string(),
	run_remove_option: z.enum(['all', 'last']).optional(),
});
export const ContactAutomationsRemoveOutput = z
	.object({ removed: z.number() })
	.loose();

export const SegmentsListInput = PageInput;
export const SegmentsListOutput = listOf('segments', ActiveCampaignSegment);
export const SegmentsGetInput = IdInput;
export const SegmentsGetOutput = oneOf('segment', ActiveCampaignSegment);
export const SegmentsCreateInput = z.object({
	name: z.string().min(1),
	logic: z.string().optional(),
});
export const SegmentsCreateOutput = SegmentsGetOutput;
export const SegmentsUpdateInput = SegmentsCreateInput.partial().extend({
	id: z.string(),
});
export const SegmentsUpdateOutput = SegmentsGetOutput;
export const SegmentsDeleteInput = IdInput;
export const SegmentsDeleteOutput = IdOutput;
export const SegmentsListAudiencesInput = z.object({
	...PaginationInput,
	name: z.string().optional(),
});
export const SegmentsListAudiencesOutput = SegmentsListOutput;

// ---------------------------------------------------------------------------
// E-commerce, custom objects, tracking, webhooks, administration
// ---------------------------------------------------------------------------

const ConnectionFilter = z.object({
	...PaginationInput,
	service: z.string().optional(),
	externalid: z.string().optional(),
});
export const ConnectionsListInput = ConnectionFilter;
export const ConnectionsListOutput = listOf(
	'connections',
	ActiveCampaignConnection,
);
export const ConnectionsGetInput = IdInput;
export const ConnectionsGetOutput = oneOf(
	'connection',
	ActiveCampaignConnection,
);
export const ConnectionsCreateInput = z.object({
	service: z.string().min(1),
	externalid: z.string().min(1),
	name: z.string().min(1),
	logoUrl: z.url().optional(),
	linkUrl: z.url().optional(),
});
export const ConnectionsCreateOutput = ConnectionsGetOutput;
export const ConnectionsUpdateInput = ConnectionsCreateInput.partial().extend({
	id: z.string(),
});
export const ConnectionsUpdateOutput = ConnectionsGetOutput;
export const ConnectionsDeleteInput = IdInput;
export const ConnectionsDeleteOutput = IdOutput;

export const EcomCustomersListInput = z.object({
	...PaginationInput,
	connectionid: z.string().optional(),
	externalid: z.string().optional(),
});
export const EcomCustomersListOutput = listOf(
	'ecomCustomers',
	ActiveCampaignEcomCustomer,
);
export const EcomCustomersGetInput = IdInput;
export const EcomCustomersGetOutput = oneOf(
	'ecomCustomer',
	ActiveCampaignEcomCustomer,
);
export const EcomCustomersCreateInput = z.object({
	connectionid: z.string(),
	externalid: z.string(),
	email: z.email(),
	acceptsMarketing: z.string().optional(),
});
export const EcomCustomersCreateOutput = EcomCustomersGetOutput;
export const EcomCustomersUpdateInput =
	EcomCustomersCreateInput.partial().extend({ id: z.string() });
export const EcomCustomersUpdateOutput = EcomCustomersGetOutput;
export const EcomCustomersDeleteInput = IdInput;
export const EcomCustomersDeleteOutput = IdOutput;

/** Orders are transactional and are returned but never mirrored. */
export const EcomOrdersListInput = z.object({
	...PaginationInput,
	connectionid: z.string().optional(),
	customerid: z.string().optional(),
});
export const EcomOrdersListOutput = z
	.object({ ecomOrders: z.array(z.unknown()), meta: Meta })
	.loose();
export const EcomOrdersGetInput = IdInput;
export const EcomOrdersGetOutput = z.object({ ecomOrder: z.unknown() }).loose();
export const EcomOrdersCreateInput = z.object({
	externalid: z.string(),
	source: z.number().int(),
	email: z.email(),
	orderProducts: z.array(z.record(z.string(), z.unknown())),
	orderDiscounts: z.array(z.record(z.string(), z.unknown())).optional(),
	totalPrice: z.number().int(),
	shippingAmount: z.number().int().optional(),
	taxAmount: z.number().int().optional(),
	discountAmount: z.number().int().optional(),
	currency: z.string(),
	orderDate: z.string(),
	externalUpdatedDate: z.string().optional(),
	abandonedDate: z.string().optional(),
	externalcheckoutid: z.string().optional(),
	connectionid: z.string(),
	customerid: z.string(),
	orderNumber: z.string().optional(),
	shippingMethod: z.string().optional(),
});
export const EcomOrdersCreateOutput = EcomOrdersGetOutput;
export const EcomOrdersUpdateInput = EcomOrdersCreateInput.partial().extend({
	id: z.string(),
});
export const EcomOrdersUpdateOutput = EcomOrdersGetOutput;
export const EcomOrdersDeleteInput = IdInput;
export const EcomOrdersDeleteOutput = IdOutput;

export const EcomOrderProductsListInput = PageInput;
export const EcomOrderProductsListOutput = z
	.object({ ecomOrderProducts: z.array(z.unknown()), meta: Meta })
	.loose();
export const EcomOrderProductsGetInput = IdInput;
export const EcomOrderProductsGetOutput = z
	.object({ ecomOrderProduct: z.unknown() })
	.loose();

export const CustomObjectSchemasListInput = PageInput;
export const CustomObjectSchemasListOutput = listOf(
	'schemas',
	ActiveCampaignCustomObjectSchema,
);
export const CustomObjectSchemasGetInput = IdInput;
export const CustomObjectSchemasGetOutput = oneOf(
	'schema',
	ActiveCampaignCustomObjectSchema,
);
export const CustomObjectSchemasCreateInput = z.object({
	slug: z.string().min(1),
	name: z.string().min(1),
	description: z.string().optional(),
	labels: z.record(z.string(), z.unknown()).optional(),
	fields: z.array(z.record(z.string(), z.unknown())).optional(),
	relationships: z.array(z.record(z.string(), z.unknown())).optional(),
});
export const CustomObjectSchemasCreateOutput = CustomObjectSchemasGetOutput;
export const CustomObjectSchemasUpdateInput =
	CustomObjectSchemasCreateInput.partial().extend({ id: z.string() });
export const CustomObjectSchemasUpdateOutput = CustomObjectSchemasGetOutput;
export const CustomObjectSchemasDeleteInput = IdInput;
export const CustomObjectSchemasDeleteOutput = IdOutput;

export const CustomObjectRecordsListInput = z.object({
	schemaId: z.string(),
	...PaginationInput,
});
export const CustomObjectRecordsListOutput = z
	.object({ records: z.array(z.unknown()), meta: Meta })
	.loose();
/** Upsert: an existing external ID updates, anything else creates. */
export const CustomObjectRecordsUpsertInput = z.object({
	schemaId: z.string(),
	externalId: z.string().optional(),
	fields: z.array(z.record(z.string(), z.unknown())),
});
export const CustomObjectRecordsUpsertOutput = z
	.object({ record: z.unknown() })
	.loose();
export const CustomObjectRecordsGetInput = z.object({
	schemaId: z.string(),
	id: z.string(),
});
export const CustomObjectRecordsGetOutput = CustomObjectRecordsUpsertOutput;
export const CustomObjectRecordsGetByExternalIdInput = z.object({
	schemaId: z.string(),
	externalId: z.string(),
});
export const CustomObjectRecordsGetByExternalIdOutput =
	CustomObjectRecordsUpsertOutput;
export const CustomObjectRecordsDeleteInput = CustomObjectRecordsGetInput;
export const CustomObjectRecordsDeleteOutput = z
	.object({ schemaId: z.string(), id: z.string().optional() })
	.loose();
export const CustomObjectRecordsDeleteByExternalIdInput =
	CustomObjectRecordsGetByExternalIdInput;
export const CustomObjectRecordsDeleteByExternalIdOutput = z
	.object({ schemaId: z.string(), externalId: z.string().optional() })
	.loose();

export const WebhooksListInput = PageInput;
export const WebhooksListOutput = listOf('webhooks', ActiveCampaignWebhook);
export const WebhooksGetInput = IdInput;
export const WebhooksGetOutput = oneOf('webhook', ActiveCampaignWebhook);
export const WebhooksCreateInput = z.object({
	name: z.string().min(1),
	url: z.url(),
	events: z.array(z.string()).min(1),
	sources: z.array(z.enum(['public', 'admin', 'api', 'system'])).min(1),
	listid: z.string().optional(),
});
export const WebhooksCreateOutput = WebhooksGetOutput;
export const WebhooksUpdateInput = WebhooksCreateInput.partial().extend({
	id: z.string(),
});
export const WebhooksUpdateOutput = WebhooksGetOutput;
export const WebhooksDeleteInput = IdInput;
export const WebhooksDeleteOutput = IdOutput;

export const UsersListInput = PageInput;
export const UsersListOutput = listOf('users', ActiveCampaignUser);
export const UsersGetInput = IdInput;
export const UsersGetOutput = oneOf('user', ActiveCampaignUser);
export const UsersCreateInput = z.object({
	username: z.string().min(1),
	email: z.email(),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	password: z.string().min(1),
	group: z.string(),
	phone: z.string().optional(),
	signature: z.string().optional(),
	lang: z.string().optional(),
	localZoneid: z.string().optional(),
});
export const UsersCreateOutput = UsersGetOutput;
export const UsersUpdateInput = UsersCreateInput.partial().extend({
	id: z.string(),
});
export const UsersUpdateOutput = UsersGetOutput;
export const UsersDeleteInput = IdInput;
export const UsersDeleteOutput = IdOutput;
export const UsersGetMeInput = z.object({});
export const UsersGetMeOutput = UsersGetOutput;
export const UsersGetByUsernameInput = z.object({
	username: z.string().min(1),
});
export const UsersGetByUsernameOutput = UsersGetOutput;

export const GroupsListInput = PageInput;
export const GroupsListOutput = listOf('groups', ActiveCampaignGroup);
export const GroupsGetInput = IdInput;
export const GroupsGetOutput = oneOf('group', ActiveCampaignGroup);
export const GroupsCreateInput = z.object({
	title: z.string().min(1),
	descript: z.string().optional(),
});
export const GroupsCreateOutput = GroupsGetOutput;
export const GroupsUpdateInput = GroupsCreateInput.partial().extend({
	id: z.string(),
});
export const GroupsUpdateOutput = GroupsGetOutput;
export const GroupsDeleteInput = IdInput;
export const GroupsDeleteOutput = IdOutput;
export const GroupLimitsListInput = PageInput;
export const GroupLimitsListOutput = listOf(
	'groupLimits',
	ActiveCampaignGroupLimit,
);

export const AddressesListInput = PageInput;
export const AddressesListOutput = listOf('addresses', ActiveCampaignAddress);
export const AddressesGetInput = IdInput;
export const AddressesGetOutput = oneOf('address', ActiveCampaignAddress);
export const AddressesCreateInput = z.object({
	companyName: z.string().min(1),
	address1: z.string().min(1),
	address2: z.string().optional(),
	city: z.string().min(1),
	state: z.string().optional(),
	zip: z.string().optional(),
	country: z.string().min(2),
	allgroups: z.boolean().optional(),
	groupid: z.string().optional(),
});
export const AddressesCreateOutput = AddressesGetOutput;
export const AddressesUpdateInput = AddressesCreateInput.partial().extend({
	id: z.string(),
});
export const AddressesUpdateOutput = AddressesGetOutput;
export const AddressesDeleteInput = IdInput;
export const AddressesDeleteOutput = IdOutput;

export const CalendarsListInput = PageInput;
export const CalendarsListOutput = listOf('calendars', ActiveCampaignCalendar);
export const CalendarsGetInput = IdInput;
export const CalendarsGetOutput = oneOf('calendar', ActiveCampaignCalendar);
export const CalendarsCreateInput = z.object({
	title: z.string().min(1),
	type: z.string().optional(),
	description: z.string().optional(),
	isglobal: z.boolean().optional(),
	inviteusers: z.array(z.string()).optional(),
});
export const CalendarsCreateOutput = CalendarsGetOutput;
export const CalendarsUpdateInput = CalendarsCreateInput.partial().extend({
	id: z.string(),
});
export const CalendarsUpdateOutput = CalendarsGetOutput;
export const CalendarsDeleteInput = IdInput;
export const CalendarsDeleteOutput = IdOutput;

export const EventTrackingEventsListInput = PageInput;
export const EventTrackingEventsListOutput = listOf(
	'eventTrackingEvents',
	ActiveCampaignEventTrackingEvent,
);
export const EventTrackingEventsCreateInput = z.object({
	name: z.string().min(1),
});
export const EventTrackingEventsCreateOutput = oneOf(
	'eventTrackingEvent',
	ActiveCampaignEventTrackingEvent,
);
export const EventTrackingEventsDeleteInput = IdInput;
export const EventTrackingEventsDeleteOutput = IdOutput;

const TrackingStatus = z.object({ enabled: z.boolean() });
export const TrackingGetSiteStatusInput = z.object({});
export const TrackingGetSiteStatusOutput = z
	.object({ siteTracking: TrackingStatus.loose() })
	.loose();
export const TrackingGetEventStatusInput = z.object({});
export const TrackingGetEventStatusOutput = z
	.object({ eventTracking: TrackingStatus.loose() })
	.loose();
export const TrackingSetSiteStatusInput = TrackingStatus;
export const TrackingSetSiteStatusOutput = TrackingGetSiteStatusOutput;
export const TrackingSetEventStatusInput = TrackingStatus;
export const TrackingSetEventStatusOutput = TrackingGetEventStatusOutput;

/**
 * Event tracking posts to a separate host with form encoding and needs the
 * account's event key and actor id, neither of which is derivable from the API
 * token, so both are caller-supplied.
 */
export const TrackingTrackEventInput = z.object({
	actid: z.string(),
	key: z.string(),
	event: z.string().min(1),
	email: z.email(),
	eventdata: z.string().optional(),
});
export const TrackingTrackEventOutput = z.object({}).loose();

export const TrackingListWhitelistInput = PageInput;
export const TrackingListWhitelistOutput = z
	.object({
		siteTrackingWhitelist: z.array(z.unknown()).optional(),
		meta: Meta,
	})
	.loose();
export const TrackingAddWhitelistInput = z.object({ name: z.string().min(1) });
export const TrackingAddWhitelistOutput = z.object({}).loose();
export const TrackingRemoveWhitelistInput = IdInput;
export const TrackingRemoveWhitelistOutput = IdOutput;

export const ScoresListInput = PageInput;
export const ScoresListOutput = listOf('scores', ActiveCampaignScore);

export const EmailActivitiesListInput = z.object({
	...PaginationInput,
	subscriberid: z.string().optional(),
	dealId: z.string().optional(),
});
export const EmailActivitiesListOutput = z
	.object({ emailActivities: z.array(z.unknown()), meta: Meta })
	.loose();

export const BrandingsGetInput = IdInput;
export const BrandingsGetOutput = oneOf('branding', ActiveCampaignBranding);
export const BrandingsUpdateInput = z.object({
	id: z.string(),
	siteName: z.string().optional(),
	siteLogo: z.string().optional(),
	favicon: z.string().optional(),
	copyright: z.string().optional(),
});
export const BrandingsUpdateOutput = BrandingsGetOutput;
export const ConfigsUpdateInput = z.object({
	id: z.string(),
	value: z.string(),
});
export const ConfigsUpdateOutput = z.object({ config: z.unknown() }).loose();

// --- GraphQL e-commerce catalog --------------------------------------------

export const ProductsSearchInput = z.object({
	filter: z.record(z.string(), z.unknown()).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export const ProductsSearchOutput = z
	.object({ products: z.array(z.unknown()).optional() })
	.loose();
export const ProductsGetInput = IdInput;
export const ProductsGetOutput = z
	.object({ product: z.unknown().optional() })
	.loose();
export const ProductsCreateInput = z.object({
	legacyConnectionId: z.string(),
	name: z.string().min(1),
	sku: z.string().optional(),
	price: z.number().optional(),
	currency: z.string().optional(),
	description: z.string().optional(),
	imageUrl: z.url().optional(),
	productUrl: z.url().optional(),
	isVariant: z.boolean().optional(),
});
export const ProductsCreateOutput = z
	.object({ createProduct: z.unknown().optional() })
	.loose();
export const ProductsUpdateInput = ProductsCreateInput.partial().extend({
	id: z.string(),
});
export const ProductsUpdateOutput = z
	.object({ updateProduct: z.unknown().optional() })
	.loose();
export const ProductsDeleteInput = IdInput;
export const ProductsDeleteOutput = z
	.object({ deleteProduct: z.unknown().optional() })
	.loose();
export const ProductsUpsertBulkInput = z.object({
	products: z.array(z.record(z.string(), z.unknown())).min(1),
});
export const ProductsUpsertBulkOutput = z.object({}).loose();

/** Orders are matched on storeOrderId within a connection. */
export const OrdersUpsertBulkInput = z.object({
	orders: z.array(z.record(z.string(), z.unknown())).min(1),
});
export const OrdersUpsertBulkOutput = z.object({}).loose();
export const OrdersUpsertBulkAsyncInput = OrdersUpsertBulkInput;
export const OrdersUpsertBulkAsyncOutput = z.object({}).loose();

export const RecurringPaymentsSearchInput = ProductsSearchInput;
export const RecurringPaymentsSearchOutput = z
	.object({ recurringPayments: z.array(z.unknown()).optional() })
	.loose();
export const RecurringPaymentsUpsertBulkInput = z.object({
	recurringPayments: z.array(z.record(z.string(), z.unknown())).min(1),
});
export const RecurringPaymentsUpsertBulkOutput = z.object({}).loose();

export const BrowseSessionsSearchInput = z.object({
	connectionId: z.string(),
	email: z.email().optional(),
	status: z.string().optional(),
});
export const BrowseSessionsSearchOutput = z
	.object({ browseSessions: z.array(z.unknown()).optional() })
	.loose();
export const BrowseSessionsSaveInput = z.object({
	connectionId: z.string(),
	email: z.email(),
	status: z.string(),
	products: z.array(z.record(z.string(), z.unknown())).optional(),
});
export const BrowseSessionsSaveOutput = z.object({}).loose();
export const BrowseSessionsAddToCartInput = z.object({
	connectionId: z.string(),
	email: z.email(),
});
export const BrowseSessionsAddToCartOutput = z.object({}).loose();

// ---------------------------------------------------------------------------
// SMS
//
// Reachable under `sms/*` rather than `smsBroadcasts`. Row shapes are left
// unmodelled: the development account returned an empty broadcast list, so
// nothing was captured to declare.
// ---------------------------------------------------------------------------

export const SmsBroadcastsListInput = z.object({
	...PaginationInput,
	name: z.string().optional(),
	status: z.string().optional(),
});
export const SmsBroadcastsListOutput = z
	.object({ broadcasts: z.array(z.unknown()).optional(), meta: Meta })
	.loose();
export const SmsBroadcastsGetMetricsInput = z.object({
	broadcastIds: z.array(z.string()).optional(),
});
export const SmsBroadcastsGetMetricsOutput = z.object({}).loose();
export const SmsBroadcastsGetSnapshotInput = z.object({});
export const SmsBroadcastsGetSnapshotOutput = z
	.object({ snapshot: z.unknown().optional() })
	.loose();
export const SmsBroadcastsCreateSnapshotInput = z.object({
	broadcastIds: z.array(z.string()).min(1),
});
export const SmsBroadcastsCreateSnapshotOutput = z.object({}).loose();
export const SmsBroadcastsGetFailuresInput = z.object({
	broadcastId: z.string(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
});
export const SmsBroadcastsGetFailuresOutput = z.object({}).loose();
export const SmsBroadcastsGetRecipientsInput = z.object({
	id: z.string(),
	...PaginationInput,
});
export const SmsBroadcastsGetRecipientsOutput = z.object({}).loose();
export const SmsCreditsGetInput = z.object({});
export const SmsCreditsGetOutput = z
	.object({ smsCredits: z.unknown().optional() })
	.loose();

export const TrackingGetCodeInput = z.object({});
export const TrackingGetCodeOutput = z.object({}).loose();

// ---------------------------------------------------------------------------
// Late additions
// ---------------------------------------------------------------------------

export const SmsBroadcastListsListInput = z.object({
	...PaginationInput,
	name: z.string().optional(),
});
export const SmsBroadcastListsListOutput = z
	.object({ lists: z.array(z.unknown()).optional(), meta: Meta })
	.loose();

export const AddressGroupsDeleteInput = IdInput;
export const AddressGroupsDeleteOutput = IdOutput;

/** No route takes a store order id directly, so the collection is filtered. */
export const EcomOrdersFindInput = z.object({
	connectionId: z.string(),
	storeOrderId: z.string(),
});
export const EcomOrdersFindOutput = z
	.object({ ecomOrder: z.unknown().nullable() })
	.loose();

export const EcomOrdersUpsertInput = EcomOrdersCreateInput;
export const EcomOrdersUpsertOutput = EcomOrdersGetOutput;

export const EcomOrderProductsListForOrderInput = z.object({
	orderId: z.string(),
	...PaginationInput,
});
export const EcomOrderProductsListForOrderOutput = EcomOrderProductsListOutput;

/** Typed note helpers: `/notes` with `reltype` fixed to the entity. */
const TypedNoteCreate = z.object({
	id: z.string(),
	note: z.string().min(1),
});
export const NotesCreateForAccountInput = TypedNoteCreate;
export const NotesCreateForAccountOutput = NotesGetOutput;
export const NotesCreateForDealInput = TypedNoteCreate;
export const NotesCreateForDealOutput = NotesGetOutput;
export const NotesUpdateForAccountInput = NotesUpdateInput;
export const NotesUpdateForAccountOutput = NotesGetOutput;
export const NotesUpdateForDealInput = NotesUpdateInput;
export const NotesUpdateForDealOutput = NotesGetOutput;

/** Contact tasks are deal tasks with `reltype: 'Subscriber'`. */
export const ContactTasksCreateInput = z.object({
	contactId: z.string(),
	title: z.string().min(1),
	taskTypeId: z.string(),
	dueDate: z.string(),
	note: z.string().optional(),
	assignee: z.string().optional(),
});
export const ContactTasksCreateOutput = z
	.object({ dealTask: ActiveCampaignDealTask })
	.loose();
export const ContactTasksFindInput = z.object({
	title: z.string().min(1),
	contactId: z.string().optional(),
});
export const ContactTasksFindOutput = z
	.object({ dealTasks: z.array(z.unknown()) })
	.loose();

// ---------------------------------------------------------------------------
// V2 segments, task reminders, child schemas, import aggregate, event test
//
// The V2 segment routes could not be confirmed against a live account - see
// the header of `endpoints/segments-v2.ts` and UNVERIFIED_ROUTES there.
// ---------------------------------------------------------------------------

/** V2 segment ids are UUIDs, not the numeric ids the legacy API uses. */
const SegmentUuid = z.string().min(1);

export const SegmentsV2CreateInput = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	conditions: z.array(z.record(z.string(), z.unknown())).optional(),
});
export const SegmentsV2CreateOutput = z
	.object({ segment: z.unknown() })
	.loose();
export const SegmentsV2GetInput = z.object({ id: SegmentUuid });
export const SegmentsV2GetOutput = SegmentsV2CreateOutput;
export const SegmentsV2UpdateInput = SegmentsV2CreateInput.partial().extend({
	id: SegmentUuid,
});
export const SegmentsV2UpdateOutput = SegmentsV2CreateOutput;
export const SegmentsV2DeleteInput = z.object({ id: SegmentUuid });
/** Returns the segment's final state as an audit trail. */
export const SegmentsV2DeleteOutput = SegmentsV2CreateOutput;

export const SegmentsV2GetAtTimestampInput = z.object({
	id: SegmentUuid,
	timestamp: z.string().min(1),
});
export const SegmentsV2GetAtTimestampOutput = SegmentsV2CreateOutput;
export const SegmentsV2RevertToTimestampInput = SegmentsV2GetAtTimestampInput;
export const SegmentsV2RevertToTimestampOutput = SegmentsV2CreateOutput;

export const SegmentsV2RecentCountsInput = PageInput;
export const SegmentsV2RecentCountsOutput = z
	.object({ segmentCounts: z.array(z.unknown()).optional(), meta: Meta })
	.loose();
export const SegmentsV2CountHistoryInput = z.object({ id: SegmentUuid });
export const SegmentsV2CountHistoryOutput = SegmentsV2RecentCountsOutput;
export const SegmentsV2CountAtTimestampInput = SegmentsV2GetAtTimestampInput;
export const SegmentsV2CountAtTimestampOutput = SegmentsV2RecentCountsOutput;

export const SegmentsV2MatchInput = z.object({
	id: SegmentUuid,
	contactId: z.string(),
});
export const SegmentsV2MatchOutput = z.object({}).loose();
export const SegmentsV2MatchByExternalIdInput = z.object({
	id: SegmentUuid,
	externalId: z.string().min(1),
});
export const SegmentsV2MatchByExternalIdOutput = z.object({}).loose();

/** `is_ready: false` returns a run id to poll rather than a result set. */
export const SegmentsV2MatchAllInput = z.object({ id: SegmentUuid });
export const SegmentsV2MatchAllOutput = z
	.object({ is_ready: z.boolean().optional(), run_id: z.unknown().optional() })
	.loose();
export const SegmentsV2MatchAllResultInput = z.object({ runId: z.string() });
export const SegmentsV2MatchAllResultOutput = SegmentsV2MatchAllOutput;
export const SegmentsV2MatchSomeResultInput = SegmentsV2MatchAllResultInput;
export const SegmentsV2MatchSomeResultOutput = SegmentsV2MatchAllOutput;

/** `interval` is minutes before the task's due date. */
export const TaskRemindersCreateInput = z.object({
	dealTask: z.string(),
	interval: z.number().int().min(1),
});
export const TaskRemindersCreateOutput = z
	.object({ taskNotification: z.unknown() })
	.loose();

export const CustomObjectSchemasCreateChildInput = z.object({
	parentId: z.string(),
	applicationId: z.string(),
	slug: z.string().min(1),
	name: z.string().min(1),
	description: z.string().optional(),
});
export const CustomObjectSchemasCreateChildOutput =
	CustomObjectSchemasGetOutput;

export const ImportsListAggregateInput = z.object({});
export const ImportsListAggregateOutput = z.object({}).loose();

export const BrowseSessionsTestEventInput = z.object({
	connectionId: z.string(),
	url: z.url(),
	email: z.email().optional(),
});
export const BrowseSessionsTestEventOutput = z.object({}).loose();

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
	contactsGetLogs: ContactsGetLogsInput,
	contactsGetTrackingLogs: ContactsGetTrackingLogsInput,
	contactsGetGoals: ContactsGetGoalsInput,
	contactsGetAccountContacts: ContactsGetAccountContactsInput,
	contactsGetNotes: ContactsGetNotesInput,
	contactsGetData: ContactsGetDataInput,
	contactsGetOrganization: ContactsGetOrganizationInput,
	contactsGetPlusAppend: ContactsGetPlusAppendInput,
	activitiesList: ActivitiesListInput,
	importsCreateBulk: ImportsCreateBulkInput,
	importsList: ImportsListInput,
	importsGetStatus: ImportsGetStatusInput,
	listGroupsCreate: ListGroupsCreateInput,
	dealsList: DealsListInput,
	dealsListFiltered: DealsListInput,
	dealsGet: DealsGetInput,
	dealsUpdate: DealsUpdateInput,
	dealsDelete: DealsDeleteInput,
	dealsUpdateOwnersBulk: DealsUpdateOwnersBulkInput,
	dealGroupsList: DealGroupsListInput,
	dealGroupsGet: DealGroupsGetInput,
	dealGroupsCreate: DealGroupsCreateInput,
	dealGroupsUpdate: DealGroupsUpdateInput,
	dealGroupsDelete: DealGroupsDeleteInput,
	dealStagesList: DealStagesListInput,
	dealStagesGet: DealStagesGetInput,
	dealStagesCreate: DealStagesCreateInput,
	dealStagesUpdate: DealStagesUpdateInput,
	dealStagesDelete: DealStagesDeleteInput,
	dealStagesMoveDeals: DealStagesMoveDealsInput,
	dealStagesDeleteWithDeals: DealStagesDeleteWithDealsInput,
	dealTasksList: DealTasksListInput,
	dealTasksGet: DealTasksGetInput,
	dealTasksCreate: DealTasksCreateInput,
	dealTasksUpdate: DealTasksUpdateInput,
	dealTasksDelete: DealTasksDeleteInput,
	dealTaskTypesList: DealTaskTypesListInput,
	dealTaskTypesGet: DealTaskTypesGetInput,
	dealTaskTypesCreate: DealTaskTypesCreateInput,
	dealTaskTypesUpdate: DealTaskTypesUpdateInput,
	taskOutcomesList: TaskOutcomesListInput,
	taskOutcomesGet: TaskOutcomesGetInput,
	taskOutcomesCreate: TaskOutcomesCreateInput,
	dealRolesList: DealRolesListInput,
	dealRolesCreate: DealRolesCreateInput,
	dealRolesDelete: DealRolesDeleteInput,
	contactDealsList: ContactDealsListInput,
	contactDealsGet: ContactDealsGetInput,
	contactDealsCreate: ContactDealsCreateInput,
	contactDealsUpdate: ContactDealsUpdateInput,
	contactDealsDelete: ContactDealsDeleteInput,
	dealCustomFieldMetaList: DealCustomFieldMetaListInput,
	dealCustomFieldMetaGet: DealCustomFieldMetaGetInput,
	dealCustomFieldMetaCreate: DealCustomFieldMetaCreateInput,
	dealCustomFieldMetaUpdate: DealCustomFieldMetaUpdateInput,
	dealCustomFieldMetaDelete: DealCustomFieldMetaDeleteInput,
	dealCustomFieldDataList: DealCustomFieldDataListInput,
	dealCustomFieldDataGet: DealCustomFieldDataGetInput,
	dealCustomFieldDataUpdate: DealCustomFieldDataUpdateInput,
	dealCustomFieldDataDelete: DealCustomFieldDataDeleteInput,
	dealActivitiesList: DealActivitiesListInput,
	accountsList: AccountsListInput,
	accountsGet: AccountsGetInput,
	accountsCreate: AccountsCreateInput,
	accountsUpdate: AccountsUpdateInput,
	accountsDelete: AccountsDeleteInput,
	accountsUpsert: AccountsUpsertInput,
	accountsDeleteBulk: AccountsDeleteBulkInput,
	accountContactsList: AccountContactsListInput,
	accountContactsGet: AccountContactsGetInput,
	accountContactsCreate: AccountContactsCreateInput,
	accountContactsUpdate: AccountContactsUpdateInput,
	accountContactsDelete: AccountContactsDeleteInput,
	accountCustomFieldMetaList: AccountCustomFieldMetaListInput,
	accountCustomFieldMetaGet: AccountCustomFieldMetaGetInput,
	accountCustomFieldMetaCreate: AccountCustomFieldMetaCreateInput,
	accountCustomFieldMetaUpdate: AccountCustomFieldMetaUpdateInput,
	accountCustomFieldMetaDelete: AccountCustomFieldMetaDeleteInput,
	accountCustomFieldDataList: AccountCustomFieldDataListInput,
	accountCustomFieldDataGet: AccountCustomFieldDataGetInput,
	accountCustomFieldDataCreate: AccountCustomFieldDataCreateInput,
	accountCustomFieldDataUpdate: AccountCustomFieldDataUpdateInput,
	accountCustomFieldDataDelete: AccountCustomFieldDataDeleteInput,
	accountCustomFieldDataCreateBulk: AccountCustomFieldDataCreateBulkInput,
	accountCustomFieldDataUpdateBulk: AccountCustomFieldDataUpdateBulkInput,
	notesList: NotesListInput,
	notesGet: NotesGetInput,
	notesCreate: NotesCreateInput,
	notesUpdate: NotesUpdateInput,
	notesDelete: NotesDeleteInput,
	notesAddToContact: NotesAddToContactInput,
	campaignsList: CampaignsListInput,
	campaignsGet: CampaignsGetInput,
	campaignsCreate: CampaignsCreateInput,
	campaignsUpdate: CampaignsUpdateInput,
	campaignsDuplicate: CampaignsDuplicateInput,
	campaignsGetLinks: CampaignsGetLinksInput,
	campaignsGetMessages: CampaignsGetMessagesInput,
	campaignsGetAutomations: CampaignsGetAutomationsInput,
	campaignsGetAutomationLists: CampaignsGetAutomationListsInput,
	campaignsGetUser: CampaignsGetUserInput,
	messagesList: MessagesListInput,
	messagesGet: MessagesGetInput,
	messagesCreate: MessagesCreateInput,
	messagesUpdate: MessagesUpdateInput,
	messagesDelete: MessagesDeleteInput,
	savedResponsesList: SavedResponsesListInput,
	savedResponsesGet: SavedResponsesGetInput,
	savedResponsesCreate: SavedResponsesCreateInput,
	savedResponsesUpdate: SavedResponsesUpdateInput,
	savedResponsesDelete: SavedResponsesDeleteInput,
	formsList: FormsListInput,
	formsGet: FormsGetInput,
	formsDelete: FormsDeleteInput,
	formsCreateOptin: FormsCreateOptinInput,
	personalizationsList: PersonalizationsListInput,
	personalizationsGet: PersonalizationsGetInput,
	personalizationsCreate: PersonalizationsCreateInput,
	personalizationsUpdate: PersonalizationsUpdateInput,
	personalizationsDelete: PersonalizationsDeleteInput,
	personalizationsDeleteBulk: PersonalizationsDeleteBulkInput,
	personalizationsLock: PersonalizationsLockInput,
	personalizationsUnlock: PersonalizationsUnlockInput,
	templatesGet: TemplatesGetInput,
	templatesCreateShareLink: TemplatesCreateShareLinkInput,
	automationsList: AutomationsListInput,
	contactAutomationsList: ContactAutomationsListInput,
	contactAutomationsGet: ContactAutomationsGetInput,
	contactAutomationsEntryCounts: ContactAutomationsEntryCountsInput,
	contactAutomationsAdd: ContactAutomationsAddInput,
	contactAutomationsRemove: ContactAutomationsRemoveInput,
	segmentsList: SegmentsListInput,
	segmentsGet: SegmentsGetInput,
	segmentsCreate: SegmentsCreateInput,
	segmentsUpdate: SegmentsUpdateInput,
	segmentsDelete: SegmentsDeleteInput,
	segmentsListAudiences: SegmentsListAudiencesInput,
	connectionsList: ConnectionsListInput,
	connectionsGet: ConnectionsGetInput,
	connectionsCreate: ConnectionsCreateInput,
	connectionsUpdate: ConnectionsUpdateInput,
	connectionsDelete: ConnectionsDeleteInput,
	ecomCustomersList: EcomCustomersListInput,
	ecomCustomersGet: EcomCustomersGetInput,
	ecomCustomersCreate: EcomCustomersCreateInput,
	ecomCustomersUpdate: EcomCustomersUpdateInput,
	ecomCustomersDelete: EcomCustomersDeleteInput,
	ecomOrdersList: EcomOrdersListInput,
	ecomOrdersGet: EcomOrdersGetInput,
	ecomOrdersCreate: EcomOrdersCreateInput,
	ecomOrdersUpdate: EcomOrdersUpdateInput,
	ecomOrdersDelete: EcomOrdersDeleteInput,
	ecomOrderProductsList: EcomOrderProductsListInput,
	ecomOrderProductsGet: EcomOrderProductsGetInput,
	customObjectSchemasList: CustomObjectSchemasListInput,
	customObjectSchemasGet: CustomObjectSchemasGetInput,
	customObjectSchemasCreate: CustomObjectSchemasCreateInput,
	customObjectSchemasUpdate: CustomObjectSchemasUpdateInput,
	customObjectSchemasDelete: CustomObjectSchemasDeleteInput,
	customObjectRecordsList: CustomObjectRecordsListInput,
	customObjectRecordsUpsert: CustomObjectRecordsUpsertInput,
	customObjectRecordsGet: CustomObjectRecordsGetInput,
	customObjectRecordsGetByExternalId: CustomObjectRecordsGetByExternalIdInput,
	customObjectRecordsDelete: CustomObjectRecordsDeleteInput,
	customObjectRecordsDeleteByExternalId:
		CustomObjectRecordsDeleteByExternalIdInput,
	webhooksList: WebhooksListInput,
	webhooksGet: WebhooksGetInput,
	webhooksCreate: WebhooksCreateInput,
	webhooksUpdate: WebhooksUpdateInput,
	webhooksDelete: WebhooksDeleteInput,
	usersList: UsersListInput,
	usersGet: UsersGetInput,
	usersCreate: UsersCreateInput,
	usersUpdate: UsersUpdateInput,
	usersDelete: UsersDeleteInput,
	usersGetMe: UsersGetMeInput,
	usersGetByUsername: UsersGetByUsernameInput,
	groupsList: GroupsListInput,
	groupsGet: GroupsGetInput,
	groupsCreate: GroupsCreateInput,
	groupsUpdate: GroupsUpdateInput,
	groupsDelete: GroupsDeleteInput,
	groupLimitsList: GroupLimitsListInput,
	addressesList: AddressesListInput,
	addressesGet: AddressesGetInput,
	addressesCreate: AddressesCreateInput,
	addressesUpdate: AddressesUpdateInput,
	addressesDelete: AddressesDeleteInput,
	calendarsList: CalendarsListInput,
	calendarsGet: CalendarsGetInput,
	calendarsCreate: CalendarsCreateInput,
	calendarsUpdate: CalendarsUpdateInput,
	calendarsDelete: CalendarsDeleteInput,
	eventTrackingEventsList: EventTrackingEventsListInput,
	eventTrackingEventsCreate: EventTrackingEventsCreateInput,
	eventTrackingEventsDelete: EventTrackingEventsDeleteInput,
	trackingGetSiteStatus: TrackingGetSiteStatusInput,
	trackingGetEventStatus: TrackingGetEventStatusInput,
	trackingSetSiteStatus: TrackingSetSiteStatusInput,
	trackingSetEventStatus: TrackingSetEventStatusInput,
	trackingTrackEvent: TrackingTrackEventInput,
	trackingListWhitelist: TrackingListWhitelistInput,
	trackingAddWhitelist: TrackingAddWhitelistInput,
	trackingRemoveWhitelist: TrackingRemoveWhitelistInput,
	scoresList: ScoresListInput,
	emailActivitiesList: EmailActivitiesListInput,
	brandingsGet: BrandingsGetInput,
	brandingsUpdate: BrandingsUpdateInput,
	configsUpdate: ConfigsUpdateInput,
	productsSearch: ProductsSearchInput,
	productsGet: ProductsGetInput,
	productsCreate: ProductsCreateInput,
	productsUpdate: ProductsUpdateInput,
	productsDelete: ProductsDeleteInput,
	productsUpsertBulk: ProductsUpsertBulkInput,
	ordersUpsertBulk: OrdersUpsertBulkInput,
	ordersUpsertBulkAsync: OrdersUpsertBulkAsyncInput,
	recurringPaymentsSearch: RecurringPaymentsSearchInput,
	recurringPaymentsUpsertBulk: RecurringPaymentsUpsertBulkInput,
	browseSessionsSearch: BrowseSessionsSearchInput,
	browseSessionsSave: BrowseSessionsSaveInput,
	browseSessionsAddToCart: BrowseSessionsAddToCartInput,
	smsBroadcastsList: SmsBroadcastsListInput,
	smsBroadcastsGetMetrics: SmsBroadcastsGetMetricsInput,
	smsBroadcastsGetSnapshot: SmsBroadcastsGetSnapshotInput,
	smsBroadcastsCreateSnapshot: SmsBroadcastsCreateSnapshotInput,
	smsBroadcastsGetFailures: SmsBroadcastsGetFailuresInput,
	smsBroadcastsGetRecipients: SmsBroadcastsGetRecipientsInput,
	smsCreditsGet: SmsCreditsGetInput,
	trackingGetCode: TrackingGetCodeInput,
	smsBroadcastListsList: SmsBroadcastListsListInput,
	addressGroupsDelete: AddressGroupsDeleteInput,
	ecomOrdersFind: EcomOrdersFindInput,
	ecomOrdersUpsert: EcomOrdersUpsertInput,
	ecomOrderProductsListForOrder: EcomOrderProductsListForOrderInput,
	notesCreateForAccount: NotesCreateForAccountInput,
	notesCreateForDeal: NotesCreateForDealInput,
	notesUpdateForAccount: NotesUpdateForAccountInput,
	notesUpdateForDeal: NotesUpdateForDealInput,
	contactTasksCreate: ContactTasksCreateInput,
	contactTasksFind: ContactTasksFindInput,
	segmentsV2Create: SegmentsV2CreateInput,
	segmentsV2Get: SegmentsV2GetInput,
	segmentsV2Update: SegmentsV2UpdateInput,
	segmentsV2Delete: SegmentsV2DeleteInput,
	segmentsV2GetAtTimestamp: SegmentsV2GetAtTimestampInput,
	segmentsV2RevertToTimestamp: SegmentsV2RevertToTimestampInput,
	segmentsV2RecentCounts: SegmentsV2RecentCountsInput,
	segmentsV2CountHistory: SegmentsV2CountHistoryInput,
	segmentsV2CountAtTimestamp: SegmentsV2CountAtTimestampInput,
	segmentsV2Match: SegmentsV2MatchInput,
	segmentsV2MatchByExternalId: SegmentsV2MatchByExternalIdInput,
	segmentsV2MatchAll: SegmentsV2MatchAllInput,
	segmentsV2MatchAllResult: SegmentsV2MatchAllResultInput,
	segmentsV2MatchSomeResult: SegmentsV2MatchSomeResultInput,
	taskRemindersCreate: TaskRemindersCreateInput,
	customObjectSchemasCreateChild: CustomObjectSchemasCreateChildInput,
	importsListAggregate: ImportsListAggregateInput,
	browseSessionsTestEvent: BrowseSessionsTestEventInput,
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
	contactsGetLogs: ContactsGetLogsOutput,
	contactsGetTrackingLogs: ContactsGetTrackingLogsOutput,
	contactsGetGoals: ContactsGetGoalsOutput,
	contactsGetAccountContacts: ContactsGetAccountContactsOutput,
	contactsGetNotes: ContactsGetNotesOutput,
	contactsGetData: ContactsGetDataOutput,
	contactsGetOrganization: ContactsGetOrganizationOutput,
	contactsGetPlusAppend: ContactsGetPlusAppendOutput,
	activitiesList: ActivitiesListOutput,
	importsCreateBulk: ImportsCreateBulkOutput,
	importsList: ImportsListOutput,
	importsGetStatus: ImportsGetStatusOutput,
	listGroupsCreate: ListGroupsCreateOutput,
	dealsList: DealsListOutput,
	dealsListFiltered: DealsListOutput,
	dealsGet: DealsGetOutput,
	dealsUpdate: DealsUpdateOutput,
	dealsDelete: DealsDeleteOutput,
	dealsUpdateOwnersBulk: DealsUpdateOwnersBulkOutput,
	dealGroupsList: DealGroupsListOutput,
	dealGroupsGet: DealGroupsGetOutput,
	dealGroupsCreate: DealGroupsCreateOutput,
	dealGroupsUpdate: DealGroupsUpdateOutput,
	dealGroupsDelete: DealGroupsDeleteOutput,
	dealStagesList: DealStagesListOutput,
	dealStagesGet: DealStagesGetOutput,
	dealStagesCreate: DealStagesCreateOutput,
	dealStagesUpdate: DealStagesUpdateOutput,
	dealStagesDelete: DealStagesDeleteOutput,
	dealStagesMoveDeals: DealStagesMoveDealsOutput,
	dealStagesDeleteWithDeals: DealStagesDeleteWithDealsOutput,
	dealTasksList: DealTasksListOutput,
	dealTasksGet: DealTasksGetOutput,
	dealTasksCreate: DealTasksCreateOutput,
	dealTasksUpdate: DealTasksUpdateOutput,
	dealTasksDelete: DealTasksDeleteOutput,
	dealTaskTypesList: DealTaskTypesListOutput,
	dealTaskTypesGet: DealTaskTypesGetOutput,
	dealTaskTypesCreate: DealTaskTypesCreateOutput,
	dealTaskTypesUpdate: DealTaskTypesUpdateOutput,
	taskOutcomesList: TaskOutcomesListOutput,
	taskOutcomesGet: TaskOutcomesGetOutput,
	taskOutcomesCreate: TaskOutcomesCreateOutput,
	dealRolesList: DealRolesListOutput,
	dealRolesCreate: DealRolesCreateOutput,
	dealRolesDelete: DealRolesDeleteOutput,
	contactDealsList: ContactDealsListOutput,
	contactDealsGet: ContactDealsGetOutput,
	contactDealsCreate: ContactDealsCreateOutput,
	contactDealsUpdate: ContactDealsUpdateOutput,
	contactDealsDelete: ContactDealsDeleteOutput,
	dealCustomFieldMetaList: DealCustomFieldMetaListOutput,
	dealCustomFieldMetaGet: DealCustomFieldMetaGetOutput,
	dealCustomFieldMetaCreate: DealCustomFieldMetaCreateOutput,
	dealCustomFieldMetaUpdate: DealCustomFieldMetaUpdateOutput,
	dealCustomFieldMetaDelete: DealCustomFieldMetaDeleteOutput,
	dealCustomFieldDataList: DealCustomFieldDataListOutput,
	dealCustomFieldDataGet: DealCustomFieldDataGetOutput,
	dealCustomFieldDataUpdate: DealCustomFieldDataUpdateOutput,
	dealCustomFieldDataDelete: DealCustomFieldDataDeleteOutput,
	dealActivitiesList: DealActivitiesListOutput,
	accountsList: AccountsListOutput,
	accountsGet: AccountsGetOutput,
	accountsCreate: AccountsCreateOutput,
	accountsUpdate: AccountsUpdateOutput,
	accountsDelete: AccountsDeleteOutput,
	accountsUpsert: AccountsUpsertOutput,
	accountsDeleteBulk: AccountsDeleteBulkOutput,
	accountContactsList: AccountContactsListOutput,
	accountContactsGet: AccountContactsGetOutput,
	accountContactsCreate: AccountContactsCreateOutput,
	accountContactsUpdate: AccountContactsUpdateOutput,
	accountContactsDelete: AccountContactsDeleteOutput,
	accountCustomFieldMetaList: AccountCustomFieldMetaListOutput,
	accountCustomFieldMetaGet: AccountCustomFieldMetaGetOutput,
	accountCustomFieldMetaCreate: AccountCustomFieldMetaCreateOutput,
	accountCustomFieldMetaUpdate: AccountCustomFieldMetaUpdateOutput,
	accountCustomFieldMetaDelete: AccountCustomFieldMetaDeleteOutput,
	accountCustomFieldDataList: AccountCustomFieldDataListOutput,
	accountCustomFieldDataGet: AccountCustomFieldDataGetOutput,
	accountCustomFieldDataCreate: AccountCustomFieldDataCreateOutput,
	accountCustomFieldDataUpdate: AccountCustomFieldDataUpdateOutput,
	accountCustomFieldDataDelete: AccountCustomFieldDataDeleteOutput,
	accountCustomFieldDataCreateBulk: AccountCustomFieldDataCreateBulkOutput,
	accountCustomFieldDataUpdateBulk: AccountCustomFieldDataUpdateBulkOutput,
	notesList: NotesListOutput,
	notesGet: NotesGetOutput,
	notesCreate: NotesCreateOutput,
	notesUpdate: NotesUpdateOutput,
	notesDelete: NotesDeleteOutput,
	notesAddToContact: NotesAddToContactOutput,
	campaignsList: CampaignsListOutput,
	campaignsGet: CampaignsGetOutput,
	campaignsCreate: CampaignsCreateOutput,
	campaignsUpdate: CampaignsUpdateOutput,
	campaignsDuplicate: CampaignsDuplicateOutput,
	campaignsGetLinks: CampaignsGetLinksOutput,
	campaignsGetMessages: CampaignsGetMessagesOutput,
	campaignsGetAutomations: CampaignsGetAutomationsOutput,
	campaignsGetAutomationLists: CampaignsGetAutomationListsOutput,
	campaignsGetUser: CampaignsGetUserOutput,
	messagesList: MessagesListOutput,
	messagesGet: MessagesGetOutput,
	messagesCreate: MessagesCreateOutput,
	messagesUpdate: MessagesUpdateOutput,
	messagesDelete: MessagesDeleteOutput,
	savedResponsesList: SavedResponsesListOutput,
	savedResponsesGet: SavedResponsesGetOutput,
	savedResponsesCreate: SavedResponsesCreateOutput,
	savedResponsesUpdate: SavedResponsesUpdateOutput,
	savedResponsesDelete: SavedResponsesDeleteOutput,
	formsList: FormsListOutput,
	formsGet: FormsGetOutput,
	formsDelete: FormsDeleteOutput,
	formsCreateOptin: FormsCreateOptinOutput,
	personalizationsList: PersonalizationsListOutput,
	personalizationsGet: PersonalizationsGetOutput,
	personalizationsCreate: PersonalizationsCreateOutput,
	personalizationsUpdate: PersonalizationsUpdateOutput,
	personalizationsDelete: PersonalizationsDeleteOutput,
	personalizationsDeleteBulk: PersonalizationsDeleteBulkOutput,
	personalizationsLock: PersonalizationsLockOutput,
	personalizationsUnlock: PersonalizationsUnlockOutput,
	templatesGet: TemplatesGetOutput,
	templatesCreateShareLink: TemplatesCreateShareLinkOutput,
	automationsList: AutomationsListOutput,
	contactAutomationsList: ContactAutomationsListOutput,
	contactAutomationsGet: ContactAutomationsGetOutput,
	contactAutomationsEntryCounts: ContactAutomationsEntryCountsOutput,
	contactAutomationsAdd: ContactAutomationsAddOutput,
	contactAutomationsRemove: ContactAutomationsRemoveOutput,
	segmentsList: SegmentsListOutput,
	segmentsGet: SegmentsGetOutput,
	segmentsCreate: SegmentsCreateOutput,
	segmentsUpdate: SegmentsUpdateOutput,
	segmentsDelete: SegmentsDeleteOutput,
	segmentsListAudiences: SegmentsListAudiencesOutput,
	connectionsList: ConnectionsListOutput,
	connectionsGet: ConnectionsGetOutput,
	connectionsCreate: ConnectionsCreateOutput,
	connectionsUpdate: ConnectionsUpdateOutput,
	connectionsDelete: ConnectionsDeleteOutput,
	ecomCustomersList: EcomCustomersListOutput,
	ecomCustomersGet: EcomCustomersGetOutput,
	ecomCustomersCreate: EcomCustomersCreateOutput,
	ecomCustomersUpdate: EcomCustomersUpdateOutput,
	ecomCustomersDelete: EcomCustomersDeleteOutput,
	ecomOrdersList: EcomOrdersListOutput,
	ecomOrdersGet: EcomOrdersGetOutput,
	ecomOrdersCreate: EcomOrdersCreateOutput,
	ecomOrdersUpdate: EcomOrdersUpdateOutput,
	ecomOrdersDelete: EcomOrdersDeleteOutput,
	ecomOrderProductsList: EcomOrderProductsListOutput,
	ecomOrderProductsGet: EcomOrderProductsGetOutput,
	customObjectSchemasList: CustomObjectSchemasListOutput,
	customObjectSchemasGet: CustomObjectSchemasGetOutput,
	customObjectSchemasCreate: CustomObjectSchemasCreateOutput,
	customObjectSchemasUpdate: CustomObjectSchemasUpdateOutput,
	customObjectSchemasDelete: CustomObjectSchemasDeleteOutput,
	customObjectRecordsList: CustomObjectRecordsListOutput,
	customObjectRecordsUpsert: CustomObjectRecordsUpsertOutput,
	customObjectRecordsGet: CustomObjectRecordsGetOutput,
	customObjectRecordsGetByExternalId: CustomObjectRecordsGetByExternalIdOutput,
	customObjectRecordsDelete: CustomObjectRecordsDeleteOutput,
	customObjectRecordsDeleteByExternalId:
		CustomObjectRecordsDeleteByExternalIdOutput,
	webhooksList: WebhooksListOutput,
	webhooksGet: WebhooksGetOutput,
	webhooksCreate: WebhooksCreateOutput,
	webhooksUpdate: WebhooksUpdateOutput,
	webhooksDelete: WebhooksDeleteOutput,
	usersList: UsersListOutput,
	usersGet: UsersGetOutput,
	usersCreate: UsersCreateOutput,
	usersUpdate: UsersUpdateOutput,
	usersDelete: UsersDeleteOutput,
	usersGetMe: UsersGetMeOutput,
	usersGetByUsername: UsersGetByUsernameOutput,
	groupsList: GroupsListOutput,
	groupsGet: GroupsGetOutput,
	groupsCreate: GroupsCreateOutput,
	groupsUpdate: GroupsUpdateOutput,
	groupsDelete: GroupsDeleteOutput,
	groupLimitsList: GroupLimitsListOutput,
	addressesList: AddressesListOutput,
	addressesGet: AddressesGetOutput,
	addressesCreate: AddressesCreateOutput,
	addressesUpdate: AddressesUpdateOutput,
	addressesDelete: AddressesDeleteOutput,
	calendarsList: CalendarsListOutput,
	calendarsGet: CalendarsGetOutput,
	calendarsCreate: CalendarsCreateOutput,
	calendarsUpdate: CalendarsUpdateOutput,
	calendarsDelete: CalendarsDeleteOutput,
	eventTrackingEventsList: EventTrackingEventsListOutput,
	eventTrackingEventsCreate: EventTrackingEventsCreateOutput,
	eventTrackingEventsDelete: EventTrackingEventsDeleteOutput,
	trackingGetSiteStatus: TrackingGetSiteStatusOutput,
	trackingGetEventStatus: TrackingGetEventStatusOutput,
	trackingSetSiteStatus: TrackingSetSiteStatusOutput,
	trackingSetEventStatus: TrackingSetEventStatusOutput,
	trackingTrackEvent: TrackingTrackEventOutput,
	trackingListWhitelist: TrackingListWhitelistOutput,
	trackingAddWhitelist: TrackingAddWhitelistOutput,
	trackingRemoveWhitelist: TrackingRemoveWhitelistOutput,
	scoresList: ScoresListOutput,
	emailActivitiesList: EmailActivitiesListOutput,
	brandingsGet: BrandingsGetOutput,
	brandingsUpdate: BrandingsUpdateOutput,
	configsUpdate: ConfigsUpdateOutput,
	productsSearch: ProductsSearchOutput,
	productsGet: ProductsGetOutput,
	productsCreate: ProductsCreateOutput,
	productsUpdate: ProductsUpdateOutput,
	productsDelete: ProductsDeleteOutput,
	productsUpsertBulk: ProductsUpsertBulkOutput,
	ordersUpsertBulk: OrdersUpsertBulkOutput,
	ordersUpsertBulkAsync: OrdersUpsertBulkAsyncOutput,
	recurringPaymentsSearch: RecurringPaymentsSearchOutput,
	recurringPaymentsUpsertBulk: RecurringPaymentsUpsertBulkOutput,
	browseSessionsSearch: BrowseSessionsSearchOutput,
	browseSessionsSave: BrowseSessionsSaveOutput,
	browseSessionsAddToCart: BrowseSessionsAddToCartOutput,
	smsBroadcastsList: SmsBroadcastsListOutput,
	smsBroadcastsGetMetrics: SmsBroadcastsGetMetricsOutput,
	smsBroadcastsGetSnapshot: SmsBroadcastsGetSnapshotOutput,
	smsBroadcastsCreateSnapshot: SmsBroadcastsCreateSnapshotOutput,
	smsBroadcastsGetFailures: SmsBroadcastsGetFailuresOutput,
	smsBroadcastsGetRecipients: SmsBroadcastsGetRecipientsOutput,
	smsCreditsGet: SmsCreditsGetOutput,
	trackingGetCode: TrackingGetCodeOutput,
	smsBroadcastListsList: SmsBroadcastListsListOutput,
	addressGroupsDelete: AddressGroupsDeleteOutput,
	ecomOrdersFind: EcomOrdersFindOutput,
	ecomOrdersUpsert: EcomOrdersUpsertOutput,
	ecomOrderProductsListForOrder: EcomOrderProductsListForOrderOutput,
	notesCreateForAccount: NotesCreateForAccountOutput,
	notesCreateForDeal: NotesCreateForDealOutput,
	notesUpdateForAccount: NotesUpdateForAccountOutput,
	notesUpdateForDeal: NotesUpdateForDealOutput,
	contactTasksCreate: ContactTasksCreateOutput,
	contactTasksFind: ContactTasksFindOutput,
	segmentsV2Create: SegmentsV2CreateOutput,
	segmentsV2Get: SegmentsV2GetOutput,
	segmentsV2Update: SegmentsV2UpdateOutput,
	segmentsV2Delete: SegmentsV2DeleteOutput,
	segmentsV2GetAtTimestamp: SegmentsV2GetAtTimestampOutput,
	segmentsV2RevertToTimestamp: SegmentsV2RevertToTimestampOutput,
	segmentsV2RecentCounts: SegmentsV2RecentCountsOutput,
	segmentsV2CountHistory: SegmentsV2CountHistoryOutput,
	segmentsV2CountAtTimestamp: SegmentsV2CountAtTimestampOutput,
	segmentsV2Match: SegmentsV2MatchOutput,
	segmentsV2MatchByExternalId: SegmentsV2MatchByExternalIdOutput,
	segmentsV2MatchAll: SegmentsV2MatchAllOutput,
	segmentsV2MatchAllResult: SegmentsV2MatchAllResultOutput,
	segmentsV2MatchSomeResult: SegmentsV2MatchSomeResultOutput,
	taskRemindersCreate: TaskRemindersCreateOutput,
	customObjectSchemasCreateChild: CustomObjectSchemasCreateChildOutput,
	importsListAggregate: ImportsListAggregateOutput,
	browseSessionsTestEvent: BrowseSessionsTestEventOutput,
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
