import { z } from 'zod';

// Inputs use Userlist's own parameter names. This is a write-only API: every
// operation answers 202 with no body, so outputs are acknowledgements the
// plugin builds, not responses it parses.
// Reference: https://userlist.com/docs/developers/push-api/

/**
 * A custom-property bag. Keys are normalised to snake_case by Userlist, values
 * may be any JSON, and nesting is allowed (`product_a.billing_plan`), so the
 * schema passes the shape through unchanged.
 */
const PropertiesSchema = z
	.record(z.string(), z.unknown())
	.describe(
		'Custom properties. Nested objects become dotted keys, and ISO 8601 strings are stored as timestamps.',
	);

/** A resource may be referenced by identifier or embedded whole. */
const UserRefSchema = z
	.union([z.string(), z.number(), z.record(z.string(), z.unknown())])
	.describe('A user identifier, or an embedded user object.');

const CompanyRefSchema = z
	.union([z.string(), z.number(), z.record(z.string(), z.unknown())])
	.describe('A company identifier, or an embedded company object.');

const TimestampSchema = z
	.string()
	.describe(
		'RFC 3339 / ISO 8601, e.g. 2024-01-15T10:30:00Z. No zone means UTC.',
	);

/** Every write answers 202 and nothing else, so this is what the plugin reports. */
const AcknowledgementSchema = z.object({
	accepted: z.literal(true),
	operation: z.string(),
	identifier: z.string().optional(),
	queuedAt: z.string(),
});

export type UserlistAcknowledgement = z.infer<typeof AcknowledgementSchema>;

// ── users ─────────────────────────────────────────────────────────────────

/**
 * Create or update a user.
 *
 * `identifier` is required unless `email` is given, and the reverse — Userlist
 * uses whichever it has to match an existing user.
 */
const UsersUpsertInputSchema = z
	.object({
		identifier: z
			.union([z.string().min(1), z.number()])
			.optional()
			.describe('Your id for the user. Required unless email is given.'),
		email: z
			.string()
			.min(1)
			.optional()
			.describe('The address. Required unless identifier is given.'),
		signed_up_at: TimestampSchema.optional(),
		properties: PropertiesSchema.optional(),
		company: CompanyRefSchema.optional().describe(
			'A single company, as a shortcut for one relationship.',
		),
		companies: z
			.array(CompanyRefSchema)
			.min(1)
			.optional()
			.describe(
				'Several companies, as a shortcut for relationships without properties.',
			),
		relationships: z
			.array(
				z
					.object({
						company: CompanyRefSchema,
						properties: PropertiesSchema.optional(),
					})
					.loose(),
			)
			.min(1)
			.optional()
			.describe(
				'Relationships to companies, which can each hold their own properties.',
			),
		preferences: z
			.array(
				z
					.object({
						topic: z
							.string()
							.min(1)
							.describe('The topic identifier from the Topics settings.'),
						subscribed: z.boolean(),
					})
					.loose(),
			)
			.min(1)
			.optional()
			.describe(
				'Subscription preferences. Only the topics sent are changed; the rest keep their value.',
			),
	})
	.superRefine((value, ctx) => {
		if (value.identifier === undefined && value.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['identifier'],
				message: 'A user needs an identifier, an email, or both.',
			});
		}
	});

export type UsersUpsertInput = z.infer<typeof UsersUpsertInputSchema>;

const UsersDeleteInputSchema = z
	.object({
		identifier: z.union([z.string().min(1), z.number()]).optional(),
		email: z.string().min(1).optional(),
	})
	.superRefine((value, ctx) => {
		if (value.identifier === undefined && value.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['identifier'],
				message:
					'A delete needs an identifier or an email to know who to remove.',
			});
		}
	});

export type UsersDeleteInput = z.infer<typeof UsersDeleteInputSchema>;

// ── companies ─────────────────────────────────────────────────────────────

const CompaniesUpsertInputSchema = z.object({
	identifier: z.union([z.string().min(1), z.number()]),
	name: z.string().optional(),
	signed_up_at: TimestampSchema.optional(),
	properties: PropertiesSchema.optional(),
});

export type CompaniesUpsertInput = z.infer<typeof CompaniesUpsertInputSchema>;

const CompaniesDeleteInputSchema = z.object({
	identifier: z.union([z.string().min(1), z.number()]),
});

export type CompaniesDeleteInput = z.infer<typeof CompaniesDeleteInputSchema>;

// ── relationships ─────────────────────────────────────────────────────────

const RelationshipsUpsertInputSchema = z.object({
	user: UserRefSchema,
	company: CompanyRefSchema,
	properties: PropertiesSchema.optional(),
});

export type RelationshipsUpsertInput = z.infer<
	typeof RelationshipsUpsertInputSchema
>;

const RelationshipsDeleteInputSchema = z.object({
	user: UserRefSchema,
	company: CompanyRefSchema,
});

export type RelationshipsDeleteInput = z.infer<
	typeof RelationshipsDeleteInputSchema
>;

// ── events ────────────────────────────────────────────────────────────────

const EventsCreateInputSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.describe('The event name, such as `subscription_activated`.'),
		user: UserRefSchema.optional().describe(
			'Required unless a company is given.',
		),
		company: CompanyRefSchema.optional().describe(
			'Required unless a user is given.',
		),
		occurred_at: TimestampSchema.optional().describe(
			'When it happened, for importing historic events. Defaults to now.',
		),
		properties: PropertiesSchema.optional(),
	})
	.superRefine((value, ctx) => {
		if (value.user === undefined && value.company === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['user'],
				message: 'An event needs a user, a company, or both.',
			});
		}
	});

export type EventsCreateInput = z.infer<typeof EventsCreateInputSchema>;

// ── transactional messages ────────────────────────────────────────────────

/** A part of a multipart body. */
const MessagePartSchema = z
	.object({
		type: z.string().describe('The part media type, such as `text/plain`.'),
		content: z.string(),
	})
	.loose();

const MessagesSendInputSchema = z
	.object({
		template: z
			.string()
			.optional()
			.describe(
				'The template identifier. When set, subject, body and channel come from it.',
			),
		user: UserRefSchema.optional().describe(
			'Required unless `to` is given. Always required for a web message.',
		),
		company: CompanyRefSchema.optional(),
		properties: PropertiesSchema.optional().describe(
			'Available in the template as `{{ event.<key> }}`.',
		),
		channel: z
			.enum(['email', 'web'])
			.optional()
			.describe(
				'Defaults to email. A web message requires `user` and forbids `to`.',
			),
		to: z
			.string()
			.optional()
			.describe(
				'The recipient address. Only for email; required unless `user` is set.',
			),
		from: z.string().optional().describe('The sender address. Email only.'),
		reply_to: z
			.string()
			.optional()
			.describe('The reply-to address. Email only.'),
		subject: z
			.string()
			.optional()
			.describe('Required when not using a template. Supports Liquid.'),
		preheader: z.string().optional().describe('Email preheader text.'),
		body: z
			.object({
				type: z.enum(['html', 'text', 'multipart']),
				content: z
					.union([z.string(), z.array(MessagePartSchema).min(1)])
					.describe(
						'A string for html and text, an array of parts for multipart.',
					),
			})
			.loose()
			.optional()
			.describe('Required when not using a template.'),
		sender: z
			.string()
			.optional()
			.describe('A sender identifier from the account.'),
		theme: z
			.union([z.string(), z.literal(false)])
			.optional()
			.describe('A theme identifier, or false to disable theming.'),
		topic: z
			.string()
			.optional()
			.describe('A topic identifier from the account.'),
	})
	.superRefine((value, ctx) => {
		if (value.template === undefined) {
			if (value.subject === undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['subject'],
					message: 'A message without a template needs a subject.',
				});
			}
			if (value.body === undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['body'],
					message: 'A message without a template needs a body.',
				});
			}
		}
		const channel = value.channel ?? 'email';
		if (channel === 'web') {
			if (value.user === undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['user'],
					message: 'A web message needs a user.',
				});
			}
			if (value.to !== undefined) {
				ctx.addIssue({
					code: 'custom',
					path: ['to'],
					message: 'A web message is delivered in-app, so it takes no `to`.',
				});
			}
		} else if (value.user === undefined && value.to === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['to'],
				message: 'An email message needs a user or a `to` address.',
			});
		}
	});

export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type UserlistEndpointInputs = {
	usersUpsert: UsersUpsertInput;
	usersDelete: UsersDeleteInput;
	companiesUpsert: CompaniesUpsertInput;
	companiesDelete: CompaniesDeleteInput;
	relationshipsUpsert: RelationshipsUpsertInput;
	relationshipsDelete: RelationshipsDeleteInput;
	eventsCreate: EventsCreateInput;
	messagesSend: MessagesSendInput;
};

export type UserlistEndpointOutputs = {
	usersUpsert: UserlistAcknowledgement;
	usersDelete: UserlistAcknowledgement;
	companiesUpsert: UserlistAcknowledgement;
	companiesDelete: UserlistAcknowledgement;
	relationshipsUpsert: UserlistAcknowledgement;
	relationshipsDelete: UserlistAcknowledgement;
	eventsCreate: UserlistAcknowledgement;
	messagesSend: UserlistAcknowledgement;
};

export const UserlistEndpointInputSchemas = {
	usersUpsert: UsersUpsertInputSchema,
	usersDelete: UsersDeleteInputSchema,
	companiesUpsert: CompaniesUpsertInputSchema,
	companiesDelete: CompaniesDeleteInputSchema,
	relationshipsUpsert: RelationshipsUpsertInputSchema,
	relationshipsDelete: RelationshipsDeleteInputSchema,
	eventsCreate: EventsCreateInputSchema,
	messagesSend: MessagesSendInputSchema,
} as const;

export const UserlistEndpointOutputSchemas = {
	usersUpsert: AcknowledgementSchema,
	usersDelete: AcknowledgementSchema,
	companiesUpsert: AcknowledgementSchema,
	companiesDelete: AcknowledgementSchema,
	relationshipsUpsert: AcknowledgementSchema,
	relationshipsDelete: AcknowledgementSchema,
	eventsCreate: AcknowledgementSchema,
	messagesSend: AcknowledgementSchema,
} as const;
