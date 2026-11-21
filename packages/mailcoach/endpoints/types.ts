import { z } from 'zod';

export type MailcoachJsonValue =
	| string
	| number
	| boolean
	| null
	| MailcoachJsonValue[]
	| { [key: string]: MailcoachJsonValue };

export const MailcoachJsonValueSchema: z.ZodType<
	MailcoachJsonValue,
	MailcoachJsonValue
> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(MailcoachJsonValueSchema),
		z.record(z.string(), MailcoachJsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), MailcoachJsonValueSchema);
const UuidSchema = z.string().uuid();
const EmptyInput = z.object({}).strict();
const PageLinksSchema = z
	.object({
		first: z.string().nullable().optional(),
		last: z.string().nullable().optional(),
		prev: z.string().nullable().optional(),
		next: z.string().nullable(),
	})
	.passthrough();
const PageMetaSchema = z.record(z.string(), MailcoachJsonValueSchema);

// The API reference publishes selected resource fields and response excerpts,
// not a closed list of every returned field. These schemas validate documented
// fields while preserving provider-added fields rather than rejecting them.
const ResourceSchema = z.object({ uuid: z.string() }).passthrough();
const EmailListSchema = ResourceSchema.extend({
	name: z.string().optional(),
	default_from_email: z.string().optional(),
	default_from_name: z.string().nullable().optional(),
	active_subscribers_count: z.number().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
}).passthrough();
const SubscriberSchema = ResourceSchema.extend({
	email_list_uuid: z.string().optional(),
	email: z.string().optional(),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	extra_attributes: JsonObjectSchema.optional(),
	tags: z.array(z.string()).optional(),
	status: z.enum(['unconfirmed', 'subscribed', 'unsubscribed']).optional(),
	subscribed_at: z.string().nullable().optional(),
	unsubscribed_at: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
}).passthrough();
const ImportSchema = ResourceSchema.extend({
	status: z
		.enum(['draft', 'pending', 'importing', 'completed', 'failed'])
		.optional(),
	email_list_uuid: z.string().optional(),
	imported_subscribers_count: z.number().optional(),
	error_count: z.number().optional(),
}).passthrough();
const TagSchema = ResourceSchema.extend({
	name: z.string().optional(),
	email_list_uuid: z.string().optional(),
	visible_in_preferences: z.boolean().optional(),
}).passthrough();
const SegmentSchema = ResourceSchema.extend({
	name: z.string().optional(),
	email_list_uuid: z.string().optional(),
	positive_tags: z.array(z.string()).optional(),
	negative_tags: z.array(z.string()).optional(),
	all_positive_tags_required: z.boolean().optional(),
	all_negative_tags_required: z.boolean().optional(),
}).passthrough();
const TemplateSchema = ResourceSchema.extend({
	name: z.string().optional(),
	html: z.string().optional(),
	structured_html: MailcoachJsonValueSchema.nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
}).passthrough();
const CampaignSchema = ResourceSchema.extend({
	name: z.string().optional(),
	subject: z.string().nullable().optional(),
	html: z.string().nullable().optional(),
	scheduled_at: z.string().nullable().optional(),
	status: z.string().optional(),
	email_list_uuid: z.string().optional(),
	segment_uuid: z.string().nullable().optional(),
}).passthrough();
const TransactionalTemplateSchema = ResourceSchema.extend({
	name: z.string().optional(),
	subject: z.string().nullable().optional(),
	html: z.string().nullable().optional(),
	store_mail: z.boolean().optional(),
}).passthrough();
const AutomationMailSchema = ResourceSchema.extend({
	name: z.string().optional(),
	subject: z.string().nullable().optional(),
	html: z.string().nullable().optional(),
	template_uuid: z.string().nullable().optional(),
	structured_html: MailcoachJsonValueSchema.nullable().optional(),
}).passthrough();
const SendSchema = ResourceSchema.extend({
	campaign_uuid: z.string().nullable().optional(),
	automation_mail_uuid: z.string().nullable().optional(),
	transactional_mail_log_item_uuid: z.string().nullable().optional(),
	subscriber_uuid: z.string().nullable().optional(),
	sent_at: z.string().nullable().optional(),
	failed_at: z.string().nullable().optional(),
	failure_reason: z.string().nullable().optional(),
	open_count: z.number().optional(),
	click_count: z.number().optional(),
	first_opened_at: z.string().nullable().optional(),
	last_opened_at: z.string().nullable().optional(),
	first_clicked_at: z.string().nullable().optional(),
	last_clicked_at: z.string().nullable().optional(),
}).passthrough();
const SuppressionSchema = ResourceSchema.extend({
	email: z.string().optional(),
	reason: z.enum(['hard_bounce', 'spam_complaint', 'manual']).optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
}).passthrough();
const UploadedImageSchema = z
	.object({
		uuid: z.string(),
		name: z.string(),
		url: z.string().url(),
	})
	.passthrough();
const LinkClickSchema = z
	.object({
		uuid: z.string(),
		send_uuid: z.string(),
		link_uuid: z.string(),
		subscriber_uuid: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
	})
	.passthrough();

const data = <T extends z.ZodType>(resource: T) =>
	z.object({ data: resource }).passthrough();
const page = <T extends z.ZodType>(resource: T) =>
	z
		.object({
			data: z.array(resource),
			links: PageLinksSchema,
			meta: PageMetaSchema,
		})
		.passthrough();
const EmptyOutput = z.void();
const PageQuery = <F extends z.ZodType, S extends z.ZodType>(
	filter: F,
	sort: S,
) =>
	z
		.object({
			query: z
				.object({ filter: filter.optional(), sort: sort.optional() })
				.strict()
				.optional(),
			next: z.string().url().optional(),
		})
		.strict()
		.refine(({ query, next }) => query === undefined || next === undefined, {
			message: 'Pass either a fresh query or a pagination link, not both',
		});
const StringFilter = <T extends z.ZodRawShape>(shape: T) =>
	z.object(shape).strict();
const Sort = <const T extends [string, ...string[]]>(...fields: T) =>
	z.enum(fields);
const CampaignScheduleSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
	.refine((value) => {
		const asUtc = new Date(`${value.replace(' ', 'T')}Z`);
		return (
			!Number.isNaN(asUtc.getTime()) &&
			asUtc.toISOString().slice(0, 19).replace('T', ' ') === value
		);
	}, 'Schedule must be a valid UTC date and time');

const EmailListBody = z
	.object({
		name: z.string().min(1),
		default_from_email: z.string().email(),
		default_from_name: z.string().optional(),
	})
	.strict();
const SubscriberCreateBody = z
	.object({
		email: z.string().email(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		extra_attributes: JsonObjectSchema.optional(),
		tags: z.array(z.string()).optional(),
		skip_confirmation: z.boolean().optional(),
		strict: z.boolean().optional(),
	})
	.strict();
const SubscriberUpdateBody = z
	.object({
		email: z.string().email().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		extra_attributes: JsonObjectSchema.optional(),
		tags: z.array(z.string()).optional(),
		append_tags: z.boolean().optional(),
	})
	.strict();
const TagsBody = z.object({ tags: z.array(z.string()) }).strict();
const ImportBody = z
	.object({
		subscribers_csv: z
			.string()
			.min(1)
			.refine((csv) => {
				const header = csv.split(/\r?\n/, 1)[0] ?? '';
				return header
					.split(',')
					.map((column) => column.trim())
					.includes('email');
			}, 'CSV must include an email header row'),
		email_list_uuid: UuidSchema,
		subscribe_unsubscribed: z.boolean().optional(),
		unsubscribe_others: z.boolean().optional(),
		replace_tags: z.boolean().optional(),
	})
	.strict();
const TagCreateBody = z
	.object({
		name: z.string().min(1),
		visible_in_preferences: z.boolean().optional(),
	})
	.strict();
const TagUpdateBody = z
	.object({
		name: z.string().min(1),
		visible_in_preferences: z.boolean(),
	})
	.strict();
const SegmentCreateBody = z
	.object({
		name: z.string().min(1),
		all_positive_tags_required: z.boolean().optional(),
		all_negative_tags_required: z.boolean().optional(),
		positive_tags: z.array(z.string()).optional(),
		negative_tags: z.array(z.string()).optional(),
	})
	.strict();
const SegmentUpdateBody = z
	.object({
		name: z.string().min(1),
		all_positive_tags_required: z.boolean(),
		all_negative_tags_required: z.boolean(),
		positive_tags: z.array(z.string()),
		negative_tags: z.array(z.string()),
	})
	.strict();
const TemplateCreateBody = z
	.object({
		name: z.string().min(1),
		html: z.string().optional(),
		structured_html: MailcoachJsonValueSchema.optional(),
	})
	.strict();
const TemplateUpdateBody = TemplateCreateBody;
const CampaignBody = z
	.object({
		name: z.string().min(1),
		email_list_uuid: UuidSchema,
		subject: z.string().optional(),
		template_uuid: UuidSchema.optional(),
		fields: JsonObjectSchema.optional(),
		segment_uuid: UuidSchema.optional(),
		html: z.string().optional(),
		schedule_at: CampaignScheduleSchema.optional(),
		utm_tags: z.boolean().optional(),
		add_subscriber_tags: z.boolean().optional(),
		add_subscriber_link_tags: z.boolean().optional(),
		disable_webview: z.boolean().optional(),
	})
	.strict();
const AttachmentSchema = z
	.object({
		name: z.string().min(1),
		content: z
			.string()
			.min(4)
			.regex(/^[A-Za-z0-9+/]+={0,2}$/)
			.refine(
				(value) => value.length % 4 === 0,
				'Attachment content must be base64',
			),
		content_type: z.string().min(1),
		content_id: z.string().optional(),
	})
	.strict();
const TransactionalMailBody = z
	.object({
		from: z.string().min(1),
		to: z.string().min(1),
		cc: z.string().optional(),
		bcc: z.string().optional(),
		reply_to: z.string().optional(),
		mail_name: z.string().min(1).optional(),
		replacements: JsonObjectSchema.optional(),
		subject: z.string().min(1).optional(),
		html: z.string().optional(),
		text: z.string().optional(),
		store: z.boolean().optional(),
		mailer: z.string().optional(),
		attachments: z.array(AttachmentSchema).optional(),
		fake: z.boolean().optional(),
	})
	.strict()
	.superRefine((mail, context) => {
		const savedTemplate = mail.mail_name !== undefined;
		const inlineContent =
			mail.subject !== undefined &&
			(mail.html !== undefined || mail.text !== undefined);
		if (savedTemplate === inlineContent) {
			context.addIssue({
				code: 'custom',
				message: 'Provide either mail_name or subject with html/text content.',
			});
		}
	});
const AutomationMailCreateBody = z
	.object({
		name: z.string().min(1),
		subject: z.string().optional(),
		html: z.string().optional(),
		template_uuid: UuidSchema.optional(),
		fields: JsonObjectSchema.optional(),
		utm_tags: z.boolean().optional(),
		add_subscriber_tags: z.boolean().optional(),
		add_subscriber_link_tags: z.boolean().optional(),
	})
	.strict();
const AutomationMailUpdateBody = z
	.object({
		name: z.string().min(1),
		subject: z.string().optional(),
		html: z.string().optional(),
		template_uuid: UuidSchema.optional(),
		fields: JsonObjectSchema.optional(),
		utm_tags: z.boolean().optional(),
		add_subscriber_tags: z.boolean().optional(),
		add_subscriber_link_tags: z.boolean().optional(),
	})
	.strict();
const SuppressionListFilter = z
	.object({
		search: z.string().optional(),
		reason: z.enum(['hard_bounce', 'spam_complaint', 'manual']).optional(),
	})
	.strict();
function hasSupportedImageSignature(base64: string): boolean {
	try {
		const prefix = atob(base64.slice(0, 16));
		return (
			prefix.startsWith('\x89PNG\r\n\x1a\n') ||
			prefix.startsWith('\xff\xd8\xff') ||
			prefix.startsWith('GIF87a') ||
			prefix.startsWith('GIF89a') ||
			(prefix.startsWith('RIFF') && prefix.slice(8, 12) === 'WEBP')
		);
	} catch {
		return false;
	}
}
const ImageFileSchema = z
	.object({
		name: z.string().min(1),
		base64: z
			.string()
			.min(4)
			.max(11_184_812)
			.regex(/^[A-Za-z0-9+/]+={0,2}$/)
			.refine((value) => value.length % 4 === 0, 'Invalid base64 length')
			.refine((value) => {
				const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;
				return (value.length / 4) * 3 - padding <= 8 * 1024 * 1024;
			}, 'Image exceeds the documented 8 MB size limit')
			.refine(
				hasSupportedImageSignature,
				'Image bytes must be JPEG, PNG, GIF, or WebP',
			),
	})
	.strict();

const ApiUserOutput = data(
	z.object({ id: z.number(), email: z.string().email() }).strict(),
);
const PaginatedResource = <T extends z.ZodType>(resource: T) => page(resource);

export const MailcoachEndpointInputSchemas = {
	'user.get': EmptyInput,
	'emailLists.list': PageQuery(
		StringFilter({
			search: z.string().optional(),
			name: z.string().optional(),
		}),
		Sort(
			'name',
			'-name',
			'created_at',
			'-created_at',
			'active_subscribers_count',
			'-active_subscribers_count',
		),
	),
	'emailLists.get': z.object({ emailListUuid: UuidSchema }).strict(),
	'emailLists.create': EmailListBody,
	'emailLists.update': z
		.object({ emailListUuid: UuidSchema, body: EmailListBody })
		.strict(),
	'emailLists.delete': z.object({ emailListUuid: UuidSchema }).strict(),
	'subscribers.list': z
		.object({
			emailListUuid: UuidSchema,
			query: z
				.object({
					filter: z
						.object({
							email: z.string().optional(),
							search: z.string().optional(),
							status: z
								.enum(['unconfirmed', 'subscribed', 'unsubscribed'])
								.optional(),
						})
						.strict()
						.optional(),
					sort: Sort(
						'created_at',
						'-created_at',
						'updated_at',
						'-updated_at',
						'subscribed_at',
						'-subscribed_at',
						'unsubscribed_at',
						'-unsubscribed_at',
						'email',
						'-email',
						'first_name',
						'-first_name',
						'last_name',
						'-last_name',
					).optional(),
				})
				.strict()
				.optional(),
			next: z.string().url().optional(),
		})
		.strict()
		.refine(({ query, next }) => query === undefined || next === undefined, {
			message: 'Pass either a fresh query or a pagination link, not both',
		}),
	'subscribers.get': z.object({ subscriberUuid: UuidSchema }).strict(),
	'subscribers.subscribe': z
		.object({ emailListUuid: UuidSchema, body: SubscriberCreateBody })
		.strict(),
	'subscribers.update': z
		.object({ subscriberUuid: UuidSchema, body: SubscriberUpdateBody })
		.strict(),
	'subscribers.delete': z.object({ subscriberUuid: UuidSchema }).strict(),
	'subscribers.confirm': z.object({ subscriberUuid: UuidSchema }).strict(),
	'subscribers.confirmByEmail': z
		.object({ emailListUuid: UuidSchema, email: z.string().email() })
		.strict(),
	'subscribers.unsubscribe': z.object({ subscriberUuid: UuidSchema }).strict(),
	'subscribers.unsubscribeByEmail': z
		.object({ emailListUuid: UuidSchema, email: z.string().email() })
		.strict(),
	'subscribers.resendConfirmation': z
		.object({ subscriberUuid: UuidSchema })
		.strict(),
	'subscribers.resendConfirmationByEmail': z
		.object({ emailListUuid: UuidSchema, email: z.string().email() })
		.strict(),
	'subscribers.addTags': z
		.object({ subscriberUuid: UuidSchema, body: TagsBody })
		.strict(),
	'subscribers.removeTags': z
		.object({ subscriberUuid: UuidSchema, body: TagsBody })
		.strict(),
	'subscriberImports.list': z
		.object({ next: z.string().url().optional() })
		.strict(),
	'subscriberImports.get': z.object({ importUuid: UuidSchema }).strict(),
	'subscriberImports.create': ImportBody,
	'subscriberImports.update': z
		.object({ importUuid: UuidSchema, body: ImportBody })
		.strict(),
	'subscriberImports.delete': z.object({ importUuid: UuidSchema }).strict(),
	'subscriberImports.append': z
		.object({ importUuid: UuidSchema, subscribers_csv: z.string().min(1) })
		.strict(),
	'subscriberImports.start': z.object({ importUuid: UuidSchema }).strict(),
	'tags.list': z
		.object({ emailListUuid: UuidSchema, next: z.string().url().optional() })
		.strict(),
	'tags.get': z
		.object({ emailListUuid: UuidSchema, tagUuid: UuidSchema })
		.strict(),
	'tags.create': z
		.object({ emailListUuid: UuidSchema, body: TagCreateBody })
		.strict(),
	'tags.update': z
		.object({
			emailListUuid: UuidSchema,
			tagUuid: UuidSchema,
			body: TagUpdateBody,
		})
		.strict(),
	'tags.delete': z
		.object({ emailListUuid: UuidSchema, tagUuid: UuidSchema })
		.strict(),
	'segments.list': z
		.object({ emailListUuid: UuidSchema, next: z.string().url().optional() })
		.strict(),
	'segments.get': z
		.object({ emailListUuid: UuidSchema, segmentUuid: UuidSchema })
		.strict(),
	'segments.create': z
		.object({ emailListUuid: UuidSchema, body: SegmentCreateBody })
		.strict(),
	'segments.update': z
		.object({
			emailListUuid: UuidSchema,
			segmentUuid: UuidSchema,
			body: SegmentUpdateBody,
		})
		.strict(),
	'segments.delete': z
		.object({ emailListUuid: UuidSchema, segmentUuid: UuidSchema })
		.strict(),
	'templates.list': PageQuery(
		z.object({ search: z.string() }).strict(),
		Sort('name', '-name', 'updated_at', '-updated_at'),
	),
	'templates.get': z.object({ templateUuid: UuidSchema }).strict(),
	'templates.create': TemplateCreateBody,
	'templates.update': z
		.object({ templateUuid: UuidSchema, body: TemplateUpdateBody })
		.strict(),
	'templates.delete': z.object({ templateUuid: UuidSchema }).strict(),
	'campaigns.list': PageQuery(
		z
			.object({
				search: z.string().optional(),
				status: z.string().optional(),
				email_list_id: z.union([z.string(), z.number()]).optional(),
				'emailList.uuid': z.string().optional(),
				'contentItem.template.uuid': z.string().optional(),
			})
			.strict(),
		Sort(
			'name',
			'-name',
			'email_list_id',
			'-email_list_id',
			'unique_open_count',
			'-unique_open_count',
			'unique_click_count',
			'-unique_click_count',
			'unsubscribe_rate',
			'-unsubscribe_rate',
			'sent_to_number_of_subscribers',
			'-sent_to_number_of_subscribers',
			'sent',
			'-sent',
		),
	),
	'campaigns.get': z.object({ campaignUuid: UuidSchema }).strict(),
	'campaigns.create': CampaignBody,
	'campaigns.update': z
		.object({ campaignUuid: UuidSchema, body: CampaignBody })
		.strict(),
	'campaigns.delete': z.object({ campaignUuid: UuidSchema }).strict(),
	'campaigns.sendTest': z
		.object({
			campaignUuid: UuidSchema,
			email: z
				.string()
				.min(1)
				.refine((value) => {
					const addresses = value.split(',').map((address) => address.trim());
					return (
						addresses.length <= 10 &&
						addresses.every((address) => address.length > 0)
					);
				}, 'Provide one to ten comma-separated test recipients'),
		})
		.strict(),
	'campaigns.send': z.object({ campaignUuid: UuidSchema }).strict(),
	'campaigns.opens': z
		.object({ campaignUuid: UuidSchema, next: z.string().url().optional() })
		.strict(),
	'campaigns.clicks': z
		.object({ campaignUuid: UuidSchema, next: z.string().url().optional() })
		.strict(),
	'campaigns.unsubscribes': z
		.object({ campaignUuid: UuidSchema, next: z.string().url().optional() })
		.strict(),
	'campaigns.bounces': z
		.object({ campaignUuid: UuidSchema, next: z.string().url().optional() })
		.strict(),
	'transactionalMails.send': TransactionalMailBody,
	'transactionalMails.listTemplates': PageQuery(
		z.object({ name: z.string() }).strict(),
		Sort('created_at', '-created_at'),
	),
	'transactionalMails.getTemplate': z
		.object({ templateUuid: UuidSchema })
		.strict(),
	'automationMails.list': PageQuery(
		z
			.object({
				search: z.string().optional(),
				name: z.string().optional(),
				uuid: UuidSchema.optional(),
			})
			.strict(),
		Sort('name', '-name', 'created_at', '-created_at'),
	),
	'automationMails.get': z.object({ automationMailUuid: UuidSchema }).strict(),
	'automationMails.create': AutomationMailCreateBody,
	'automationMails.update': z
		.object({ automationMailUuid: UuidSchema, body: AutomationMailUpdateBody })
		.strict(),
	'automationMails.delete': z
		.object({ automationMailUuid: UuidSchema })
		.strict(),
	'sends.list': PageQuery(
		z
			.object({
				subscriber_uuid: UuidSchema.optional(),
				campaign_uuid: UuidSchema.optional(),
				automation_mail_uuid: UuidSchema.optional(),
				transactional_mail_log_item_uuid: UuidSchema.optional(),
			})
			.strict(),
		Sort('sent_at', '-sent_at'),
	),
	'sends.get': z.object({ sendUuid: UuidSchema }).strict(),
	'sends.delete': z.object({ sendUuid: UuidSchema }).strict(),
	'links.get': z.object({ linkUuid: UuidSchema }).strict(),
	'suppressions.list': PageQuery(
		SuppressionListFilter,
		Sort('created_at', '-created_at'),
	),
	'suppressions.get': z
		.object({ identifier: z.union([UuidSchema, z.string().email()]) })
		.strict(),
	'suppressions.create': z.object({ email: z.string().email() }).strict(),
	'suppressions.delete': z
		.object({ identifier: z.union([UuidSchema, z.string().email()]) })
		.strict(),
	'uploads.create': z
		.object({ images: z.array(ImageFileSchema).min(1).max(10) })
		.strict(),
} as const;

const JsonStatsPageSchema = page(
	z.record(z.string(), MailcoachJsonValueSchema),
);
const CampaignStatsPageSchema = JsonStatsPageSchema;
const TransactionalMailSendOutput = z.union([
	z.object({ uuid: z.string() }).strict(),
	z.undefined(),
]);
const LinkOutput = data(
	z
		.object({
			uuid: z.string(),
			url: z.string().url(),
			unique_click_count: z.number(),
			click_count: z.number(),
			clicks: z.array(LinkClickSchema),
		})
		.passthrough(),
);

export const MailcoachEndpointOutputSchemas = {
	'user.get': ApiUserOutput,
	'emailLists.list': PaginatedResource(EmailListSchema),
	'emailLists.get': data(EmailListSchema),
	'emailLists.create': data(EmailListSchema),
	'emailLists.update': data(EmailListSchema),
	'emailLists.delete': EmptyOutput,
	'subscribers.list': PaginatedResource(SubscriberSchema),
	'subscribers.get': data(SubscriberSchema),
	'subscribers.subscribe': data(SubscriberSchema),
	'subscribers.update': data(SubscriberSchema),
	'subscribers.delete': EmptyOutput,
	'subscribers.confirm': EmptyOutput,
	'subscribers.confirmByEmail': EmptyOutput,
	'subscribers.unsubscribe': EmptyOutput,
	'subscribers.unsubscribeByEmail': EmptyOutput,
	'subscribers.resendConfirmation': EmptyOutput,
	'subscribers.resendConfirmationByEmail': EmptyOutput,
	'subscribers.addTags': data(SubscriberSchema),
	'subscribers.removeTags': data(SubscriberSchema),
	'subscriberImports.list': PaginatedResource(ImportSchema),
	'subscriberImports.get': data(ImportSchema),
	'subscriberImports.create': data(ImportSchema),
	'subscriberImports.update': data(ImportSchema),
	'subscriberImports.delete': EmptyOutput,
	'subscriberImports.append': data(ImportSchema),
	'subscriberImports.start': EmptyOutput,
	'tags.list': PaginatedResource(TagSchema),
	'tags.get': data(TagSchema),
	'tags.create': data(TagSchema),
	'tags.update': data(TagSchema),
	'tags.delete': EmptyOutput,
	'segments.list': PaginatedResource(SegmentSchema),
	'segments.get': data(SegmentSchema),
	'segments.create': data(SegmentSchema),
	'segments.update': data(SegmentSchema),
	'segments.delete': EmptyOutput,
	'templates.list': PaginatedResource(TemplateSchema),
	'templates.get': data(TemplateSchema),
	'templates.create': data(TemplateSchema),
	'templates.update': data(TemplateSchema),
	'templates.delete': EmptyOutput,
	'campaigns.list': PaginatedResource(CampaignSchema),
	'campaigns.get': data(CampaignSchema),
	'campaigns.create': data(CampaignSchema),
	'campaigns.update': data(CampaignSchema),
	'campaigns.delete': EmptyOutput,
	'campaigns.sendTest': EmptyOutput,
	'campaigns.send': EmptyOutput,
	'campaigns.opens': CampaignStatsPageSchema,
	'campaigns.clicks': CampaignStatsPageSchema,
	'campaigns.unsubscribes': CampaignStatsPageSchema,
	'campaigns.bounces': CampaignStatsPageSchema,
	'transactionalMails.send': TransactionalMailSendOutput,
	'transactionalMails.listTemplates': PaginatedResource(
		TransactionalTemplateSchema,
	),
	'transactionalMails.getTemplate': data(TransactionalTemplateSchema),
	'automationMails.list': PaginatedResource(AutomationMailSchema),
	'automationMails.get': data(AutomationMailSchema),
	'automationMails.create': data(AutomationMailSchema),
	'automationMails.update': data(AutomationMailSchema),
	'automationMails.delete': EmptyOutput,
	'sends.list': PaginatedResource(SendSchema),
	'sends.get': data(SendSchema),
	'sends.delete': EmptyOutput,
	'links.get': LinkOutput,
	'suppressions.list': PaginatedResource(SuppressionSchema),
	'suppressions.get': data(SuppressionSchema),
	'suppressions.create': data(SuppressionSchema),
	'suppressions.delete': EmptyOutput,
	'uploads.create': data(z.array(UploadedImageSchema)),
} as const;

export type MailcoachEndpointInputs = {
	[K in keyof typeof MailcoachEndpointInputSchemas]: z.input<
		(typeof MailcoachEndpointInputSchemas)[K]
	>;
};
export type MailcoachEndpointOutputs = {
	[K in keyof typeof MailcoachEndpointOutputSchemas]: z.output<
		(typeof MailcoachEndpointOutputSchemas)[K]
	>;
};

export type UserGetInput = MailcoachEndpointInputs['user.get'];
export type UserGetResponse = MailcoachEndpointOutputs['user.get'];
export type EmailListsListInput = MailcoachEndpointInputs['emailLists.list'];
export type EmailListsGetInput = MailcoachEndpointInputs['emailLists.get'];
export type EmailListsCreateInput =
	MailcoachEndpointInputs['emailLists.create'];
export type EmailListsUpdateInput =
	MailcoachEndpointInputs['emailLists.update'];
export type EmailListsDeleteInput =
	MailcoachEndpointInputs['emailLists.delete'];
export type SubscribersListInput = MailcoachEndpointInputs['subscribers.list'];
export type SubscribersGetInput = MailcoachEndpointInputs['subscribers.get'];
export type SubscribersSubscribeInput =
	MailcoachEndpointInputs['subscribers.subscribe'];
export type SubscribersUpdateInput =
	MailcoachEndpointInputs['subscribers.update'];
export type SubscribersDeleteInput =
	MailcoachEndpointInputs['subscribers.delete'];
export type SubscriberImportsListInput =
	MailcoachEndpointInputs['subscriberImports.list'];
export type TagsListInput = MailcoachEndpointInputs['tags.list'];
export type SegmentsListInput = MailcoachEndpointInputs['segments.list'];
export type TemplatesListInput = MailcoachEndpointInputs['templates.list'];
export type CampaignsListInput = MailcoachEndpointInputs['campaigns.list'];
export type TransactionalMailSendInput =
	MailcoachEndpointInputs['transactionalMails.send'];
export type AutomationMailsListInput =
	MailcoachEndpointInputs['automationMails.list'];
export type SendsListInput = MailcoachEndpointInputs['sends.list'];
export type SuppressionsListInput =
	MailcoachEndpointInputs['suppressions.list'];
export type UploadsCreateInput = MailcoachEndpointInputs['uploads.create'];
