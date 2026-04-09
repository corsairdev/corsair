import { z } from 'zod';

// ── Shared Schemas ────────────────────────────────────────────────────────────

const PaginationSchema = z.object({
	type: z.string().optional(),
	page: z.number().optional(),
	per_page: z.number().optional(),
	total_pages: z.number().optional(),
	next: z.string().nullable().optional(),
});

const ContactSchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	external_id: z.string().nullable().optional(),
	user_id: z.string().nullable().optional(),
	email: z.string().optional(),
	name: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	role: z.string().optional(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
	last_seen_at: z.number().nullable().optional(),
	unsubscribed_from_emails: z.boolean().optional(),
});

const ConversationPartSchema = z.object({
	type: z.string().optional(),
	id: z.string().optional(),
	part_type: z.string().optional(),
	body: z.string().nullable().optional(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
	author: z
		.object({
			type: z.string().optional(),
			id: z.string().optional(),
			name: z.string().nullable().optional(),
		})
		.optional(),
});

const ConversationSchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
	waiting_since: z.number().nullable().optional(),
	snoozed_until: z.number().nullable().optional(),
	state: z.string().optional(),
	read: z.boolean().optional(),
	priority: z.string().optional(),
	assignee: z
		.object({
			type: z.string().optional(),
			id: z.number().nullable().optional(),
		})
		.optional(),
	source: z
		.object({
			type: z.string().optional(),
			id: z.string().optional(),
			subject: z.string().nullable().optional(),
			body: z.string().nullable().optional(),
			author: z
				.object({
					type: z.string().optional(),
					id: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	conversation_parts: z
		.object({
			type: z.string().optional(),
			conversation_parts: z.array(ConversationPartSchema).optional(),
			total_count: z.number().optional(),
		})
		.optional(),
});

const CompanySchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	company_id: z.string().optional(),
	name: z.string().optional(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
	monthly_spend: z.number().optional(),
	session_count: z.number().optional(),
	user_count: z.number().optional(),
	size: z.number().nullable().optional(),
	website: z.string().nullable().optional(),
	industry: z.string().nullable().optional(),
});

const ArticleSchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	title: z.string().optional(),
	description: z.string().nullable().optional(),
	body: z.string().nullable().optional(),
	author_id: z.number().optional(),
	state: z.string().optional(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
	url: z.string().nullable().optional(),
});

const CollectionSchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	name: z.string().optional(),
	description: z.string().nullable().optional(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
	url: z.string().nullable().optional(),
	icon: z.string().nullable().optional(),
	order: z.number().optional(),
	help_center_id: z.number().nullable().optional(),
});

const AdminSchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	away_mode_enabled: z.boolean().optional(),
	away_mode_reassign: z.boolean().optional(),
	has_inbox_seat: z.boolean().optional(),
	team_ids: z.array(z.number()).optional(),
	avatar: z.string().optional(),
});

const HelpCenterSchema = z.object({
	type: z.string().optional(),
	id: z.number(),
	workspace_id: z.string().optional(),
	identifier: z.string().optional(),
	website_turned_on: z.boolean().optional(),
	display_name: z.string().optional(),
});

const DeletedResponseSchema = z.object({
	id: z.string(),
	object: z.string().optional(),
	deleted: z.boolean().optional(),
});

const TagSchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	name: z.string().optional(),
});

const NoteSchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	body: z.string().optional(),
	author: z
		.object({
			type: z.string().optional(),
			id: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
	contact: z
		.object({
			type: z.string().optional(),
			id: z.string().optional(),
		})
		.optional(),
	created_at: z.number().optional(),
});

const SegmentSchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	name: z.string().optional(),
	created_at: z.number().optional(),
	updated_at: z.number().optional(),
	person_type: z.string().optional(),
});

const SubscriptionTypeSchema = z.object({
	type: z.string().optional(),
	id: z.string(),
	state: z.string().optional(),
	consent_type: z.string().optional(),
	default_translation: z
		.object({
			name: z.string().optional(),
			description: z.string().optional(),
			locale: z.string().optional(),
		})
		.optional(),
});

// ── Contacts ─────────────────────────────────────────────────────────────────

const ContactsGetInputSchema = z.object({
	id: z.string(),
});
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;
const ContactsGetResponseSchema = ContactSchema;
export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

const ContactsListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	starting_after: z.string().optional(),
});
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;
const ContactsListResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(ContactSchema),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
});
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

const ContactsUpdateInputSchema = z.object({
	id: z.string(),
	email: z.string().optional(),
	name: z.string().optional(),
	phone: z.string().optional(),
	role: z.enum(['user', 'lead']).optional(),
	external_id: z.string().optional(),
	unsubscribed_from_emails: z.boolean().optional(),
	// Unknwon type because the custom attributes are dynamic and depend on the contact.
	custom_attributes: z.record(z.unknown()).optional(),
});
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;
const ContactsUpdateResponseSchema = ContactSchema;
export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

const ContactsDeleteInputSchema = z.object({
	id: z.string(),
});
export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;
const ContactsDeleteResponseSchema = DeletedResponseSchema;
export type ContactsDeleteResponse = z.infer<
	typeof ContactsDeleteResponseSchema
>;

const ContactsAddTagInputSchema = z.object({
	contact_id: z.string(),
	tag_id: z.string(),
});
export type ContactsAddTagInput = z.infer<typeof ContactsAddTagInputSchema>;
const ContactsAddTagResponseSchema = TagSchema;
export type ContactsAddTagResponse = z.infer<
	typeof ContactsAddTagResponseSchema
>;

const ContactsRemoveTagInputSchema = z.object({
	contact_id: z.string(),
	tag_id: z.string(),
});
export type ContactsRemoveTagInput = z.infer<
	typeof ContactsRemoveTagInputSchema
>;
const ContactsRemoveTagResponseSchema = TagSchema;
export type ContactsRemoveTagResponse = z.infer<
	typeof ContactsRemoveTagResponseSchema
>;

const ContactsListTagsInputSchema = z.object({
	contact_id: z.string(),
});
export type ContactsListTagsInput = z.infer<typeof ContactsListTagsInputSchema>;
const ContactsListTagsResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(TagSchema),
});
export type ContactsListTagsResponse = z.infer<
	typeof ContactsListTagsResponseSchema
>;

const ContactsAddSubscriptionInputSchema = z.object({
	contact_id: z.string(),
	id: z.string(),
	consent_type: z.enum(['opt_in', 'opt_out']),
});
export type ContactsAddSubscriptionInput = z.infer<
	typeof ContactsAddSubscriptionInputSchema
>;
const ContactsAddSubscriptionResponseSchema = SubscriptionTypeSchema;
export type ContactsAddSubscriptionResponse = z.infer<
	typeof ContactsAddSubscriptionResponseSchema
>;

const ContactsRemoveSubscriptionInputSchema = z.object({
	contact_id: z.string(),
	subscription_id: z.string(),
});
export type ContactsRemoveSubscriptionInput = z.infer<
	typeof ContactsRemoveSubscriptionInputSchema
>;
const ContactsRemoveSubscriptionResponseSchema = SubscriptionTypeSchema;
export type ContactsRemoveSubscriptionResponse = z.infer<
	typeof ContactsRemoveSubscriptionResponseSchema
>;

const ContactsListSubscriptionsInputSchema = z.object({
	contact_id: z.string(),
});
export type ContactsListSubscriptionsInput = z.infer<
	typeof ContactsListSubscriptionsInputSchema
>;
const ContactsListSubscriptionsResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(SubscriptionTypeSchema),
});
export type ContactsListSubscriptionsResponse = z.infer<
	typeof ContactsListSubscriptionsResponseSchema
>;

const ContactsAttachToCompanyInputSchema = z.object({
	contact_id: z.string(),
	company_id: z.string(),
});
export type ContactsAttachToCompanyInput = z.infer<
	typeof ContactsAttachToCompanyInputSchema
>;
const ContactsAttachToCompanyResponseSchema = CompanySchema;
export type ContactsAttachToCompanyResponse = z.infer<
	typeof ContactsAttachToCompanyResponseSchema
>;

const ContactsDetachFromCompanyInputSchema = z.object({
	contact_id: z.string(),
	company_id: z.string(),
});
export type ContactsDetachFromCompanyInput = z.infer<
	typeof ContactsDetachFromCompanyInputSchema
>;
const ContactsDetachFromCompanyResponseSchema = CompanySchema;
export type ContactsDetachFromCompanyResponse = z.infer<
	typeof ContactsDetachFromCompanyResponseSchema
>;

const ContactsListAttachedCompaniesInputSchema = z.object({
	contact_id: z.string(),
	page: z.number().optional(),
	per_page: z.number().optional(),
});
export type ContactsListAttachedCompaniesInput = z.infer<
	typeof ContactsListAttachedCompaniesInputSchema
>;
const ContactsListAttachedCompaniesResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(CompanySchema),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
});
export type ContactsListAttachedCompaniesResponse = z.infer<
	typeof ContactsListAttachedCompaniesResponseSchema
>;

const ContactsListAttachedSegmentsInputSchema = z.object({
	contact_id: z.string(),
});
export type ContactsListAttachedSegmentsInput = z.infer<
	typeof ContactsListAttachedSegmentsInputSchema
>;
const ContactsListAttachedSegmentsResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(SegmentSchema),
});
export type ContactsListAttachedSegmentsResponse = z.infer<
	typeof ContactsListAttachedSegmentsResponseSchema
>;

const ContactsCreateNoteInputSchema = z.object({
	contact_id: z.string(),
	body: z.string(),
	admin_id: z.string().optional(),
});
export type ContactsCreateNoteInput = z.infer<
	typeof ContactsCreateNoteInputSchema
>;
const ContactsCreateNoteResponseSchema = NoteSchema;
export type ContactsCreateNoteResponse = z.infer<
	typeof ContactsCreateNoteResponseSchema
>;

const ContactsListNotesInputSchema = z.object({
	contact_id: z.string(),
	page: z.number().optional(),
	per_page: z.number().optional(),
});
export type ContactsListNotesInput = z.infer<
	typeof ContactsListNotesInputSchema
>;
const ContactsListNotesResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(NoteSchema),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
});
export type ContactsListNotesResponse = z.infer<
	typeof ContactsListNotesResponseSchema
>;

const ContactsMergeInputSchema = z.object({
	lead_id: z.string(),
	user_id: z.string(),
});
export type ContactsMergeInput = z.infer<typeof ContactsMergeInputSchema>;
const ContactsMergeResponseSchema = ContactSchema;
export type ContactsMergeResponse = z.infer<typeof ContactsMergeResponseSchema>;

// ── Conversations ─────────────────────────────────────────────────────────────

const ConversationsGetInputSchema = z.object({
	id: z.string(),
	display_as: z.enum(['plaintext', 'html']).optional(),
});
export type ConversationsGetInput = z.infer<typeof ConversationsGetInputSchema>;
const ConversationsGetResponseSchema = ConversationSchema;
export type ConversationsGetResponse = z.infer<
	typeof ConversationsGetResponseSchema
>;

const ConversationsListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	sort: z.string().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	starting_after: z.string().optional(),
});
export type ConversationsListInput = z.infer<
	typeof ConversationsListInputSchema
>;
const ConversationsListResponseSchema = z.object({
	type: z.string().optional(),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
	conversations: z.array(ConversationSchema),
});
export type ConversationsListResponse = z.infer<
	typeof ConversationsListResponseSchema
>;

const ConversationsCreateInputSchema = z.object({
	from: z.object({
		type: z.enum(['user', 'lead', 'contact']),
		id: z.string(),
	}),
	body: z.string(),
});
export type ConversationsCreateInput = z.infer<
	typeof ConversationsCreateInputSchema
>;
const ConversationsCreateResponseSchema = ConversationSchema;
export type ConversationsCreateResponse = z.infer<
	typeof ConversationsCreateResponseSchema
>;

const ConversationsSearchInputSchema = z.object({
	query: z
		.object({
			field: z.string().optional(),
			operator: z.string().optional(),
			value: z.string().optional(),
		})
		.optional(),
	sort: z
		.object({
			field: z.string().optional(),
			order: z.enum(['ascending', 'descending']).optional(),
		})
		.optional(),
	pagination: z
		.object({
			per_page: z.number().optional(),
			starting_after: z.string().optional(),
		})
		.optional(),
});
export type ConversationsSearchInput = z.infer<
	typeof ConversationsSearchInputSchema
>;
const ConversationsSearchResponseSchema = z.object({
	type: z.string().optional(),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
	conversations: z.array(ConversationSchema),
});
export type ConversationsSearchResponse = z.infer<
	typeof ConversationsSearchResponseSchema
>;

const ConversationsAssignInputSchema = z.object({
	id: z.string(),
	admin_id: z.string(),
	assignee_id: z.string(),
	type: z.enum(['admin', 'team']).optional(),
	message_type: z.literal('assignment').optional(),
	body: z.string().optional(),
});
export type ConversationsAssignInput = z.infer<
	typeof ConversationsAssignInputSchema
>;
const ConversationsAssignResponseSchema = ConversationSchema;
export type ConversationsAssignResponse = z.infer<
	typeof ConversationsAssignResponseSchema
>;

const ConversationsCloseInputSchema = z.object({
	id: z.string(),
	admin_id: z.string(),
	message_type: z.literal('close').optional(),
	body: z.string().optional(),
});
export type ConversationsCloseInput = z.infer<
	typeof ConversationsCloseInputSchema
>;
const ConversationsCloseResponseSchema = ConversationSchema;
export type ConversationsCloseResponse = z.infer<
	typeof ConversationsCloseResponseSchema
>;

const ConversationsReopenInputSchema = z.object({
	id: z.string(),
	admin_id: z.string(),
	message_type: z.literal('open').optional(),
	body: z.string().optional(),
});
export type ConversationsReopenInput = z.infer<
	typeof ConversationsReopenInputSchema
>;
const ConversationsReopenResponseSchema = ConversationSchema;
export type ConversationsReopenResponse = z.infer<
	typeof ConversationsReopenResponseSchema
>;

const ConversationsReplyInputSchema = z.object({
	id: z.string(),
	admin_id: z.string().optional(),
	intercom_user_id: z.string().optional(),
	message_type: z.enum(['comment', 'note']).optional(),
	type: z.enum(['admin', 'user']),
	body: z.string(),
	attachment_urls: z.array(z.string()).optional(),
});
export type ConversationsReplyInput = z.infer<
	typeof ConversationsReplyInputSchema
>;
const ConversationsReplyResponseSchema = ConversationSchema;
export type ConversationsReplyResponse = z.infer<
	typeof ConversationsReplyResponseSchema
>;

// ── Companies ─────────────────────────────────────────────────────────────────

const CompaniesCreateOrUpdateInputSchema = z.object({
	company_id: z.string().optional(),
	name: z.string().optional(),
	remote_created_at: z.number().optional(),
	plan: z.string().optional(),
	size: z.number().optional(),
	website: z.string().optional(),
	industry: z.string().optional(),
	monthly_spend: z.number().optional(),
	custom_attributes: z.record(z.unknown()).optional(),
});
export type CompaniesCreateOrUpdateInput = z.infer<
	typeof CompaniesCreateOrUpdateInputSchema
>;
const CompaniesCreateOrUpdateResponseSchema = CompanySchema;
export type CompaniesCreateOrUpdateResponse = z.infer<
	typeof CompaniesCreateOrUpdateResponseSchema
>;

const CompaniesGetInputSchema = z.object({
	id: z.string(),
});
export type CompaniesGetInput = z.infer<typeof CompaniesGetInputSchema>;
const CompaniesGetResponseSchema = CompanySchema;
export type CompaniesGetResponse = z.infer<typeof CompaniesGetResponseSchema>;

const CompaniesListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	order: z.string().optional(),
	tag_id: z.string().optional(),
	segment_id: z.string().optional(),
});
export type CompaniesListInput = z.infer<typeof CompaniesListInputSchema>;
const CompaniesListResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(CompanySchema),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
});
export type CompaniesListResponse = z.infer<typeof CompaniesListResponseSchema>;

const CompaniesScrollInputSchema = z.object({
	scroll_param: z.string().optional(),
});
export type CompaniesScrollInput = z.infer<typeof CompaniesScrollInputSchema>;
const CompaniesScrollResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(CompanySchema),
	scroll_param: z.string().optional(),
	pages: PaginationSchema.optional(),
});
export type CompaniesScrollResponse = z.infer<
	typeof CompaniesScrollResponseSchema
>;

const CompaniesDeleteInputSchema = z.object({
	id: z.string(),
});
export type CompaniesDeleteInput = z.infer<typeof CompaniesDeleteInputSchema>;
const CompaniesDeleteResponseSchema = DeletedResponseSchema;
export type CompaniesDeleteResponse = z.infer<
	typeof CompaniesDeleteResponseSchema
>;

const CompaniesRetrieveInputSchema = z.object({
	company_id: z.string().optional(),
	name: z.string().optional(),
});
export type CompaniesRetrieveInput = z.infer<
	typeof CompaniesRetrieveInputSchema
>;
const CompaniesRetrieveResponseSchema = CompanySchema;
export type CompaniesRetrieveResponse = z.infer<
	typeof CompaniesRetrieveResponseSchema
>;

const CompaniesListAttachedContactsInputSchema = z.object({
	id: z.string(),
	page: z.number().optional(),
	per_page: z.number().optional(),
});
export type CompaniesListAttachedContactsInput = z.infer<
	typeof CompaniesListAttachedContactsInputSchema
>;
const CompaniesListAttachedContactsResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(ContactSchema),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
});
export type CompaniesListAttachedContactsResponse = z.infer<
	typeof CompaniesListAttachedContactsResponseSchema
>;

const CompaniesListAttachedSegmentsInputSchema = z.object({
	id: z.string(),
});
export type CompaniesListAttachedSegmentsInput = z.infer<
	typeof CompaniesListAttachedSegmentsInputSchema
>;
const CompaniesListAttachedSegmentsResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(SegmentSchema),
});
export type CompaniesListAttachedSegmentsResponse = z.infer<
	typeof CompaniesListAttachedSegmentsResponseSchema
>;

// ── Articles ──────────────────────────────────────────────────────────────────

const ArticlesGetInputSchema = z.object({
	id: z.string(),
});
export type ArticlesGetInput = z.infer<typeof ArticlesGetInputSchema>;
const ArticlesGetResponseSchema = ArticleSchema;
export type ArticlesGetResponse = z.infer<typeof ArticlesGetResponseSchema>;

const ArticlesListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	state: z.enum(['draft', 'published']).optional(),
});
export type ArticlesListInput = z.infer<typeof ArticlesListInputSchema>;
const ArticlesListResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(ArticleSchema),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
});
export type ArticlesListResponse = z.infer<typeof ArticlesListResponseSchema>;

const ArticlesCreateInputSchema = z.object({
	title: z.string(),
	author_id: z.number(),
	body: z.string().optional(),
	description: z.string().optional(),
	state: z.enum(['draft', 'published']).optional(),
	parent_id: z.number().optional(),
	parent_type: z.string().optional(),
});
export type ArticlesCreateInput = z.infer<typeof ArticlesCreateInputSchema>;
const ArticlesCreateResponseSchema = ArticleSchema;
export type ArticlesCreateResponse = z.infer<
	typeof ArticlesCreateResponseSchema
>;

const ArticlesUpdateInputSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	author_id: z.number().optional(),
	body: z.string().optional(),
	description: z.string().optional(),
	state: z.enum(['draft', 'published']).optional(),
	parent_id: z.number().optional(),
	parent_type: z.string().optional(),
});
export type ArticlesUpdateInput = z.infer<typeof ArticlesUpdateInputSchema>;
const ArticlesUpdateResponseSchema = ArticleSchema;
export type ArticlesUpdateResponse = z.infer<
	typeof ArticlesUpdateResponseSchema
>;

const ArticlesDeleteInputSchema = z.object({
	id: z.string(),
});
export type ArticlesDeleteInput = z.infer<typeof ArticlesDeleteInputSchema>;
const ArticlesDeleteResponseSchema = DeletedResponseSchema;
export type ArticlesDeleteResponse = z.infer<
	typeof ArticlesDeleteResponseSchema
>;

const ArticlesSearchInputSchema = z.object({
	phrase: z.string(),
	help_center_id: z.number().optional(),
	state: z.enum(['draft', 'published']).optional(),
});
export type ArticlesSearchInput = z.infer<typeof ArticlesSearchInputSchema>;
const ArticlesSearchResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(ArticleSchema),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
});
export type ArticlesSearchResponse = z.infer<
	typeof ArticlesSearchResponseSchema
>;

// ── Collections ───────────────────────────────────────────────────────────────

const CollectionsGetInputSchema = z.object({
	id: z.string(),
});
export type CollectionsGetInput = z.infer<typeof CollectionsGetInputSchema>;
const CollectionsGetResponseSchema = CollectionSchema;
export type CollectionsGetResponse = z.infer<
	typeof CollectionsGetResponseSchema
>;

const CollectionsListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	help_center_id: z.number().optional(),
});
export type CollectionsListInput = z.infer<typeof CollectionsListInputSchema>;
const CollectionsListResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(CollectionSchema),
	pages: PaginationSchema.optional(),
	total_count: z.number().optional(),
});
export type CollectionsListResponse = z.infer<
	typeof CollectionsListResponseSchema
>;

const CollectionsCreateInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	help_center_id: z.number().optional(),
	parent_id: z.string().nullable().optional(),
});
export type CollectionsCreateInput = z.infer<
	typeof CollectionsCreateInputSchema
>;
const CollectionsCreateResponseSchema = CollectionSchema;
export type CollectionsCreateResponse = z.infer<
	typeof CollectionsCreateResponseSchema
>;

const CollectionsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	order: z.number().optional(),
});
export type CollectionsUpdateInput = z.infer<
	typeof CollectionsUpdateInputSchema
>;
const CollectionsUpdateResponseSchema = CollectionSchema;
export type CollectionsUpdateResponse = z.infer<
	typeof CollectionsUpdateResponseSchema
>;

const CollectionsDeleteInputSchema = z.object({
	id: z.string(),
});
export type CollectionsDeleteInput = z.infer<
	typeof CollectionsDeleteInputSchema
>;
const CollectionsDeleteResponseSchema = DeletedResponseSchema;
export type CollectionsDeleteResponse = z.infer<
	typeof CollectionsDeleteResponseSchema
>;

// ── Admins ────────────────────────────────────────────────────────────────────

const AdminsIdentifyInputSchema = z.object({});
export type AdminsIdentifyInput = z.infer<typeof AdminsIdentifyInputSchema>;
const AdminsIdentifyResponseSchema = AdminSchema;
export type AdminsIdentifyResponse = z.infer<
	typeof AdminsIdentifyResponseSchema
>;

const AdminsListInputSchema = z.object({});
export type AdminsListInput = z.infer<typeof AdminsListInputSchema>;
const AdminsListResponseSchema = z.object({
	type: z.string().optional(),
	admins: z.array(AdminSchema),
});
export type AdminsListResponse = z.infer<typeof AdminsListResponseSchema>;

const AdminsGetInputSchema = z.object({
	id: z.string(),
});
export type AdminsGetInput = z.infer<typeof AdminsGetInputSchema>;
const AdminsGetResponseSchema = AdminSchema;
export type AdminsGetResponse = z.infer<typeof AdminsGetResponseSchema>;

const AdminsListActivityLogsInputSchema = z.object({
	created_at_after: z.string(),
	created_at_before: z.string().optional(),
	page: z.number().optional(),
	per_page: z.number().optional(),
});
export type AdminsListActivityLogsInput = z.infer<
	typeof AdminsListActivityLogsInputSchema
>;
const AdminsListActivityLogsResponseSchema = z.object({
	type: z.string().optional(),
	pages: PaginationSchema.optional(),
	activity_logs: z.array(
		z.object({
			id: z.string(),
			performed_by: z
				.object({
					type: z.string().optional(),
					id: z.string().optional(),
					email: z.string().optional(),
				})
				.optional(),
			// Unknown type because the metadata is dynamic and depend on the activity.
			metadata: z.record(z.unknown()).optional(),
			created_at: z.number().optional(),
			activity_type: z.string().optional(),
			activity_description: z.string().optional(),
		}),
	),
});
export type AdminsListActivityLogsResponse = z.infer<
	typeof AdminsListActivityLogsResponseSchema
>;

const AdminsSetAwayInputSchema = z.object({
	id: z.string(),
	away_mode_enabled: z.boolean(),
	away_mode_reassign: z.boolean().optional(),
});
export type AdminsSetAwayInput = z.infer<typeof AdminsSetAwayInputSchema>;
const AdminsSetAwayResponseSchema = AdminSchema;
export type AdminsSetAwayResponse = z.infer<typeof AdminsSetAwayResponseSchema>;

// ── Help Centers ──────────────────────────────────────────────────────────────

const HelpCentersListInputSchema = z.object({});
export type HelpCentersListInput = z.infer<typeof HelpCentersListInputSchema>;
const HelpCentersListResponseSchema = z.object({
	type: z.string().optional(),
	data: z.array(HelpCenterSchema),
});
export type HelpCentersListResponse = z.infer<
	typeof HelpCentersListResponseSchema
>;

const HelpCentersGetInputSchema = z.object({
	id: z.number(),
});
export type HelpCentersGetInput = z.infer<typeof HelpCentersGetInputSchema>;
const HelpCentersGetResponseSchema = HelpCenterSchema;
export type HelpCentersGetResponse = z.infer<
	typeof HelpCentersGetResponseSchema
>;

// ── Endpoint I/O Maps ────────────────────────────────────────────────────────

export type IntercomEndpointInputs = {
	contactsGet: ContactsGetInput;
	contactsList: ContactsListInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
	contactsAddTag: ContactsAddTagInput;
	contactsRemoveTag: ContactsRemoveTagInput;
	contactsListTags: ContactsListTagsInput;
	contactsAddSubscription: ContactsAddSubscriptionInput;
	contactsRemoveSubscription: ContactsRemoveSubscriptionInput;
	contactsListSubscriptions: ContactsListSubscriptionsInput;
	contactsAttachToCompany: ContactsAttachToCompanyInput;
	contactsDetachFromCompany: ContactsDetachFromCompanyInput;
	contactsListAttachedCompanies: ContactsListAttachedCompaniesInput;
	contactsListAttachedSegments: ContactsListAttachedSegmentsInput;
	contactsCreateNote: ContactsCreateNoteInput;
	contactsListNotes: ContactsListNotesInput;
	contactsMerge: ContactsMergeInput;
	conversationsGet: ConversationsGetInput;
	conversationsList: ConversationsListInput;
	conversationsCreate: ConversationsCreateInput;
	conversationsSearch: ConversationsSearchInput;
	conversationsAssign: ConversationsAssignInput;
	conversationsClose: ConversationsCloseInput;
	conversationsReopen: ConversationsReopenInput;
	conversationsReply: ConversationsReplyInput;
	companiesCreateOrUpdate: CompaniesCreateOrUpdateInput;
	companiesGet: CompaniesGetInput;
	companiesList: CompaniesListInput;
	companiesScroll: CompaniesScrollInput;
	companiesDelete: CompaniesDeleteInput;
	companiesRetrieve: CompaniesRetrieveInput;
	companiesListAttachedContacts: CompaniesListAttachedContactsInput;
	companiesListAttachedSegments: CompaniesListAttachedSegmentsInput;
	articlesGet: ArticlesGetInput;
	articlesList: ArticlesListInput;
	articlesCreate: ArticlesCreateInput;
	articlesUpdate: ArticlesUpdateInput;
	articlesDelete: ArticlesDeleteInput;
	articlesSearch: ArticlesSearchInput;
	collectionsGet: CollectionsGetInput;
	collectionsList: CollectionsListInput;
	collectionsCreate: CollectionsCreateInput;
	collectionsUpdate: CollectionsUpdateInput;
	collectionsDelete: CollectionsDeleteInput;
	adminsIdentify: AdminsIdentifyInput;
	adminsList: AdminsListInput;
	adminsGet: AdminsGetInput;
	adminsListActivityLogs: AdminsListActivityLogsInput;
	adminsSetAway: AdminsSetAwayInput;
	helpCentersList: HelpCentersListInput;
	helpCentersGet: HelpCentersGetInput;
};

export type IntercomEndpointOutputs = {
	contactsGet: ContactsGetResponse;
	contactsList: ContactsListResponse;
	contactsUpdate: ContactsUpdateResponse;
	contactsDelete: ContactsDeleteResponse;
	contactsAddTag: ContactsAddTagResponse;
	contactsRemoveTag: ContactsRemoveTagResponse;
	contactsListTags: ContactsListTagsResponse;
	contactsAddSubscription: ContactsAddSubscriptionResponse;
	contactsRemoveSubscription: ContactsRemoveSubscriptionResponse;
	contactsListSubscriptions: ContactsListSubscriptionsResponse;
	contactsAttachToCompany: ContactsAttachToCompanyResponse;
	contactsDetachFromCompany: ContactsDetachFromCompanyResponse;
	contactsListAttachedCompanies: ContactsListAttachedCompaniesResponse;
	contactsListAttachedSegments: ContactsListAttachedSegmentsResponse;
	contactsCreateNote: ContactsCreateNoteResponse;
	contactsListNotes: ContactsListNotesResponse;
	contactsMerge: ContactsMergeResponse;
	conversationsGet: ConversationsGetResponse;
	conversationsList: ConversationsListResponse;
	conversationsCreate: ConversationsCreateResponse;
	conversationsSearch: ConversationsSearchResponse;
	conversationsAssign: ConversationsAssignResponse;
	conversationsClose: ConversationsCloseResponse;
	conversationsReopen: ConversationsReopenResponse;
	conversationsReply: ConversationsReplyResponse;
	companiesCreateOrUpdate: CompaniesCreateOrUpdateResponse;
	companiesGet: CompaniesGetResponse;
	companiesList: CompaniesListResponse;
	companiesScroll: CompaniesScrollResponse;
	companiesDelete: CompaniesDeleteResponse;
	companiesRetrieve: CompaniesRetrieveResponse;
	companiesListAttachedContacts: CompaniesListAttachedContactsResponse;
	companiesListAttachedSegments: CompaniesListAttachedSegmentsResponse;
	articlesGet: ArticlesGetResponse;
	articlesList: ArticlesListResponse;
	articlesCreate: ArticlesCreateResponse;
	articlesUpdate: ArticlesUpdateResponse;
	articlesDelete: ArticlesDeleteResponse;
	articlesSearch: ArticlesSearchResponse;
	collectionsGet: CollectionsGetResponse;
	collectionsList: CollectionsListResponse;
	collectionsCreate: CollectionsCreateResponse;
	collectionsUpdate: CollectionsUpdateResponse;
	collectionsDelete: CollectionsDeleteResponse;
	adminsIdentify: AdminsIdentifyResponse;
	adminsList: AdminsListResponse;
	adminsGet: AdminsGetResponse;
	adminsListActivityLogs: AdminsListActivityLogsResponse;
	adminsSetAway: AdminsSetAwayResponse;
	helpCentersList: HelpCentersListResponse;
	helpCentersGet: HelpCentersGetResponse;
};

export const IntercomEndpointInputSchemas = {
	contactsGet: ContactsGetInputSchema,
	contactsList: ContactsListInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsAddTag: ContactsAddTagInputSchema,
	contactsRemoveTag: ContactsRemoveTagInputSchema,
	contactsListTags: ContactsListTagsInputSchema,
	contactsAddSubscription: ContactsAddSubscriptionInputSchema,
	contactsRemoveSubscription: ContactsRemoveSubscriptionInputSchema,
	contactsListSubscriptions: ContactsListSubscriptionsInputSchema,
	contactsAttachToCompany: ContactsAttachToCompanyInputSchema,
	contactsDetachFromCompany: ContactsDetachFromCompanyInputSchema,
	contactsListAttachedCompanies: ContactsListAttachedCompaniesInputSchema,
	contactsListAttachedSegments: ContactsListAttachedSegmentsInputSchema,
	contactsCreateNote: ContactsCreateNoteInputSchema,
	contactsListNotes: ContactsListNotesInputSchema,
	contactsMerge: ContactsMergeInputSchema,
	conversationsGet: ConversationsGetInputSchema,
	conversationsList: ConversationsListInputSchema,
	conversationsCreate: ConversationsCreateInputSchema,
	conversationsSearch: ConversationsSearchInputSchema,
	conversationsAssign: ConversationsAssignInputSchema,
	conversationsClose: ConversationsCloseInputSchema,
	conversationsReopen: ConversationsReopenInputSchema,
	conversationsReply: ConversationsReplyInputSchema,
	companiesCreateOrUpdate: CompaniesCreateOrUpdateInputSchema,
	companiesGet: CompaniesGetInputSchema,
	companiesList: CompaniesListInputSchema,
	companiesScroll: CompaniesScrollInputSchema,
	companiesDelete: CompaniesDeleteInputSchema,
	companiesRetrieve: CompaniesRetrieveInputSchema,
	companiesListAttachedContacts: CompaniesListAttachedContactsInputSchema,
	companiesListAttachedSegments: CompaniesListAttachedSegmentsInputSchema,
	articlesGet: ArticlesGetInputSchema,
	articlesList: ArticlesListInputSchema,
	articlesCreate: ArticlesCreateInputSchema,
	articlesUpdate: ArticlesUpdateInputSchema,
	articlesDelete: ArticlesDeleteInputSchema,
	articlesSearch: ArticlesSearchInputSchema,
	collectionsGet: CollectionsGetInputSchema,
	collectionsList: CollectionsListInputSchema,
	collectionsCreate: CollectionsCreateInputSchema,
	collectionsUpdate: CollectionsUpdateInputSchema,
	collectionsDelete: CollectionsDeleteInputSchema,
	adminsIdentify: AdminsIdentifyInputSchema,
	adminsList: AdminsListInputSchema,
	adminsGet: AdminsGetInputSchema,
	adminsListActivityLogs: AdminsListActivityLogsInputSchema,
	adminsSetAway: AdminsSetAwayInputSchema,
	helpCentersList: HelpCentersListInputSchema,
	helpCentersGet: HelpCentersGetInputSchema,
} as const;

export const IntercomEndpointOutputSchemas = {
	contactsGet: ContactsGetResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
	contactsAddTag: ContactsAddTagResponseSchema,
	contactsRemoveTag: ContactsRemoveTagResponseSchema,
	contactsListTags: ContactsListTagsResponseSchema,
	contactsAddSubscription: ContactsAddSubscriptionResponseSchema,
	contactsRemoveSubscription: ContactsRemoveSubscriptionResponseSchema,
	contactsListSubscriptions: ContactsListSubscriptionsResponseSchema,
	contactsAttachToCompany: ContactsAttachToCompanyResponseSchema,
	contactsDetachFromCompany: ContactsDetachFromCompanyResponseSchema,
	contactsListAttachedCompanies: ContactsListAttachedCompaniesResponseSchema,
	contactsListAttachedSegments: ContactsListAttachedSegmentsResponseSchema,
	contactsCreateNote: ContactsCreateNoteResponseSchema,
	contactsListNotes: ContactsListNotesResponseSchema,
	contactsMerge: ContactsMergeResponseSchema,
	conversationsGet: ConversationsGetResponseSchema,
	conversationsList: ConversationsListResponseSchema,
	conversationsCreate: ConversationsCreateResponseSchema,
	conversationsSearch: ConversationsSearchResponseSchema,
	conversationsAssign: ConversationsAssignResponseSchema,
	conversationsClose: ConversationsCloseResponseSchema,
	conversationsReopen: ConversationsReopenResponseSchema,
	conversationsReply: ConversationsReplyResponseSchema,
	companiesCreateOrUpdate: CompaniesCreateOrUpdateResponseSchema,
	companiesGet: CompaniesGetResponseSchema,
	companiesList: CompaniesListResponseSchema,
	companiesScroll: CompaniesScrollResponseSchema,
	companiesDelete: CompaniesDeleteResponseSchema,
	companiesRetrieve: CompaniesRetrieveResponseSchema,
	companiesListAttachedContacts: CompaniesListAttachedContactsResponseSchema,
	companiesListAttachedSegments: CompaniesListAttachedSegmentsResponseSchema,
	articlesGet: ArticlesGetResponseSchema,
	articlesList: ArticlesListResponseSchema,
	articlesCreate: ArticlesCreateResponseSchema,
	articlesUpdate: ArticlesUpdateResponseSchema,
	articlesDelete: ArticlesDeleteResponseSchema,
	articlesSearch: ArticlesSearchResponseSchema,
	collectionsGet: CollectionsGetResponseSchema,
	collectionsList: CollectionsListResponseSchema,
	collectionsCreate: CollectionsCreateResponseSchema,
	collectionsUpdate: CollectionsUpdateResponseSchema,
	collectionsDelete: CollectionsDeleteResponseSchema,
	adminsIdentify: AdminsIdentifyResponseSchema,
	adminsList: AdminsListResponseSchema,
	adminsGet: AdminsGetResponseSchema,
	adminsListActivityLogs: AdminsListActivityLogsResponseSchema,
	adminsSetAway: AdminsSetAwayResponseSchema,
	helpCentersList: HelpCentersListResponseSchema,
	helpCentersGet: HelpCentersGetResponseSchema,
} as const;
