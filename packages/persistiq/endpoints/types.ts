import { z } from 'zod';

// Shapes follow the official spec, generated from PersistIQ's own request
// specs: https://persistiq.com/api-docs/v1/swagger.json. Response objects
// stay loose and nullish so a field PersistIQ adds or drops does not break
// a read; inputs stay strict.

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

export const MailboxSchema = z
	.object({
		id: z.string().nullish().describe('Mailbox id'),
		email: z.string().nullish().describe('Mailbox address'),
		campaign_ids: z
			.array(z.string())
			.nullish()
			.describe('Campaigns that send from this mailbox'),
	})
	.loose()
	.describe('A mailbox connected to a user');

export const UserSchema = z
	.object({
		id: z.string().min(1).describe('User id'),
		name: z.string().nullish().describe('User name'),
		email: z.string().nullish().describe('User email address'),
		activated: z.boolean().nullish().describe('Whether the user is active'),
		salesforce_id: z.string().nullish().describe('Linked Salesforce user id'),
		default_mailbox_id: z
			.string()
			.nullish()
			.describe('Mailbox used when none is given'),
		mailboxes: z
			.array(MailboxSchema)
			.nullish()
			.describe('Mailboxes connected to the user'),
	})
	.loose()
	.describe('A PersistIQ team member');
export type User = z.infer<typeof UserSchema>;

export const CampaignSchema = z
	.object({
		id: z.string().min(1).describe('Campaign id'),
		name: z.string().nullish().describe('Campaign name'),
		creator: z
			.object({
				id: z.string().nullish().describe('Creator user id'),
				name: z.string().nullish().describe('Creator name'),
				email: z.string().nullish().describe('Creator email address'),
			})
			.loose()
			.nullish()
			.describe('The user who created the campaign'),
		stats: z
			.object({
				prospects_contacted: z.number().nullish(),
				prospects_reached: z.number().nullish(),
				prospects_opened: z.number().nullish(),
				prospects_replied: z.number().nullish(),
				prospects_bounced: z.number().nullish(),
				prospects_optedout: z.number().nullish(),
				total_prospects: z.number().nullish(),
			})
			.loose()
			.nullish()
			.describe('Campaign counters'),
	})
	.loose()
	.describe('A PersistIQ campaign');
export type Campaign = z.infer<typeof CampaignSchema>;

/** A lead's membership in a campaign. */
export const CampaignLeadSchema = z
	.object({
		id: z.string().min(1).describe('Campaign lead id'),
		campaign_id: z.string().nullish().describe('Campaign id'),
		mailbox_id: z
			.string()
			.nullish()
			.describe('Mailbox the campaign sends from'),
		lead: LeadSchema.nullish().describe('The lead'),
	})
	.loose()
	.describe('A lead in a campaign');
export type CampaignLead = z.infer<typeof CampaignLeadSchema>;

export const LeadFieldSchema = z
	.object({
		id: z.string().min(1).describe('Field id'),
		name: z.string().nullish().describe('Field key used in a lead data map'),
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
		name: z.string().nullish().describe('Do-not-contact domain'),
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

export const ReplySchema = z
	.object({
		id: z.string().min(1).describe('Reply id'),
		from_email: z.string().nullish().describe('Sender address'),
		to_emails: z.array(z.string()).nullish().describe('Recipient addresses'),
		cc_emails: z.array(z.string()).nullish().describe('Cc addresses'),
		subject: z.string().nullish().describe('Subject line'),
		body: z.string().nullish().describe('Message body'),
		preview: z.string().nullish().describe('Short preview of the body'),
		sent_at: z.string().nullish().describe('When the message was sent'),
		sentiment: z.string().nullish().describe('Reply sentiment'),
		kind: z.string().nullish().describe('Message kind'),
		lead_id: z.string().nullish().describe('Lead the message belongs to'),
		campaign_id: z.string().nullish().describe('Campaign id'),
		step_message_id: z
			.string()
			.nullish()
			.describe('Campaign step message the reply answers'),
	})
	.loose()
	.describe('A reply received in a campaign');
export type Reply = z.infer<typeof ReplySchema>;

const webhookToggle = (what: string) =>
	z.boolean().nullish().describe(`Whether ${what} deliveries are on`);
const webhookUrl = (what: string) =>
	z.string().nullish().describe(`Endpoint ${what} deliveries are posted to`);

export const WebhookSettingsSchema = z
	.object({
		post_new_prospect: webhookToggle('new-lead'),
		post_new_prospect_url: webhookUrl('new-lead'),
		post_updated_prospect: webhookToggle('updated-lead'),
		post_updated_prospect_url: webhookUrl('updated-lead'),
		raw_events: webhookToggle('raw-event'),
		raw_events_url: webhookUrl('raw-event'),
		post_email_reply: webhookToggle('email-reply'),
		post_email_reply_url: webhookUrl('email-reply'),
		post_email_opened: webhookToggle('email-opened'),
		post_email_opened_url: webhookUrl('email-opened'),
	})
	.loose()
	.describe('The webhook plugin settings');
export type WebhookSettings = z.infer<typeof WebhookSettingsSchema>;

/**
 * The fields every list answer carries beside its named array:
 * `{ status, errors, has_more, next_page, <items>: [...] }`.
 */
const listEnvelope = {
	status: z.string().nullish().describe('success or error'),
	errors: z
		.array(z.string())
		.nullish()
		.describe('Problems PersistIQ reports with the request'),
	has_more: z.boolean().nullish().describe('Whether more pages exist'),
	next_page: z
		.string()
		.nullish()
		.describe('Link to the next page; pass page + 1 to fetch it'),
};

/** The `{ status, error, <record> }` answer single-record calls give. */
const recordEnvelope = {
	status: z.string().nullish().describe('success or error'),
	// unknown: the spec types error only as a nullable object.
	error: z.unknown().nullish().describe('Error details, null on success'),
};

const page = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Page number, from 1; ask for the next one while has_more is true');

const noInput = (what: string) =>
	z.object({}).describe(`Input for listing ${what} (none)`);

// ── users ──────────────────────────────────────────────────────────────────

export const ListUsersInputSchema = z
	.object({ page })
	.describe('Input for listing team members');
export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;

export const ListUsersOutputSchema = z
	.object({
		...listEnvelope,
		users: z.array(UserSchema).describe('Team members'),
	})
	.loose();
export type ListUsersOutput = z.infer<typeof ListUsersOutputSchema>;

// ── leadFields / leadStatuses / tags ───────────────────────────────────────

export const ListLeadFieldsInputSchema = noInput('lead fields');
export type ListLeadFieldsInput = z.infer<typeof ListLeadFieldsInputSchema>;

export const ListLeadFieldsOutputSchema = z
	.object({
		...listEnvelope,
		lead_fields: z.array(LeadFieldSchema).describe('Lead field definitions'),
	})
	.loose();
export type ListLeadFieldsOutput = z.infer<typeof ListLeadFieldsOutputSchema>;

export const ListLeadStatusesInputSchema = noInput('lead statuses');
export type ListLeadStatusesInput = z.infer<typeof ListLeadStatusesInputSchema>;

export const ListLeadStatusesOutputSchema = z
	.object({
		...listEnvelope,
		lead_statuses: z.array(LeadStatusSchema).describe('Lead statuses'),
	})
	.loose();
export type ListLeadStatusesOutput = z.infer<
	typeof ListLeadStatusesOutputSchema
>;

export const ListTagsInputSchema = z
	.object({ page })
	.describe('Input for listing tags');
export type ListTagsInput = z.infer<typeof ListTagsInputSchema>;

export const ListTagsOutputSchema = z
	.object({
		...listEnvelope,
		tags: z.array(TagSchema).describe('Tags'),
	})
	.loose();
export type ListTagsOutput = z.infer<typeof ListTagsOutputSchema>;

// ── leads ──────────────────────────────────────────────────────────────────

export const ListLeadsInputSchema = z
	.object({
		page,
		status: z
			.string()
			.min(1)
			.optional()
			.describe('Only leads with this status name'),
		status_id: z
			.string()
			.min(1)
			.optional()
			.describe('Only leads with this status id'),
		updated_after: z
			.string()
			.min(1)
			.optional()
			.describe('Only leads updated after this ISO 8601 time'),
		created_after: z
			.string()
			.min(1)
			.optional()
			.describe('Only leads created after this ISO 8601 time'),
		email: z
			.string()
			.min(1)
			.optional()
			.describe('Only the lead with this email'),
	})
	.describe('Query parameters for listing leads');
export type ListLeadsInput = z.infer<typeof ListLeadsInputSchema>;

export const ListLeadsOutputSchema = z
	.object({
		...listEnvelope,
		leads: z.array(LeadSchema).describe('Leads on this page'),
	})
	.loose();
export type ListLeadsOutput = z.infer<typeof ListLeadsOutputSchema>;

export const CreateLeadInputSchema = z
	.object({
		lead: z
			// unknown: lead keys are the account's lead fields (email,
			// first_name, company_name, ...), so the record cannot be stricter.
			.record(z.string(), z.unknown())
			.describe(
				'Lead data keyed by field name (email, first_name, last_name, company_name, ...); see leadFields.list',
			),
		dup: z
			.enum(['update', 'skip'])
			.optional()
			.describe('What to do when a lead with the same email exists'),
		creator_id: z
			.string()
			.min(1)
			.optional()
			.describe('User id recorded as the creator'),
	})
	.describe('Create a lead');
export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;

const LeadRecordOutputSchema = z
	.object({
		...recordEnvelope,
		lead: LeadSchema.describe('The lead'),
	})
	.loose();

export const CreateLeadOutputSchema = LeadRecordOutputSchema.describe(
	'The lead as created',
);
export type CreateLeadOutput = z.infer<typeof CreateLeadOutputSchema>;

export const GetLeadInputSchema = z
	.object({
		id: z.string().min(1).describe('Lead id, or the lead email address'),
	})
	.describe('Input for reading one lead');
export type GetLeadInput = z.infer<typeof GetLeadInputSchema>;

export const GetLeadOutputSchema = LeadRecordOutputSchema.describe('The lead');
export type GetLeadOutput = z.infer<typeof GetLeadOutputSchema>;

export const UpdateLeadInputSchema = z
	.object({
		id: z.string().min(1).describe('Lead id, or the lead email address'),
		status: z.string().min(1).optional().describe('New status name'),
		status_id: z.string().min(1).optional().describe('New status id'),
		owner_id: z.string().min(1).optional().describe('New owner user id'),
		bounced: z.boolean().optional().describe('Mark the lead bounced'),
		optedout: z.boolean().optional().describe('Mark the lead opted out'),
		// unknown: `data` keys are the account's lead fields, so the record
		// cannot be stricter.
		data: z
			.record(z.string(), z.unknown())
			.optional()
			.describe('Lead attributes to update, keyed by field name'),
	})
	.refine(
		({ id: _id, ...fields }) =>
			Object.values(fields).some((value) => value !== undefined),
		{ message: 'Give at least one field to update' },
	)
	.describe('Update a lead');
export type UpdateLeadInput = z.infer<typeof UpdateLeadInputSchema>;

export const UpdateLeadOutputSchema = LeadRecordOutputSchema.describe(
	'The lead as updated',
);
export type UpdateLeadOutput = z.infer<typeof UpdateLeadOutputSchema>;

// ── campaigns ──────────────────────────────────────────────────────────────

export const ListCampaignsInputSchema = z
	.object({
		page,
		name: z
			.string()
			.min(1)
			.optional()
			.describe('Only campaigns with this name'),
		owner_id: z
			.string()
			.min(1)
			.optional()
			.describe('Only campaigns owned by this user id'),
		lead_id: z
			.string()
			.min(1)
			.optional()
			.describe('Only campaigns this lead is in'),
	})
	.describe('Query parameters for listing campaigns');
export type ListCampaignsInput = z.infer<typeof ListCampaignsInputSchema>;

export const ListCampaignsOutputSchema = z
	.object({
		...listEnvelope,
		campaigns: z.array(CampaignSchema).describe('Campaigns'),
	})
	.loose();
export type ListCampaignsOutput = z.infer<typeof ListCampaignsOutputSchema>;

export const CreateCampaignInputSchema = z
	.object({
		campaign_name: z.string().min(1).describe('Campaign name'),
		owner_id: z
			.string()
			.min(1)
			.describe('User id of the campaign owner; see users.list'),
	})
	.describe('Create a campaign');
export type CreateCampaignInput = z.infer<typeof CreateCampaignInputSchema>;

export const CreateCampaignOutputSchema = CampaignSchema.describe(
	'The campaign as created',
);
export type CreateCampaignOutput = z.infer<typeof CreateCampaignOutputSchema>;

export const DuplicateCampaignInputSchema = z
	.object({
		campaign_id: z.string().min(1).describe('Campaign id to duplicate'),
		owner_id: z.string().min(1).describe('User id that owns the copy'),
		name: z
			.string()
			.min(1)
			.optional()
			.describe('Name of the copy; PersistIQ picks one when omitted'),
	})
	.describe('Duplicate a campaign');
export type DuplicateCampaignInput = z.infer<
	typeof DuplicateCampaignInputSchema
>;

export const DuplicateCampaignOutputSchema =
	CampaignSchema.describe('The copy');
export type DuplicateCampaignOutput = z.infer<
	typeof DuplicateCampaignOutputSchema
>;

export const ListCampaignLeadsInputSchema = z
	.object({ campaignId: z.string().min(1).describe('Campaign id'), page })
	.describe('Input for listing the leads in a campaign');
export type ListCampaignLeadsInput = z.infer<
	typeof ListCampaignLeadsInputSchema
>;

export const ListCampaignLeadsOutputSchema = z
	.object({
		...listEnvelope,
		campaign_leads: z
			.array(CampaignLeadSchema)
			.describe('Leads in the campaign'),
	})
	.loose();
export type ListCampaignLeadsOutput = z.infer<
	typeof ListCampaignLeadsOutputSchema
>;

export const AddCampaignLeadInputSchema = z
	.object({
		campaignId: z.string().min(1).describe('Campaign id'),
		lead_id: z.string().min(1).optional().describe('Lead id to add'),
		leads: z
			.array(z.string().min(1))
			.min(1)
			.max(100)
			.optional()
			.describe('Bulk add: up to 100 lead ids'),
		mailbox_id: z
			.string()
			.min(1)
			.optional()
			.describe("Mailbox to send from; defaults to the campaign owner's"),
		skip_if_exists: z
			.boolean()
			.optional()
			.describe('Return the existing membership instead of an error'),
		override_lead_limit: z
			.boolean()
			.optional()
			.describe("Add past the campaign's lead limit"),
	})
	.refine((input) => input.lead_id !== undefined || input.leads !== undefined, {
		message: 'Give lead_id or leads',
	})
	.describe('Add a lead to a campaign');
export type AddCampaignLeadInput = z.infer<typeof AddCampaignLeadInputSchema>;

export const AddCampaignLeadOutputSchema = z
	.object({
		...recordEnvelope,
		campaign_lead: CampaignLeadSchema.nullish().describe(
			'The membership created (single add)',
		),
	})
	.loose()
	.describe('The lead was added to the campaign');
export type AddCampaignLeadOutput = z.infer<typeof AddCampaignLeadOutputSchema>;

export const RemoveCampaignLeadInputSchema = z
	.object({
		campaignId: z.string().min(1).describe('Campaign id'),
		leadId: z
			.string()
			.min(1)
			.describe('Lead id to remove (the id of the lead, as the spec names it)'),
	})
	.describe('Remove a lead from a campaign');
export type RemoveCampaignLeadInput = z.infer<
	typeof RemoveCampaignLeadInputSchema
>;

export const RemoveCampaignLeadOutputSchema = z
	.object({
		status: z.literal('success').describe('success'),
		leadId: z.string().describe('The lead removed'),
	})
	.describe('The lead was removed from the campaign');
export type RemoveCampaignLeadOutput = z.infer<
	typeof RemoveCampaignLeadOutputSchema
>;

export const ListRepliesInputSchema = z
	.object({
		campaignId: z.string().min(1).describe('Campaign id'),
		page,
		lead_id: z
			.string()
			.min(1)
			.optional()
			.describe('Only replies from this lead'),
		start_at: z
			.string()
			.min(1)
			.optional()
			.describe('Only replies sent on or after this ISO 8601 time'),
		end_at: z
			.string()
			.min(1)
			.optional()
			.describe('Only replies sent on or before this ISO 8601 time'),
	})
	.describe('Input for listing the replies in a campaign');
export type ListRepliesInput = z.infer<typeof ListRepliesInputSchema>;

export const ListRepliesOutputSchema = z
	.object({
		...listEnvelope,
		replies: z.array(ReplySchema).describe('Replies'),
	})
	.loose();
export type ListRepliesOutput = z.infer<typeof ListRepliesOutputSchema>;

export const ReplyToMessageInputSchema = z
	.object({
		campaignId: z.string().min(1).describe('Campaign id'),
		inbox_message_id: z
			.string()
			.min(1)
			.describe('Inbox message id to reply to (a reply id from listReplies)'),
		body: z.string().min(1).describe('HTML body of the reply'),
	})
	.describe('Reply to an inbox message in a campaign');
export type ReplyToMessageInput = z.infer<typeof ReplyToMessageInputSchema>;

export const ReplyToMessageOutputSchema = z
	.object({
		status: z.string().nullish().describe('queued once accepted'),
		message: z.string().nullish().describe('What PersistIQ did'),
	})
	.loose()
	.describe('The reply was queued for sending');
export type ReplyToMessageOutput = z.infer<typeof ReplyToMessageOutputSchema>;

// ── dncDomains ─────────────────────────────────────────────────────────────

export const ListDncDomainsInputSchema = z
	.object({ page })
	.describe('Input for listing do-not-contact domains');
export type ListDncDomainsInput = z.infer<typeof ListDncDomainsInputSchema>;

export const ListDncDomainsOutputSchema = z
	.object({
		...listEnvelope,
		dnc_domains: z.array(DncDomainSchema).describe('Do-not-contact domains'),
	})
	.loose();
export type ListDncDomainsOutput = z.infer<typeof ListDncDomainsOutputSchema>;

export const CreateDncDomainInputSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.describe('Domain to add to the do-not-contact list, e.g. example.com'),
	})
	.describe('Add a do-not-contact domain');
export type CreateDncDomainInput = z.infer<typeof CreateDncDomainInputSchema>;

export const CreateDncDomainOutputSchema = z
	.object({
		...recordEnvelope,
		dnc_domain: DncDomainSchema.nullish().describe('The domain added'),
	})
	.loose()
	// A 200 that still says status "error" is a failure, not a success.
	.refine((result) => result.status !== 'error', {
		message: 'PersistIQ answered status "error"',
	})
	.describe('The domain was added');
export type CreateDncDomainOutput = z.infer<typeof CreateDncDomainOutputSchema>;

// ── events ─────────────────────────────────────────────────────────────────

export const ListEventsInputSchema = z
	.object({
		page,
		group: z.string().min(1).optional().describe('Only events of this group'),
		campaign: z
			.string()
			.min(1)
			.optional()
			.describe('Only events of this campaign id'),
		lead: z.string().min(1).optional().describe('Only events of this lead id'),
		user: z.string().min(1).optional().describe('Only events of this user id'),
		start_at: z
			.string()
			.min(1)
			.optional()
			.describe('Only events after this ISO 8601 time'),
		end_at: z
			.string()
			.min(1)
			.optional()
			.describe('Only events before this ISO 8601 time'),
	})
	.describe('Query parameters for listing events');
export type ListEventsInput = z.infer<typeof ListEventsInputSchema>;

export const ListEventsOutputSchema = z
	.object({
		...listEnvelope,
		events: z.array(EventSchema).describe('Events on this page'),
	})
	.loose();
export type ListEventsOutput = z.infer<typeof ListEventsOutputSchema>;

// ── webhooks ───────────────────────────────────────────────────────────────

export const GetWebhookSettingsInputSchema = z
	.object({})
	.describe('Input for reading the webhook plugin settings (none)');
export type GetWebhookSettingsInput = z.infer<
	typeof GetWebhookSettingsInputSchema
>;

export const GetWebhookSettingsOutputSchema = WebhookSettingsSchema;
export type GetWebhookSettingsOutput = z.infer<
	typeof GetWebhookSettingsOutputSchema
>;

const toggleInput = (what: string) =>
	z.boolean().optional().describe(`Turn ${what} deliveries on or off`);
const urlInput = (what: string) =>
	z.url().optional().describe(`Endpoint ${what} deliveries are posted to`);

export const UpdateWebhookSettingsInputSchema = z
	.object({
		post_new_prospect: toggleInput('new-lead'),
		post_new_prospect_url: urlInput('new-lead'),
		post_updated_prospect: toggleInput('updated-lead'),
		post_updated_prospect_url: urlInput('updated-lead'),
		raw_events: toggleInput('raw-event'),
		raw_events_url: urlInput('raw-event'),
		post_email_reply: toggleInput('email-reply'),
		post_email_reply_url: urlInput('email-reply'),
		post_email_opened: toggleInput('email-opened'),
		post_email_opened_url: urlInput('email-opened'),
	})
	.refine(
		(input) => Object.values(input).some((value) => value !== undefined),
		{ message: 'Give at least one setting to change' },
	)
	.describe('Update the webhook plugin settings');
export type UpdateWebhookSettingsInput = z.infer<
	typeof UpdateWebhookSettingsInputSchema
>;

export const UpdateWebhookSettingsOutputSchema = WebhookSettingsSchema.describe(
	'The webhook plugin settings as updated',
);
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
