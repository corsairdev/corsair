import { z } from 'zod';
import {
	DeletedResponseSchema,
	FubFlagSchema,
	FubMetadataSchema,
	IdSchema,
	ListQuerySchema,
} from './types';

// Inputs use Follow Up Boss's own parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a field FUB adds or omits cannot fail a
// call that has already happened. Field reference:
// https://docs.followupboss.com/reference

// ── email templates ────────────────────────────────────────────────────────

export const TemplateActionPlanSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
	})
	.loose();

export const TemplateSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		createdById: IdSchema.nullish(),
		updatedById: IdSchema.nullish(),
		name: z.string().nullish(),
		// The published examples carry this 0/1 flag as an integer, not a boolean.
		isMobile: z.number().nullish(),
		imported: z.number().nullish(),
		isShared: FubFlagSchema.nullish(),
		body: z.string().nullish(),
		subject: z.string().nullish(),
		isEditable: FubFlagSchema.nullish(),
		isDeletable: FubFlagSchema.nullish(),
		isShareable: FubFlagSchema.nullish(),
		actionPlans: z.array(TemplateActionPlanSchema).nullish(),
		// unknown: the categories payload is provider defined and empty in the
		// published examples, so it passes through as sent.
		categories: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type FollowUpBossTemplate = z.infer<typeof TemplateSchema>;

const TemplateEnvelopeSchema = z
	.object({
		templates: z.array(TemplateSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const TemplatesListInputSchema = ListQuerySchema;

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

const TemplatesListResponseSchema = TemplateEnvelopeSchema;

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

// Create answers 201 with the created template.
const TemplatesCreateInputSchema = z.object({
	name: z.string().describe('The name of the new email template.'),
	subject: z
		.string()
		.describe('The email subject used when this template is selected.'),
	body: z.string().describe('The HTML body of the email template.'),
	isShared: z
		.boolean()
		.optional()
		.describe('Share the template with other users in the account.'),
});

export type TemplatesCreateInput = z.infer<typeof TemplatesCreateInputSchema>;

const TemplatesCreateResponseSchema = TemplateSchema;

export type TemplatesCreateResponse = z.infer<
	typeof TemplatesCreateResponseSchema
>;

const TemplatesGetInputSchema = z.object({
	id: IdSchema.describe('The template ID.'),
	mergePersonId: z
		.number()
		.int()
		.optional()
		.describe(
			'Fill the merge fields with this person and the current user before returning the template.',
		),
});

export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;

const TemplatesGetResponseSchema = TemplateSchema;

export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

// PUT /templates/{id} requires all three content fields (a full replacement),
// unlike FUB's other partial PUT bodies.
const TemplatesUpdateInputSchema = z.object({
	id: IdSchema.describe('The template ID.'),
	name: z.string().describe('The new name for the email template.'),
	subject: z.string().describe('The new subject for the email template.'),
	body: z.string().describe('The new body for the email template.'),
	// Not in the published PUT schema, but its own request example sends it.
	isShared: z.boolean().optional(),
});

export type TemplatesUpdateInput = z.infer<typeof TemplatesUpdateInputSchema>;

const TemplatesUpdateResponseSchema = TemplateSchema;

export type TemplatesUpdateResponse = z.infer<
	typeof TemplatesUpdateResponseSchema
>;

const TemplatesDeleteInputSchema = z.object({
	id: IdSchema.describe('The template ID to delete.'),
});

export type TemplatesDeleteInput = z.infer<typeof TemplatesDeleteInputSchema>;

const TemplatesDeleteResponseSchema = DeletedResponseSchema;

export type TemplatesDeleteResponse = z.infer<
	typeof TemplatesDeleteResponseSchema
>;

// Recipients pass through loose, mirroring the shared email/phone entry style.
const EmailRecipientSchema = z
	.object({
		name: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

const EmailRecipientsSchema = z
	.object({
		to: z.array(EmailRecipientSchema).nullish(),
	})
	.loose();

// The published /templates/merge schema lost its `required` array (its text
// message sibling requires templateId); a merge without a template has nothing
// to merge, so it is required here.
const TemplatesMergeInputSchema = z.object({
	templateId: IdSchema.describe('The ID of the email template to merge.'),
	mergePersonId: z
		.number()
		.int()
		.optional()
		.describe('Person ID to use for merge fields like %contact_name%.'),
	recipients: EmailRecipientsSchema.optional().describe(
		'Recipients in the To: field of this email.',
	),
});

export type TemplatesMergeInput = z.infer<typeof TemplatesMergeInputSchema>;

// The merge answers 200 with the merged template.
const TemplatesMergeResponseSchema = TemplateSchema;

export type TemplatesMergeResponse = z.infer<
	typeof TemplatesMergeResponseSchema
>;

// ── text message templates ─────────────────────────────────────────────────

export const TextMessageTemplateSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		message: z.string().nullish(),
		totalSent: z.number().nullish(),
		totalReplies: z.number().nullish(),
		isShared: FubFlagSchema.nullish(),
		// -1 marks the templates FUB ships by default.
		createdBy: z.number().nullish(),
		isEditable: FubFlagSchema.nullish(),
		isDeletable: FubFlagSchema.nullish(),
		isShareable: FubFlagSchema.nullish(),
		sentPeopleIds: z.array(IdSchema).nullish(),
		sentPeopleCount: z.number().nullish(),
		// unknown: the categories and actionPlans payloads are provider defined,
		// so they pass through as sent.
		categories: z.array(z.record(z.string(), z.unknown())).nullish(),
		actionPlans: z.array(z.record(z.string(), z.unknown())).nullish(),
		effectivenessScore: z.number().nullish(),
		windowedSent: z.number().nullish(),
		windowedReplies: z.number().nullish(),
		windowedOptOutRate: z.number().nullish(),
		totalOptOutRate: z.number().nullish(),
	})
	.loose();

export type FollowUpBossTextMessageTemplate = z.infer<
	typeof TextMessageTemplateSchema
>;

// The collection envelope key is the lowercase `textmessagetemplates`, unlike
// the camelCase /textMessageTemplates path.
const TextMessageTemplateEnvelopeSchema = z
	.object({
		textmessagetemplates: z.array(TextMessageTemplateSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

// The published OAS types limit and offset as strings on this list alone,
// while every other FUB list takes integers; the numeric form is kept because
// it is what _metadata echoes back.
const TextMessageTemplatesListInputSchema = ListQuerySchema;

export type TextMessageTemplatesListInput = z.infer<
	typeof TextMessageTemplatesListInputSchema
>;

const TextMessageTemplatesListResponseSchema =
	TextMessageTemplateEnvelopeSchema;

export type TextMessageTemplatesListResponse = z.infer<
	typeof TextMessageTemplatesListResponseSchema
>;

// Create answers 200 (not 201) with the created template.
const TextMessageTemplatesCreateInputSchema = z.object({
	name: z.string().describe('The name of the text message template.'),
	message: z.string().describe('The body of the text message template.'),
	isShared: z
		.boolean()
		.optional()
		.describe('Share the template with other users in the account.'),
});

export type TextMessageTemplatesCreateInput = z.infer<
	typeof TextMessageTemplatesCreateInputSchema
>;

const TextMessageTemplatesCreateResponseSchema = TextMessageTemplateSchema;

export type TextMessageTemplatesCreateResponse = z.infer<
	typeof TextMessageTemplatesCreateResponseSchema
>;

const TextMessageTemplatesGetInputSchema = z.object({
	id: IdSchema.describe('The template ID.'),
});

export type TextMessageTemplatesGetInput = z.infer<
	typeof TextMessageTemplatesGetInputSchema
>;

const TextMessageTemplatesGetResponseSchema = TextMessageTemplateSchema;

export type TextMessageTemplatesGetResponse = z.infer<
	typeof TextMessageTemplatesGetResponseSchema
>;

const TextMessageTemplatesUpdateInputSchema = z.object({
	id: IdSchema.describe('The template ID.'),
	name: z.string().describe('The name of the text message template.'),
	message: z.string().describe('The body of the text message template.'),
	isShared: z.boolean().optional(),
});

export type TextMessageTemplatesUpdateInput = z.infer<
	typeof TextMessageTemplatesUpdateInputSchema
>;

const TextMessageTemplatesUpdateResponseSchema = TextMessageTemplateSchema;

export type TextMessageTemplatesUpdateResponse = z.infer<
	typeof TextMessageTemplatesUpdateResponseSchema
>;

const TextMessageTemplatesDeleteInputSchema = z.object({
	id: IdSchema.describe('The template ID to delete.'),
});

export type TextMessageTemplatesDeleteInput = z.infer<
	typeof TextMessageTemplatesDeleteInputSchema
>;

const TextMessageTemplatesDeleteResponseSchema = DeletedResponseSchema;

export type TextMessageTemplatesDeleteResponse = z.infer<
	typeof TextMessageTemplatesDeleteResponseSchema
>;

const PhoneRecipientSchema = z
	.object({
		name: z.string().nullish(),
		phone: z.string().nullish(),
	})
	.loose();

const PhoneRecipientsSchema = z
	.object({
		to: z.array(PhoneRecipientSchema).nullish(),
	})
	.loose();

const TextMessageTemplatesMergeInputSchema = z.object({
	templateId: IdSchema.describe(
		'The ID of the text message template to merge.',
	),
	// The email merge publishes this field as mergePersonId; the text message
	// merge names it personId, so the asymmetry is kept per endpoint.
	personId: z
		.number()
		.int()
		.optional()
		.describe('Person ID to use for merge fields like %contact_name%.'),
	recipients: PhoneRecipientsSchema.optional().describe(
		'Recipients of this text message.',
	),
});

export type TextMessageTemplatesMergeInput = z.infer<
	typeof TextMessageTemplatesMergeInputSchema
>;

// The published example body is `{ "mergedTemplate"; ... }` with a stray
// semicolon, so only the documented key is declared and the rest passes
// through.
const TextMessageTemplatesMergeResponseSchema = z
	.object({
		mergedTemplate: z.string().nullish(),
	})
	.loose();

export type TextMessageTemplatesMergeResponse = z.infer<
	typeof TextMessageTemplatesMergeResponseSchema
>;

// ── email marketing campaigns ──────────────────────────────────────────────

export const EmCampaignSchema = z
	.object({
		id: IdSchema.nullish(),
		origin: z.string().nullish(),
		originId: z.string().nullish(),
		name: z.string().nullish(),
		subject: z.string().nullish(),
		bodyHtml: z.string().nullish(),
	})
	.loose();

export type FollowUpBossEmCampaign = z.infer<typeof EmCampaignSchema>;

const EmCampaignEnvelopeSchema = z
	.object({
		emCampaigns: z.array(EmCampaignSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

// Unlike the other lists, /emCampaigns publishes no limit/offset paging
// parameters.
const EmCampaignsListInputSchema = ListQuerySchema.extend({
	origin: z
		.string()
		.optional()
		.describe('Search for campaigns from a specific origin.'),
	originId: z
		.string()
		.optional()
		.describe(
			'Search for campaigns with a specific ID from the originating system.',
		),
});

export type EmCampaignsListInput = z.infer<typeof EmCampaignsListInputSchema>;

const EmCampaignsListResponseSchema = EmCampaignEnvelopeSchema;

export type EmCampaignsListResponse = z.infer<
	typeof EmCampaignsListResponseSchema
>;

// Create answers 200 (not 201) with the campaign.
const EmCampaignsCreateInputSchema = z.object({
	origin: z
		.string()
		.optional()
		.describe(
			'Name of the email marketing system where this campaign originated from.',
		),
	originId: z
		.string()
		.optional()
		.describe('Internal ID of the new campaign or email in the origin system.'),
	name: z
		.string()
		.optional()
		.describe('Name of the email campaign or template.'),
	subject: z.string().optional().describe('Email subject line.'),
	bodyHtml: z.string().optional().describe('Email body in HTML.'),
});

export type EmCampaignsCreateInput = z.infer<
	typeof EmCampaignsCreateInputSchema
>;

const EmCampaignsCreateResponseSchema = EmCampaignSchema;

export type EmCampaignsCreateResponse = z.infer<
	typeof EmCampaignsCreateResponseSchema
>;

const EmCampaignsUpdateInputSchema = z.object({
	id: IdSchema.describe('The Follow Up Boss ID of the email campaign.'),
	name: z
		.string()
		.optional()
		.describe('Name of the email campaign or template.'),
	subject: z.string().optional().describe('Email subject line.'),
	bodyHtml: z.string().optional().describe('Email body in HTML.'),
});

export type EmCampaignsUpdateInput = z.infer<
	typeof EmCampaignsUpdateInputSchema
>;

const EmCampaignsUpdateResponseSchema = EmCampaignSchema;

export type EmCampaignsUpdateResponse = z.infer<
	typeof EmCampaignsUpdateResponseSchema
>;

// ── email marketing events ─────────────────────────────────────────────────

export const EmEventSchema = z
	.object({
		// The published rows carry no id, only the event count and type.
		count: z.number().nullish(),
		type: z.string().nullish(),
		personId: IdSchema.nullish(),
		campaignId: z.number().nullish(),
		campaignName: z.string().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type FollowUpBossEmEvent = z.infer<typeof EmEventSchema>;

const EmEventEnvelopeSchema = z
	.object({
		emEvents: z.array(EmEventSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const EmEventsListInputSchema = ListQuerySchema.extend({
	type: z
		.string()
		.optional()
		.describe(
			'Event type: `delivered`, `open`, `click`, `bounced`, `soft-bounce`, `hard-bounce`, `unsubscribe`, `spamreport` or `dropped`.',
		),
	personId: z.number().int().optional(),
	updatedAfter: z
		.string()
		.optional()
		.describe(
			'Only events created or updated after this time, e.g. 2017-01-01T00:00:00Z.',
		),
});

export type EmEventsListInput = z.infer<typeof EmEventsListInputSchema>;

const EmEventsListResponseSchema = EmEventEnvelopeSchema;

export type EmEventsListResponse = z.infer<typeof EmEventsListResponseSchema>;

const EmEventPayloadSchema = z
	.object({
		type: z
			.string()
			.optional()
			.describe(
				'Event type: `delivered`, `open`, `click`, `bounced`, `soft-bounce`, `hard-bounce`, `unsubscribe`, `spamreport` or `dropped`.',
			),
		occurred: z
			.string()
			.optional()
			.describe('Date/time of the event, e.g. 2017-04-09T16:10:59Z.'),
		recipient: z
			.string()
			.optional()
			.describe('Email address of the recipient.'),
		personId: z.number().int().optional().describe('ID of the recipient.'),
		// The published schema types campaignId as a string while its own
		// example sends a number, so both are accepted.
		campaignId: z.union([z.string(), z.number()]).optional(),
		userId: z
			.number()
			.int()
			.optional()
			.describe('Follow Up Boss ID of the user the email was sent from.'),
		url: z.string().optional().describe('URL for the campaign.'),
	})
	.loose();

const EmEventsCreateInputSchema = z.object({
	emEvents: z
		.array(EmEventPayloadSchema)
		.optional()
		.describe('The email marketing events to notify FUB about.'),
});

export type EmEventsCreateInput = z.infer<typeof EmEventsCreateInputSchema>;

// The published example misses the comma between the two keys, so only the
// documented keys are declared and the rest passes through.
const EmEventsCreateResponseSchema = z
	.object({
		emEventIds: z.array(z.number()).nullish(),
		recipientsNotFound: z.array(z.string()).nullish(),
	})
	.loose();

export type EmEventsCreateResponse = z.infer<
	typeof EmEventsCreateResponseSchema
>;

// ── type maps ──────────────────────────────────────────────────────────────

export const MarketingInputSchemas = {
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,
	templatesMerge: TemplatesMergeInputSchema,
	textMessageTemplatesList: TextMessageTemplatesListInputSchema,
	textMessageTemplatesGet: TextMessageTemplatesGetInputSchema,
	textMessageTemplatesCreate: TextMessageTemplatesCreateInputSchema,
	textMessageTemplatesUpdate: TextMessageTemplatesUpdateInputSchema,
	textMessageTemplatesDelete: TextMessageTemplatesDeleteInputSchema,
	textMessageTemplatesMerge: TextMessageTemplatesMergeInputSchema,
	emCampaignsList: EmCampaignsListInputSchema,
	emCampaignsCreate: EmCampaignsCreateInputSchema,
	emCampaignsUpdate: EmCampaignsUpdateInputSchema,
	emEventsList: EmEventsListInputSchema,
	emEventsCreate: EmEventsCreateInputSchema,
} as const;

export const MarketingOutputSchemas = {
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesCreate: TemplatesCreateResponseSchema,
	templatesUpdate: TemplatesUpdateResponseSchema,
	templatesDelete: TemplatesDeleteResponseSchema,
	templatesMerge: TemplatesMergeResponseSchema,
	textMessageTemplatesList: TextMessageTemplatesListResponseSchema,
	textMessageTemplatesGet: TextMessageTemplatesGetResponseSchema,
	textMessageTemplatesCreate: TextMessageTemplatesCreateResponseSchema,
	textMessageTemplatesUpdate: TextMessageTemplatesUpdateResponseSchema,
	textMessageTemplatesDelete: TextMessageTemplatesDeleteResponseSchema,
	textMessageTemplatesMerge: TextMessageTemplatesMergeResponseSchema,
	emCampaignsList: EmCampaignsListResponseSchema,
	emCampaignsCreate: EmCampaignsCreateResponseSchema,
	emCampaignsUpdate: EmCampaignsUpdateResponseSchema,
	emEventsList: EmEventsListResponseSchema,
	emEventsCreate: EmEventsCreateResponseSchema,
} as const;
