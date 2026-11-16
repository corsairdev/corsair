import { z } from 'zod';

// Inputs use Needle's own parameter names. Outputs are `.loose()` and their
// documented nullable fields `.nullish()`, so a field Needle adds or nulls
// cannot fail a call that has already happened.

const UuidSchema = z.string().uuid();

/** A `datetime`-formatted timestamp, as Needle sends it. */
const TimestampSchema = z.string();

/** One word of a note or reason; capped where Needle caps it. */
const NoteSchema = z.string().max(500);

export const NEEDLE_CHANNELS = ['linkedin', 'instagram'] as const;
const ChannelSchema = z.enum(NEEDLE_CHANNELS);

// ── account.me ────────────────────────────────────────────────────────────

const MeInputSchema = z.object({});

export type MeInput = z.input<typeof MeInputSchema>;

const OrganizationSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		imageUrl: z.string().nullish(),
		role: z.string().nullish(),
	})
	.loose();

const MeUserSchema = z
	.object({
		// Output ids are plain strings: a stricter read can only reject a real
		// response, and the provider owns the format.
		id: z.string().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
		imageUrl: z.string().nullish(),
		organization: OrganizationSchema.nullish(),
	})
	.loose();

const MeResponseSchema = z.object({
	user: MeUserSchema,
	requestId: z.string().nullish(),
});

export type MeResponse = z.infer<typeof MeResponseSchema>;

// ── shared lead shapes ────────────────────────────────────────────────────

/**
 * Needle stores one identity per channel. A LinkedIn value may be a public
 * identifier, a `/in/` path, a profile URL or a user id, and Instagram a
 * username, handle or URL; Needle normalises each to the bare identifier.
 */
const IdentityInputSchema = z
	.object({
		linkedin: z
			.string()
			.min(1)
			.optional()
			.describe(
				'LinkedIn public identifier, /in/ path, profile URL or user id. Stored as the identifier.',
			),
		instagram: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Instagram username, @handle or profile URL. Stored without the @.',
			),
	})
	.superRefine((value, ctx) => {
		// Needle needs at least one channel to identify the lead.
		if (!value.linkedin && !value.instagram) {
			ctx.addIssue({
				code: 'custom',
				message: 'At least one of linkedin or instagram is required.',
			});
		}
	});

const LeadFieldsSchema = z.object({
	timezone: z
		.string()
		.optional()
		.describe(
			'IANA time zone used for the sending window, e.g. Europe/London.',
		),
	firstName: z.string().max(256).optional(),
	lastName: z.string().max(256).optional(),
	companyName: z.string().max(256).optional(),
	companyDomain: z.string().max(256).optional(),
	jobTitle: z.string().max(256).optional(),
	email: z.string().max(256).optional(),
	imageUrl: z.string().max(2048).optional(),
	properties: z
		.record(z.string(), z.string())
		.optional()
		.describe('Custom properties, as a name-to-string map.'),
});

export const LeadSchema = z
	.object({
		id: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		companyName: z.string().nullish(),
		companyDomain: z.string().nullish(),
		jobTitle: z.string().nullish(),
		email: z.string().nullish(),
		imageUrl: z.string().nullish(),
		timezone: z.string().nullish(),
		/** Stored identifiers, not the URLs that were sent in. */
		identities: z
			.array(
				z
					.object({
						channel: z.string().nullish(),
						channelIdentity: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		liveEnrollment: z
			.object({
				campaignId: z.string().nullish(),
				status: z.string().nullish(),
				stepId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		properties: z.record(z.string(), z.string()).nullish(),
		createdAt: TimestampSchema.nullish(),
		updatedAt: TimestampSchema.nullish(),
	})
	.loose();

export type NeedleLead = z.infer<typeof LeadSchema>;

// ── leads.create ──────────────────────────────────────────────────────────

const LeadsCreateInputSchema = z.object({
	identities: IdentityInputSchema,
	timezone: LeadFieldsSchema.shape.timezone.unwrap(),
	firstName: LeadFieldsSchema.shape.firstName,
	lastName: LeadFieldsSchema.shape.lastName,
	companyName: LeadFieldsSchema.shape.companyName,
	companyDomain: LeadFieldsSchema.shape.companyDomain,
	jobTitle: LeadFieldsSchema.shape.jobTitle,
	email: LeadFieldsSchema.shape.email,
	imageUrl: LeadFieldsSchema.shape.imageUrl,
	properties: LeadFieldsSchema.shape.properties,
});

export type LeadsCreateInput = z.input<typeof LeadsCreateInputSchema>;

const LeadResponseSchema = z.object({ lead: LeadSchema });

export type LeadsCreateResponse = z.infer<typeof LeadResponseSchema>;

// ── leads.update ──────────────────────────────────────────────────────────

const LeadsUpdateInputSchema = z.object({
	leadId: UuidSchema.describe('The lead to update.'),
	identities: IdentityInputSchema.optional(),
	timezone: LeadFieldsSchema.shape.timezone,
	firstName: LeadFieldsSchema.shape.firstName,
	lastName: LeadFieldsSchema.shape.lastName,
	companyName: LeadFieldsSchema.shape.companyName,
	companyDomain: LeadFieldsSchema.shape.companyDomain,
	jobTitle: LeadFieldsSchema.shape.jobTitle,
	email: LeadFieldsSchema.shape.email,
	imageUrl: LeadFieldsSchema.shape.imageUrl,
	properties: LeadFieldsSchema.shape.properties,
});

export type LeadsUpdateInput = z.input<typeof LeadsUpdateInputSchema>;

export type LeadsUpdateResponse = LeadsCreateResponse;

// ── leads.upsert ──────────────────────────────────────────────────────────

const LeadsUpsertInputSchema = z.object({
	identities: IdentityInputSchema,
	timezone: LeadFieldsSchema.shape.timezone.unwrap(),
	firstName: LeadFieldsSchema.shape.firstName,
	lastName: LeadFieldsSchema.shape.lastName,
	companyName: LeadFieldsSchema.shape.companyName,
	companyDomain: LeadFieldsSchema.shape.companyDomain,
	jobTitle: LeadFieldsSchema.shape.jobTitle,
	email: LeadFieldsSchema.shape.email,
	imageUrl: LeadFieldsSchema.shape.imageUrl,
	properties: LeadFieldsSchema.shape.properties,
});

export type LeadsUpsertInput = z.input<typeof LeadsUpsertInputSchema>;

const LeadsUpsertResponseSchema = z.object({
	status: z
		.string()
		.describe(
			'created for a new lead, matched when an identity already belonged to one and the fields were patched onto it.',
		),
	lead: LeadSchema,
});

export type LeadsUpsertResponse = z.infer<typeof LeadsUpsertResponseSchema>;

// ── leads.list ────────────────────────────────────────────────────────────

const LeadsListInputSchema = z.object({
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe('The nextCursor from a prior page.'),
	limit: z.number().int().min(1).optional(),
});

export type LeadsListInput = z.input<typeof LeadsListInputSchema>;

const LeadsListResponseSchema = z.object({
	leads: z.array(LeadSchema),
	nextCursor: z
		.string()
		.nullish()
		.describe('Pass as `cursor` for the next page; null on the last one.'),
});

export type LeadsListResponse = z.infer<typeof LeadsListResponseSchema>;

// ── leads.get ─────────────────────────────────────────────────────────────

const LeadsGetInputSchema = z.object({ leadId: UuidSchema });

export type LeadsGetInput = z.input<typeof LeadsGetInputSchema>;

export type LeadsGetResponse = LeadsCreateResponse;

// ── leads.remove ──────────────────────────────────────────────────────────

const LeadsRemoveInputSchema = z.object({ leadId: UuidSchema });

export type LeadsRemoveInput = z.input<typeof LeadsRemoveInputSchema>;

const LeadsRemoveResponseSchema = z.object({
	deleted: z.boolean(),
});

export type LeadsRemoveResponse = z.infer<typeof LeadsRemoveResponseSchema>;

// ── leads.search ──────────────────────────────────────────────────────────

export const NEEDLE_FILTER_OPERATORS = [
	'eq',
	'neq',
	'in',
	'not_in',
	'contains',
	'not_contains',
	'starts_with',
	'gt',
	'gte',
	'lt',
	'lte',
	'before',
	'after',
	'on',
	'between',
	'is_set',
	'is_not_set',
] as const;

/**
 * A filter is `field`, `operator` and a value. The operator set applies to any
 * field, but which ones are valid depends on the field's type, so that pairing
 * is left to Needle. `is_set` and `is_not_set` take no value; `in`, `not_in`
 * and `between` take a list.
 */
const LeadFilterSchema = z.object({
	field: z
		.string()
		.min(1)
		.max(300)
		.describe(
			'A built-in field (firstName, lastName, jobTitle, companyName, companyDomain, email, createdAt, updatedAt, createdBy, updatedBy, enrollmentStatus) or a custom one as properties.<key>.',
		),
	operator: z.enum(NEEDLE_FILTER_OPERATORS),
	value: z
		.union([
			z.string().max(1000),
			z.number(),
			z.boolean(),
			z
				.array(z.union([z.string().max(1000), z.number()]))
				.min(1)
				.max(100),
		])
		.optional()
		.describe(
			'Omit for is_set and is_not_set. A list for in, not_in and between. Dates as YYYY-MM-DD in UTC, or an ISO instant on createdAt and updatedAt.',
		),
});

const LeadsSearchInputSchema = z.object({
	query: z
		.string()
		.max(200)
		.optional()
		.describe(
			'Free text. Every word must appear in the name, email, company, domain, job title or a profile handle.',
		),
	filters: z
		.array(LeadFilterSchema)
		.max(20)
		.optional()
		.describe('Every filter must match. Combined with `query` as AND.'),
	cursor: z.string().min(1).optional(),
	limit: z.number().int().min(1).optional(),
});

export type LeadsSearchInput = z.input<typeof LeadsSearchInputSchema>;

export type LeadsSearchResponse = LeadsListResponse;

// ── campaigns.* ───────────────────────────────────────────────────────────

export const NEEDLE_CAMPAIGN_STATUSES = [
	'draft',
	'active',
	'paused',
	'archived',
] as const;

export const CampaignSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		startedAt: TimestampSchema.nullish(),
		pausedAt: TimestampSchema.nullish(),
		archivedAt: TimestampSchema.nullish(),
		enrollmentCount: z.number().nullish(),
		progress: z.number().nullish(),
		createdAt: TimestampSchema.nullish(),
		updatedAt: TimestampSchema.nullish(),
	})
	.loose();

export type NeedleCampaign = z.infer<typeof CampaignSchema>;

const CampaignsListInputSchema = z.object({
	cursor: z.string().min(1).optional(),
	limit: z.number().int().min(1).optional(),
	status: z
		.enum(NEEDLE_CAMPAIGN_STATUSES)
		.optional()
		.describe('Only campaigns in this status.'),
});

export type CampaignsListInput = z.input<typeof CampaignsListInputSchema>;

const CampaignsListResponseSchema = z.object({
	campaigns: z.array(CampaignSchema),
	nextCursor: z.string().nullish(),
});

export type CampaignsListResponse = z.infer<typeof CampaignsListResponseSchema>;

const CampaignsGetInputSchema = z.object({ campaignId: UuidSchema });

export type CampaignsGetInput = z.input<typeof CampaignsGetInputSchema>;

const CampaignResponseSchema = z.object({ campaign: CampaignSchema });

export type CampaignsGetResponse = z.infer<typeof CampaignResponseSchema>;

/**
 * A campaign is a graph of nodes joined by edges. Every node has an id and a
 * kind; an action names its channel and step, and a delay how long it waits.
 * Needle validates the whole graph, so the edges are required and their labels
 * come from a fixed set.
 */
export const NEEDLE_CHANNEL_ACTIONS = [
	'linkedin_invitation',
	'linkedin_cancel_invitation',
	'linkedin_message',
	'linkedin_inmail',
	'linkedin_profile_view',
	'linkedin_search',
	'linkedin_comment',
	'linkedin_reaction',
	'linkedin_post_view',
	'linkedin_company_view',
	'linkedin_job_view',
	'linkedin_conversation_view',
	'linkedin_network_view',
	'linkedin_invitation_list',
	'linkedin_invitation_response',
	'linkedin_search_parameter',
	'linkedin_inmail_balance',
	'linkedin_own_profile',
	'instagram_message',
	'instagram_profile_view',
	'instagram_follow',
	'instagram_unfollow',
	'instagram_comment',
	'instagram_reaction',
	'instagram_post',
	'instagram_post_view',
	'instagram_conversation_view',
	'instagram_network_view',
	'instagram_own_profile',
] as const;

/** A step's message is either fixed text or composed per lead by Needle. */
const StepContentSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('template'),
		text: z.string().min(1),
		subject: z
			.string()
			.min(1)
			.optional()
			.describe('InMail subject, required on linkedin_inmail template steps.'),
	}),
	z.object({
		kind: z.literal('ai'),
		prompt: z.string().min(1),
		context: z
			.array(z.enum(['profile', 'posts', 'conversation', 'lead_properties']))
			.optional()
			.describe('What the composer may read. Defaults to conversation.'),
		maxChars: z.number().int().positive().optional(),
		fallbackText: z
			.string()
			.optional()
			.describe('Sent when generation fails, so the step still completes.'),
		requiresApproval: z.boolean().optional(),
	}),
]);

const NodeIdSchema = z
	.string()
	.min(1)
	.max(64)
	.regex(/^[a-zA-Z0-9_-]+$/, 'Expected letters, digits, _ or -');

const CampaignNodeSchema = z
	.object({
		id: NodeIdSchema,
		kind: z
			.enum(['start', 'end', 'delay', 'action'])
			.describe('Where the node sits in the sequence.'),
		label: z.string().max(120).optional(),
		duration: z
			.object({
				days: z.number().int().min(0).max(90).optional(),
				hours: z.number().int().min(0).max(23).optional(),
				minutes: z.number().int().min(0).max(59).optional(),
			})
			.optional()
			.describe('How long a delay node waits. Required on a delay node.'),
		channel: z
			.enum(['linkedin', 'instagram'])
			.optional()
			.describe('The channel an action node acts on. Required on an action.'),
		connectedAccountId: z
			.string()
			.uuid()
			.optional()
			.describe('The account that sends this step.'),
		action: z
			.enum(NEEDLE_CHANNEL_ACTIONS)
			.optional()
			.describe('The step an action node performs. Required on an action.'),
		content: StepContentSchema.optional().describe(
			'The message a sending step uses.',
		),
	})
	.superRefine((value, ctx) => {
		if (value.kind === 'delay' && !value.duration) {
			ctx.addIssue({
				code: 'custom',
				path: ['duration'],
				message: 'A delay node needs a duration.',
			});
		}
		// Needle rejects an action without a channel and a step name.
		if (value.kind === 'action' && (!value.channel || !value.action)) {
			ctx.addIssue({
				code: 'custom',
				path: ['action'],
				message: 'An action node needs a channel and an action.',
			});
		}
	});

const CampaignEdgeSchema = z.object({
	from: NodeIdSchema,
	to: NodeIdSchema,
	label: z
		.enum(['next', 'yes', 'no', 'on_event', 'on_timeout'])
		.optional()
		.describe('Which outcome this edge follows. Defaults to next.'),
});

const CampaignGraphSchema = z.object({
	nodes: z
		.array(CampaignNodeSchema)
		.min(2)
		.describe('At least a start node and an end node.'),
	edges: z
		.array(CampaignEdgeSchema)
		.describe('How the nodes connect, in order.'),
});

const CampaignsCreateInputSchema = z.object({
	name: z.string().min(1).max(256),
	graph: CampaignGraphSchema,
});

export type CampaignsCreateInput = z.input<typeof CampaignsCreateInputSchema>;

export type CampaignsCreateResponse = CampaignsGetResponse;

const CampaignsUpdateInputSchema = z.object({
	campaignId: UuidSchema,
	name: z.string().min(1).max(256).optional(),
	status: z
		.enum(['active', 'paused'])
		.optional()
		.describe('Set active to start or resume, paused to halt contact.'),
	graph: CampaignGraphSchema.optional(),
});

export type CampaignsUpdateInput = z.input<typeof CampaignsUpdateInputSchema>;

export type CampaignsUpdateResponse = CampaignsGetResponse;

const CampaignsArchiveInputSchema = z.object({ campaignId: UuidSchema });

export type CampaignsArchiveInput = z.input<typeof CampaignsArchiveInputSchema>;

const CampaignsArchiveResponseSchema = z.object({
	archived: z.boolean(),
});

export type CampaignsArchiveResponse = z.infer<
	typeof CampaignsArchiveResponseSchema
>;

const FunnelSchema = z
	.object({
		enrolled: z.number().nullish(),
		skippedByReason: z.record(z.string(), z.number()).nullish(),
		invitesSent: z.number().nullish(),
		invitesAccepted: z.number().nullish(),
		acceptanceRate: z.number().nullish(),
		messagesSent: z.number().nullish(),
		repliedLeads: z.number().nullish(),
		replyRate: z.number().nullish(),
		repliedBySentiment: z.record(z.string(), z.number()).nullish(),
	})
	.loose();

const CampaignsStatsInputSchema = z.object({ campaignId: UuidSchema });

export type CampaignsStatsInput = z.input<typeof CampaignsStatsInputSchema>;

const CampaignsStatsResponseSchema = z.object({
	stats: z
		.object({
			progress: z.number().nullish(),
			funnel: FunnelSchema.nullish(),
		})
		.loose(),
});

export type CampaignsStatsResponse = z.infer<
	typeof CampaignsStatsResponseSchema
>;

const CampaignLeadSchema = z
	.object({
		leadId: z.string().nullish(),
		enrollmentId: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		companyName: z.string().nullish(),
		companyDomain: z.string().nullish(),
		jobTitle: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

const CampaignsLeadsInputSchema = z.object({
	campaignId: UuidSchema,
	cursor: z.string().min(1).optional(),
	limit: z.number().int().min(1).optional(),
});

export type CampaignsLeadsInput = z.input<typeof CampaignsLeadsInputSchema>;

const CampaignsLeadsResponseSchema = z.object({
	leads: z.array(CampaignLeadSchema),
	nextCursor: z.string().nullish(),
});

export type CampaignsLeadsResponse = z.infer<
	typeof CampaignsLeadsResponseSchema
>;

/**
 * Enrollment reports one result per lead, so a batch can partly succeed. A
 * rejected entry carries the reason instead of an enrollment id.
 */
const EnrollmentResultSchema = z
	.object({
		index: z.number().nullish(),
		status: z.string().nullish(),
		leadId: z.string().nullish(),
		enrollmentId: z.string().nullish(),
		reason: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

const BulkResultResponseSchema = z.object({
	results: z.array(EnrollmentResultSchema),
});

export type BulkResultResponse = z.infer<typeof BulkResultResponseSchema>;

const CampaignsEnrollInputSchema = z.object({
	campaignId: UuidSchema,
	leadIds: z
		.array(UuidSchema)
		.min(1)
		.max(500)
		.describe('Leads to enroll, by id. Create them first.'),
});

export type CampaignsEnrollInput = z.input<typeof CampaignsEnrollInputSchema>;

export type CampaignsEnrollResponse = BulkResultResponse;

const CampaignsStopLeadsInputSchema = z.object({
	campaignId: UuidSchema,
	leadIds: z.array(UuidSchema).min(1).max(500),
});

export type CampaignsStopLeadsInput = z.input<
	typeof CampaignsStopLeadsInputSchema
>;

export type CampaignsStopLeadsResponse = BulkResultResponse;

// ── suppressions.* ────────────────────────────────────────────────────────

export const NEEDLE_SUPPRESSION_REASONS = [
	'manual',
	'unsubscribed',
	'not_interested',
	'existing_customer',
	'open_opportunity',
	'competitor',
	'employee',
	'invalid_recipient',
	'complained',
	'recently_contacted',
	'unresponsive',
] as const;

const SuppressionReasonSchema = z.enum(NEEDLE_SUPPRESSION_REASONS);

const SuppressionSchema = z
	.object({
		id: z.string().nullish(),
		scope: z.string().nullish(),
		leadId: z.string().nullish(),
		companyDomain: z.string().nullish(),
		reason: z.string().nullish(),
		note: z.string().nullish(),
		expiresAt: TimestampSchema.nullish(),
		createdAt: TimestampSchema.nullish(),
	})
	.loose();

/* A suppression entry is either a lead or a company, told apart by `scope`. */
const SuppressionEntrySchema = z.discriminatedUnion('scope', [
	z.object({
		scope: z.literal('lead'),
		leadId: UuidSchema,
		reason: SuppressionReasonSchema,
		note: NoteSchema.optional(),
		expiresAt: z.string().datetime().nullish(),
	}),
	z.object({
		scope: z.literal('company'),
		companyDomain: z.string().min(1),
		reason: SuppressionReasonSchema,
		note: NoteSchema.optional(),
		expiresAt: z.string().datetime().nullish(),
	}),
]);

const SuppressionsListInputSchema = z.object({
	cursor: z.string().min(1).optional(),
	limit: z.number().int().min(1).optional(),
	reason: SuppressionReasonSchema.optional(),
});

export type SuppressionsListInput = z.input<typeof SuppressionsListInputSchema>;

const SuppressionsListResponseSchema = z.object({
	suppressions: z.array(SuppressionSchema),
	nextCursor: z.string().nullish(),
});

export type SuppressionsListResponse = z.infer<
	typeof SuppressionsListResponseSchema
>;

const SuppressionsCreateInputSchema = z.object({
	entries: z.array(SuppressionEntrySchema).min(1).max(1000),
});

export type SuppressionsCreateInput = z.input<
	typeof SuppressionsCreateInputSchema
>;

const SuppressionsCreateResponseSchema = z.object({
	created: z.number(),
	alreadyListed: z.number(),
});

export type SuppressionsCreateResponse = z.infer<
	typeof SuppressionsCreateResponseSchema
>;

const SuppressionRemoveInputSchema = z.object({
	suppressionId: UuidSchema.describe('The suppression entry to delete.'),
});

export type SuppressionRemoveInput = z.input<
	typeof SuppressionRemoveInputSchema
>;

const SuppressionRemoveResponseSchema = z.object({
	deleted: z.boolean(),
});

export type SuppressionRemoveResponse = z.infer<
	typeof SuppressionRemoveResponseSchema
>;

const SuppressionCheckInputSchema = z.object({
	identities: z
		.array(
			z.object({
				channel: ChannelSchema,
				identity: z.string().min(1).max(512),
			}),
		)
		.min(1)
		.max(1000),
});

export type SuppressionCheckInput = z.input<typeof SuppressionCheckInputSchema>;

/**
 * A decision is one of two shapes, told apart by `contactable`. A false one
 * names the reason and, when the entry came from the suppression list, the
 * entry's source.
 */
const SuppressionDecisionSchema = z
	.object({
		contactable: z.boolean(),
		reason: z.string().nullish(),
		source: z.string().nullish(),
	})
	.loose();

const SuppressionCheckResponseSchema = z.object({
	results: z.array(
		z
			.object({
				channel: z.string().nullish(),
				identity: z.string().nullish(),
				decision: SuppressionDecisionSchema.nullish(),
			})
			.loose(),
	),
});

export type SuppressionCheckResponse = z.infer<
	typeof SuppressionCheckResponseSchema
>;

// ── places.search ─────────────────────────────────────────────────────────

const PlacesSearchInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.max(1024)
			.optional()
			.describe('Free text such as "dentists in Munich".'),
		location: z
			.object({
				latitude: z.number().min(-90).max(90),
				longitude: z.number().min(-180).max(180),
			})
			.optional()
			.describe('Centre point for a nearby search.'),
		radiusMeters: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).optional(),
	})
	.superRefine((value, ctx) => {
		// Needle needs one of the two; a request with neither answers 422.
		if (!value.query && !value.location) {
			ctx.addIssue({
				code: 'custom',
				message: 'Either query or location is required.',
			});
		}
	});

export type PlacesSearchInput = z.input<typeof PlacesSearchInputSchema>;

const PlaceSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		formattedAddress: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		country: z.string().nullish(),
		postalCode: z.string().nullish(),
		location: z
			.object({
				latitude: z.number().nullish(),
				longitude: z.number().nullish(),
			})
			.loose()
			.nullish(),
		googleMapsUrl: z.string().nullish(),
		websiteUrl: z.string().nullish(),
	})
	.loose();

export type NeedlePlace = z.infer<typeof PlaceSchema>;

const PlacesSearchResponseSchema = z.object({
	hits: z.array(PlaceSchema),
});

export type PlacesSearchResponse = z.infer<typeof PlacesSearchResponseSchema>;

// ── compose.preview ───────────────────────────────────────────────────────

const ComposeInputSchema = z.object({
	channel: ChannelSchema,
	connectedAccountId: UuidSchema.describe(
		'The connected account the message would be sent from.',
	),
	leadId: UuidSchema.optional(),
	instructions: z.string().optional(),
	context: z
		.object({
			notes: z.string().optional(),
			offer: z.string().optional(),
		})
		.loose()
		.optional()
		.describe('Extra hints for the composer, such as the offer to mention.'),
});

export type ComposeInput = z.input<typeof ComposeInputSchema>;

const ComposedContextSchema = z
	.object({
		source: z.string().nullish(),
		cached: z.boolean().nullish(),
	})
	.loose();

const ComposeResponseSchema = z.object({
	text: z.string(),
	meta: z
		.object({ contextUsed: z.array(ComposedContextSchema).nullish() })
		.loose()
		.nullish(),
});

export type ComposeResponse = z.infer<typeof ComposeResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type NeedleEndpointInputs = {
	accountMe: MeInput;
	leadsCreate: LeadsCreateInput;
	leadsUpdate: LeadsUpdateInput;
	leadsUpsert: LeadsUpsertInput;
	leadsList: LeadsListInput;
	leadsGet: LeadsGetInput;
	leadsRemove: LeadsRemoveInput;
	leadsSearch: LeadsSearchInput;
	campaignsList: CampaignsListInput;
	campaignsCreate: CampaignsCreateInput;
	campaignsGet: CampaignsGetInput;
	campaignsUpdate: CampaignsUpdateInput;
	campaignsArchive: CampaignsArchiveInput;
	campaignsStats: CampaignsStatsInput;
	campaignsLeads: CampaignsLeadsInput;
	campaignsEnroll: CampaignsEnrollInput;
	campaignsStopLeads: CampaignsStopLeadsInput;
	suppressionsList: SuppressionsListInput;
	suppressionsCreate: SuppressionsCreateInput;
	suppressionRemove: SuppressionRemoveInput;
	suppressionCheck: SuppressionCheckInput;
	placesSearch: PlacesSearchInput;
	composePreview: ComposeInput;
};

export type NeedleEndpointOutputs = {
	accountMe: MeResponse;
	leadsCreate: LeadsCreateResponse;
	leadsUpdate: LeadsUpdateResponse;
	leadsUpsert: LeadsUpsertResponse;
	leadsList: LeadsListResponse;
	leadsGet: LeadsGetResponse;
	leadsRemove: LeadsRemoveResponse;
	leadsSearch: LeadsSearchResponse;
	campaignsList: CampaignsListResponse;
	campaignsCreate: CampaignsCreateResponse;
	campaignsGet: CampaignsGetResponse;
	campaignsUpdate: CampaignsUpdateResponse;
	campaignsArchive: CampaignsArchiveResponse;
	campaignsStats: CampaignsStatsResponse;
	campaignsLeads: CampaignsLeadsResponse;
	campaignsEnroll: CampaignsEnrollResponse;
	campaignsStopLeads: CampaignsStopLeadsResponse;
	suppressionsList: SuppressionsListResponse;
	suppressionsCreate: SuppressionsCreateResponse;
	suppressionRemove: SuppressionRemoveResponse;
	suppressionCheck: SuppressionCheckResponse;
	placesSearch: PlacesSearchResponse;
	composePreview: ComposeResponse;
};

export const NeedleEndpointInputSchemas = {
	accountMe: MeInputSchema,
	leadsCreate: LeadsCreateInputSchema,
	leadsUpdate: LeadsUpdateInputSchema,
	leadsUpsert: LeadsUpsertInputSchema,
	leadsList: LeadsListInputSchema,
	leadsGet: LeadsGetInputSchema,
	leadsRemove: LeadsRemoveInputSchema,
	leadsSearch: LeadsSearchInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsCreate: CampaignsCreateInputSchema,
	campaignsGet: CampaignsGetInputSchema,
	campaignsUpdate: CampaignsUpdateInputSchema,
	campaignsArchive: CampaignsArchiveInputSchema,
	campaignsStats: CampaignsStatsInputSchema,
	campaignsLeads: CampaignsLeadsInputSchema,
	campaignsEnroll: CampaignsEnrollInputSchema,
	campaignsStopLeads: CampaignsStopLeadsInputSchema,
	suppressionsList: SuppressionsListInputSchema,
	suppressionsCreate: SuppressionsCreateInputSchema,
	suppressionRemove: SuppressionRemoveInputSchema,
	suppressionCheck: SuppressionCheckInputSchema,
	placesSearch: PlacesSearchInputSchema,
	composePreview: ComposeInputSchema,
} as const;

export const NeedleEndpointOutputSchemas = {
	accountMe: MeResponseSchema,
	leadsCreate: LeadResponseSchema,
	leadsUpdate: LeadResponseSchema,
	leadsUpsert: LeadsUpsertResponseSchema,
	leadsList: LeadsListResponseSchema,
	leadsGet: LeadResponseSchema,
	leadsRemove: LeadsRemoveResponseSchema,
	leadsSearch: LeadsListResponseSchema,
	campaignsList: CampaignsListResponseSchema,
	campaignsCreate: CampaignResponseSchema,
	campaignsGet: CampaignResponseSchema,
	campaignsUpdate: CampaignResponseSchema,
	campaignsArchive: CampaignsArchiveResponseSchema,
	campaignsStats: CampaignsStatsResponseSchema,
	campaignsLeads: CampaignsLeadsResponseSchema,
	campaignsEnroll: BulkResultResponseSchema,
	campaignsStopLeads: BulkResultResponseSchema,
	suppressionsList: SuppressionsListResponseSchema,
	suppressionsCreate: SuppressionsCreateResponseSchema,
	suppressionRemove: SuppressionRemoveResponseSchema,
	suppressionCheck: SuppressionCheckResponseSchema,
	placesSearch: PlacesSearchResponseSchema,
	composePreview: ComposeResponseSchema,
} as const;
