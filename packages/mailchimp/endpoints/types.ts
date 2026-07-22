import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*  Shared building blocks                                                     */
/* -------------------------------------------------------------------------- */

const listQuery = {
	count: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	fields: z.array(z.string()).optional(),
	exclude_fields: z.array(z.string()).optional(),
};

/** Response for a 204 No Content action (send, delete, schedule, ...). */
const EmptyResponseSchema = z.unknown();

const ContactSchema = z.object({
	company: z.string(),
	address1: z.string(),
	address2: z.string().optional(),
	city: z.string(),
	state: z.string(),
	zip: z.string(),
	country: z.string(),
	phone: z.string().optional(),
});

const CampaignDefaultsSchema = z.object({
	from_name: z.string(),
	from_email: z.string(),
	subject: z.string(),
	language: z.string(),
});

/* -------------------------------------------------------------------------- */
/*  Output resources (loose — Mailchimp returns many extra fields)            */
/* -------------------------------------------------------------------------- */

const ListResource = z
	.object({ id: z.string(), name: z.string(), web_id: z.number().optional() })
	.loose();
const MemberResource = z
	.object({
		id: z.string(),
		email_address: z.string(),
		status: z.string(),
		list_id: z.string().optional(),
	})
	.loose();
const SegmentResource = z
	.object({ id: z.number(), name: z.string(), list_id: z.string().optional() })
	.loose();
const MergeFieldResource = z
	.object({ merge_id: z.number(), tag: z.string(), name: z.string() })
	.loose();
const CampaignResource = z.object({ id: z.string() }).loose();
const WebhookResource = z.object({ id: z.string(), url: z.string() }).loose();

// Mailchimp list responses are `{ <key>: item[], total_items }`. zod cannot
// infer a literal key from a computed property, so the shape is asserted to its
// exact type (narrow and safe by construction) to keep the output well-typed —
// e.g. `listsList.lists` is `ListResource[]`, not `unknown`.
const collection = <K extends string, T extends z.ZodTypeAny>(
	key: K,
	item: T,
) =>
	z
		.object({ [key]: z.array(item), total_items: z.number().optional() } as {
			[P in K]: z.ZodArray<T>;
		} & { total_items: z.ZodOptional<z.ZodNumber> })
		.loose();

/* -------------------------------------------------------------------------- */
/*  Account                                                                    */
/* -------------------------------------------------------------------------- */

const AccountPingInputSchema = z.object({}).optional();
const PingResponseSchema = z.object({ health_status: z.string() }).loose();

const AccountRootInputSchema = z
	.object({
		fields: z.array(z.string()).optional(),
		exclude_fields: z.array(z.string()).optional(),
	})
	.optional();
const RootResponseSchema = z.object({ account_id: z.string() }).loose();

/* -------------------------------------------------------------------------- */
/*  Lists / Audiences                                                          */
/* -------------------------------------------------------------------------- */

const ListsListInputSchema = z.object(listQuery).optional();
const ListsGetInputSchema = z.object({
	list_id: z.string(),
	fields: z.array(z.string()).optional(),
	exclude_fields: z.array(z.string()).optional(),
});
const ListsCreateInputSchema = z.object({
	name: z.string(),
	contact: ContactSchema,
	permission_reminder: z.string(),
	campaign_defaults: CampaignDefaultsSchema,
	email_type_option: z.boolean(),
	use_archive_bar: z.boolean().optional(),
	double_optin: z.boolean().optional(),
	marketing_permissions: z.boolean().optional(),
});
const ListsUpdateInputSchema = z.object({
	list_id: z.string(),
	name: z.string().optional(),
	contact: ContactSchema.optional(),
	permission_reminder: z.string().optional(),
	campaign_defaults: CampaignDefaultsSchema.optional(),
	email_type_option: z.boolean().optional(),
});
const ListsRemoveInputSchema = z.object({ list_id: z.string() });

/* -------------------------------------------------------------------------- */
/*  Members                                                                    */
/* -------------------------------------------------------------------------- */

const memberStatus = z.enum([
	'subscribed',
	'unsubscribed',
	'cleaned',
	'pending',
	'transactional',
]);

const MembersListInputSchema = z.object({
	list_id: z.string(),
	status: memberStatus.optional(),
	count: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	fields: z.array(z.string()).optional(),
	exclude_fields: z.array(z.string()).optional(),
});
const MembersGetInputSchema = z.object({
	list_id: z.string(),
	subscriber_hash: z.string(),
});
const MembersUpsertInputSchema = z.object({
	list_id: z.string(),
	email_address: z.string(),
	status_if_new: memberStatus.optional(),
	status: memberStatus.optional(),
	email_type: z.enum(['html', 'text']).optional(),
	merge_fields: z.record(z.string(), z.unknown()).optional(),
	interests: z.record(z.string(), z.boolean()).optional(),
	tags: z.array(z.string()).optional(),
});
const MembersAddInputSchema = z.object({
	list_id: z.string(),
	email_address: z.string(),
	status: memberStatus,
	email_type: z.enum(['html', 'text']).optional(),
	merge_fields: z.record(z.string(), z.unknown()).optional(),
	interests: z.record(z.string(), z.boolean()).optional(),
	tags: z.array(z.string()).optional(),
});
const MembersUpdateInputSchema = z.object({
	list_id: z.string(),
	subscriber_hash: z.string(),
	email_address: z.string().optional(),
	status: memberStatus.optional(),
	merge_fields: z.record(z.string(), z.unknown()).optional(),
	interests: z.record(z.string(), z.boolean()).optional(),
});
const MembersArchiveInputSchema = z.object({
	list_id: z.string(),
	subscriber_hash: z.string(),
});
const MembersRemoveInputSchema = z.object({
	list_id: z.string(),
	subscriber_hash: z.string(),
});
const MembersSearchInputSchema = z.object({
	query: z.string(),
	list_id: z.string().optional(),
});
const MembersListTagsInputSchema = z.object({
	list_id: z.string(),
	subscriber_hash: z.string(),
	count: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});
const MembersUpdateTagsInputSchema = z.object({
	list_id: z.string(),
	subscriber_hash: z.string(),
	tags: z.array(
		z.object({
			name: z.string(),
			status: z.enum(['active', 'inactive']),
		}),
	),
});

/* -------------------------------------------------------------------------- */
/*  Segments                                                                   */
/* -------------------------------------------------------------------------- */

const SegmentsListInputSchema = z.object({
	list_id: z.string(),
	count: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});
const SegmentsGetInputSchema = z.object({
	list_id: z.string(),
	segment_id: z.number(),
});
const SegmentsCreateInputSchema = z.object({
	list_id: z.string(),
	name: z.string(),
	static_segment: z.array(z.string()).optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});
const SegmentsUpdateInputSchema = z.object({
	list_id: z.string(),
	segment_id: z.number(),
	name: z.string().optional(),
	static_segment: z.array(z.string()).optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});
const SegmentsRemoveInputSchema = z.object({
	list_id: z.string(),
	segment_id: z.number(),
});
const SegmentsListMembersInputSchema = z.object({
	list_id: z.string(),
	segment_id: z.number(),
	count: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});
const SegmentsAddMemberInputSchema = z.object({
	list_id: z.string(),
	segment_id: z.number(),
	email_address: z.string(),
});
const SegmentsRemoveMemberInputSchema = z.object({
	list_id: z.string(),
	segment_id: z.number(),
	subscriber_hash: z.string(),
});

/* -------------------------------------------------------------------------- */
/*  Merge fields                                                               */
/* -------------------------------------------------------------------------- */

const MergeFieldsListInputSchema = z.object({
	list_id: z.string(),
	count: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});
const MergeFieldsGetInputSchema = z.object({
	list_id: z.string(),
	merge_id: z.number(),
});
const MergeFieldsCreateInputSchema = z.object({
	list_id: z.string(),
	name: z.string(),
	type: z.enum([
		'text',
		'number',
		'address',
		'phone',
		'date',
		'url',
		'imageurl',
		'radio',
		'dropdown',
		'birthday',
		'zip',
	]),
	tag: z.string().optional(),
	required: z.boolean().optional(),
	default_value: z.string().optional(),
	public: z.boolean().optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});
const MergeFieldsUpdateInputSchema = z.object({
	list_id: z.string(),
	merge_id: z.number(),
	name: z.string().optional(),
	required: z.boolean().optional(),
	default_value: z.string().optional(),
	public: z.boolean().optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});
const MergeFieldsRemoveInputSchema = z.object({
	list_id: z.string(),
	merge_id: z.number(),
});

/* -------------------------------------------------------------------------- */
/*  Interest categories & interests                                            */
/* -------------------------------------------------------------------------- */

const InterestCategoryResource = z
	.object({ id: z.string(), title: z.string(), list_id: z.string().optional() })
	.loose();
const InterestResource = z
	.object({ id: z.string(), name: z.string(), list_id: z.string().optional() })
	.loose();

const interestCategoryType = z.enum([
	'checkboxes',
	'dropdown',
	'radio',
	'hidden',
]);

const InterestCategoriesListInputSchema = z.object({
	list_id: z.string(),
	count: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});
const InterestCategoriesGetInputSchema = z.object({
	list_id: z.string(),
	interest_category_id: z.string(),
});
const InterestCategoriesCreateInputSchema = z.object({
	list_id: z.string(),
	title: z.string(),
	type: interestCategoryType,
	display_order: z.number().optional(),
});
const InterestCategoriesUpdateInputSchema = z.object({
	list_id: z.string(),
	interest_category_id: z.string(),
	title: z.string().optional(),
	type: interestCategoryType.optional(),
	display_order: z.number().optional(),
});
const InterestCategoriesRemoveInputSchema = z.object({
	list_id: z.string(),
	interest_category_id: z.string(),
});

const InterestsListInputSchema = z.object({
	list_id: z.string(),
	interest_category_id: z.string(),
	count: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
});
const InterestsGetInputSchema = z.object({
	list_id: z.string(),
	interest_category_id: z.string(),
	interest_id: z.string(),
});
const InterestsCreateInputSchema = z.object({
	list_id: z.string(),
	interest_category_id: z.string(),
	name: z.string(),
	display_order: z.number().optional(),
});
const InterestsUpdateInputSchema = z.object({
	list_id: z.string(),
	interest_category_id: z.string(),
	interest_id: z.string(),
	name: z.string().optional(),
	display_order: z.number().optional(),
});
const InterestsRemoveInputSchema = z.object({
	list_id: z.string(),
	interest_category_id: z.string(),
	interest_id: z.string(),
});

/* -------------------------------------------------------------------------- */
/*  Campaigns                                                                  */
/* -------------------------------------------------------------------------- */

const CampaignSettingsSchema = z.object({
	subject_line: z.string().optional(),
	preview_text: z.string().optional(),
	title: z.string().optional(),
	from_name: z.string().optional(),
	reply_to: z.string().optional(),
	to_name: z.string().optional(),
	folder_id: z.string().optional(),
});
const CampaignRecipientsSchema = z.object({
	list_id: z.string(),
	segment_opts: z.record(z.string(), z.unknown()).optional(),
});

const CampaignsListInputSchema = z.object({
	type: z
		.enum(['regular', 'plaintext', 'absplit', 'rss', 'variate'])
		.optional(),
	status: z.enum(['save', 'paused', 'schedule', 'sending', 'sent']).optional(),
	count: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	fields: z.array(z.string()).optional(),
	exclude_fields: z.array(z.string()).optional(),
});
const CampaignsGetInputSchema = z.object({ campaign_id: z.string() });
const CampaignsCreateInputSchema = z.object({
	type: z.enum(['regular', 'plaintext', 'absplit', 'rss', 'variate']),
	recipients: CampaignRecipientsSchema.optional(),
	settings: CampaignSettingsSchema.optional(),
});
const CampaignsUpdateInputSchema = z.object({
	campaign_id: z.string(),
	recipients: CampaignRecipientsSchema.optional(),
	settings: CampaignSettingsSchema.optional(),
});
const CampaignsRemoveInputSchema = z.object({ campaign_id: z.string() });
const CampaignsGetContentInputSchema = z.object({ campaign_id: z.string() });
const CampaignsSetContentInputSchema = z.object({
	campaign_id: z.string(),
	html: z.string().optional(),
	plain_text: z.string().optional(),
	template: z.record(z.string(), z.unknown()).optional(),
});
const CampaignsSendTestInputSchema = z.object({
	campaign_id: z.string(),
	test_emails: z.array(z.string()).min(1),
	send_type: z.enum(['html', 'plaintext']),
});
const CampaignsScheduleInputSchema = z.object({
	campaign_id: z.string(),
	schedule_time: z.string(),
	timewarp: z.boolean().optional(),
	batch_delivery: z.record(z.string(), z.unknown()).optional(),
});
const CampaignsUnscheduleInputSchema = z.object({ campaign_id: z.string() });
const CampaignsSendInputSchema = z.object({ campaign_id: z.string() });

const CampaignContentResponseSchema = z
	.object({ plain_text: z.string().optional(), html: z.string().optional() })
	.loose();

/* -------------------------------------------------------------------------- */
/*  Webhooks (management)                                                      */
/* -------------------------------------------------------------------------- */

const webhookEvents = z
	.object({
		subscribe: z.boolean().optional(),
		unsubscribe: z.boolean().optional(),
		profile: z.boolean().optional(),
		cleaned: z.boolean().optional(),
		upemail: z.boolean().optional(),
		campaign: z.boolean().optional(),
	})
	.optional();
const webhookSources = z
	.object({
		user: z.boolean().optional(),
		admin: z.boolean().optional(),
		api: z.boolean().optional(),
	})
	.optional();

const WebhooksListInputSchema = z.object({ list_id: z.string() });
const WebhooksGetInputSchema = z.object({
	list_id: z.string(),
	webhook_id: z.string(),
});
const WebhooksCreateInputSchema = z.object({
	list_id: z.string(),
	url: z.string(),
	events: webhookEvents,
	sources: webhookSources,
});
const WebhooksUpdateInputSchema = z.object({
	list_id: z.string(),
	webhook_id: z.string(),
	url: z.string().optional(),
	events: webhookEvents,
	sources: webhookSources,
});
const WebhooksRemoveInputSchema = z.object({
	list_id: z.string(),
	webhook_id: z.string(),
});

/* -------------------------------------------------------------------------- */
/*  Input / output schema maps                                                 */
/* -------------------------------------------------------------------------- */

export const MailchimpEndpointInputSchemas = {
	accountPing: AccountPingInputSchema,
	accountRoot: AccountRootInputSchema,
	listsList: ListsListInputSchema,
	listsGet: ListsGetInputSchema,
	listsCreate: ListsCreateInputSchema,
	listsUpdate: ListsUpdateInputSchema,
	listsRemove: ListsRemoveInputSchema,
	membersList: MembersListInputSchema,
	membersGet: MembersGetInputSchema,
	membersUpsert: MembersUpsertInputSchema,
	membersAdd: MembersAddInputSchema,
	membersUpdate: MembersUpdateInputSchema,
	membersArchive: MembersArchiveInputSchema,
	membersRemove: MembersRemoveInputSchema,
	membersSearch: MembersSearchInputSchema,
	membersListTags: MembersListTagsInputSchema,
	membersUpdateTags: MembersUpdateTagsInputSchema,
	segmentsList: SegmentsListInputSchema,
	segmentsGet: SegmentsGetInputSchema,
	segmentsCreate: SegmentsCreateInputSchema,
	segmentsUpdate: SegmentsUpdateInputSchema,
	segmentsRemove: SegmentsRemoveInputSchema,
	segmentsListMembers: SegmentsListMembersInputSchema,
	segmentsAddMember: SegmentsAddMemberInputSchema,
	segmentsRemoveMember: SegmentsRemoveMemberInputSchema,
	mergeFieldsList: MergeFieldsListInputSchema,
	mergeFieldsGet: MergeFieldsGetInputSchema,
	mergeFieldsCreate: MergeFieldsCreateInputSchema,
	mergeFieldsUpdate: MergeFieldsUpdateInputSchema,
	mergeFieldsRemove: MergeFieldsRemoveInputSchema,
	interestCategoriesList: InterestCategoriesListInputSchema,
	interestCategoriesGet: InterestCategoriesGetInputSchema,
	interestCategoriesCreate: InterestCategoriesCreateInputSchema,
	interestCategoriesUpdate: InterestCategoriesUpdateInputSchema,
	interestCategoriesRemove: InterestCategoriesRemoveInputSchema,
	interestsList: InterestsListInputSchema,
	interestsGet: InterestsGetInputSchema,
	interestsCreate: InterestsCreateInputSchema,
	interestsUpdate: InterestsUpdateInputSchema,
	interestsRemove: InterestsRemoveInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsGet: CampaignsGetInputSchema,
	campaignsCreate: CampaignsCreateInputSchema,
	campaignsUpdate: CampaignsUpdateInputSchema,
	campaignsRemove: CampaignsRemoveInputSchema,
	campaignsGetContent: CampaignsGetContentInputSchema,
	campaignsSetContent: CampaignsSetContentInputSchema,
	campaignsSendTest: CampaignsSendTestInputSchema,
	campaignsSchedule: CampaignsScheduleInputSchema,
	campaignsUnschedule: CampaignsUnscheduleInputSchema,
	campaignsSend: CampaignsSendInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksRemove: WebhooksRemoveInputSchema,
} as const;

export const MailchimpEndpointOutputSchemas = {
	accountPing: PingResponseSchema,
	accountRoot: RootResponseSchema,
	listsList: collection('lists', ListResource),
	listsGet: ListResource,
	listsCreate: ListResource,
	listsUpdate: ListResource,
	listsRemove: EmptyResponseSchema,
	membersList: collection('members', MemberResource),
	membersGet: MemberResource,
	membersUpsert: MemberResource,
	membersAdd: MemberResource,
	membersUpdate: MemberResource,
	membersArchive: EmptyResponseSchema,
	membersRemove: EmptyResponseSchema,
	membersSearch: z
		.object({ exact_matches: z.unknown(), full_search: z.unknown() })
		.loose(),
	membersListTags: collection('tags', z.object({ name: z.string() }).loose()),
	membersUpdateTags: EmptyResponseSchema,
	segmentsList: collection('segments', SegmentResource),
	segmentsGet: SegmentResource,
	segmentsCreate: SegmentResource,
	segmentsUpdate: SegmentResource,
	segmentsRemove: EmptyResponseSchema,
	segmentsListMembers: collection('members', MemberResource),
	segmentsAddMember: MemberResource,
	segmentsRemoveMember: EmptyResponseSchema,
	mergeFieldsList: collection('merge_fields', MergeFieldResource),
	mergeFieldsGet: MergeFieldResource,
	mergeFieldsCreate: MergeFieldResource,
	mergeFieldsUpdate: MergeFieldResource,
	mergeFieldsRemove: EmptyResponseSchema,
	interestCategoriesList: collection('categories', InterestCategoryResource),
	interestCategoriesGet: InterestCategoryResource,
	interestCategoriesCreate: InterestCategoryResource,
	interestCategoriesUpdate: InterestCategoryResource,
	interestCategoriesRemove: EmptyResponseSchema,
	interestsList: collection('interests', InterestResource),
	interestsGet: InterestResource,
	interestsCreate: InterestResource,
	interestsUpdate: InterestResource,
	interestsRemove: EmptyResponseSchema,
	campaignsList: collection('campaigns', CampaignResource),
	campaignsGet: CampaignResource,
	campaignsCreate: CampaignResource,
	campaignsUpdate: CampaignResource,
	campaignsRemove: EmptyResponseSchema,
	campaignsGetContent: CampaignContentResponseSchema,
	campaignsSetContent: CampaignContentResponseSchema,
	campaignsSendTest: EmptyResponseSchema,
	campaignsSchedule: EmptyResponseSchema,
	campaignsUnschedule: EmptyResponseSchema,
	campaignsSend: EmptyResponseSchema,
	webhooksList: collection('webhooks', WebhookResource),
	webhooksGet: WebhookResource,
	webhooksCreate: WebhookResource,
	webhooksUpdate: WebhookResource,
	webhooksRemove: EmptyResponseSchema,
} as const;

export type MailchimpEndpointInputs = {
	[K in keyof typeof MailchimpEndpointInputSchemas]: z.infer<
		(typeof MailchimpEndpointInputSchemas)[K]
	>;
};

export type MailchimpEndpointOutputs = {
	[K in keyof typeof MailchimpEndpointOutputSchemas]: z.infer<
		(typeof MailchimpEndpointOutputSchemas)[K]
	>;
};
