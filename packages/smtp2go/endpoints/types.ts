import { z } from 'zod';

// Inputs use SMTP2GO's own parameter names. Outputs parse the whole
// `{ request_id, data }` envelope; their documented fields are `.loose()` and
// `.nullish()`, so a field SMTP2GO adds or omits cannot fail a call that has
// already happened. Field reference: https://developers.smtp2go.com/reference

/** Wraps one operation's data shape in the response envelope. */
function envelope<T extends z.ZodType>(data: T) {
	return z.object({ request_id: z.string(), data }).loose();
}

// ── shared pieces ─────────────────────────────────────────────────────────

const EmailAddressSchema = z
	.string()
	.min(1)
	.describe(
		'An email address, or a name and address in `Name <name@example.com>` format.',
	);

const RecipientListSchema = z
	.array(EmailAddressSchema)
	.min(1)
	.max(100)
	.describe(
		'Up to 100 recipients. Each recipient counts against the plan quota.',
	);

const CustomHeaderSchema = z.object({
	header: z.string().min(1),
	value: z.string().min(1),
});

const AttachmentSchema = z
	.object({
		filename: z.string().min(1),
		fileblob: z
			.string()
			.optional()
			.describe('Base64 encoded file data. Required when `url` is not set.'),
		url: z
			.string()
			.optional()
			.describe(
				'A URL the file is fetched from. Required when `fileblob` is not set.',
			),
		mimetype: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (!value.fileblob && !value.url) {
			ctx.addIssue({
				code: 'custom',
				message: "An attachment needs either 'fileblob' or 'url'",
				path: ['fileblob'],
			});
		}
	});

// The whole message, including attachments, is capped at 50MB.

/**
 * One body of an outgoing message. The server rejects a send with none of
 * `text_body`, `html_body` or `template_id` with a `model_validation_errors`
 * string, so the same rule is checked here before a call is spent.
 */
function requireBody(
	value: {
		text_body?: string;
		html_body?: string;
		template_id?: string;
	},
	ctx: z.RefinementCtx,
) {
	if (!value.text_body && !value.html_body && !value.template_id) {
		ctx.addIssue({
			code: 'custom',
			message:
				"Either 'text_body', 'html_body' or 'template_id' must be passed",
			path: ['text_body'],
		});
	}
}

const MessageFieldsSchema = {
	sender: z
		.string()
		.min(1)
		.describe('The sender, in `Name <name@example.com>` format.'),
	to: RecipientListSchema,
	cc: z.array(EmailAddressSchema).max(100).optional(),
	bcc: z.array(EmailAddressSchema).max(100).optional(),
	// The rendered docs list subject as required, but the server accepts a
	// send without one (live-verified); it is optional here on purpose.
	subject: z
		.string()
		.optional()
		.describe(
			'Optional despite the docs saying required: the server does not enforce it.',
		),
	html_body: z.string().optional(),
	text_body: z.string().optional(),
	custom_headers: z
		.array(CustomHeaderSchema)
		.optional()
		.describe(
			'Content-Type, Content-Transfer-Encoding and MIME-Version cannot be overridden.',
		),
	attachments: z.array(AttachmentSchema).optional(),
	inlines: z
		.array(AttachmentSchema)
		.optional()
		.describe('Inline images referenced by the HTML body via cid: URLs.'),
	template_id: z.string().optional(),
	template_data: z
		.string()
		.optional()
		.describe('Template variables as a JSON-encoded string.'),
	schedule: z
		.string()
		.optional()
		.describe(
			'Schedule the send, in `YYYY-MM-DD HH:mm:ss +ZZZZ` format, less than 3 days out.',
		),
	fastaccept: z
		.boolean()
		.optional()
		.describe(
			'Accept the message without delivery results; defaults to false, which waits for per-recipient outcomes.',
		),
} as const;

/** Sends counts, per-recipient failures and ids, shared by the three send ops. */
const SendResultSchema = z
	.object({
		succeeded: z
			.number()
			.nullish()
			.describe("Emails accepted. Only returned when 'fastaccept' is false."),
		// Present-but-zero means every recipient went out; a positive count with
		// `failures` entries is a partial failure reported at HTTP 200, so
		// callers must check this field rather than relying on the status code.
		failed: z
			.number()
			.nullish()
			.describe(
				"Emails that failed to send. 0 means full success. Only returned when 'fastaccept' is false.",
			),
		failures: z
			// unknown: the API does not document the per-failure entry shape.
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('One entry per failed recipient, when fastaccept is false.'),
		email_id: z.string().nullish().describe('The id of the accepted email.'),
		schedule_id: z
			.string()
			.nullish()
			.describe('Set when `schedule` was passed and the email was queued.'),
	})
	.loose();

// ── email ─────────────────────────────────────────────────────────────────
// NOTE: /email/status/{email_id} does not exist: live probes answer a
// plain-text 404 for both GET and POST. A sent email's status comes from
// email.searchSent (filter by email_id) or activity.search instead.

const EmailSendInputSchema = z
	.object(MessageFieldsSchema)
	.superRefine(requireBody);

export type EmailSendInput = z.input<typeof EmailSendInputSchema>;

const EmailSendResponseSchema = envelope(SendResultSchema);

export type EmailSendResponse = z.infer<typeof EmailSendResponseSchema>;

const MimeSendInputSchema = z
	.object({
		mime_email: z
			.string()
			.min(1)
			.describe('A complete pre-encoded MIME message.'),
		schedule: MessageFieldsSchema.schedule,
		fastaccept: MessageFieldsSchema.fastaccept,
	})
	.loose();

export type EmailSendMimeInput = z.input<typeof MimeSendInputSchema>;

const EmailSendMimeResponseSchema = envelope(SendResultSchema);

export type EmailSendMimeResponse = z.infer<typeof EmailSendMimeResponseSchema>;

const BatchMessageSchema = z
	.object({
		...MessageFieldsSchema,
	})
	.superRefine(requireBody);

const EmailSendBatchInputSchema = z.object({
	emails: z
		.array(BatchMessageSchema)
		.min(1)
		.max(1000)
		.describe('Up to 1000 messages; each recipient counts against the quota.'),
});

export type EmailSendBatchInput = z.input<typeof EmailSendBatchInputSchema>;

// The batch answer is a bare array, one entry per message, each carrying an
// email_id or (for scheduled messages) a schedule_id.
const BatchResultEntrySchema = z
	.object({
		email_id: z.string().nullish(),
		schedule_id: z.string().nullish(),
	})
	.loose();

const EmailSendBatchResponseSchema = envelope(z.array(BatchResultEntrySchema));

export type EmailSendBatchResponse = z.infer<
	typeof EmailSendBatchResponseSchema
>;

export const SMTP2GO_MAX_SEARCH_LIMIT = 5000;

const SentEmailSchema = z
	.object({
		email_id: z.string().nullish(),
		sender: z.string().nullish(),
		recipient: z.string().nullish(),
		subject: z.string().nullish(),
		status: z.string().nullish(),
		process_status: z.string().nullish(),
		smtpcode: z.number().nullish(),
		response: z.string().nullish(),
		host: z.string().nullish(),
		delivered_at: z.string().nullish(),
		sent_at: z.string().nullish(),
		total_opens: z.number().nullish(),
		total_clicks: z.number().nullish(),
		// unknown: per-open rows as the API returns them.
		opens: z
			.array(
				z
					.object({
						user_agent: z.string().nullish(),
						opened_at: z.string().nullish(),
						read_secs: z.string().nullish(),
						recipient: z.string().nullish(),
						ip_address: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const EmailSearchSentInputSchema = z.object({
	start_date: z
		.string()
		.optional()
		.describe('Search window start, such as 2024-01-01 or a full timestamp.'),
	end_date: z.string().optional(),
	email_id: z
		.array(z.string())
		.min(1)
		.optional()
		.describe('Only these emails; this is how a single send is looked up.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(SMTP2GO_MAX_SEARCH_LIMIT)
		.optional()
		.describe(`Defaults to ${SMTP2GO_MAX_SEARCH_LIMIT}.`),
	status_counts: z.boolean().optional(),
	opened_only: z.boolean().optional(),
	clicked_only: z.boolean().optional(),
	ignore_case: z.boolean().optional(),
	filter_query: z.string().optional(),
	username: z.string().optional(),
	headers: z
		.array(z.string())
		.optional()
		.describe('Return these email header values on each result.'),
	continue_token: z
		.string()
		.optional()
		.describe('The continue_token from the previous page.'),
});

export type EmailSearchSentInput = z.input<typeof EmailSearchSentInputSchema>;

const EmailSearchSentResponseSchema = envelope(
	z
		.object({
			count: z
				.number()
				.nullish()
				.describe('Total matches, which can exceed one page.'),
			emails: z.array(SentEmailSchema),
			continue_token: z
				.string()
				.nullish()
				.describe('Token for the next page; null on the last page.'),
		})
		.loose(),
);

export type EmailSearchSentResponse = z.infer<
	typeof EmailSearchSentResponseSchema
>;

const ScheduledEmailSchema = z
	.object({
		schedule_id: z.string().nullish(),
		schedule: z.string().nullish(),
		sender: z.string().nullish(),
		subject: z.string().nullish(),
		recipients: z.string().nullish(),
		client_ip: z.string().nullish(),
	})
	.loose();

const EmailSearchScheduledInputSchema = z.object({
	schedule_id: z.string().optional(),
	search_subject: z.string().optional(),
	search_recipient: z.string().optional(),
	search_sender: z.string().optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Defaults to 1000.'),
	page: z.number().int().min(1).optional(),
});

export type EmailSearchScheduledInput = z.input<
	typeof EmailSearchScheduledInputSchema
>;

// The answer's `data` is a bare array of scheduled messages, not an object.
const EmailSearchScheduledResponseSchema = envelope(
	z.array(ScheduledEmailSchema),
);

export type EmailSearchScheduledResponse = z.infer<
	typeof EmailSearchScheduledResponseSchema
>;

const UuidSchema = z.uuid();

const EmailCancelScheduledInputSchema = z.object({
	schedule_id: UuidSchema.describe(
		'The schedule_id from email.searchScheduled.',
	),
});

export type EmailCancelScheduledInput = z.input<
	typeof EmailCancelScheduledInputSchema
>;

// The success body of a removal is undocumented, so both the object and the
// string answer are accepted; confirm the cancellation with
// email.searchScheduled.
const UndocumentedDataSchema = z.union([
	// unknown: the removal answer's object shape is not documented.
	z.record(z.string(), z.unknown()),
	z.string(),
]);

const EmailCancelScheduledResponseSchema = envelope(
	UndocumentedDataSchema.nullish(),
);

export type EmailCancelScheduledResponse = z.infer<
	typeof EmailCancelScheduledResponseSchema
>;

// ── activity ──────────────────────────────────────────────────────────────

export const SMTP2GO_ACTIVITY_REGIONS = ['us', 'eu', 'au'] as const;

export const SMTP2GO_MAX_ACTIVITY_LIMIT = 1000;

const ActivitySearchInputSchema = z.object({
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	search: z.string().optional(),
	search_email_id: z.string().optional(),
	search_subject: z.string().optional(),
	search_sender: z.string().optional(),
	search_recipient: z.string().optional(),
	event_types: z
		.array(z.string())
		.optional()
		.describe(
			"Event types to keep: 'processed', 'soft-bounced', 'hard-bounced', 'rejected', 'spam', 'delivered', 'unsubscribed', 'resubscribed', 'opened', 'clicked'.",
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(SMTP2GO_MAX_ACTIVITY_LIMIT)
		.optional()
		.describe(
			`Defaults to 100; the API returns at most ${SMTP2GO_MAX_ACTIVITY_LIMIT} items.`,
		),
	continue_token: z.string().optional(),
	only_latest: z.boolean().optional(),
	include_headers: z.boolean().optional(),
	region: z
		.enum(SMTP2GO_ACTIVITY_REGIONS)
		.optional()
		.describe('Read activity from one region instead of the account default.'),
	subaccounts: z
		.array(z.string())
		.optional()
		.describe('Subaccount ids to include.'),
});

export type ActivitySearchInput = z.input<typeof ActivitySearchInputSchema>;

const ActivityEventSchema = z
	.object({
		email_id: z.string().nullish(),
		event: z.string().nullish(),
		date: z.string().nullish(),
		from: z.string().nullish(),
		sender: z.string().nullish(),
		recipient: z.string().nullish(),
		to: z.string().nullish(),
		bcc: z.string().nullish(),
		subject: z.string().nullish(),
		username: z.string().nullish(),
		subaccount_name: z.string().nullish(),
		smtp_response: z.string().nullish(),
		host: z.string().nullish(),
		headers: z.string().nullish(),
		// unknown: custom header names vary per account.
		custom_headers: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const ActivitySearchResponseSchema = envelope(
	z
		.object({
			events: z.array(ActivityEventSchema),
			total_events: z
				.number()
				.nullish()
				.describe('Total matches; can exceed the returned page.'),
			continue_token: z
				.string()
				.nullish()
				.describe('Token for the next page; null on the last page.'),
		})
		.loose(),
);

export type ActivitySearchResponse = z.infer<
	typeof ActivitySearchResponseSchema
>;

// ── suppressions ──────────────────────────────────────────────────────────

const SuppressionSchema = z
	.object({
		email_address: z.string().nullish(),
		reason: z.string().nullish(),
		block_description: z.string().nullish(),
		complaint: z.string().nullish(),
		subject: z.string().nullish(),
		timestamp: z.string().nullish(),
	})
	.loose();

const SuppressionsListInputSchema = z.object({
	email_address: z.string().optional(),
	suppression_types: z
		.array(z.string())
		.optional()
		.describe(
			"Restrict the results to these types: 'manual', 'spam', 'unsubscribe', 'bounce', 'compliance'.",
		),
	limit: z.number().int().min(1).optional(),
	continue_token: z.string().optional(),
});

export type SuppressionsListInput = z.input<typeof SuppressionsListInputSchema>;

const SuppressionsListResponseSchema = envelope(
	z
		.object({
			results: z.array(SuppressionSchema),
			total_results: z.number().nullish(),
			continue_token: z
				.string()
				.nullish()
				.describe('Token for the next page; null on the last page.'),
		})
		.loose(),
);

export type SuppressionsListResponse = z.infer<
	typeof SuppressionsListResponseSchema
>;

const SuppressionsAddInputSchema = z.object({
	email_address: EmailAddressSchema.describe('The address to stop sending to.'),
	block_description: z.string().optional(),
	subaccount_id: z.string().optional(),
});

export type SuppressionsAddInput = z.input<typeof SuppressionsAddInputSchema>;

const SuppressionsAddResponseSchema = envelope(
	z
		.object({
			added: z.boolean().nullish(),
			email_address: z.string().nullish(),
			block_description: z.string().nullish(),
		})
		.loose(),
);

export type SuppressionsAddResponse = z.infer<
	typeof SuppressionsAddResponseSchema
>;

const SuppressionsRemoveInputSchema = z.object({
	email_address: EmailAddressSchema.describe('The address to unblock.'),
	reasons: z
		.array(z.string())
		.optional()
		.describe("Block types to remove; the API defaults to ['manual', 'spam']."),
	subaccount_id: z.string().optional(),
});

export type SuppressionsRemoveInput = z.input<
	typeof SuppressionsRemoveInputSchema
>;

const SuppressionsRemoveResponseSchema = envelope(
	z
		.object({
			// One row per requested reason; `removed: false` means that block
			// type was not in place or could not be lifted.
			suppressions: z.array(
				z
					.object({
						email_address: z.string().nullish(),
						reason: z.string().nullish(),
						removed: z.boolean().nullish(),
					})
					.loose(),
			),
		})
		.loose(),
);

export type SuppressionsRemoveResponse = z.infer<
	typeof SuppressionsRemoveResponseSchema
>;

// ── domains ───────────────────────────────────────────────────────────────

const DomainDetailSchema = z
	.object({
		fulldomain: z.string().nullish(),
		subdomain: z.string().nullish(),
		domain: z.string().nullish(),
		suffix: z.string().nullish(),
		dkim_selector: z.string().nullish(),
		dkim_verified: z.boolean().nullish(),
		dkim_status: z.string().nullish(),
		dkim_value: z.string().nullish(),
		rpath_selector: z.string().nullish(),
		rpath_verified: z.boolean().nullish(),
		rpath_status: z.string().nullish(),
		rpath_value: z.string().nullish(),
		setup_link: z.string().nullish(),
	})
	.loose();

const TrackerSchema = z
	.object({
		fulldomain: z.string().nullish(),
		subdomain: z.string().nullish(),
		domain: z.string().nullish(),
		suffix: z.string().nullish(),
		cname_verified: z.boolean().nullish(),
		cname_status: z.string().nullish(),
		cname_value: z.string().nullish(),
		enabled: z.boolean().nullish(),
	})
	.loose();

const DomainSchema = z
	.object({
		domain: DomainDetailSchema.nullish(),
		trackers: z.array(TrackerSchema).nullish(),
		subaccount_access: z
			.object({
				subaccounts: z.array(z.string()).nullish(),
				future_subaccounts: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const DomainsDataSchema = z.object({ domains: z.array(DomainSchema) }).loose();

const DomainsListInputSchema = z.object({
	domain: z.string().optional(),
	subaccount_id: z.string().optional(),
});

export type DomainsListInput = z.input<typeof DomainsListInputSchema>;

const DomainsListResponseSchema = envelope(DomainsDataSchema);

export type DomainsListResponse = z.infer<typeof DomainsListResponseSchema>;

const DomainsAddInputSchema = z.object({
	domain: z
		.string()
		.min(1)
		.describe('The sender domain to add, such as example.com.'),
	auto_verify: z
		.boolean()
		.optional()
		.describe('Defaults to true: verification is attempted right away.'),
	requisition_ssl: z
		.boolean()
		.optional()
		.describe(
			'Defaults to true: an SSL requisition is created for the tracking subdomain.',
		),
	subaccount_id: z.string().optional(),
});

export type DomainsAddInput = z.input<typeof DomainsAddInputSchema>;

const DomainsAddResponseSchema = envelope(DomainsDataSchema);

export type DomainsAddResponse = z.infer<typeof DomainsAddResponseSchema>;

const DomainsVerifyInputSchema = z.object({
	domain: z.string().min(1).describe('The sender domain to verify.'),
	requisition_ssl: z.boolean().optional(),
	subaccount_id: z.string().optional(),
});

export type DomainsVerifyInput = z.input<typeof DomainsVerifyInputSchema>;

const DomainsVerifyResponseSchema = envelope(DomainsDataSchema);

export type DomainsVerifyResponse = z.infer<typeof DomainsVerifyResponseSchema>;

const DomainsRemoveInputSchema = z.object({
	domain: z.string().min(1).describe('The sender domain to remove.'),
	subaccount_id: z.string().optional(),
});

export type DomainsRemoveInput = z.input<typeof DomainsRemoveInputSchema>;

// Live (11-28): a successful /domain/remove answers `data: null`.
const DomainsRemoveResponseSchema = envelope(DomainsDataSchema.nullable());

export type DomainsRemoveResponse = z.infer<typeof DomainsRemoveResponseSchema>;

// ── stats ─────────────────────────────────────────────────────────────────

const StatsBouncesInputSchema = z.object({
	username: z
		.string()
		.optional()
		.describe('Restrict to one SMTP user; defaults to the whole account.'),
});

export type StatsBouncesInput = z.input<typeof StatsBouncesInputSchema>;

const StatsBouncesResponseSchema = envelope(
	z
		.object({
			emails: z.number().nullish(),
			hardbounces: z.number().nullish(),
			softbounces: z.number().nullish(),
			rejects: z.number().nullish(),
			bounce_percent: z.string().nullish(),
		})
		.loose(),
);

export type StatsBouncesResponse = z.infer<typeof StatsBouncesResponseSchema>;

const StatsCycleInputSchema = z.object({});

export type StatsCycleInput = z.input<typeof StatsCycleInputSchema>;

const StatsCycleResponseSchema = envelope(
	z
		.object({
			cycle_start: z.string().nullish(),
			cycle_end: z.string().nullish(),
			cycle_used: z.number().nullish(),
			cycle_remaining: z.number().nullish(),
			cycle_max: z.number().nullish(),
		})
		.loose(),
);

export type StatsCycleResponse = z.infer<typeof StatsCycleResponseSchema>;

const StatsSpamInputSchema = z.object({
	username: z.string().optional(),
});

export type StatsSpamInput = z.input<typeof StatsSpamInputSchema>;

const StatsSpamResponseSchema = envelope(
	z
		.object({
			emails: z.number().nullish(),
			spams: z.number().nullish(),
			rejects: z.number().nullish(),
			spam_percent: z.string().nullish(),
		})
		.loose(),
);

export type StatsSpamResponse = z.infer<typeof StatsSpamResponseSchema>;

const StatsUnsubscribesInputSchema = z.object({
	username: z.string().optional(),
});

export type StatsUnsubscribesInput = z.input<
	typeof StatsUnsubscribesInputSchema
>;

const StatsUnsubscribesResponseSchema = envelope(
	z
		.object({
			emails: z.number().nullish(),
			unsubscribes: z.number().nullish(),
			rejects: z.number().nullish(),
			unsubscribe_percent: z.string().nullish(),
		})
		.loose(),
);

export type StatsUnsubscribesResponse = z.infer<
	typeof StatsUnsubscribesResponseSchema
>;

const StatsHistoryInputSchema = z.object({
	group_by: z
		.string()
		.optional()
		.describe('Group the rows, such as by day or by email_address.'),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	subaccounts: z.array(z.string()).optional(),
});

export type StatsHistoryInput = z.input<typeof StatsHistoryInputSchema>;

const StatsHistoryResponseSchema = envelope(
	z
		.object({
			count: z.number().nullish(),
			history: z.array(
				z
					.object({
						email_address: z.string().nullish(),
						used: z.number().nullish(),
						bytecount: z.number().nullish(),
						avgsize: z.number().nullish(),
						lastip: z.string().nullish(),
						bounces: z.number().nullish(),
						clicks: z.number().nullish(),
						opens: z.number().nullish(),
						rejects: z.number().nullish(),
						spam: z.number().nullish(),
						unsubscribes: z.number().nullish(),
					})
					.loose(),
			),
		})
		.loose(),
);

export type StatsHistoryResponse = z.infer<typeof StatsHistoryResponseSchema>;

const StatsSummaryInputSchema = z.object({
	username: z.string().optional(),
});

export type StatsSummaryInput = z.input<typeof StatsSummaryInputSchema>;

const StatsSummaryResponseSchema = envelope(
	z
		.object({
			cycle_start: z.string().nullish(),
			cycle_end: z.string().nullish(),
			cycle_used: z.number().nullish(),
			cycle_remaining: z.number().nullish(),
			cycle_max: z.number().nullish(),
			email_count: z.number().nullish(),
			hardbounces: z.number().nullish(),
			softbounces: z.number().nullish(),
			bounce_rejects: z.number().nullish(),
			bounce_percent: z.string().nullish(),
			spam_emails: z.number().nullish(),
			spam_rejects: z.number().nullish(),
			spam_percent: z.string().nullish(),
			unsubscribes: z.number().nullish(),
			unsubscribe_percent: z.string().nullish(),
			opens: z.number().nullish(),
			clicks: z.number().nullish(),
			rejects: z.number().nullish(),
		})
		.loose(),
);

export type StatsSummaryResponse = z.infer<typeof StatsSummaryResponseSchema>;

// ── templates ─────────────────────────────────────────────────────────────

const TemplateSummarySchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		template_name: z.string().nullish(),
		subject: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		last_updated: z.string().nullish(),
	})
	.loose();

const TemplatesListInputSchema = z.object({
	fuzzy_search: z.boolean().optional(),
	search_terms: z
		.array(z.string())
		.optional()
		.describe('Terms matched against template names.'),
	tags: z.array(z.string()).optional(),
	sort_direction: z.string().optional(),
	page_size: z.number().int().min(1).optional().describe('Defaults to 100.'),
	continue_token: z
		.string()
		.optional()
		.describe('The continue_token from the previous page.'),
});

export type TemplatesListInput = z.input<typeof TemplatesListInputSchema>;

const TemplatesListResponseSchema = envelope(
	z
		.object({
			templates: z.array(TemplateSummarySchema),
			total_count: z.number().nullish(),
			continue_token: z
				.string()
				.nullish()
				.describe('Token for the next page; null on the last page.'),
		})
		.loose(),
);

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

// unknown: template variable values are caller-defined strings, numbers or
// nested values.
const TemplateVariablesSchema = z.record(z.string(), z.unknown());

const TemplatesViewInputSchema = z.object({
	id: z.string().min(1).describe('The template id.'),
});

export type TemplatesViewInput = z.input<typeof TemplatesViewInputSchema>;

const TemplatesViewResponseSchema = envelope(
	z
		.object({
			id: z.string().nullish(),
			name: z.string().nullish(),
			subject: z.string().nullish(),
			html_body: z.string().nullish(),
			text_body: z.string().nullish(),
			tags: z.array(z.string()).nullish(),
			template_variables: TemplateVariablesSchema.nullish(),
			last_updated: z.string().nullish(),
		})
		.loose(),
);

export type TemplatesViewResponse = z.infer<typeof TemplatesViewResponseSchema>;

const TemplatesAddInputSchema = z.object({
	// Unusual for a create: the API requires the caller to pick the id.
	id: z.string().min(1).describe('A caller-chosen id for the new template.'),
	template_name: z.string().min(1),
	subject: z.string().min(1),
	html_body: z.string().min(1),
	text_body: z.string().min(1),
	template_variables: TemplateVariablesSchema.optional(),
	tags: z.array(z.string()).optional(),
});

export type TemplatesAddInput = z.input<typeof TemplatesAddInputSchema>;

const TemplatesAddResponseSchema = envelope(
	z
		.object({
			id: z.string().nullish(),
			template_name: z.string().nullish(),
			name: z.string().nullish(),
			subject: z.string().nullish(),
			html_body: z.string().nullish(),
			text_body: z.string().nullish(),
			template_variables: TemplateVariablesSchema.nullish(),
			tags: z.array(z.string()).nullish(),
			last_updated: z.string().nullish(),
		})
		.loose(),
);

export type TemplatesAddResponse = z.infer<typeof TemplatesAddResponseSchema>;

const TemplatesEditInputSchema = z.object({
	id: z.string().min(1).describe('The template to change.'),
	new_id: z.string().optional().describe('Move the template to a new id.'),
	template_name: z.string().optional(),
	subject: z.string().optional(),
	html_body: z.string().optional(),
	text_body: z.string().optional(),
	template_variables: TemplateVariablesSchema.optional(),
	tags: z.array(z.string()).optional(),
});

export type TemplatesEditInput = z.input<typeof TemplatesEditInputSchema>;

const TemplatesEditResponseSchema = envelope(
	z
		.object({
			id: z.string().nullish(),
			template_name: z.string().nullish(),
			name: z.string().nullish(),
			subject: z.string().nullish(),
			html_body: z.string().nullish(),
			text_body: z.string().nullish(),
			template_variables: TemplateVariablesSchema.nullish(),
			tags: z.array(z.string()).nullish(),
			last_updated: z.string().nullish(),
		})
		.loose(),
);

export type TemplatesEditResponse = z.infer<typeof TemplatesEditResponseSchema>;

const TemplatesDeleteInputSchema = z.object({
	id: z.string().min(1).describe('The template to delete.'),
});

export type TemplatesDeleteInput = z.input<typeof TemplatesDeleteInputSchema>;

// The documented answer carries a confirmation string in `data`, such as
// "Successfully deleted template 'example'".
const TemplatesDeleteResponseSchema = envelope(z.string());

export type TemplatesDeleteResponse = z.infer<
	typeof TemplatesDeleteResponseSchema
>;

// ── webhooks ──────────────────────────────────────────────────────────────

const HeaderValuesSchema = z.union([z.string(), z.array(z.string())]);

const WebhookSchema = z
	.object({
		id: z.number().nullish(),
		url: z.string().nullish(),
		events: z.array(z.string()).nullish(),
		sms_events: z.array(z.string()).nullish(),
		headers: HeaderValuesSchema.nullish(),
		usernames: HeaderValuesSchema.nullish(),
		output_format: z.string().nullish(),
		auth_header_type: z.string().nullish(),
		auth_header_value: z.string().nullish(),
		disabled: z.boolean().nullish(),
		custom_headers: z.array(z.string()).nullish(),
	})
	.loose();

const WebhooksListInputSchema = z.object({
	subaccount_id: z.string().optional(),
});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

// The documented answer is a single webhook object rather than a list.
// Live (11-28): /webhook/view answers an array of webhooks ([] when none),
// not one webhook object.
const WebhooksListResponseSchema = envelope(z.array(WebhookSchema));

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhooksAddInputSchema = z.object({
	url: z.string().min(1).describe('The https URL events are posted to.'),
	events: z
		.array(z.string())
		.optional()
		.describe(
			"Email events to receive: 'delivered', 'unsubscribe', 'spam', 'bounce', 'processed', 'reject', 'click', 'open'. Defaults to all.",
		),
	sms_events: z.array(z.string()).optional(),
	headers: z
		.array(z.string())
		.optional()
		.describe('Email headers echoed to the webhook.'),
	usernames: z
		.array(z.string())
		.optional()
		.describe('Restrict the webhook to these SMTP users.'),
	output_format: z
		.enum(['form', 'json'])
		.optional()
		.describe("Defaults to 'form'."),
	auth_header_type: z.string().optional(),
	auth_header_value: z.string().optional(),
	custom_headers: z
		.array(z.string())
		.optional()
		.describe('Extra headers sent with every delivery.'),
	subaccount_id: z.string().optional(),
});

export type WebhooksAddInput = z.input<typeof WebhooksAddInputSchema>;

const WebhooksAddResponseSchema = envelope(WebhookSchema);

export type WebhooksAddResponse = z.infer<typeof WebhooksAddResponseSchema>;

const WebhooksEditInputSchema = z.object({
	id: z
		.number()
		.int()
		.positive()
		.describe('The webhook registration to change.'),
	// The reference marks url optional, but /webhook/edit answers 400 "The
	// field 'url' was expecting a value" without it (live, 11-28).
	url: z
		.string()
		.min(1)
		.describe('The webhook URL; required on every edit, even when unchanged.'),
	events: z.array(z.string()).optional(),
	sms_events: z.array(z.string()).optional(),
	headers: z.array(z.string()).optional(),
	usernames: z.array(z.string()).optional(),
	output_format: z.enum(['form', 'json']).optional(),
	disabled: z.boolean().optional(),
	auth_header_type: z.string().optional(),
	auth_header_value: z.string().optional(),
	custom_headers: z.array(z.string()).optional(),
	subaccount_id: z.string().optional(),
});

export type WebhooksEditInput = z.input<typeof WebhooksEditInputSchema>;

const WebhooksEditResponseSchema = envelope(WebhookSchema);

export type WebhooksEditResponse = z.infer<typeof WebhooksEditResponseSchema>;

const WebhooksRemoveInputSchema = z.object({
	id: z
		.number()
		.int()
		.positive()
		.describe('The webhook registration to remove.'),
	subaccount_id: z.string().optional(),
});

export type WebhooksRemoveInput = z.input<typeof WebhooksRemoveInputSchema>;

const WebhooksRemoveResponseSchema = envelope(WebhookSchema);

export type WebhooksRemoveResponse = z.infer<
	typeof WebhooksRemoveResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type Smtp2goEndpointInputs = {
	emailSend: EmailSendInput;
	emailSendMime: EmailSendMimeInput;
	emailSendBatch: EmailSendBatchInput;
	emailSearchSent: EmailSearchSentInput;
	emailSearchScheduled: EmailSearchScheduledInput;
	emailCancelScheduled: EmailCancelScheduledInput;
	activitySearch: ActivitySearchInput;
	suppressionsList: SuppressionsListInput;
	suppressionsAdd: SuppressionsAddInput;
	suppressionsRemove: SuppressionsRemoveInput;
	domainsList: DomainsListInput;
	domainsAdd: DomainsAddInput;
	domainsVerify: DomainsVerifyInput;
	domainsRemove: DomainsRemoveInput;
	statsBounces: StatsBouncesInput;
	statsCycle: StatsCycleInput;
	statsSpam: StatsSpamInput;
	statsUnsubscribes: StatsUnsubscribesInput;
	statsHistory: StatsHistoryInput;
	statsSummary: StatsSummaryInput;
	templatesList: TemplatesListInput;
	templatesView: TemplatesViewInput;
	templatesAdd: TemplatesAddInput;
	templatesEdit: TemplatesEditInput;
	templatesDelete: TemplatesDeleteInput;
	webhooksList: WebhooksListInput;
	webhooksAdd: WebhooksAddInput;
	webhooksEdit: WebhooksEditInput;
	webhooksRemove: WebhooksRemoveInput;
};

export type Smtp2goEndpointOutputs = {
	emailSend: EmailSendResponse;
	emailSendMime: EmailSendMimeResponse;
	emailSendBatch: EmailSendBatchResponse;
	emailSearchSent: EmailSearchSentResponse;
	emailSearchScheduled: EmailSearchScheduledResponse;
	emailCancelScheduled: EmailCancelScheduledResponse;
	activitySearch: ActivitySearchResponse;
	suppressionsList: SuppressionsListResponse;
	suppressionsAdd: SuppressionsAddResponse;
	suppressionsRemove: SuppressionsRemoveResponse;
	domainsList: DomainsListResponse;
	domainsAdd: DomainsAddResponse;
	domainsVerify: DomainsVerifyResponse;
	domainsRemove: DomainsRemoveResponse;
	statsBounces: StatsBouncesResponse;
	statsCycle: StatsCycleResponse;
	statsSpam: StatsSpamResponse;
	statsUnsubscribes: StatsUnsubscribesResponse;
	statsHistory: StatsHistoryResponse;
	statsSummary: StatsSummaryResponse;
	templatesList: TemplatesListResponse;
	templatesView: TemplatesViewResponse;
	templatesAdd: TemplatesAddResponse;
	templatesEdit: TemplatesEditResponse;
	templatesDelete: TemplatesDeleteResponse;
	webhooksList: WebhooksListResponse;
	webhooksAdd: WebhooksAddResponse;
	webhooksEdit: WebhooksEditResponse;
	webhooksRemove: WebhooksRemoveResponse;
};

export const Smtp2goEndpointInputSchemas = {
	emailSend: EmailSendInputSchema,
	emailSendMime: MimeSendInputSchema,
	emailSendBatch: EmailSendBatchInputSchema,
	emailSearchSent: EmailSearchSentInputSchema,
	emailSearchScheduled: EmailSearchScheduledInputSchema,
	emailCancelScheduled: EmailCancelScheduledInputSchema,
	activitySearch: ActivitySearchInputSchema,
	suppressionsList: SuppressionsListInputSchema,
	suppressionsAdd: SuppressionsAddInputSchema,
	suppressionsRemove: SuppressionsRemoveInputSchema,
	domainsList: DomainsListInputSchema,
	domainsAdd: DomainsAddInputSchema,
	domainsVerify: DomainsVerifyInputSchema,
	domainsRemove: DomainsRemoveInputSchema,
	statsBounces: StatsBouncesInputSchema,
	statsCycle: StatsCycleInputSchema,
	statsSpam: StatsSpamInputSchema,
	statsUnsubscribes: StatsUnsubscribesInputSchema,
	statsHistory: StatsHistoryInputSchema,
	statsSummary: StatsSummaryInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesView: TemplatesViewInputSchema,
	templatesAdd: TemplatesAddInputSchema,
	templatesEdit: TemplatesEditInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksAdd: WebhooksAddInputSchema,
	webhooksEdit: WebhooksEditInputSchema,
	webhooksRemove: WebhooksRemoveInputSchema,
} as const;

export const Smtp2goEndpointOutputSchemas = {
	emailSend: EmailSendResponseSchema,
	emailSendMime: EmailSendMimeResponseSchema,
	emailSendBatch: EmailSendBatchResponseSchema,
	emailSearchSent: EmailSearchSentResponseSchema,
	emailSearchScheduled: EmailSearchScheduledResponseSchema,
	emailCancelScheduled: EmailCancelScheduledResponseSchema,
	activitySearch: ActivitySearchResponseSchema,
	suppressionsList: SuppressionsListResponseSchema,
	suppressionsAdd: SuppressionsAddResponseSchema,
	suppressionsRemove: SuppressionsRemoveResponseSchema,
	domainsList: DomainsListResponseSchema,
	domainsAdd: DomainsAddResponseSchema,
	domainsVerify: DomainsVerifyResponseSchema,
	domainsRemove: DomainsRemoveResponseSchema,
	statsBounces: StatsBouncesResponseSchema,
	statsCycle: StatsCycleResponseSchema,
	statsSpam: StatsSpamResponseSchema,
	statsUnsubscribes: StatsUnsubscribesResponseSchema,
	statsHistory: StatsHistoryResponseSchema,
	statsSummary: StatsSummaryResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesView: TemplatesViewResponseSchema,
	templatesAdd: TemplatesAddResponseSchema,
	templatesEdit: TemplatesEditResponseSchema,
	templatesDelete: TemplatesDeleteResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksAdd: WebhooksAddResponseSchema,
	webhooksEdit: WebhooksEditResponseSchema,
	webhooksRemove: WebhooksRemoveResponseSchema,
} as const;
