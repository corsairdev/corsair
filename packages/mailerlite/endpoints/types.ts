import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────
//
// MailerLite wraps every non-empty answer in `{ data, links, meta }` and ids
// are sent as strings, however numeric they look. Output fields the docs show
// as null (ip_address, unsubscribed_at, ...) are `.nullish()`.

const SUBSCRIBER_STATUSES = [
	'active',
	'unsubscribed',
	'unconfirmed',
	'bounced',
	'junk',
] as const;

const subscriberStatus = z.enum(SUBSCRIBER_STATUSES);

/** Comma-separated repetition of a string enum, as the docs describe. */
function commaList<const T extends readonly [string, ...string[]]>(
	values: T,
) {
	const member = values.join('|');
	return z
		.string()
		.regex(
			new RegExp(`^(${member})(,(${member}))*$`),
			`Must be a comma-separated list of: ${member}`,
		);
}

/** `yyyy-MM-dd HH:mm:ss`, the format every MailerLite timestamp uses. */
const timestamp = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, 'Must be yyyy-MM-dd HH:mm:ss');

/** `Y-m-d`, the format every MailerLite date filter uses. */
const date = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be Y-m-d, e.g. 2026-01-31');

/** `HH` 24-hour and `ii` minute formats from the schedule table. */
const hour = z.string().regex(/^([01]\d|2[0-3])$/, 'Must be HH, 00-23');
const minute = z.string().regex(/^[0-5]\d$/, 'Must be ii, 00-59');

/** Custom field values, keyed by field key. Unknown keys are ignored. */
const fieldValues = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.null()]),
);

/** Sort field with the docs' optional `-` descending prefix. */
function sortField(fields: string) {
	return z
		.string()
		.regex(
			new RegExp(`^-?(${fields})$`),
			`Must be one of ${fields}, optionally prefixed with - for descending order`,
		);
}

const links = z
	.object({
		first: z.string().nullish(),
		last: z.string().nullish(),
		prev: z.string().nullish(),
		next: z.string().nullish(),
	})
	.loose();

/** Cursor-style meta, sent by subscribers list. */
const cursorMeta = z
	.object({
		path: z.string().nullish(),
		per_page: z.number().nullish(),
		next_cursor: z.string().nullish(),
		prev_cursor: z.string().nullish(),
	})
	.loose();

/** Page-style meta, sent by the groups, fields, campaigns and activity lists. */
const pageMeta = z
	.object({
		current_page: z.number().nullish(),
		from: z.number().nullish(),
		last_page: z.number().nullish(),
		links: z
			.array(
				z
					.object({
						url: z.string().nullish(),
						label: z.string().nullish(),
						active: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
		path: z.string().nullish(),
		per_page: z.number().nullish(),
		to: z.number().nullish(),
		total: z.number().nullish(),
	})
	.loose();

const rateStat = z
	.object({ float: z.number().nullish(), string: z.string().nullish() })
	.loose();

// ── subscribers ───────────────────────────────────────────────────────────

const SubscriberSchema = z
	.object({
		id: z.string(),
		email: z.string(),
		status: z.string(),
		source: z.string().nullish(),
		sent: z.number().nullish(),
		opens_count: z.number().nullish(),
		clicks_count: z.number().nullish(),
		open_rate: z.number().nullish(),
		click_rate: z.number().nullish(),
		ip_address: z.string().nullish(),
		subscribed_at: z.string().nullish(),
		unsubscribed_at: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		fields: fieldValues.nullish(),
		groups: z.array(z.string()).nullish(),
		opted_in_at: z.string().nullish(),
		optin_ip: z.string().nullish(),
	})
	.loose();

export type MailerLiteSubscriber = z.infer<typeof SubscriberSchema>;

// subscribers.list

const SubscribersListInputSchema = z.object({
	filterStatus: commaList(SUBSCRIBER_STATUSES)
		.optional()
		.describe('Only subscribers with these statuses, comma separated'),
	filterGroup: z
		.string()
		.optional()
		.describe('Only subscribers in this group, by group id or name'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Subscribers per page, 1-1000. Defaults to 25'),
	cursor: z
		.string()
		.optional()
		.describe('Cursor for the page to return, read from meta.next_cursor'),
	sort: sortField('id|created_at|subscribed_at|unsubscribed_at|email|signup_date')
		.optional()
		.describe('Sort field, prefix with - for descending order'),
	include: z
		.literal('groups')
		.optional()
		.describe('Embed each subscriber groups in the response'),
});

export type SubscribersListInput = z.input<typeof SubscribersListInputSchema>;

const SubscribersListResponseSchema = z.object({
	data: z.array(SubscriberSchema),
	links: links.nullish(),
	meta: cursorMeta,
});

export type SubscribersListResponse = z.infer<
	typeof SubscribersListResponseSchema
>;

// subscribers.get

const SubscriberIdSchema = z
	.string()
	.min(1)
	.describe('Subscriber id, or the subscriber email address');

const SubscribersGetInputSchema = z.object({
	subscriberId: SubscriberIdSchema,
});

export type SubscribersGetInput = z.input<typeof SubscribersGetInputSchema>;

const SubscriberResponseSchema = z.object({ data: SubscriberSchema });

export type SubscriberResponse = z.infer<typeof SubscriberResponseSchema>;

// subscribers.upsert

const UpsertBodySchema = {
	email: z.string().email().describe('Subscriber email address, RFC 2821'),
	fields: fieldValues
		.optional()
		.describe(
			'Custom field values keyed by field key. Unknown keys are ignored; omission never removes a value',
		),
	groups: z
		.array(z.string())
		.optional()
		.describe(
			'Group ids to add the subscriber to. Additive only: omission never removes membership',
		),
	status: subscriberStatus
		.optional()
		.describe(
			'Subscriber status. New subscribers default to active, or unconfirmed on double opt-in accounts',
		),
	subscribed_at: timestamp
		.optional()
		.describe('Subscribe time, yyyy-MM-dd HH:mm:ss, at most one hour in the future'),
	ip_address: z
		.string()
		.optional()
		.describe('Signup IP address. A value that is not a valid IP address is ignored'),
	opted_in_at: timestamp.optional().describe('Opt-in confirmation time'),
	optin_ip: z
		.string()
		.optional()
		.describe('Confirmation IP address. A value that is not a valid IP address is ignored'),
	unsubscribed_at: timestamp
		.optional()
		.describe('Unsubscribe time; only used together with status unsubscribed'),
	resubscribe: z
		.boolean()
		.optional()
		.describe(
			'Set true to reactivate an unsubscribed, bounced or junk subscriber. Without it, a request that omits status fails with 422',
		),
	double_optin: z
		.boolean()
		.optional()
		.describe('Whether a new subscriber starts as unconfirmed. Ignored by most API tokens'),
	notes: z
		.array(z.string().max(10000))
		.optional()
		.describe('Free-text notes, each up to 10000 characters. Ignored for existing subscribers'),
} as const;

const SubscribersUpsertInputSchema = z.object({ ...UpsertBodySchema });

export type SubscribersUpsertInput = z.input<typeof SubscribersUpsertInputSchema>;

const SubscribersUpsertResponseSchema = SubscriberResponseSchema;

export type SubscribersUpsertResponse = z.infer<
	typeof SubscribersUpsertResponseSchema
>;

// subscribers.update

const SubscribersUpdateInputSchema = z.object({
	subscriberId: SubscriberIdSchema.describe('Subscriber id'),
	email: z
		.string()
		.email()
		.optional()
		.describe(
			'A new email address. Changeable once per calendar month, and it must not belong to another subscriber',
		),
	fields: fieldValues
		.optional()
		.describe('Custom field values keyed by field key. Pass null to clear a field'),
	groups: z
		.array(z.string())
		.optional()
		.describe(
			'The complete set of group ids the subscriber belongs to. The subscriber is removed from every group not listed, so an empty array removes them from all groups',
		),
	status: subscriberStatus
		.optional()
		.describe(
			'Subscriber status. Setting active or unconfirmed is silently ignored for unsubscribed, bounced or junk subscribers; only subscribers.upsert with resubscribe reactivates them',
		),
	subscribed_at: timestamp.optional().describe('Subscribe time'),
	ip_address: z.string().optional().describe('Signup IP address'),
	opted_in_at: timestamp.optional().describe('Opt-in confirmation time'),
	optin_ip: z.string().optional().describe('Confirmation IP address'),
	unsubscribed_at: timestamp.optional().describe('Unsubscribe time'),
});

export type SubscribersUpdateInput = z.input<typeof SubscribersUpdateInputSchema>;

const SubscribersUpdateResponseSchema = SubscriberResponseSchema;

export type SubscribersUpdateResponse = z.infer<
	typeof SubscribersUpdateResponseSchema
>;

// subscribers.delete

const SubscribersDeleteInputSchema = z.object({
	subscriberId: SubscriberIdSchema.describe('Subscriber id'),
});

export type SubscribersDeleteInput = z.input<typeof SubscribersDeleteInputSchema>;

/** A delete answers 204 with no body; the endpoint derives the result. */
const DeleteResponseSchema = z.object({
	deleted: z.literal(true),
	id: z.string(),
});

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

// subscribers.addToGroup / subscribers.removeFromGroup

const GroupMembershipInputSchema = z.object({
	subscriberId: z.string().min(1).describe('Existing subscriber id'),
	groupId: z.string().min(1).describe('Existing group id'),
});

export type GroupMembershipInput = z.input<typeof GroupMembershipInputSchema>;

// subscribers.addToGroup answers the group; removeFromGroup answers 204 and
// shares the delete result schema with the delete operations.

// ── groups ────────────────────────────────────────────────────────────────

const GroupSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		active_count: z.number().nullish(),
		sent_count: z.number().nullish(),
		opens_count: z.number().nullish(),
		open_rate: rateStat.nullish(),
		clicks_count: z.number().nullish(),
		click_rate: rateStat.nullish(),
		unsubscribed_count: z.number().nullish(),
		unconfirmed_count: z.number().nullish(),
		bounced_count: z.number().nullish(),
		junk_count: z.number().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();

export type MailerLiteGroup = z.infer<typeof GroupSchema>;

// groups.list

const GroupsListInputSchema = z.object({
	filterName: z
		.string()
		.optional()
		.describe('Only groups whose name contains this value'),
	sort: sortField('id|name|active_count|open_rate|click_rate|created_at')
		.optional()
		.describe('Sort field, prefix with - for descending order. Defaults to name'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Groups per page, 1-1000. Defaults to 1000, the account maximum'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number to return, counting from 1'),
});

export type GroupsListInput = z.input<typeof GroupsListInputSchema>;

const GroupsListResponseSchema = z.object({
	data: z.array(GroupSchema),
	links: links.nullish(),
	meta: pageMeta,
});

export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;

// groups.create

const GroupsCreateInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.max(255)
		.describe('Group name, up to 255 characters'),
});

export type GroupsCreateInput = z.input<typeof GroupsCreateInputSchema>;

const GroupResponseSchema = z.object({ data: GroupSchema });

export type GroupResponse = z.infer<typeof GroupResponseSchema>;

// groups.delete

const GroupsDeleteInputSchema = z.object({
	groupId: z.string().min(1).describe('Group id'),
});

export type GroupsDeleteInput = z.input<typeof GroupsDeleteInputSchema>;

// ── fields ────────────────────────────────────────────────────────────────

const FieldSchema = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string(),
	type: z.string(),
});

export type MailerLiteField = z.infer<typeof FieldSchema>;

const FieldsListInputSchema = z.object({
	filterKeyword: z
		.string()
		.optional()
		.describe('Only fields whose name contains this value'),
	filterType: commaList(['text', 'number', 'date'])
		.optional()
		.describe('Only fields of these types, comma separated'),
	sort: sortField('name|type')
		.optional()
		.describe('Sort field, prefix with - for descending order. Defaults to name'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Fields per page, 1-1000. Defaults to 200'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number to return, counting from 1'),
});

export type FieldsListInput = z.input<typeof FieldsListInputSchema>;

const FieldsListResponseSchema = z.object({
	data: z.array(FieldSchema),
	links: links.nullish(),
	meta: pageMeta,
});

export type FieldsListResponse = z.infer<typeof FieldsListResponseSchema>;

// ── campaigns ─────────────────────────────────────────────────────────────

const CampaignEmailSchema = z
	.object({
		id: z.string().nullish(),
		subject: z.string().nullish(),
		from: z.string().nullish(),
		from_name: z.string().nullish(),
		reply_to: z.string().nullish(),
		plain_text: z.string().nullish(),
		is_designed: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

const CampaignSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string(),
		status: z.string(),
		delivery_schedule: z.string().nullish(),
		scheduled_for: z.string().nullish(),
		queued_at: z.string().nullish(),
		started_at: z.string().nullish(),
		finished_at: z.string().nullish(),
		stopped_at: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		emails: z.array(CampaignEmailSchema).nullish(),
		used_in_automations: z.boolean().nullish(),
	})
	.loose();

export type MailerLiteCampaign = z.infer<typeof CampaignSchema>;

// campaigns.list

const CampaignsListInputSchema = z.object({
	filterStatus: z
		.enum(['sent', 'draft', 'ready'])
		.optional()
		.describe(
			'Only campaigns with this status. Defaults to ready when any other filter is given',
		),
	filterType: z
		.enum(['regular', 'ab', 'resend', 'rss', 'multivariate', 'all'])
		.optional()
		.describe('Only campaigns of this type'),
	filterDateFrom: date
		.optional()
		.describe('Only campaigns from this date onwards, Y-m-d'),
	filterDateTo: date
		.optional()
		.describe('Only campaigns up to this date, Y-m-d'),
	filterFolder: z
		.number()
		.int()
		.optional()
		.describe('Only campaigns in this folder, by folder id'),
	filterSubject: z
		.string()
		.optional()
		.describe('Only campaigns whose subject line contains this value'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Campaigns per page, 1-100. Defaults to 25'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number to return, counting from 1'),
});

export type CampaignsListInput = z.input<typeof CampaignsListInputSchema>;

const CampaignsListResponseSchema = z.object({
	data: z.array(CampaignSchema),
	links: links.nullish(),
	meta: pageMeta,
});

export type CampaignsListResponse = z.infer<typeof CampaignsListResponseSchema>;

// campaigns.create

const CampaignEmailInputSchema = z.object({
	subject: z
		.string()
		.max(255)
		.optional()
		.describe('Subject line, up to 255 characters. Required unless this is a multivariate campaign'),
	from_name: z
		.string()
		.max(255)
		.optional()
		.describe('Sender name, up to 255 characters. Required unless this is a multivariate campaign'),
	from: z
		.string()
		.email()
		.optional()
		.describe(
			'Sender email address. Must already be verified on the MailerLite account',
		),
	reply_to: z
		.string()
		.email()
		.optional()
		.describe('Reply-to address. Must already be verified on the MailerLite account'),
	content: z
		.string()
		.optional()
		.describe(
			'Email body as HTML. Not on every plan; not allowed when editor is simple',
		),
	editor: z
		.literal('simple')
		.optional()
		.describe(
			'Set to simple to build the content through the emails endpoints instead',
		),
	template_id: z
		.number()
		.int()
		.optional()
		.describe('Simple-editor template to start from; allowed only when editor is simple'),
});

const AbSettingsSchema = z
	.object({
		test_type: z
			.enum(['subject', 'sender', 'sending_time'])
			.describe('What the A/B test varies'),
		select_winner_by: z
			.enum(['o', 'c'])
			.optional()
			.describe('Metric for picking the winner: o for opens, c for clicks'),
		after_time_amount: z.number().int().optional().describe('Wait before picking the winner'),
		after_time_unit: z.enum(['h', 'd']).optional().describe('Unit for the wait: h or d'),
		test_split: z
			.number()
			.int()
			.min(5)
			.max(100)
			.optional()
			.describe('Percentage of recipients who receive the test, 5-25 for subject and sender, 100 for sending_time'),
		b_value: z
			.object({
				subject: z.string().max(255).optional(),
				from_name: z.string().max(255).optional(),
				from: z.string().email().optional(),
			})
			.loose()
			.optional()
			.describe('The B version; its keys depend on test_type'),
	})
	.loose();

const ResendSettingsSchema = z
	.object({
		test_type: z.literal('subject').describe('What the resend varies'),
		select_winner_by: z
			.enum(['o', 'c'])
			.describe('Who receives the second email: o for non-openers, c for non-clickers'),
		b_value: z
			.object({ subject: z.string().max(255) })
			.describe('The content of the resent email'),
	})
	.loose();

const MultivariateSettingsSchema = z
	.object({
		test_variants: z
			.object({
				subject: z
					.array(z.string().max(998))
					.min(1)
					.describe('Subject line variants, each up to 998 characters'),
				sender: z
					.array(
						z.object({
							from: z.string().email(),
							from_name: z.string().max(255),
						}),
					)
					.min(1)
					.describe('Sender variants'),
				content: z
					.number()
					.int()
					.min(1)
					.max(8)
					.describe('How many content variants to test, 1-8'),
				sending_time: z
					.number()
					.int()
					.min(1)
					.max(8)
					.describe('How many sending times to test, 1-8'),
			})
			.describe(
				'All four keys are required; the combinations must come to 2-8 emails. Each variant needs at least 10 recipients',
			),
		select_winner_by: z.enum(['o', 'c']).optional(),
		after_time_amount: z
			.number()
			.int()
			.min(1)
			.max(10)
			.optional()
			.describe('Wait before picking the winner, 1-10'),
		after_time_unit: z.enum(['h', 'd']).optional(),
		test_split: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('100 when there are fewer than 1000 recipients per variant, otherwise at most 50'),
	})
	.loose();

const SettingsSchema = z
	.object({
		ecommerce_tracking: z
			.boolean()
			.optional()
			.describe('Enable e-commerce link tracking when the content contains shop URLs'),
	})
	.loose();

const CampaignsCreateInputSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.max(255)
			.describe('Campaign name, up to 255 characters'),
		type: z
			.enum(['regular', 'ab', 'resend', 'multivariate'])
			.describe('Campaign kind. resend and multivariate need a paid plan'),
		language_id: z
			.number()
			.int()
			.optional()
			.describe('Language for the unsubscribe template. Defaults to English'),
		emails: z
			.array(CampaignEmailInputSchema)
			.min(1)
			.describe(
				'Exactly one email object, unless this is a multivariate campaign testing content',
			),
		groups: z
			.array(z.string())
			.optional()
			.describe('Group ids to send to. Ignored when segments is also given'),
		segments: z
			.array(z.string())
			.optional()
			.describe('Segment ids to send to. Takes precedence over groups'),
		ab_settings: AbSettingsSchema.optional(),
		resend_settings: ResendSettingsSchema.optional(),
		multivariate_settings: MultivariateSettingsSchema.optional(),
		settings: SettingsSchema.optional(),
	})
	.superRefine((input, ctx) => {
		const multivariate = input.type === 'multivariate';
		if (!multivariate && input.emails.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				message:
					'A non-multivariate campaign takes exactly one email object',
				path: ['emails'],
			});
		}
		if (!multivariate) {
			for (const [index, email] of input.emails.entries()) {
				if (!email.subject || !email.from_name || !email.from) {
					ctx.addIssue({
						code: 'custom',
						message:
							'subject, from_name and from are required on every email unless this is a multivariate campaign',
						path: ['emails', index],
					});
				}
			}
		}
		for (const [index, email] of input.emails.entries()) {
			if (email.editor === 'simple' && email.content !== undefined) {
				ctx.addIssue({
					code: 'custom',
					message:
						'content is not allowed when editor is simple; build it through the emails endpoints',
					path: ['emails', index, 'content'],
				});
			}
		}
		const needed =
			input.type === 'ab'
				? ('ab_settings' as const)
				: input.type === 'resend'
					? ('resend_settings' as const)
					: input.type === 'multivariate'
						? ('multivariate_settings' as const)
						: undefined;
		if (needed && !input[needed]) {
			ctx.addIssue({
				code: 'custom',
				message: `${needed} is required when type is ${input.type}`,
				path: [needed],
			});
		}
	});

export type CampaignsCreateInput = z.input<typeof CampaignsCreateInputSchema>;

const CampaignResponseSchema = z.object({ data: CampaignSchema });

export type CampaignResponse = z.infer<typeof CampaignResponseSchema>;

// campaigns.schedule

const ScheduleSchema = z
	.object({
		date: date
			.optional()
			.describe('Send date, Y-m-d, in the future. For timezone_based, after today'),
		hours: hour.optional().describe('Send hour, HH'),
		minutes: minute.optional().describe('Send minute, ii'),
		timezone_id: z
			.number()
			.int()
			.optional()
			.describe('Timezone for the send time, by timezone id. Defaults to the account timezone'),
	})
	.loose();

const ResendScheduleSchema = z
	.object({
		delivery: z
			.enum(['day', 'scheduled'])
			.describe('When the second email of an auto-resend campaign goes out'),
		date: date
			.optional()
			.describe('Resend date, Y-m-d, at least 24 hours after the first send'),
		hours: hour.optional(),
		minutes: minute.optional(),
		timezone_id: z.number().int().optional(),
	})
	.loose();

const SendingTimeEntrySchema = z
	.object({
		date: date.describe('Send date, Y-m-d, in the future'),
		hours: hour.describe('Send hour, HH'),
		minutes: minute.describe('Send minute, ii'),
		timezone_id: z.number().int().optional(),
	})
	.loose();

const CampaignsScheduleInputSchema = z
	.object({
		campaignId: z.string().min(1).describe('Campaign id'),
		delivery: z
			.enum(['instant', 'scheduled', 'timezone_based', 'smart_sending'])
			.optional()
			.describe(
				'When to send. instant sends now and cannot be unsent; required unless the campaign type is rss, which takes no body',
			),
		schedule: ScheduleSchema.optional().describe(
			'Send time, used by the scheduled, timezone_based and smart_sending deliveries',
		),
		resend: ResendScheduleSchema.optional()
			.describe('Second-send time, for auto-resend campaigns only'),
		sending_time_test_schedule: z
			.array(SendingTimeEntrySchema)
			.optional()
			.describe(
				'Send times to test, ordered soonest first. Only for campaigns testing sending time: exactly 2 entries for A/B, 2-8 for multivariate',
			),
	})
	.superRefine((input, ctx) => {
		if (
			input.delivery === 'scheduled' ||
			input.delivery === 'timezone_based' ||
			input.delivery === 'smart_sending'
		) {
			if (!input.schedule?.date) {
				ctx.addIssue({
					code: 'custom',
					message: `schedule.date is required for ${input.delivery} delivery`,
					path: ['schedule', 'date'],
				});
			}
		}
		if (input.delivery === 'scheduled' || input.delivery === 'timezone_based') {
			if (!input.schedule?.hours || !input.schedule?.minutes) {
				ctx.addIssue({
					code: 'custom',
					message: `schedule.hours and schedule.minutes are required for ${input.delivery} delivery`,
					path: ['schedule', 'hours'],
				});
			}
		}
	});

export type CampaignsScheduleInput = z.input<typeof CampaignsScheduleInputSchema>;

const CampaignsScheduleResponseSchema = CampaignResponseSchema;

export type CampaignsScheduleResponse = z.infer<
	typeof CampaignsScheduleResponseSchema
>;

// campaigns.cancel

const CampaignsCancelInputSchema = z.object({
	campaignId: z.string().min(1).describe('Campaign id'),
});

export type CampaignsCancelInput = z.input<typeof CampaignsCancelInputSchema>;

const CampaignsCancelResponseSchema = CampaignResponseSchema;

export type CampaignsCancelResponse = z.infer<
	typeof CampaignsCancelResponseSchema
>;

// campaigns.activity

const ActivitySubscriberSchema = z
	.object({
		id: z.string().nullish(),
		email: z.string().nullish(),
		status: z.string().nullish(),
		sent: z.number().nullish(),
		opens_count: z.number().nullish(),
		clicks_count: z.number().nullish(),
		open_rate: z.number().nullish(),
		click_rate: z.number().nullish(),
	})
	.loose();

const SubscriberActivitySchema = z
	.object({
		id: z.string(),
		opens_count: z.number().nullish(),
		clicks_count: z.number().nullish(),
		subscriber: ActivitySubscriberSchema.nullish(),
	})
	.loose();

const ActivityAggregationsSchema = z
	.object({
		sum: z.number().nullish(),
		opened: z.number().nullish(),
		unopened: z.number().nullish(),
		clicked: z.number().nullish(),
		unsubscribed: z.number().nullish(),
		forwarded: z.number().nullish(),
		hardbounced: z.number().nullish(),
		softbounced: z.number().nullish(),
		junk: z.number().nullish(),
	})
	.loose();

const CampaignsActivityInputSchema = z.object({
	campaignId: z
		.string()
		.min(1)
		.describe('Id of a sent campaign'),
	filterType: z
		.enum([
			'opened',
			'unopened',
			'clicked',
			'unsubscribed',
			'forwarded',
			'hardbounced',
			'softbounced',
			'junk',
			'sent',
			'social_interaction',
		])
		.optional()
		.describe('Only recipients with this kind of activity'),
	filterSearch: z
		.string()
		.optional()
		.describe('Only the activity of the subscriber with this email address'),
	limit: z
		.union([
			z.literal(10),
			z.literal(25),
			z.literal(50),
			z.literal(100),
		])
		.optional()
		.describe('Recipients per page: 10, 25, 50 or 100'),
	sort: sortField('id|clicks_count|opens_count')
		.optional()
		.describe('Sort field, prefix with - for descending order'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number to return, counting from 1'),
	include: z
		.union([z.literal('subscriber'), z.literal('subscriber.groups')])
		.optional()
		.describe('Relations to embed in the response'),
});

export type CampaignsActivityInput = z.input<typeof CampaignsActivityInputSchema>;

const CampaignsActivityResponseSchema = z.object({
	data: z.array(SubscriberActivitySchema),
	links: links.nullish(),
	meta: pageMeta.extend({
		aggregations: ActivityAggregationsSchema.nullish(),
	}),
});

export type CampaignsActivityResponse = z.infer<
	typeof CampaignsActivityResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export const MailerLiteEndpointInputSchemas = {
	subscribersList: SubscribersListInputSchema,
	subscribersGet: SubscribersGetInputSchema,
	subscribersUpsert: SubscribersUpsertInputSchema,
	subscribersUpdate: SubscribersUpdateInputSchema,
	subscribersDelete: SubscribersDeleteInputSchema,
	subscribersAddToGroup: GroupMembershipInputSchema,
	subscribersRemoveFromGroup: GroupMembershipInputSchema,
	groupsList: GroupsListInputSchema,
	groupsCreate: GroupsCreateInputSchema,
	groupsDelete: GroupsDeleteInputSchema,
	fieldsList: FieldsListInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsCreate: CampaignsCreateInputSchema,
	campaignsSchedule: CampaignsScheduleInputSchema,
	campaignsCancel: CampaignsCancelInputSchema,
	campaignsActivity: CampaignsActivityInputSchema,
} as const;

export type MailerLiteEndpointInputs = {
	[K in keyof typeof MailerLiteEndpointInputSchemas]: z.input<
		(typeof MailerLiteEndpointInputSchemas)[K]
	>;
};

export const MailerLiteEndpointOutputSchemas = {
	subscribersList: SubscribersListResponseSchema,
	subscribersGet: SubscriberResponseSchema,
	subscribersUpsert: SubscribersUpsertResponseSchema,
	subscribersUpdate: SubscribersUpdateResponseSchema,
	subscribersDelete: DeleteResponseSchema,
	subscribersAddToGroup: GroupResponseSchema,
	subscribersRemoveFromGroup: DeleteResponseSchema,
	groupsList: GroupsListResponseSchema,
	groupsCreate: GroupResponseSchema,
	groupsDelete: DeleteResponseSchema,
	fieldsList: FieldsListResponseSchema,
	campaignsList: CampaignsListResponseSchema,
	campaignsCreate: CampaignResponseSchema,
	campaignsSchedule: CampaignsScheduleResponseSchema,
	campaignsCancel: CampaignsCancelResponseSchema,
	campaignsActivity: CampaignsActivityResponseSchema,
} as const;

export type MailerLiteEndpointOutputs = {
	[K in keyof typeof MailerLiteEndpointOutputSchemas]: z.infer<
		(typeof MailerLiteEndpointOutputSchemas)[K]
	>;
};
