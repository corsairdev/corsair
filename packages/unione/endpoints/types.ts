import { z } from 'zod';

const StatusSchema = z.object({
	status: z.string().optional(),
});

const StringMapSchema = z.record(z.string(), z.string());

const AttachmentSchema = z.object({
	type: z.string(),
	name: z.string(),
	content: z.string(),
});

const EmailBodySchema = z.object({
	html: z.string().optional(),
	plaintext: z.string().optional(),
	amp: z.string().optional(),
});

const RecipientSchema = z.object({
	email: z.string().email(),
	substitutions: StringMapSchema.optional(),
	metadata: StringMapSchema.optional(),
});

export const EMAIL_STATUS_TYPES = [
	'delivered',
	'opened',
	'clicked',
	'unsubscribed',
	'subscribed',
	'soft_bounced',
	'hard_bounced',
	'spam',
] as const;

export const EmailStatusTypeSchema = z.enum(EMAIL_STATUS_TYPES);

const DumpFileSchema = z
	.object({
		url: z.string(),
		size: z.number().optional(),
	})
	.loose();

const EventDumpObjectSchema = z
	.object({
		dump_id: z.string(),
		dump_status: z.string().optional(),
		files: z.array(DumpFileSchema).optional(),
	})
	.loose();

const WebhookEventsSchema = z
	.object({
		spam_block: z.array(z.string()).nullable().optional(),
		email_status: z.array(z.string()).nullable().optional(),
	})
	.loose();

// UniOne omits unset webhook settings from some responses and sends them as
// null in others - the same split that made a non-nullable `cursor` reject an
// ordinary suppression page. Every optional field therefore accepts null.
const WebhookObjectSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullable().optional(),
		// `url` is the webhook's identity - UniOne addresses them by URL and the
		// mirror keys on it - so it stays required and non-nullable even though
		// the surrounding settings are permissive.
		url: z.string(),
		status: z.string().nullable().optional(),
		event_format: z.string().nullable().optional(),
		delivery_info: z.number().nullable().optional(),
		single_event: z.number().nullable().optional(),
		max_parallel: z.number().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		events: WebhookEventsSchema.nullable().optional(),
	})
	.loose();

const TemplateObjectSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		editor_type: z.string().optional(),
		template_engine: z.string().optional(),
		global_substitutions: StringMapSchema.optional(),
		global_metadata: StringMapSchema.optional(),
		body: EmailBodySchema.optional(),
		subject: z.string().optional(),
		from_email: z.string().optional(),
		from_name: z.string().optional(),
		reply_to: z.string().optional(),
		reply_to_name: z.string().optional(),
		track_links: z.number().optional(),
		track_read: z.number().optional(),
		headers: StringMapSchema.optional(),
		attachments: z.array(AttachmentSchema).optional(),
		inline_attachments: z.array(AttachmentSchema).optional(),
	})
	.loose();

const SuppressionItemSchema = z
	.object({
		email: z.string().optional(),
		project_id: z.string().optional(),
		cause: z.string().optional(),
		source: z.string().optional(),
		is_deletable: z.boolean().optional(),
		created: z.string().optional(),
	})
	.loose();

const DomainListItemSchema = z
	.object({
		domain: z.string(),
		'verification-record': z
			.object({
				value: z.string().optional(),
				status: z.string().optional(),
			})
			.loose()
			.optional(),
		dkim: z
			.object({
				key: z.string().optional(),
				status: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const ValidationResultSchema = z
	.object({
		status: z.string().optional(),
		email: z.string().optional(),
		result: z.string().optional(),
		cause: z.string().optional(),
		validity: z.number().optional(),
		local_part: z.string().optional(),
		domain: z.string().optional(),
		mx_found: z.boolean().optional(),
		mx_record: z.union([z.string(), z.number()]).optional(),
		did_you_mean: z.string().optional(),
		processed_at: z.string().optional(),
	})
	.loose();

const EventDumpFilterSchema = z.object({
	job_id: z.string().optional(),
	status: z.string().optional(),
	delivery_status: z.string().optional(),
	email: z.string().optional(),
	email_from: z.string().optional(),
	domain: z.string().optional(),
	campaign_id: z.string().optional(),
});

// --- inputs ---

const EmailSendInputSchema = z.object({
	recipients: z.array(RecipientSchema).min(1),
	from_email: z.string().email(),
	subject: z.string(),
	from_name: z.string().optional(),
	reply_to: z.string().optional(),
	reply_to_name: z.string().optional(),
	body: EmailBodySchema.optional(),
	template_id: z.string().optional(),
	tags: z.array(z.string()).optional(),
	template_engine: z.string().optional(),
	global_substitutions: StringMapSchema.optional(),
	global_metadata: StringMapSchema.optional(),
	track_links: z.number().optional(),
	track_read: z.number().optional(),
});

/** `send_at` defers the send. UniOne accepts at most 24 hours ahead. */
const EmailScheduleInputSchema = EmailSendInputSchema.extend({
	send_at: z.string(),
});

const EventDumpForJobInputSchema = z.object({
	job_id: z.string(),
	start_time: z.string().optional(),
	end_time: z.string().optional(),
	email: z.string().email().optional(),
	status: z.string().optional(),
});

const EmailListInputSchema = z.object({
	start_time: z.string(),
	end_time: z.string().optional(),
	limit: z.number().optional(),
	all_projects: z.boolean().optional(),
	filter: EventDumpFilterSchema.optional(),
	dump_fields: z.array(z.string()).optional(),
	format: z.enum(['csv', 'csv_gzip']).optional(),
});

const EmailStatisticsInputSchema = z.object({
	start_time: z.string(),
	end_time: z.string().optional(),
});

const EmailSubscribeInputSchema = z.object({
	from_email: z.string().email(),
	to_email: z.string().email(),
	from_name: z.string().optional(),
});

const EmailUnsubscribeInputSchema = z.object({
	email: z.string().email(),
	created: z.string().optional(),
});

const EmailValidateBatchInputSchema = z.object({
	emails: z.array(z.string().email()).min(1),
});

const EventDumpCreateInputSchema = z.object({
	start_time: z.string(),
	end_time: z.string().optional(),
	limit: z.number().optional(),
	all_projects: z.boolean().optional(),
	filter: EventDumpFilterSchema.optional(),
	dump_fields: z.array(z.string()).optional(),
	aggregate: z.string().optional(),
	delimiter: z.string().optional(),
	format: z.enum(['csv', 'csv_gzip']).optional(),
});

const DumpIdInputSchema = z.object({
	dump_id: z.string(),
});

const EmptyInputSchema = z.object({});

const TagDeleteInputSchema = z.object({
	tag_id: z.number(),
});

const TemplateSetInputSchema = z.object({
	template: TemplateObjectSchema,
});

const TemplateIdInputSchema = z.object({
	id: z.string(),
});

const TemplateListInputSchema = z.object({
	limit: z.number().optional(),
	offset: z.number().optional(),
});

const WebhookSetInputSchema = z.object({
	url: z.string().url(),
	status: z.string().optional(),
	event_format: z.string().optional(),
	delivery_info: z.number().optional(),
	single_event: z.number().optional(),
	max_parallel: z.number().optional(),
	events: WebhookEventsSchema.optional(),
});

const WebhookUrlInputSchema = z.object({
	url: z.string().url(),
});

const SuppressionGetInputSchema = z.object({
	email: z.string().email(),
	all_projects: z.boolean().optional(),
});

const SuppressionListInputSchema = z.object({
	cause: z.string().optional(),
	source: z.string().optional(),
	start_time: z.string().optional(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
});

const SuppressionDeleteInputSchema = z.object({
	email: z.string().email(),
});

const DomainManageInputSchema = z.object({
	action: z.enum([
		'get_dns_records',
		'validate_verification',
		'validate_dkim',
		'list',
	]),
	domain: z.string().optional(),
});

const DomainDeleteInputSchema = z.object({
	domain: z.string(),
});

// --- outputs ---

const EmailSendResponseSchema = StatusSchema.extend({
	job_id: z.string().optional(),
	emails: z.array(z.string()).optional(),
	failed_emails: z.record(z.string(), z.string()).optional(),
}).loose();

const DumpCreateResponseSchema = StatusSchema.extend({
	dump_id: z.string().optional(),
}).loose();

const DumpGetResponseSchema = StatusSchema.extend({
	event_dump: EventDumpObjectSchema.optional(),
}).loose();

const DumpListResponseSchema = StatusSchema.extend({
	event_dumps: z.array(EventDumpObjectSchema).optional(),
}).loose();

const SuccessResponseSchema = StatusSchema.loose();

const SubscribeResponseSchema = StatusSchema.loose();

const UnsubscribeResponseSchema = StatusSchema.loose();

const ValidateBatchResponseSchema = z
	.object({
		status: z.string(),
		results: z.array(ValidationResultSchema),
	})
	.loose();

const TagListResponseSchema = StatusSchema.extend({
	tags: z
		.array(
			z
				.object({
					tag_id: z.number(),
					tag: z.string(),
				})
				.loose(),
		)
		.optional(),
}).loose();

const TemplateGetResponseSchema = StatusSchema.extend({
	template: TemplateObjectSchema.optional(),
}).loose();

const TemplateListResponseSchema = StatusSchema.extend({
	templates: z.array(TemplateObjectSchema).optional(),
}).loose();

const TemplateSetResponseSchema = StatusSchema.extend({
	template: TemplateObjectSchema.optional(),
}).loose();

const WebhookGetResponseSchema = StatusSchema.extend({
	object: WebhookObjectSchema.optional(),
}).loose();

const WebhookListResponseSchema = StatusSchema.extend({
	objects: z.array(WebhookObjectSchema).optional(),
}).loose();

const SystemPingResponseSchema = StatusSchema.loose();

const WebhookTypesResponseSchema = z.object({
	email_status: z.array(z.string()),
	spam_block: z.array(z.string()),
});

const SuppressionGetResponseSchema = StatusSchema.extend({
	email: z.string().optional(),
	suppressions: z.array(SuppressionItemSchema).optional(),
}).loose();

const SuppressionListResponseSchema = StatusSchema.extend({
	count: z.number().optional(),
	suppressions: z.array(SuppressionItemSchema).optional(),
	// UniOne sends `"cursor": null` once there is no further page, including on
	// an empty list, so a non-nullable cursor rejects an ordinary response.
	cursor: z.string().nullable().optional(),
}).loose();

const DomainManageResponseSchema = StatusSchema.extend({
	domain: z.string().optional(),
	'verification-record': z.unknown().optional(),
	dkim: z.unknown().optional(),
	domains: z.array(DomainListItemSchema).optional(),
}).loose();

const SystemInfoResponseSchema = StatusSchema.extend({
	user_id: z.number().optional(),
	email: z.string().optional(),
	project_id: z.string().optional(),
	project_name: z.string().optional(),
	project_accounting: z
		.object({
			email_counter: z.number().optional(),
			email_counter_limit: z.number().optional(),
			email_counter_mode: z.unknown().optional(),
		})
		.loose()
		.optional(),
	accounting: z
		.object({
			period_start: z.string().optional(),
			period_end: z.string().optional(),
			emails_included: z.number().optional(),
			emails_sent: z.number().optional(),
			validations_included: z.number().optional(),
			validations_used: z.number().optional(),
		})
		.loose()
		.optional(),
}).loose();

export type UnioneEndpointInputs = {
	emailSend: z.infer<typeof EmailSendInputSchema>;
	emailSchedule: z.infer<typeof EmailScheduleInputSchema>;
	emailList: z.infer<typeof EmailListInputSchema>;
	emailStatistics: z.infer<typeof EmailStatisticsInputSchema>;
	emailSubscribe: z.infer<typeof EmailSubscribeInputSchema>;
	emailUnsubscribe: z.infer<typeof EmailUnsubscribeInputSchema>;
	emailValidateBatch: z.infer<typeof EmailValidateBatchInputSchema>;
	eventDumpCreateForJob: z.infer<typeof EventDumpForJobInputSchema>;
	eventDumpCreate: z.infer<typeof EventDumpCreateInputSchema>;
	eventDumpGet: z.infer<typeof DumpIdInputSchema>;
	eventDumpList: z.infer<typeof EmptyInputSchema>;
	eventDumpDelete: z.infer<typeof DumpIdInputSchema>;
	tagList: z.infer<typeof EmptyInputSchema>;
	tagDelete: z.infer<typeof TagDeleteInputSchema>;
	templateSet: z.infer<typeof TemplateSetInputSchema>;
	templateGet: z.infer<typeof TemplateIdInputSchema>;
	templateList: z.infer<typeof TemplateListInputSchema>;
	templateDelete: z.infer<typeof TemplateIdInputSchema>;
	webhookSet: z.infer<typeof WebhookSetInputSchema>;
	webhookGet: z.infer<typeof WebhookUrlInputSchema>;
	webhookList: z.infer<typeof EmptyInputSchema>;
	webhookDelete: z.infer<typeof WebhookUrlInputSchema>;
	webhookTypes: z.infer<typeof EmptyInputSchema>;
	suppressionGet: z.infer<typeof SuppressionGetInputSchema>;
	suppressionList: z.infer<typeof SuppressionListInputSchema>;
	suppressionDelete: z.infer<typeof SuppressionDeleteInputSchema>;
	domainManage: z.infer<typeof DomainManageInputSchema>;
	domainDelete: z.infer<typeof DomainDeleteInputSchema>;
	systemInfo: z.infer<typeof EmptyInputSchema>;
	systemPing: z.infer<typeof EmptyInputSchema>;
};

export type UnioneEndpointOutputs = {
	emailSend: z.infer<typeof EmailSendResponseSchema>;
	emailSchedule: z.infer<typeof EmailSendResponseSchema>;
	emailList: z.infer<typeof DumpCreateResponseSchema>;
	emailStatistics: z.infer<typeof DumpCreateResponseSchema>;
	emailSubscribe: z.infer<typeof SubscribeResponseSchema>;
	emailUnsubscribe: z.infer<typeof UnsubscribeResponseSchema>;
	emailValidateBatch: z.infer<typeof ValidateBatchResponseSchema>;
	eventDumpCreateForJob: z.infer<typeof DumpCreateResponseSchema>;
	eventDumpCreate: z.infer<typeof DumpCreateResponseSchema>;
	eventDumpGet: z.infer<typeof DumpGetResponseSchema>;
	eventDumpList: z.infer<typeof DumpListResponseSchema>;
	eventDumpDelete: z.infer<typeof SuccessResponseSchema>;
	tagList: z.infer<typeof TagListResponseSchema>;
	tagDelete: z.infer<typeof SuccessResponseSchema>;
	templateSet: z.infer<typeof TemplateSetResponseSchema>;
	templateGet: z.infer<typeof TemplateGetResponseSchema>;
	templateList: z.infer<typeof TemplateListResponseSchema>;
	templateDelete: z.infer<typeof SuccessResponseSchema>;
	webhookSet: z.infer<typeof WebhookGetResponseSchema>;
	webhookGet: z.infer<typeof WebhookGetResponseSchema>;
	webhookList: z.infer<typeof WebhookListResponseSchema>;
	webhookDelete: z.infer<typeof SuccessResponseSchema>;
	webhookTypes: z.infer<typeof WebhookTypesResponseSchema>;
	suppressionGet: z.infer<typeof SuppressionGetResponseSchema>;
	suppressionList: z.infer<typeof SuppressionListResponseSchema>;
	suppressionDelete: z.infer<typeof SuccessResponseSchema>;
	domainManage: z.infer<typeof DomainManageResponseSchema>;
	domainDelete: z.infer<typeof SuccessResponseSchema>;
	systemInfo: z.infer<typeof SystemInfoResponseSchema>;
	systemPing: z.infer<typeof SystemPingResponseSchema>;
};

export const UnioneEndpointInputSchemas = {
	emailSend: EmailSendInputSchema,
	emailSchedule: EmailScheduleInputSchema,
	emailList: EmailListInputSchema,
	emailStatistics: EmailStatisticsInputSchema,
	emailSubscribe: EmailSubscribeInputSchema,
	emailUnsubscribe: EmailUnsubscribeInputSchema,
	emailValidateBatch: EmailValidateBatchInputSchema,
	eventDumpCreateForJob: EventDumpForJobInputSchema,
	eventDumpCreate: EventDumpCreateInputSchema,
	eventDumpGet: DumpIdInputSchema,
	eventDumpList: EmptyInputSchema,
	eventDumpDelete: DumpIdInputSchema,
	tagList: EmptyInputSchema,
	tagDelete: TagDeleteInputSchema,
	templateSet: TemplateSetInputSchema,
	templateGet: TemplateIdInputSchema,
	templateList: TemplateListInputSchema,
	templateDelete: TemplateIdInputSchema,
	webhookSet: WebhookSetInputSchema,
	webhookGet: WebhookUrlInputSchema,
	webhookList: EmptyInputSchema,
	webhookDelete: WebhookUrlInputSchema,
	webhookTypes: EmptyInputSchema,
	suppressionGet: SuppressionGetInputSchema,
	suppressionList: SuppressionListInputSchema,
	suppressionDelete: SuppressionDeleteInputSchema,
	domainManage: DomainManageInputSchema,
	domainDelete: DomainDeleteInputSchema,
	systemInfo: EmptyInputSchema,
	systemPing: EmptyInputSchema,
} as const;

export const UnioneEndpointOutputSchemas = {
	emailSend: EmailSendResponseSchema,
	emailSchedule: EmailSendResponseSchema,
	emailList: DumpCreateResponseSchema,
	emailStatistics: DumpCreateResponseSchema,
	emailSubscribe: SubscribeResponseSchema,
	emailUnsubscribe: UnsubscribeResponseSchema,
	emailValidateBatch: ValidateBatchResponseSchema,
	eventDumpCreateForJob: DumpCreateResponseSchema,
	eventDumpCreate: DumpCreateResponseSchema,
	eventDumpGet: DumpGetResponseSchema,
	eventDumpList: DumpListResponseSchema,
	eventDumpDelete: SuccessResponseSchema,
	tagList: TagListResponseSchema,
	tagDelete: SuccessResponseSchema,
	templateSet: TemplateSetResponseSchema,
	templateGet: TemplateGetResponseSchema,
	templateList: TemplateListResponseSchema,
	templateDelete: SuccessResponseSchema,
	webhookSet: WebhookGetResponseSchema,
	webhookGet: WebhookGetResponseSchema,
	webhookList: WebhookListResponseSchema,
	webhookDelete: SuccessResponseSchema,
	webhookTypes: WebhookTypesResponseSchema,
	suppressionGet: SuppressionGetResponseSchema,
	suppressionList: SuppressionListResponseSchema,
	suppressionDelete: SuccessResponseSchema,
	domainManage: DomainManageResponseSchema,
	domainDelete: SuccessResponseSchema,
	systemInfo: SystemInfoResponseSchema,
	systemPing: SystemPingResponseSchema,
} as const;

export { EventDumpFilterSchema, ValidationResultSchema };
