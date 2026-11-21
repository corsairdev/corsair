import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** A lead: a prospect record whose custom fields live in `data`. */
export const LeadSchema = z
	.object({
		id: z.string().min(1).describe('Lead id'),
		status: z.string().nullish().describe('Lead status name'),
		// unknown: `data` holds the custom fields defined in lead_fields, so
		// it stays an open record.
		data: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Lead attributes keyed by field name'),
		creator_id: z
			.string()
			.nullish()
			.describe('Id of the user who created the lead'),
		owner_id: z.string().nullish().describe('Id of the user who owns the lead'),
		bounced: z.boolean().nullish().describe('Whether the last email bounced'),
		optedout: z.boolean().nullish().describe('Whether the lead opted out'),
		sent_count: z.number().nullish().describe('Emails sent to the lead'),
		replied_count: z
			.number()
			.nullish()
			.describe('Replies received from the lead'),
		last_sent_at: z.string().nullish().describe('When the last email was sent'),
	})
	.loose()
	.describe('A PersistIQ lead');
export type Lead = z.infer<typeof LeadSchema>;

export const UserSchema = z
	.object({
		id: z.string().min(1).describe('User id'),
		name: z.string().nullish().describe('User name'),
		email: z.string().nullish().describe('User email address'),
	})
	.loose()
	.describe('A PersistIQ team member');
export type User = z.infer<typeof UserSchema>;

export const CampaignSchema = z
	.object({
		id: z.string().min(1).describe('Campaign id'),
		name: z.string().nullish().describe('Campaign name'),
	})
	.loose()
	.describe('A PersistIQ campaign');
export type Campaign = z.infer<typeof CampaignSchema>;

export const LeadFieldSchema = z
	.object({
		id: z.string().min(1).describe('Field id'),
		label: z.string().nullish().describe('Field label shown in the UI'),
	})
	.loose()
	.describe('A lead field definition');
export type LeadField = z.infer<typeof LeadFieldSchema>;

export const LeadStatusSchema = z
	.object({
		id: z.string().min(1).describe('Status id'),
		name: z.string().nullish().describe('Status name'),
	})
	.loose()
	.describe('A lead status');
export type LeadStatus = z.infer<typeof LeadStatusSchema>;

export const DncDomainSchema = z
	.object({
		id: z.string().min(1).describe('DNC domain id'),
		domain: z.string().nullish().describe('Do-not-contact domain'),
	})
	.loose()
	.describe('A do-not-contact domain');
export type DncDomain = z.infer<typeof DncDomainSchema>;

export const EventSchema = z
	.object({
		id: z.string().min(1).describe('Event id'),
		event_type: z.string().nullish().describe('Event type, e.g. email_sent'),
		// unknown: the data object's keys depend on the event type, so it
		// stays an open record.
		data: z.record(z.string(), z.unknown()).nullish().describe('Event payload'),
		created_at: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A PersistIQ activity event');
export type Event = z.infer<typeof EventSchema>;

export const TagSchema = z
	.object({
		id: z.string().min(1).describe('Tag id'),
		name: z.string().nullish().describe('Tag name'),
	})
	.loose()
	.describe('A PersistIQ tag');
export type Tag = z.infer<typeof TagSchema>;

export const WebhookSettingsSchema = z
	.object({
		url: z.string().nullish().describe('Endpoint deliveries are posted to'),
		enabled: z.boolean().nullish().describe('Whether deliveries are active'),
	})
	.loose()
	.describe('The webhook plugin settings');
export type WebhookSettings = z.infer<typeof WebhookSettingsSchema>;

/** The pagination block list answers carry. */
export const PaginationSchema = z
	.object({
		has_more: z.boolean().describe('Whether more pages exist'),
		next_page: z
			.string()
			.nullish()
			.describe('Cursor of the next page; pass it back as next_page'),
	})
	.loose()
	.describe('PersistIQ pagination');

/** Wraps a named result array plus the pagination block. */
const ListEnvelopeSchema = z
	.object({
		status: z.string().describe('success'),
		// unknown: the data array's element type differs per endpoint, so the
		// shared envelope keeps it open and each endpoint extends it.
		data: z.array(z.unknown()),
		page: PaginationSchema,
	})
	.loose()
	.describe('The list envelope PersistIQ answers with');

/** The delete-style answer. */
export const DeletedSchema = z
	.object({
		status: z.string().describe('success'),
	})
	.loose()
	.describe('A PersistIQ delete answer');
export type Deleted = z.infer<typeof DeletedSchema>;

// ── users ──────────────────────────────────────────────────────────────────

export const ListUsersInputSchema = z
	.object({})
	.describe('Input for listing team members (none)');
export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;

export const ListUsersOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(UserSchema).describe('Team members'),
});
export type ListUsersOutput = z.infer<typeof ListUsersOutputSchema>;

// ── leadFields / leadStatuses / tags ───────────────────────────────────────

export const ListLeadFieldsInputSchema = z
	.object({})
	.describe('Input for listing lead fields (none)');
export type ListLeadFieldsInput = z.infer<typeof ListLeadFieldsInputSchema>;

export const ListLeadFieldsOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(LeadFieldSchema).describe('Lead field definitions'),
});
export type ListLeadFieldsOutput = z.infer<typeof ListLeadFieldsOutputSchema>;

export const ListLeadStatusesInputSchema = z
	.object({})
	.describe('Input for listing lead statuses (none)');
export type ListLeadStatusesInput = z.infer<typeof ListLeadStatusesInputSchema>;

export const ListLeadStatusesOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(LeadStatusSchema).describe('Lead statuses'),
});
export type ListLeadStatusesOutput = z.infer<
	typeof ListLeadStatusesOutputSchema
>;

export const ListTagsInputSchema = z
	.object({})
	.describe('Input for listing tags (none)');
export type ListTagsInput = z.infer<typeof ListTagsInputSchema>;

export const ListTagsOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(TagSchema).describe('Tags'),
});
export type ListTagsOutput = z.infer<typeof ListTagsOutputSchema>;

// ── leads ──────────────────────────────────────────────────────────────────

export const ListLeadsInputSchema = z
	.object({
		next_page: z
			.string()
			.optional()
			.describe(
				'Cursor of the next page; take it from page.next_page of the prior answer',
			),
	})
	.describe('Query parameters for listing leads');
export type ListLeadsInput = z.infer<typeof ListLeadsInputSchema>;

export const ListLeadsOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(LeadSchema).describe('Leads on this page'),
});
export type ListLeadsOutput = z.infer<typeof ListLeadsOutputSchema>;

export const CreateLeadInputSchema = z
	.object({
		email: z.string().email().describe('Lead email address'),
		data: z
			// unknown: `data` keys are the account's lead fields, so the record
			// cannot be stricter.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Lead attributes keyed by field name'),
	})
	.describe('Create a lead');
export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;

export const CreateLeadOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(LeadSchema).describe('The lead as created'),
});
export type CreateLeadOutput = z.infer<typeof CreateLeadOutputSchema>;

export const GetLeadInputSchema = z
	.object({ id: z.string().min(1).describe('Lead id') })
	.describe('Input for reading one lead');
export type GetLeadInput = z.infer<typeof GetLeadInputSchema>;

export const GetLeadOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(LeadSchema).describe('The lead'),
});
export type GetLeadOutput = z.infer<typeof GetLeadOutputSchema>;

export const UpdateLeadInputSchema = z
	.object({
		id: z.string().min(1).describe('Lead id'),
		// unknown: `data` keys are the account's lead fields, so the record
		// cannot be stricter.
		data: z
			.record(z.string(), z.unknown())
			.describe('Lead attributes to update'),
	})
	.describe('Update a lead');
export type UpdateLeadInput = z.infer<typeof UpdateLeadInputSchema>;

export const UpdateLeadOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(LeadSchema).describe('The lead as updated'),
});
export type UpdateLeadOutput = z.infer<typeof UpdateLeadOutputSchema>;

// ── campaigns ──────────────────────────────────────────────────────────────

export const ListCampaignsInputSchema = z
	.object({})
	.describe('Input for listing campaigns (none)');
export type ListCampaignsInput = z.infer<typeof ListCampaignsInputSchema>;

export const ListCampaignsOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(CampaignSchema).describe('Campaigns'),
});
export type ListCampaignsOutput = z.infer<typeof ListCampaignsOutputSchema>;

export const CreateCampaignInputSchema = z
	.object({
		name: z.string().min(1).describe('Campaign name'),
		do_not_automate: z
			.boolean()
			.optional()
			.describe('Draft the emails instead of automating sends'),
	})
	.describe('Create a campaign');
export type CreateCampaignInput = z.infer<typeof CreateCampaignInputSchema>;

export const CreateCampaignOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(CampaignSchema).describe('The campaign as created'),
});
export type CreateCampaignOutput = z.infer<typeof CreateCampaignOutputSchema>;

export const DuplicateCampaignInputSchema = z
	.object({
		campaign_id: z.string().min(1).describe('Campaign id to duplicate'),
		num_duplicates: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('How many copies to make'),
	})
	.describe('Duplicate a campaign');
export type DuplicateCampaignInput = z.infer<
	typeof DuplicateCampaignInputSchema
>;

export const DuplicateCampaignOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(CampaignSchema).describe('The duplicated campaigns'),
});
export type DuplicateCampaignOutput = z.infer<
	typeof DuplicateCampaignOutputSchema
>;

export const ListCampaignLeadsInputSchema = z
	.object({ campaignId: z.string().min(1).describe('Campaign id') })
	.describe('Input for listing the leads in a campaign');
export type ListCampaignLeadsInput = z.infer<
	typeof ListCampaignLeadsInputSchema
>;

export const ListCampaignLeadsOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(LeadSchema).describe('Leads in the campaign'),
});
export type ListCampaignLeadsOutput = z.infer<
	typeof ListCampaignLeadsOutputSchema
>;

export const AddCampaignLeadInputSchema = z
	.object({
		campaignId: z.string().min(1).describe('Campaign id'),
		lead_id: z.string().min(1).describe('Lead id to add'),
	})
	.describe('Add a lead to a campaign');
export type AddCampaignLeadInput = z.infer<typeof AddCampaignLeadInputSchema>;

export const AddCampaignLeadOutputSchema = DeletedSchema.describe(
	'The lead was added to the campaign',
);
export type AddCampaignLeadOutput = z.infer<typeof AddCampaignLeadOutputSchema>;

export const RemoveCampaignLeadInputSchema = z
	.object({
		campaignId: z.string().min(1).describe('Campaign id'),
		leadId: z.string().min(1).describe('Lead id to remove'),
	})
	.describe('Remove a lead from a campaign');
export type RemoveCampaignLeadInput = z.infer<
	typeof RemoveCampaignLeadInputSchema
>;

export const RemoveCampaignLeadOutputSchema = DeletedSchema.describe(
	'The lead was removed from the campaign',
);
export type RemoveCampaignLeadOutput = z.infer<
	typeof RemoveCampaignLeadOutputSchema
>;

export const ListRepliesInputSchema = z
	.object({ campaignId: z.string().min(1).describe('Campaign id') })
	.describe('Input for listing the replies in a campaign');
export type ListRepliesInput = z.infer<typeof ListRepliesInputSchema>;

export const ReplySchema = z
	.object({
		id: z.string().min(1).describe('Reply id'),
	})
	.loose()
	.describe('A reply to an inbox message');
export type Reply = z.infer<typeof ReplySchema>;

export const ListRepliesOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(ReplySchema).describe('Replies'),
});
export type ListRepliesOutput = z.infer<typeof ListRepliesOutputSchema>;

export const ReplyToMessageInputSchema = z
	.object({
		campaignId: z.string().min(1).describe('Campaign id'),
		lead_id: z.string().min(1).describe('Lead id the message belongs to'),
		message_id: z.string().min(1).describe('Inbox message id to reply to'),
		reply_message: z.string().min(1).describe('Reply body'),
	})
	.describe('Reply to an inbox message in a campaign');
export type ReplyToMessageInput = z.infer<typeof ReplyToMessageInputSchema>;

export const ReplyToMessageOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(ReplySchema).describe('The reply as sent'),
});
export type ReplyToMessageOutput = z.infer<typeof ReplyToMessageOutputSchema>;

// ── dncDomains ─────────────────────────────────────────────────────────────

export const ListDncDomainsInputSchema = z
	.object({})
	.describe('Input for listing do-not-contact domains (none)');
export type ListDncDomainsInput = z.infer<typeof ListDncDomainsInputSchema>;

export const ListDncDomainsOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(DncDomainSchema).describe('Do-not-contact domains'),
});
export type ListDncDomainsOutput = z.infer<typeof ListDncDomainsOutputSchema>;

export const CreateDncDomainInputSchema = z
	.object({
		domain: z
			.string()
			.min(1)
			.describe('Domain to add to the do-not-contact list'),
	})
	.describe('Add a do-not-contact domain');
export type CreateDncDomainInput = z.infer<typeof CreateDncDomainInputSchema>;

export const CreateDncDomainOutputSchema = DeletedSchema.describe(
	'The domain was added',
);
export type CreateDncDomainOutput = z.infer<typeof CreateDncDomainOutputSchema>;

// ── events ─────────────────────────────────────────────────────────────────

export const ListEventsInputSchema = z
	.object({
		next_page: z.string().optional().describe('Cursor of the next page'),
	})
	.describe('Query parameters for listing events');
export type ListEventsInput = z.infer<typeof ListEventsInputSchema>;

export const ListEventsOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(EventSchema).describe('Events on this page'),
});
export type ListEventsOutput = z.infer<typeof ListEventsOutputSchema>;

// ── webhooks ───────────────────────────────────────────────────────────────

export const GetWebhookSettingsInputSchema = z
	.object({})
	.describe('Input for reading the webhook plugin settings (none)');
export type GetWebhookSettingsInput = z.infer<
	typeof GetWebhookSettingsInputSchema
>;

export const GetWebhookSettingsOutputSchema = ListEnvelopeSchema.extend({
	data: z.array(WebhookSettingsSchema).describe('The webhook plugin settings'),
});
export type GetWebhookSettingsOutput = z.infer<
	typeof GetWebhookSettingsOutputSchema
>;

export const UpdateWebhookSettingsInputSchema = z
	.object({
		url: z.string().url().describe('Endpoint deliveries are posted to'),
		enabled: z.boolean().optional().describe('Whether deliveries are active'),
	})
	.describe('Update the webhook plugin settings');
export type UpdateWebhookSettingsInput = z.infer<
	typeof UpdateWebhookSettingsInputSchema
>;

export const UpdateWebhookSettingsOutputSchema = ListEnvelopeSchema.extend({
	data: z
		.array(WebhookSettingsSchema)
		.describe('The webhook plugin settings as updated'),
});
export type UpdateWebhookSettingsOutput = z.infer<
	typeof UpdateWebhookSettingsOutputSchema
>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PersistiqEndpointInputSchemas = {
	usersList: ListUsersInputSchema,
	leadFieldsList: ListLeadFieldsInputSchema,
	leadStatusesList: ListLeadStatusesInputSchema,
	tagsList: ListTagsInputSchema,
	leadsList: ListLeadsInputSchema,
	leadsCreate: CreateLeadInputSchema,
	leadsGet: GetLeadInputSchema,
	leadsUpdate: UpdateLeadInputSchema,
	campaignsList: ListCampaignsInputSchema,
	campaignsCreate: CreateCampaignInputSchema,
	campaignsDuplicate: DuplicateCampaignInputSchema,
	campaignsListLeads: ListCampaignLeadsInputSchema,
	campaignsAddLead: AddCampaignLeadInputSchema,
	campaignsRemoveLead: RemoveCampaignLeadInputSchema,
	campaignsListReplies: ListRepliesInputSchema,
	campaignsReplyToMessage: ReplyToMessageInputSchema,
	dncDomainsList: ListDncDomainsInputSchema,
	dncDomainsCreate: CreateDncDomainInputSchema,
	eventsList: ListEventsInputSchema,
	webhooksGetSettings: GetWebhookSettingsInputSchema,
	webhooksUpdateSettings: UpdateWebhookSettingsInputSchema,
};

export const PersistiqEndpointOutputSchemas = {
	usersList: ListUsersOutputSchema,
	leadFieldsList: ListLeadFieldsOutputSchema,
	leadStatusesList: ListLeadStatusesOutputSchema,
	tagsList: ListTagsOutputSchema,
	leadsList: ListLeadsOutputSchema,
	leadsCreate: CreateLeadOutputSchema,
	leadsGet: GetLeadOutputSchema,
	leadsUpdate: UpdateLeadOutputSchema,
	campaignsList: ListCampaignsOutputSchema,
	campaignsCreate: CreateCampaignOutputSchema,
	campaignsDuplicate: DuplicateCampaignOutputSchema,
	campaignsListLeads: ListCampaignLeadsOutputSchema,
	campaignsAddLead: AddCampaignLeadOutputSchema,
	campaignsRemoveLead: RemoveCampaignLeadOutputSchema,
	campaignsListReplies: ListRepliesOutputSchema,
	campaignsReplyToMessage: ReplyToMessageOutputSchema,
	dncDomainsList: ListDncDomainsOutputSchema,
	dncDomainsCreate: CreateDncDomainOutputSchema,
	eventsList: ListEventsOutputSchema,
	webhooksGetSettings: GetWebhookSettingsOutputSchema,
	webhooksUpdateSettings: UpdateWebhookSettingsOutputSchema,
};

export type PersistiqEndpointInputs = {
	[K in keyof typeof PersistiqEndpointInputSchemas]: z.input<
		(typeof PersistiqEndpointInputSchemas)[K]
	>;
};

export type PersistiqEndpointOutputs = {
	[K in keyof typeof PersistiqEndpointOutputSchemas]: z.infer<
		(typeof PersistiqEndpointOutputSchemas)[K]
	>;
};
