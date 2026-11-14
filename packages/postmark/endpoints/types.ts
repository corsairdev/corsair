import { z } from 'zod';

// Postmark is a transactional email API. Every route here needs the server
// token, so one credential covers the whole plugin. Outputs are `.loose()` with
// documented fields nullish, so a field Postmark adds or omits cannot fail a
// call that has already happened.
// Reference: https://postmarkapp.com/developer/api/overview

/**
 * Any JSON value. `Metadata` on a send is an open key-value map and a template's
 * `TemplateModel` is arbitrary, so both are described exactly rather than left
 * untyped.
 */
export type PostmarkJsonValue =
	| string
	| number
	| boolean
	| null
	| PostmarkJsonValue[]
	| { [key: string]: PostmarkJsonValue };

export const PostmarkJsonValueSchema: z.ZodType<PostmarkJsonValue> = z.lazy(
	() =>
		z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.null(),
			z.array(PostmarkJsonValueSchema),
			z.record(z.string(), PostmarkJsonValueSchema),
		]),
);

/** The two ways Postmark can track links in a message. */
export const POSTMARK_TRACK_LINKS = [
	'None',
	'HtmlAndText',
	'HtmlOnly',
	'TextOnly',
] as const;

/** The two template kinds. */
export const POSTMARK_TEMPLATE_TYPES = ['Standard', 'Layout'] as const;

/** The server colour options Postmark documents. */
export const POSTMARK_SERVER_COLORS = [
	'Purple',
	'Blue',
	'Turquoise',
	'Green',
	'Red',
	'Yellow',
	'Grey',
	'Orange',
] as const;

/** A message stream's kind. */
export const POSTMARK_STREAM_TYPES = ['inbound', 'outbound'] as const;

const EmailListSchema = z
	.string()
	.min(1)
	.describe(
		'Comma-separated addresses. `To`, `Cc` and `Bcc` together allow 50, and each address is at most 254 characters.',
	);

// ── sending ───────────────────────────────────────────────────────────────

export const PostmarkHeaderSchema = z.object({
	Name: z.string().min(1),
	Value: z.string(),
});

export type PostmarkHeader = z.infer<typeof PostmarkHeaderSchema>;

export const PostmarkAttachmentSchema = z.object({
	Name: z.string().min(1).describe('The file name, with its extension.'),
	Content: z.string().min(1).describe('The file contents, base64 encoded.'),
	ContentType: z
		.string()
		.min(1)
		.describe('The MIME type, such as `text/plain`.'),
	ContentID: z
		.string()
		.min(1)
		.optional()
		.describe('Set it to reference the file as `cid:` from the HTML body.'),
});

export type PostmarkAttachment = z.infer<typeof PostmarkAttachmentSchema>;

const messageFields = {
	From: z
		.string()
		.min(1)
		.describe(
			'The sender. The address needs a confirmed Sender Signature or a verified domain.',
		),
	To: EmailListSchema,
	Cc: EmailListSchema.optional(),
	Bcc: EmailListSchema.optional(),
	Subject: z.string().optional().describe('Max 2000 characters.'),
	Tag: z
		.string()
		.max(1000)
		.optional()
		.describe('Categorises the message for statistics.'),
	HtmlBody: z.string().min(1).optional(),
	TextBody: z.string().min(1).optional(),
	ReplyTo: EmailListSchema.optional(),
	Headers: z
		.array(PostmarkHeaderSchema)
		.optional()
		.describe('Custom headers to include.'),
	TrackOpens: z.boolean().optional(),
	TrackLinks: z
		.enum(POSTMARK_TRACK_LINKS)
		.optional()
		.describe('Which bodies get their links rewritten for tracking.'),
	Attachments: z.array(PostmarkAttachmentSchema).optional(),
	// unknown: `Metadata` is the caller's own key-value data.
	Metadata: z.record(z.string(), z.string()).optional(),
	MessageStream: z
		.string()
		.min(1)
		.optional()
		.describe('Defaults to the `outbound` transactional stream.'),
};

const requiresBody = (
	value: { HtmlBody?: string; TextBody?: string },
	ctx: z.RefinementCtx,
) => {
	if (value.HtmlBody === undefined && value.TextBody === undefined) {
		ctx.addIssue({
			code: 'custom',
			message: 'Supply HtmlBody, TextBody, or both.',
			path: ['HtmlBody'],
		});
	}
};

export const EmailSendInputSchema = z
	.object(messageFields)
	.superRefine(requiresBody);

export type EmailSendInput = z.infer<typeof EmailSendInputSchema>;

export const EmailBatchSendInputSchema = z.object({
	Messages: z
		.array(z.object(messageFields).superRefine(requiresBody))
		.min(1)
		.max(500)
		.describe('Up to 500 messages, which is the API limit per request.'),
});

export type EmailBatchSendInput = z.infer<typeof EmailBatchSendInputSchema>;

/**
 * A send result. `ErrorCode` is `0` on success, and a batch response carries one
 * of these per message inside an HTTP 200, so a caller must read the codes.
 */
export const SendResultSchema = z
	.object({
		To: z.string().nullish(),
		SubmittedAt: z.string().nullish(),
		MessageID: z.string().nullish(),
		ErrorCode: z
			.number()
			.nullish()
			.describe('`0` on success; any other value is a per-message failure.'),
		Message: z.string().nullish(),
	})
	.loose();

export type PostmarkSendResult = z.infer<typeof SendResultSchema>;

/** One message's result, which the single-send route answers directly. */
const SendOutputSchema = z
	.object({ message: SendResultSchema })
	.describe('The message this call sent.');

export type SendOutput = z.infer<typeof SendOutputSchema>;

/** A batch send answers a bare array of per-message results. */
const BatchSendOutputSchema = z.object({
	results: z.array(SendResultSchema),
});

export type BatchSendOutput = z.infer<typeof BatchSendOutputSchema>;

// ── templates ─────────────────────────────────────────────────────────────

export const TemplateSchema = z
	.object({
		TemplateId: z.number().nullish(),
		Name: z.string().nullish(),
		Subject: z.string().nullish(),
		HtmlBody: z.string().nullish(),
		TextBody: z.string().nullish(),
		AssociatedServerId: z.number().nullish(),
		Active: z.boolean().nullish(),
		Alias: z.string().nullish(),
		TemplateType: z.string().nullish().describe('`Standard` or `Layout`.'),
		LayoutTemplate: z
			.string()
			.nullish()
			.describe('The layout alias a standard template uses, if any.'),
	})
	.loose();

export type PostmarkTemplate = z.infer<typeof TemplateSchema>;

const TemplatesListInputSchema = z.object({
	Count: z
		.number()
		.int()
		.min(1)
		.max(500)
		.optional()
		.describe('How many templates to return, at most 500.'),
	Offset: z.number().int().min(0).optional().describe('How many to skip.'),
	TemplateType: z
		.enum(POSTMARK_TEMPLATE_TYPES)
		.optional()
		.describe('Only templates of this kind.'),
});

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

const TemplatesListOutputSchema = z.object({
	TotalCount: z.number(),
	Templates: z.array(TemplateSchema),
});

export type TemplatesListOutput = z.infer<typeof TemplatesListOutputSchema>;

const TemplatesGetInputSchema = z.object({
	idOrAlias: z
		.string()
		.min(1)
		.describe('The numeric template id or its alias.'),
});

export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;

const templateFields = {
	Name: z.string().min(1),
	Subject: z.string().optional(),
	HtmlBody: z.string().min(1).optional(),
	TextBody: z.string().min(1).optional(),
	Alias: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Your own identifier: letters, digits, and `.`, `-`, `_`, starting with a letter.',
		),
	TemplateType: z.enum(POSTMARK_TEMPLATE_TYPES).optional(),
	LayoutTemplate: z
		.string()
		.min(1)
		.optional()
		.describe('The layout alias a standard template should use.'),
};

export const TemplatesCreateInputSchema = z
	.object(templateFields)
	.superRefine((value, ctx) => {
		// A template with no body has nothing to render.
		if (value.HtmlBody === undefined && value.TextBody === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply HtmlBody or TextBody.',
				path: ['HtmlBody'],
			});
		}
	});

export type TemplatesCreateInput = z.infer<typeof TemplatesCreateInputSchema>;

export const TemplatesUpdateInputSchema = z
	.object({
		idOrAlias: z
			.string()
			.min(1)
			.describe('The numeric template id or its alias.'),
		// A partial update: every field is optional, so changing only the subject
		// does not have to send the name the create route requires.
		Name: z.string().min(1).optional(),
		Subject: z.string().optional(),
		HtmlBody: z.string().min(1).optional(),
		TextBody: z.string().min(1).optional(),
		Alias: z.string().min(1).optional(),
		TemplateType: z.enum(POSTMARK_TEMPLATE_TYPES).optional(),
		LayoutTemplate: z.string().min(1).optional(),
	})
	.superRefine((value, ctx) => {
		const { idOrAlias: _ignored, ...changes } = value;
		if (Object.values(changes).every((field) => field === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply at least one field to change.',
				path: ['idOrAlias'],
			});
		}
	});

export type TemplatesUpdateInput = z.infer<typeof TemplatesUpdateInputSchema>;

const TemplatesDeleteInputSchema = z.object({
	idOrAlias: z
		.string()
		.min(1)
		.describe('The numeric template id or its alias.'),
});

export type TemplatesDeleteInput = z.infer<typeof TemplatesDeleteInputSchema>;

/** One rendered part of a template validation, either body or the subject. */
const ValidatedPartSchema = z
	.object({
		ContentIsValid: z.boolean().nullish(),
		// unknown: each entry is a message string or a structured error the API
		// formats per case, so the list passes through rather than pinning a shape.
		RenderErrors: z.array(PostmarkJsonValueSchema).nullish(),
		ValidationErrors: z.array(PostmarkJsonValueSchema).nullish(),
	})
	.loose();

const ValidatedTemplateOutputSchema = z
	.object({
		AllContentIsValid: z
			.boolean()
			.describe('True when both bodies and the subject rendered correctly.'),
		HtmlBody: ValidatedPartSchema.nullish(),
		TextBody: ValidatedPartSchema.nullish(),
		Subject: ValidatedPartSchema.nullish(),
	})
	.loose();

export type TemplatesValidateOutput = z.infer<
	typeof ValidatedTemplateOutputSchema
>;

const TemplatesValidateInputSchema = z.object({
	Subject: z.string().optional(),
	HtmlBody: z.string().min(1).optional(),
	TextBody: z.string().min(1).optional(),
	// unknown: `TemplateModel` is arbitrary data the template renders against.
	TemplateModel: z.record(z.string(), PostmarkJsonValueSchema).optional(),
});

export type TemplatesValidateInput = z.infer<
	typeof TemplatesValidateInputSchema
>;

// ── server ────────────────────────────────────────────────────────────────

export const ServerSchema = z
	.object({
		ID: z.number().nullish(),
		Name: z.string().nullish(),
		Color: z.string().nullish(),
		SmtpApiActivated: z.boolean().nullish(),
		RawEmailEnabled: z.boolean().nullish(),
		DeliveryType: z
			.string()
			.nullish()
			.describe('`Live` or `Sandbox`. It cannot change after creation.'),
		ServerLink: z.string().nullish(),
		InboundAddress: z.string().nullish(),
		InboundHookUrl: z.string().nullish(),
		BounceHookUrl: z.string().nullish(),
		OpenHookUrl: z.string().nullish(),
		DeliveryHookUrl: z.string().nullish(),
		PostFirstOpenOnly: z.boolean().nullish(),
		InboundDomain: z.string().nullish(),
		InboundHash: z.string().nullish(),
		InboundSpamThreshold: z.number().nullish(),
		TrackOpens: z.boolean().nullish(),
		TrackLinks: z.string().nullish(),
		ApiTokens: z.array(z.string()).nullish(),
	})
	.loose();

export type PostmarkServer = z.infer<typeof ServerSchema>;

const ServerGetInputSchema = z.object({});

export type ServerGetInput = z.infer<typeof ServerGetInputSchema>;

const ServerUpdateInputSchema = z
	.object({
		Name: z.string().min(1).optional(),
		Color: z.enum(POSTMARK_SERVER_COLORS).optional(),
		SmtpApiActivated: z.boolean().optional(),
		RawEmailEnabled: z.boolean().optional(),
		TrackOpens: z.boolean().optional(),
		TrackLinks: z.enum(POSTMARK_TRACK_LINKS).optional(),
		InboundHookUrl: z.string().min(1).optional(),
		BounceHookUrl: z.string().min(1).optional(),
		OpenHookUrl: z.string().min(1).optional(),
		DeliveryHookUrl: z.string().min(1).optional(),
		PostFirstOpenOnly: z.boolean().optional(),
		InboundDomain: z.string().min(1).optional(),
		InboundSpamThreshold: z
			.number()
			.int()
			.min(0)
			.max(30)
			.optional()
			.describe('A spam threshold between 0 and 30.'),
	})
	.superRefine((value, ctx) => {
		if (Object.values(value).every((field) => field === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply at least one field to change.',
				path: ['Name'],
			});
		}
	});

export type ServerUpdateInput = z.infer<typeof ServerUpdateInputSchema>;

// ── message streams ───────────────────────────────────────────────────────

export const MessageStreamSchema = z
	.object({
		ID: z.string().nullish(),
		Name: z.string().nullish(),
		Description: z.string().nullish(),
		MessageStreamType: z
			.string()
			.nullish()
			.describe('`Transactional`, `Inbound` or `Broadcast`.'),
		CreatedAt: z.string().nullish(),
		UpdatedAt: z.string().nullish(),
		ArchivedAt: z.string().nullish(),
		ExpectedPurgeDate: z.string().nullish(),
		SubscriptionManagementConfiguration: z.object({}).loose().nullish(),
	})
	.loose();

export type PostmarkMessageStream = z.infer<typeof MessageStreamSchema>;

const StreamsListInputSchema = z.object({
	MessageStreamType: z
		.enum(['Transactional', 'Inbound', 'Broadcast'])
		.optional()
		.describe('Only streams of this kind.'),
	IncludeArchivedStreams: z
		.boolean()
		.optional()
		.describe('Include archived streams. Defaults to false.'),
});

export type StreamsListInput = z.infer<typeof StreamsListInputSchema>;

const StreamsListOutputSchema = z.object({
	MessageStreams: z.array(MessageStreamSchema),
});

export type StreamsListOutput = z.infer<typeof StreamsListOutputSchema>;

const StreamsGetInputSchema = z.object({
	id: z.string().min(1).describe('The stream id, such as `outbound`.'),
});

export type StreamsGetInput = z.infer<typeof StreamsGetInputSchema>;

const StreamsArchiveInputSchema = z.object({
	id: z.string().min(1).describe('The stream id to archive.'),
});

export type StreamsArchiveInput = z.infer<typeof StreamsArchiveInputSchema>;

const StreamActionOutputSchema = z.object({
	Message: z.string().nullish(),
});

export type StreamsActionOutput = z.infer<typeof StreamActionOutputSchema>;

// ── bounces ───────────────────────────────────────────────────────────────

export const BounceSchema = z
	.object({
		ID: z.number().nullish(),
		Type: z
			.string()
			.nullish()
			.describe('The bounce type, such as `HardBounce`.'),
		TypeCode: z.number().nullish(),
		Name: z.string().nullish(),
		Tag: z.string().nullish(),
		MessageID: z.string().nullish(),
		Description: z.string().nullish(),
		Details: z.string().nullish(),
		Email: z.string().nullish(),
		BouncedAt: z.string().nullish(),
		DumpAvailable: z.boolean().nullish(),
		Inactive: z.boolean().nullish(),
		CanActivate: z.boolean().nullish(),
		Subject: z.string().nullish(),
		ServerID: z.number().nullish(),
		MessageStream: z.string().nullish(),
	})
	.loose();

export type PostmarkBounce = z.infer<typeof BounceSchema>;

const BouncesListInputSchema = z.object({
	Count: z
		.number()
		.int()
		.min(1)
		.max(500)
		.optional()
		.describe('How many bounces to return, at most 500.'),
	Offset: z.number().int().min(0).optional().describe('How many to skip.'),
	Type: z
		.string()
		.min(1)
		.optional()
		.describe('Only this bounce type, such as `HardBounce`.'),
	Inactive: z.boolean().optional(),
	EmailFilter: z.string().min(1).optional().describe('Only this address.'),
	Tag: z.string().min(1).optional().describe('Only bounces carrying this tag.'),
	MessageID: z
		.string()
		.min(1)
		.optional()
		.describe('Only the bounce for this message.'),
	FromDate: z
		.string()
		.min(1)
		.optional()
		.describe('Inclusive start, as YYYY-MM-DD.'),
	ToDate: z
		.string()
		.min(1)
		.optional()
		.describe('Inclusive end, as YYYY-MM-DD.'),
	MessageStream: z.string().min(1).optional().describe('Only this stream.'),
});

export type BouncesListInput = z.infer<typeof BouncesListInputSchema>;

const BouncesListOutputSchema = z.object({
	TotalCount: z.number(),
	Bounces: z.array(BounceSchema),
});

export type BouncesListOutput = z.infer<typeof BouncesListOutputSchema>;

const BouncesGetInputSchema = z.object({
	id: z.number().int().positive().describe('The numeric bounce id.'),
});

export type BouncesGetInput = z.infer<typeof BouncesGetInputSchema>;

const BouncesActivateInputSchema = z.object({
	id: z
		.number()
		.int()
		.positive()
		.describe('The bounce id whose address should be reactivated.'),
});

export type BouncesActivateInput = z.infer<typeof BouncesActivateInputSchema>;

const BounceActivatedOutputSchema = z.object({
	Message: z.string().nullish(),
	Bounce: BounceSchema.nullish(),
});

export type BounceActivatedOutput = z.infer<typeof BounceActivatedOutputSchema>;

const DeliveryStatsInputSchema = z.object({});

export type DeliveryStatsInput = z.infer<typeof DeliveryStatsInputSchema>;

const DeliveryStatsOutputSchema = z.object({
	// The API names this list `InactiveMails` in its example and `InactiveMails`
	// in the field table, so both spellings are kept as one optional list.
	InactiveMails: z.number().nullish(),
	Bounces: z
		.array(
			z
				.object({
					Type: z.string().nullish(),
					Name: z.string().nullish(),
					Count: z.number().nullish(),
				})
				.loose(),
		)
		.nullish(),
});

export type DeliveryStatsOutput = z.infer<typeof DeliveryStatsOutputSchema>;

// ── stats ─────────────────────────────────────────────────────────────────

const statsQueryFields = {
	Tag: z.string().min(1).optional().describe('Only messages with this tag.'),
	FromDate: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Inclusive start, as YYYY-MM-DD. It cannot be older than a year.',
		),
	ToDate: z
		.string()
		.min(1)
		.optional()
		.describe('Inclusive end, as YYYY-MM-DD.'),
	MessageStream: z.string().min(1).optional().describe('Only this stream.'),
};

const StatsOverviewInputSchema = z.object(statsQueryFields);

export type StatsOverviewInput = z.infer<typeof StatsOverviewInputSchema>;

const StatsOverviewOutputSchema = z
	.object({
		Inbound: z.number().nullish(),
		Outbound: z.number().nullish(),
		Transatlantic: z.number().nullish(),
		Tracked: z.number().nullish(),
		Opens: z.number().nullish(),
		UniqueOpens: z.number().nullish(),
		OpenRate: z.number().nullish(),
		Clicks: z.number().nullish(),
		UniqueLinksClicked: z.number().nullish(),
		ClickRate: z.number().nullish(),
		UniqueClicks: z.number().nullish(),
		Bounces: z.number().nullish(),
		BounceRate: z.number().nullish(),
		SpamComplaints: z.number().nullish(),
		SpamComplaintsRate: z.number().nullish(),
	})
	.loose();

export type StatsOverviewOutput = z.infer<typeof StatsOverviewOutputSchema>;

const StatsSendsInputSchema = z.object(statsQueryFields);

export type StatsSendsInput = z.infer<typeof StatsSendsInputSchema>;

const StatsSendsOutputSchema = z.object({
	Days: z.array(
		z
			.object({
				Date: z.string().nullish(),
				Sent: z.number().nullish(),
			})
			.loose(),
	),
});

export type StatsSendsOutput = z.infer<typeof StatsSendsOutputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type PostmarkEndpointInputs = {
	emailSend: EmailSendInput;
	emailSendBatch: EmailBatchSendInput;
	templatesList: TemplatesListInput;
	templatesGet: TemplatesGetInput;
	templatesCreate: TemplatesCreateInput;
	templatesUpdate: TemplatesUpdateInput;
	templatesDelete: TemplatesDeleteInput;
	templatesValidate: TemplatesValidateInput;
	serverGet: ServerGetInput;
	serverUpdate: ServerUpdateInput;
	streamsList: StreamsListInput;
	streamsGet: StreamsGetInput;
	streamsArchive: StreamsArchiveInput;
	bouncesList: BouncesListInput;
	bouncesGet: BouncesGetInput;
	bouncesActivate: BouncesActivateInput;
	statsDelivery: DeliveryStatsInput;
	statsOverview: StatsOverviewInput;
	statsSends: StatsSendsInput;
};

export type PostmarkEndpointOutputs = {
	emailSend: SendOutput;
	emailSendBatch: BatchSendOutput;
	templatesList: TemplatesListOutput;
	templatesGet: PostmarkTemplate;
	templatesCreate: PostmarkTemplate;
	templatesUpdate: PostmarkTemplate;
	templatesDelete: StreamsActionOutput;
	templatesValidate: TemplatesValidateOutput;
	serverGet: PostmarkServer;
	serverUpdate: PostmarkServer;
	streamsList: StreamsListOutput;
	streamsGet: PostmarkMessageStream;
	streamsArchive: StreamsActionOutput;
	bouncesList: BouncesListOutput;
	bouncesGet: PostmarkBounce;
	bouncesActivate: BounceActivatedOutput;
	statsDelivery: DeliveryStatsOutput;
	statsOverview: StatsOverviewOutput;
	statsSends: StatsSendsOutput;
};

export const PostmarkEndpointInputSchemas = {
	emailSend: EmailSendInputSchema,
	emailSendBatch: EmailBatchSendInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,
	templatesValidate: TemplatesValidateInputSchema,
	serverGet: ServerGetInputSchema,
	serverUpdate: ServerUpdateInputSchema,
	streamsList: StreamsListInputSchema,
	streamsGet: StreamsGetInputSchema,
	streamsArchive: StreamsArchiveInputSchema,
	bouncesList: BouncesListInputSchema,
	bouncesGet: BouncesGetInputSchema,
	bouncesActivate: BouncesActivateInputSchema,
	statsDelivery: DeliveryStatsInputSchema,
	statsOverview: StatsOverviewInputSchema,
	statsSends: StatsSendsInputSchema,
} as const;

export const PostmarkEndpointOutputSchemas = {
	// The single send wraps its result under `message`, since the route answers a
	// bare object and a caller reads one identified message from it.
	emailSend: SendOutputSchema,
	// A batch send answers a bare array of per-message results.
	emailSendBatch: BatchSendOutputSchema,
	templatesList: TemplatesListOutputSchema,
	templatesGet: TemplateSchema,
	templatesCreate: TemplateSchema,
	templatesUpdate: TemplateSchema,
	templatesDelete: StreamActionOutputSchema,
	templatesValidate: ValidatedTemplateOutputSchema,
	serverGet: ServerSchema,
	serverUpdate: ServerSchema,
	streamsList: StreamsListOutputSchema,
	streamsGet: MessageStreamSchema,
	streamsArchive: StreamActionOutputSchema,
	bouncesList: BouncesListOutputSchema,
	bouncesGet: BounceSchema,
	bouncesActivate: BounceActivatedOutputSchema,
	statsDelivery: DeliveryStatsOutputSchema,
	statsOverview: StatsOverviewOutputSchema,
	statsSends: StatsSendsOutputSchema,
} as const;
