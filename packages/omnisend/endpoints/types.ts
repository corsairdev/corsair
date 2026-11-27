import { z } from 'zod';

// Inputs and outputs follow Omnisend's official reference pages
// (api-docs.omnisend.com, OpenAPI fragments merged for version 2026-03-15).
//
// Omnisend speaks plain JSON: single resources return the object directly and
// list routes return `{ "<resource>": [...], "paging": {...} }`. Cursor-paged
// groups (contacts, campaigns, templates) page with `after`/`before` and cap
// at 250 rows; offset-paged groups (products, categories, batches) page with
// `offset`/`limit`.
//
// Outputs are `.loose()` and their fields nullish, so a field Omnisend adds
// cannot fail a call that has already happened. Prices are floats in the
// store currency in 2026-03-15 (the legacy v3 API used integer cents).

// ── Shared pieces ────────────────────────────────────────────────────────────

/**
 * A value inside a caller-owned map, such as event properties or batch items.
 *
 * These are open maps whose keys the caller defines, so the leaves are typed
 * as JSON rather than by a provider model. Written as a recursive union rather
 * than `z.unknown()` because the docs generator renders `ZodUnknown` as `any`.
 */
type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

/** An open JSON object, typed as one value per key. */
const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

/** `paging` of a cursor-paged list route. */
const CursorPagingSchema = z
	.object({
		limit: z.number().nullish(),
		hasMore: z.boolean().nullish(),
		cursors: z
			.object({
				// Null at either end of the list.
				after: z.string().nullish(),
				before: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

/** `paging` of an offset-paged list route. */
const OffsetPagingSchema = z
	.object({
		limit: z.number().nullish(),
		offset: z.number().nullish(),
		// Absolute URLs; absent on the last page.
		next: z.string().nullish(),
		previous: z.string().nullish(),
	})
	.loose();

/** The cursor query parameters of a cursor-paged list route. */
function cursorPage(maxLimit: number, defaultLimit: number) {
	return {
		limit: z
			.number()
			.int()
			.min(1)
			.max(maxLimit)
			.optional()
			.describe(
				`Rows per page, 1 to ${maxLimit}. Defaults to ${defaultLimit}.`,
			),
		after: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Opaque cursor for the next page, taken from the previous response `paging.cursors.after`. Omit for the first page.',
			),
		before: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Opaque cursor for the previous page, taken from `paging.cursors.before`.',
			),
	};
}

/** The offset query parameters of an offset-paged list route. */
function offsetPage(defaultLimit: number) {
	return {
		offset: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('First row to return, 0-based. Defaults to 0.'),
		limit: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe(`Rows per page. Defaults to ${defaultLimit}.`),
	};
}

/** The direction of a sort, on every sorted list route. */
const DirectionSchema = z
	.enum(['asc', 'desc'])
	.optional()
	.describe('Sort direction. Defaults to desc.');

/**
 * `nextCursor` on a cursor-paged response, derived in the endpoint from
 * `paging.cursors.after`. Declared here rather than added by a `.transform()`
 * so the docs generator can see it.
 */
function nextCursorField() {
	return z
		.string()
		.nullish()
		.describe('Pass as `after` to read the next page; absent on the last one.');
}

/** `nextOffset` on an offset-paged response, derived from `paging.next`. */
function nextOffsetField() {
	return z
		.number()
		.nullish()
		.describe(
			'Pass as `offset` to read the next page; absent on the last one.',
		);
}

/** An RFC 3339 timestamp, as the spec's `format: date-time` fields require. */
const DateTimeSchema = z.iso.datetime({ offset: true });

// ── contacts ────────────────────────────────────────────────────────────────

const ContactIdentifierSchema = z
	.object({
		id: z
			.string()
			.min(1)
			.describe(
				'Identifier value: a valid email address, or a phone number in E.164 format.',
			),
		type: z.enum(['email', 'phone']).describe('Identifier type.'),
		channels: z
			.record(
				z.string(),
				z
					.object({
						status: z
							.enum(['subscribed', 'nonSubscribed', 'unsubscribed'])
							.describe('Subscription status for this channel.'),
						statusChangedAt: DateTimeSchema.optional(),
					})
					.loose(),
			)
			.optional()
			.describe(
				'Subscription states keyed by channel, such as `email` or `phone`.',
			),
		consent: z
			.object({
				createdAt: DateTimeSchema.optional(),
				ip: z.string().optional(),
				source: z.string().optional(),
				userAgent: z.string().optional(),
			})
			.loose()
			.optional()
			.describe('Consent information for this identifier.'),
		sendWelcomeMessage: z
			.boolean()
			.optional()
			.describe(
				'Send a welcome message for this identifier. Defaults to true; takes effect only if the welcome workflow is enabled.',
			),
		source: z
			.string()
			.optional()
			.describe('Source of the identifier, such as `api`.'),
	})
	.loose();

const ContactTrackingConsentsSchema = z
	.object({
		emailOpen: z
			.object({
				status: z.enum(['given', 'declined']).describe('Consent status.'),
				statusDate: DateTimeSchema.optional(),
			})
			.loose()
			.optional()
			.describe('Email open tracking consent.'),
	})
	.loose();

/**
 * The contact body shared by `contacts.upsert`, `contacts.update` and
 * `contacts.updateByEmail`.
 */
const ContactRequestBody = {
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	gender: z
		.enum(['m', 'f'])
		.optional()
		.describe('Contact gender: `m` male, `f` female.'),
	birthdate: z
		.string()
		.optional()
		.describe('Contact birthdate in YYYY-MM-DD format.'),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	country: z
		.string()
		.optional()
		.describe(
			'Country name; used to derive the ISO code when countryCode is absent.',
		),
	countryCode: z
		.string()
		.optional()
		.describe('ISO 3166-1 alpha-2 code; takes priority over country.'),
	postalCode: z.string().optional(),
	createdAt: z
		.string()
		.optional()
		.describe('Stored as the `externalCreated` custom property when provided.'),
	identifiers: z
		.array(ContactIdentifierSchema)
		.optional()
		.describe('Contact identifiers (email and/or phone).'),
	tags: z
		.array(z.string())
		.max(100)
		.optional()
		.describe(
			'Labels for the contact. REPLACES the existing tags: every tag not sent is removed, and an empty array removes all of them. To add or remove individual tags use contacts.addTags or contacts.removeTags. A source tag such as `source: api` is recommended.',
		),
	customProperties: JsonObjectSchema.optional(),
	trackingConsents: ContactTrackingConsentsSchema.optional(),
};

const ContactSchema = z
	.object({
		id: z.string(),
		email: z.string().nullish(),
		phone: z.array(z.string()).nullish(),
		status: z
			.enum(['subscribed', 'unsubscribed', 'nonSubscribed'])
			.nullish()
			.describe('Email channel subscription status.'),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		gender: z.enum(['m', 'f']).nullish(),
		birthdate: z.string().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		country: z.string().nullish(),
		countryCode: z.string().nullish(),
		postalCode: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		segments: z.array(z.string()).nullish(),
		customProperties: JsonObjectSchema.nullish(),
		identifiers: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						type: z.enum(['email', 'phone']).nullish(),
						channels: JsonObjectSchema.nullish(),
					})
					.loose(),
			)
			.nullish(),
		consents: z.array(JsonObjectSchema).nullish(),
		statuses: z.array(JsonObjectSchema).nullish(),
		optIns: z.array(JsonObjectSchema).nullish(),
		trackingConsents: JsonObjectSchema.nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

const ContactsListInputSchema = z
	.object({
		...cursorPage(250, 100),
		sort: z
			.enum(['createdAt', 'updatedAt'])
			.optional()
			.describe('Sort field. Defaults to createdAt.'),
		direction: DirectionSchema,
		email: z.string().optional(),
		phone: z.string().optional(),
		status: z.enum(['subscribed', 'unsubscribed', 'nonSubscribed']).optional(),
		segmentID: z.string().optional(),
		tag: z.string().optional(),
		updatedAtFrom: z
			.string()
			.optional()
			.describe('Only contacts updated at or after this time.'),
	})
	.superRefine((value, ctx) => {
		// Both restrictions are documented on the list-contacts route; Omnisend
		// rejects such requests with 400.
		if (value.tag !== undefined && value.status !== undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['tag'],
				message: 'tag and status cannot be used in the same request.',
			});
		}
		if (value.updatedAtFrom !== undefined) {
			for (const [key, other] of [
				['email', value.email],
				['phone', value.phone],
				['status', value.status],
				['segmentID', value.segmentID],
				['tag', value.tag],
			] as const) {
				if (other !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: [key],
						message: `updatedAtFrom cannot be combined with ${key}.`,
					});
				}
			}
		}
	});

const ContactsGetInputSchema = z.object({ id: z.string().min(1) });

const ContactsUpsertInputSchema = z.object(ContactRequestBody);

const ContactsUpdateInputSchema = z.object({
	id: z.string().min(1),
	...ContactRequestBody,
});

const ContactsUpdateByEmailInputSchema = z.object({
	email: z
		.string()
		.min(1)
		.describe('The email address identifying the contact to update.'),
	...ContactRequestBody,
});

const ContactTagsInput = {
	contactIDs: z
		.array(z.string())
		.max(250)
		.optional()
		.describe('Contact IDs to tag or untag.'),
	emails: z
		.array(z.string())
		.max(250)
		.optional()
		.describe('Emails of the contacts to tag or untag.'),
	phones: z
		.array(z.string())
		.max(250)
		.optional()
		.describe(
			'Phone numbers of the contacts to tag or untag, in E.164 format.',
		),
	segmentID: z
		.string()
		.optional()
		.describe('Segment whose contacts get or lose the tags.'),
};

const ContactsAddTagsInputSchema = z
	.object({ ...ContactTagsInput, tags: z.array(z.string()).min(1).max(100) })
	.superRefine((value, ctx) => {
		if (
			value.contactIDs === undefined &&
			value.emails === undefined &&
			value.phones === undefined &&
			value.segmentID === undefined
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['contactIDs'],
				message: 'One of contactIDs, emails, phones or segmentID is required.',
			});
		}
	});

const ContactsRemoveTagsInputSchema = z
	.object({ ...ContactTagsInput, tags: z.array(z.string()).min(1).max(100) })
	.superRefine((value, ctx) => {
		if (
			value.contactIDs === undefined &&
			value.emails === undefined &&
			value.phones === undefined &&
			value.segmentID === undefined
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['contactIDs'],
				message: 'One of contactIDs, emails, phones or segmentID is required.',
			});
		}
	});

const ContactsListResponseSchema = z.object({
	contacts: z.array(ContactSchema),
	paging: CursorPagingSchema.nullish(),
	nextCursor: nextCursorField(),
});

const ContactsGetResponseSchema = ContactSchema;

// `POST /contacts` and both PATCH routes answer the contact either way.
const ContactsMutateResponseSchema = ContactSchema;

/** The 202 tagging routes answer no body. */
const AcceptedSchema = z.object({ accepted: z.boolean() });

// ── campaigns ───────────────────────────────────────────────────────────────

const CampaignStatusSchema = z.enum([
	'error',
	'onHold',
	'sent',
	'paused',
	'started',
	'stopped',
	'expired',
	'draft',
	'scheduled',
	'canceled',
]);

const UtmtagsSchema = z
	.object({
		source: z.string().max(250).optional(),
		medium: z.string().max(250).optional(),
		campaign: z.string().max(250).optional(),
	})
	.loose();

const SendingSettingsSchema = z
	.object({
		strategy: z
			.enum(['immediate', 'scheduled', 'personalized'])
			.optional()
			.describe(
				'Sending strategy. Defaults to immediate; `personalized` requires a plan with personalized send times.',
			),
		scheduledAt: DateTimeSchema.optional().describe(
			'Required when strategy is scheduled or personalized; must not be set otherwise. Must be in the future and within one year.',
		),
		optimizeFor: z
			.enum(['opens', 'clicks', 'orders'])
			.optional()
			.describe(
				'Required when strategy is personalized; must not be set otherwise.',
			),
		respectQuietHours: z
			.boolean()
			.optional()
			.describe(
				'Personalized sends avoid contact-local hours 22:00-06:59. Only valid with the personalized strategy.',
			),
		isTZOptimizationEnabled: z
			.boolean()
			.optional()
			.describe(
				'Timezone optimization; email campaigns with immediate or scheduled strategy only.',
			),
	})
	.superRefine((value, ctx) => {
		const strategy = value.strategy ?? 'immediate';
		if (strategy === 'scheduled' || strategy === 'personalized') {
			if (value.scheduledAt === undefined) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['scheduledAt'],
					message: `scheduledAt is required when strategy is ${strategy}.`,
				});
			}
		} else if (value.scheduledAt !== undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['scheduledAt'],
				message: 'scheduledAt must not be set for the immediate strategy.',
			});
		}
		if (strategy === 'personalized') {
			if (value.optimizeFor === undefined) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['optimizeFor'],
					message: 'optimizeFor is required when strategy is personalized.',
				});
			}
		} else if (value.optimizeFor !== undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['optimizeFor'],
				message:
					'optimizeFor must not be set when strategy is not personalized.',
			});
		}
		if (strategy !== 'personalized' && value.respectQuietHours !== undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['respectQuietHours'],
				message:
					'respectQuietHours must not be set when strategy is not personalized.',
			});
		}
	});

const AudienceSchema = z
	.object({
		includedSegmentIDs: z
			.array(z.string())
			.optional()
			.describe('Segments to include. Empty includes all subscribers.'),
		excludedSegmentIDs: z.array(z.string()).optional(),
		excludedCountries: z
			.array(z.string())
			.optional()
			.describe('ISO 3166-1 alpha-2 codes excluded from the SMS audience.'),
	})
	.loose();

const CreateCampaignInputSchema = z
	.object({
		type: z.enum(['regular', 'booster', 'abTest']),
		channel: z.enum(['email', 'push', 'sms']),
		name: z
			.string()
			.max(250)
			.optional()
			.describe('Required for regular and abTest campaigns.'),
		language: z
			.string()
			.optional()
			.describe('Locale in xx_XX format; defaults to en_US.'),
		content: z
			.object({
				email: z
					.object({
						templateID: z.string().min(1),
						subject: z.string().max(250).optional(),
						preheader: z.string().max(250).optional(),
						senderName: z.string().max(250).optional(),
						senderEmail: z.string().optional(),
						replyToEmail: z.string().optional(),
					})
					.loose()
					.optional(),
				sms: z
					.object({
						message: z.string().min(1),
						compliance: z
							.object({
								stopKeywordText: z.string().max(250),
								unsubscribeLinkText: z.string().max(250),
							})
							.loose(),
						imageID: z.string().optional(),
						isLinkShorteningEnabled: z.boolean().optional(),
						senderName: z.string().max(250).optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional()
			.describe('Required for regular campaigns.'),
		audience: AudienceSchema.optional(),
		sendingSettings: SendingSettingsSchema.optional(),
		// The A/B test and booster configuration trees are large and typed
		// nowhere but the spec; they pass through verbatim.
		abTest: JsonObjectSchema.optional(),
		boosterSettings: JsonObjectSchema.optional(),
	})
	.superRefine((value, ctx) => {
		if (value.type === 'regular') {
			if (value.channel === 'email' && !value.content?.email) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['content'],
					message:
						'A regular email campaign requires content.email with a templateID.',
				});
			}
			if (value.channel === 'sms' && !value.content?.sms) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['content'],
					message: 'A regular SMS campaign requires content.sms.',
				});
			}
		}
		if (value.type === 'abTest' && value.abTest === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['abTest'],
				message: 'abTest settings are required when type is abTest.',
			});
		}
		if (value.type === 'booster' && value.boosterSettings === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['boosterSettings'],
				message: 'boosterSettings are required when type is booster.',
			});
		}
	});

// The spec's UpdateCampaignRequest also carries abTest and boosterSettings
// update trees; they were cut as too large to type. Create accepts them
// verbatim; callers needing to change them on an existing campaign should
// recreate it.
const UpdateCampaignInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().max(250).optional(),
	language: z.string().optional(),
	content: z
		.object({
			email: z
				.object({
					subject: z.string().max(250).optional(),
					preheader: z.string().max(250).optional(),
					senderName: z.string().max(250).optional(),
					senderEmail: z.string().optional(),
					replyToEmail: z.string().optional(),
				})
				.loose()
				.optional(),
			sms: z
				.object({
					message: z.string().optional(),
					compliance: z
						.object({
							stopKeywordText: z.string().min(1).max(250).optional(),
							unsubscribeLinkText: z.string().min(1).max(250).optional(),
						})
						.loose()
						.optional(),
					imageID: z.string().optional(),
					isLinkShorteningEnabled: z.boolean().optional(),
					senderName: z.string().max(250).optional(),
				})
				.loose()
				.optional(),
		})
		.loose()
		.optional(),
	audience: AudienceSchema.optional(),
	sendingSettings: SendingSettingsSchema.optional(),
});

const CampaignsListInputSchema = z.object({
	...cursorPage(250, 100),
	sort: z
		.enum(['createdAt', 'updatedAt', 'name'])
		.optional()
		.describe('Sort field. Defaults to createdAt.'),
	direction: DirectionSchema,
	status: z
		.array(CampaignStatusSchema)
		.optional()
		.describe('Filter by one or more statuses.'),
	nameContains: z.string().max(200).optional(),
	channel: z.array(z.enum(['email', 'sms', 'push'])).optional(),
	type: z.enum(['regular', 'booster', 'abTest']).optional(),
	parentCampaignID: z.string().optional(),
	createdAtFrom: DateTimeSchema.optional(),
	createdAtTo: DateTimeSchema.optional(),
	updatedAtFrom: DateTimeSchema.optional(),
	updatedAtTo: DateTimeSchema.optional(),
	view: z.enum(['summary']).optional(),
	include: z
		.array(z.enum(['content', 'abTest']))
		.optional()
		.describe('Related resources to embed in each campaign.'),
});

const CampaignSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		type: z.enum(['regular', 'abTest', 'booster']).nullish(),
		channel: z.enum(['email', 'push', 'sms']).nullish(),
		status: CampaignStatusSchema.nullish(),
		language: z.string().nullish(),
		content: z
			.object({
				email: z
					.object({
						contentID: z.string().nullish(),
						subject: z.string().nullish(),
						preheader: z.string().nullish(),
						senderName: z.string().nullish(),
						senderEmail: z.string().nullish(),
						replyToEmail: z.string().nullish(),
					})
					.loose()
					.nullish(),
				sms: z
					.object({
						message: z.string().nullish(),
						compliance: JsonObjectSchema.nullish(),
						imageID: z.string().nullish(),
						isLinkShorteningEnabled: z.boolean().nullish(),
						senderName: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		audience: AudienceSchema.nullish(),
		sendingSettings: JsonObjectSchema.nullish(),
		abTest: JsonObjectSchema.nullish(),
		boosterSettings: JsonObjectSchema.nullish(),
		brandID: z.string().nullish(),
		url: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		startedAt: z.string().nullish(),
		endedAt: z.string().nullish(),
	})
	.loose();

const CampaignsListResponseSchema = z.object({
	campaigns: z.array(CampaignSchema),
	paging: CursorPagingSchema.nullish(),
	nextCursor: nextCursorField(),
});

const CampaignsGetResponseSchema = CampaignSchema;

const IdInputSchema = z.object({ id: z.string().min(1) });

const SendTestEmailInputSchema = z.object({
	id: z.string().min(1),
	recipients: z
		.array(z.email())
		.min(1)
		.max(5)
		.describe('Between 1 and 5 addresses that receive the test send.'),
});

const UtmResponseSchema = z
	.object({
		tags: UtmtagsSchema.nullish(),
		variants: z
			.object({
				a: z
					.object({ id: z.string().nullish(), tags: UtmtagsSchema.nullish() })
					.loose()
					.nullish(),
				b: z
					.object({ id: z.string().nullish(), tags: UtmtagsSchema.nullish() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const SetUtmInputSchema = z
	.object({
		id: z.string().min(1),
		tags: UtmtagsSchema.optional().describe('UTM tags for a regular campaign.'),
		variants: z
			.object({ a: UtmtagsSchema.optional(), b: UtmtagsSchema.optional() })
			.loose()
			.optional()
			.describe('UTM variants for an A/B test campaign.'),
	})
	.superRefine((value, ctx) => {
		// The spec: exactly one of tags/variants must be present; providing
		// both (or neither) is a validation error.
		if ((value.tags === undefined) === (value.variants === undefined)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: [value.tags === undefined ? 'tags' : 'variants'],
				message:
					'Exactly one of tags (regular campaign) or variants (A/B campaign) must be set.',
			});
		}
	});

// ── events ──────────────────────────────────────────────────────────────────

/** The contact object of `events.send`, which also creates or updates it. */
const EventContactSchema = z
	.object({
		id: z.string().optional().describe('Contact ID, for a known contact.'),
		email: z.string().optional(),
		phone: z.string().optional(),
		firstName: z.string().max(50).optional(),
		lastName: z.string().max(50).optional(),
		gender: z.enum(['m', 'f']).optional(),
		birthdate: z.string().optional(),
		address: z.string().max(500).optional(),
		city: z.string().max(100).optional(),
		state: z.string().max(100).optional(),
		country: z.string().max(100).optional(),
		countryCode: z.string().max(3).optional(),
		postalCode: z.string().max(20).optional(),
		tags: z.array(z.string()).max(100).optional(),
		customProperties: JsonObjectSchema.optional(),
		consents: z
			.array(JsonObjectSchema)
			.max(100)
			.optional()
			.describe('Consent records per channel.'),
		optIns: z
			.array(JsonObjectSchema)
			.max(10)
			.optional()
			.describe('Opt-in records per channel.'),
		optOuts: z
			.array(JsonObjectSchema)
			.max(10)
			.optional()
			.describe('Opt-out records per channel.'),
	})
	.superRefine((value, ctx) => {
		if (
			value.id === undefined &&
			value.email === undefined &&
			value.phone === undefined
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['id'],
				message: 'One of id, email or phone is required.',
			});
		}
	});

const EventsSendInputSchema = z.object({
	eventName: z
		.string()
		.min(1)
		.describe(
			'The event name, such as `placed order` for a recommended event.',
		),
	eventVersion: z
		.string()
		.optional()
		.describe(
			'Required only for recommended events; leave empty for custom ones.',
		),
	eventTime: z
		.string()
		.optional()
		.describe(
			'RFC 3339 timestamp, or "YYYY-MM-DD HH:MM:SS±HH:MM". Defaults to now. More than 10 years in the past is rejected.',
		),
	eventID: z
		.string()
		.optional()
		.describe(
			'UUID that, with eventTime, deduplicates historical events. Generated when omitted.',
		),
	origin: z
		.string()
		.optional()
		.describe(
			'Source of the event. Use `api` unless you are building a platform integration with a dedicated origin.',
		),
	contact: EventContactSchema.describe(
		'Identifies the contact and creates or updates it from the fields given.',
	),
	properties: JsonObjectSchema.optional(),
});

const EventItemSchema = z
	.object({
		name: z.string(),
		displayName: z.string().nullish(),
		origins: z.array(z.string()).nullish(),
		explicitlyDefined: z.boolean().nullish(),
	})
	.loose();

const PropertyNodeSchema: z.ZodType<{
	type: string;
	displayName?: string;
	description?: string;
	group?: string;
	explicitlyDefined?: boolean;
	properties?: Record<string, unknown>; // unknown: the tree recurses; the record holds more nodes.
}> = z.lazy(() =>
	z
		.object({
			type: z.enum([
				'string',
				'stringList',
				'integer',
				'integerList',
				'float',
				'floatList',
				'boolean',
				'booleanList',
				'date',
				'dateList',
				'struct',
				'structList',
			]),
			displayName: z.string().nullish(),
			description: z.string().nullish(),
			group: z.string().nullish(),
			explicitlyDefined: z.boolean().nullish(),
			properties: z.record(z.string(), PropertyNodeSchema).nullish(),
		})
		.loose(),
) as unknown as typeof PropertyNodeSchema; // unknown: z.lazy loses the precise output type through the recursion.

const EventsWithPropertiesSchema = EventItemSchema.extend({
	properties: z.record(z.string(), PropertyNodeSchema).nullish(),
});

const EventsQueryMetadataInputSchema = z.object({
	category: z
		.enum(['events', 'automations', 'segments'])
		.describe(
			'Event category, resolved against the requested Omnisend-Version.',
		),
	events: z
		.array(z.string())
		.optional()
		.describe('Optional event names to filter by.'),
	origins: z
		.array(z.string())
		.optional()
		.describe('Optional origins to filter by.'),
	includeProperties: z
		.boolean()
		.optional()
		.describe('When true, each item carries the nested property tree.'),
	excludeCustomEvents: z
		.boolean()
		.optional()
		.describe('When true, brand-custom events are omitted from the answer.'),
});

const EventsQueryMetadataResponseSchema = z.object({
	events: z.array(EventsWithPropertiesSchema),
});

const WritePropertyNodeSchema: z.ZodType<{
	type: string;
	displayName?: string;
	description?: string;
	group?: string;
	properties?: Record<string, unknown>; // unknown: the tree recurses; the record holds more nodes.
}> = z.lazy(() =>
	z
		.object({
			type: z.enum([
				'string',
				'stringList',
				'integer',
				'integerList',
				'float',
				'floatList',
				'boolean',
				'booleanList',
				'date',
				'dateList',
				'struct',
				'structList',
			]),
			displayName: z.string().optional(),
			description: z.string().optional(),
			group: z.string().optional(),
			properties: z.record(z.string(), WritePropertyNodeSchema).optional(),
		})
		.loose(),
) as unknown as typeof WritePropertyNodeSchema; // unknown: z.lazy loses the precise output type through the recursion.

const EventsDefineSchemaInputSchema = z.object({
	name: z.string().min(1).describe('Machine-readable event name.'),
	origin: z.string().min(1).describe('The origin the schema belongs to.'),
	displayName: z.string().optional(),
	properties: z
		.record(z.string(), WritePropertyNodeSchema)
		.refine((value) => Object.keys(value).length >= 1, {
			message:
				'At least one property is required when declaring an event schema.',
		})
		.describe(
			'Property tree keyed by property name. Property types are immutable once declared.',
		),
});

const EventsUpdateSchemaInputSchema = z.object({
	name: z.string().min(1).describe('Machine-readable event name.'),
	origin: z.string().min(1).describe('The origin the schema belongs to.'),
	displayName: z.string().optional().describe('Omit to keep the stored value.'),
	properties: z
		.record(z.string(), WritePropertyNodeSchema)
		.optional()
		.describe(
			'Merged with the stored properties; only the keys present change, and none are deleted.',
		),
});

const EventsWriteResponseSchema = z.object({
	event: EventsWithPropertiesSchema.nullish(),
});

// ── products ────────────────────────────────────────────────────────────────

const ProductVariantSchema = z
	.object({
		id: z.string().max(100),
		title: z.string().max(255),
		// A float in the store currency in 2026-03-15; v3 used integer cents.
		price: z.number(),
		url: z.string().max(1000),
		sku: z.string().max(255).optional(),
		status: z.enum(['inStock', 'outOfStock', 'notAvailable']).optional(),
		images: z.array(z.string()).max(300).optional(),
		defaultImageUrl: z.string().max(1000).optional(),
		description: z.string().max(1000).optional(),
		strikeThroughPrice: z
			.number()
			.optional()
			.describe('The price before the discount.'),
	})
	.loose();

const ProductStatusSchema = z.enum(['inStock', 'outOfStock', 'notAvailable']);

const ProductWriteSchema = {
	id: z
		.string()
		.max(100)
		.describe('Your own product ID, up to 100 characters.'),
	title: z.string().max(255),
	currency: z.string().min(1).describe('ISO currency code, such as USD.'),
	url: z.string().max(1000).describe('Link to the product page.'),
	status: ProductStatusSchema.describe(
		'Keep in sync with the store so out-of-stock products are never sent.',
	),
	variants: z
		.array(ProductVariantSchema)
		.min(1)
		.max(500)
		.describe('At least one variant. Prices are floats in the store currency.'),
	categoryIDs: z.array(z.string()).max(100).optional(),
	tags: z.array(z.string()).max(100).optional(),
	images: z.array(z.string()).max(300).optional(),
	type: z.string().max(100).optional(),
	vendor: z.string().max(100).optional(),
	defaultImageUrl: z.string().max(1000).optional(),
	description: z.string().max(1000).optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
};

const ProductSchema = z
	.object({
		id: z.string(),
		title: z.string().nullish(),
		currency: z.string().nullish(),
		url: z.string().nullish(),
		status: ProductStatusSchema.nullish(),
		variants: z.array(ProductVariantSchema).nullish(),
		categoryIDs: z.array(z.string()).nullish(),
		tags: z.array(z.string()).nullish(),
		images: z.array(z.string()).nullish(),
		type: z.string().nullish(),
		vendor: z.string().nullish(),
		defaultImageUrl: z.string().nullish(),
		description: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

const ProductsListInputSchema = z.object({
	...offsetPage(100),
	sort: z
		.enum(['date', 'updatedAt', 'createdAt'])
		.optional()
		.describe('Sort field.'),
	titleContains: z.string().max(255).optional(),
});

const ProductsListResponseSchema = z.object({
	products: z.array(ProductSchema),
	paging: OffsetPagingSchema.nullish(),
	nextOffset: nextOffsetField(),
});

const ProductsGetResponseSchema = ProductSchema;

/** Create and replace answer the caller's own product ID. */
const ProductsMutateResponseSchema = z.object({ id: z.string() });

// ── categories ──────────────────────────────────────────────────────────────

const CategorySchema = z
	.object({
		categoryID: z.string().nullish(),
		title: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

const CategoriesListInputSchema = z.object({
	...offsetPage(100),
	sort: z
		.enum(['title', 'updatedAt', 'createdAt'])
		.optional()
		.describe('Sort field.'),
});

const CategoriesListResponseSchema = z.object({
	categories: z.array(CategorySchema),
	paging: OffsetPagingSchema.nullish(),
	nextOffset: nextOffsetField(),
});

const CategoriesGetResponseSchema = CategorySchema;

const CategoriesCreateInputSchema = z.object({
	categoryID: z
		.string()
		.min(1)
		.max(100)
		.describe('Your own category ID, 1-100 characters.'),
	title: z.string().max(255),
});

const CategoriesUpdateInputSchema = z.object({
	id: z.string().min(1),
	title: z.string().max(255),
});

const CategoryMutateResponseSchema = z.object({ categoryID: z.string() });

// ── templates ───────────────────────────────────────────────────────────────

/**
 * The template editor tree (`sections`, `generalSettings`) is a deep style
 * tree typed nowhere but the spec; it passes through verbatim.
 */
const TemplateSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		sections: z.array(JsonObjectSchema).nullish(),
		generalSettings: JsonObjectSchema.nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

const TemplatesListInputSchema = z.object({
	// The email-templates route caps at 100 rows, unlike the other cursor routes.
	...cursorPage(100, 100),
	sort: z
		.enum(['createdAt', 'name'])
		.optional()
		.describe('Sort field. Defaults to createdAt.'),
	direction: DirectionSchema,
	nameContains: z.string().max(200).optional(),
});

const TemplateListItemSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

const TemplatesListResponseSchema = z.object({
	templates: z.array(TemplateListItemSchema),
	paging: CursorPagingSchema.nullish(),
	nextCursor: nextCursorField(),
});

const TemplatesGetResponseSchema = TemplateSchema;

const TemplatesCreateInputSchema = z.object({
	name: z.string().min(1).max(255),
	sections: z
		.array(JsonObjectSchema)
		.optional()
		.describe('Template sections, as the template editor defines them.'),
	generalSettings: JsonObjectSchema.optional(),
});

const TemplatesReplaceInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1).max(255),
	sections: z.array(JsonObjectSchema).optional(),
	generalSettings: JsonObjectSchema.optional(),
});

const TemplatesImportInputSchema = z.object({
	name: z.string().min(1).max(255),
	html: z.string().min(1).describe('Raw HTML to import; up to 1 MB.'),
});

/** A render answers `{ html: "..." }`-shaped string values. */
const RenderResponseSchema = z.record(z.string(), z.string());

// ── emailContent ────────────────────────────────────────────────────────────

const ContentSchema = TemplateSchema;

const EmailContentGetInputSchema = z.object({ id: z.string().min(1) });

const EmailContentReplaceInputSchema = z.object({
	id: z.string().min(1),
	sections: z.array(JsonObjectSchema).optional(),
	generalSettings: JsonObjectSchema.optional(),
});

// ── batches ─────────────────────────────────────────────────────────────────

const BatchItemSchema = z
	.object({
		itemID: z.string().nullish(),
		request: JsonObjectSchema.nullish(),
		response: JsonObjectSchema.nullish(),
		responseCode: z.number().nullish(),
		status: z.string().nullish(),
	})
	.loose();

const BatchSchema = z
	.object({
		batchID: z.string().nullish(),
		status: z.string().nullish(),
		totalCount: z.number().nullish(),
		finishedCount: z.number().nullish(),
		errorsCount: z.number().nullish(),
		errors: z.array(BatchItemSchema).nullish(),
		responses: z.array(BatchItemSchema).nullish(),
		endpoint: z.string().nullish(),
		method: z.string().nullish(),
		origin: z.string().nullish(),
		startedAt: z.string().nullish(),
		endedAt: z.string().nullish(),
		createdAt: z.string().nullish(),
		eventID: z.string().nullish(),
	})
	.loose();

const BatchesCreateInputSchema = z.object({
	endpoint: z
		.enum(['contacts', 'products', 'events', 'categories'])
		.describe('The resource the batch writes.'),
	method: z
		.enum(['POST', 'PUT'])
		.describe('The HTTP method applied to each item.'),
	items: z
		.array(JsonObjectSchema)
		.min(1)
		.max(100)
		.describe('The payloads to apply, in order; up to 100 per batch.'),
	origin: z
		.string()
		.optional()
		.describe('Marks the batch, such as your integration name.'),
});

const BatchesCreateResponseSchema = z.object({
	batchID: z.string(),
	totalCount: z.number().nullish(),
});

const BatchesListInputSchema = z.object({
	// Categories batches can be created but never listed.
	endpoint: z.enum(['products', 'contacts', 'events']),
	...offsetPage(100),
	status: z.enum(['pending', 'inProgress', 'finished', 'stopped']).optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
});

const BatchesListResponseSchema = z.object({
	batches: z.array(BatchSchema),
	paging: OffsetPagingSchema.nullish(),
	nextOffset: nextOffsetField(),
});

const BatchesGetResponseSchema = BatchSchema;

// ── Registry ────────────────────────────────────────────────────────────────

export type OmnisendEndpointInputs = {
	contactsList: z.input<typeof ContactsListInputSchema>;
	contactsGet: z.input<typeof ContactsGetInputSchema>;
	contactsUpsert: z.input<typeof ContactsUpsertInputSchema>;
	contactsUpdate: z.input<typeof ContactsUpdateInputSchema>;
	contactsUpdateByEmail: z.input<typeof ContactsUpdateByEmailInputSchema>;
	contactsAddTags: z.input<typeof ContactsAddTagsInputSchema>;
	contactsRemoveTags: z.input<typeof ContactsRemoveTagsInputSchema>;
	campaignsList: z.input<typeof CampaignsListInputSchema>;
	campaignsGet: z.input<typeof IdInputSchema>;
	campaignsCreate: z.input<typeof CreateCampaignInputSchema>;
	campaignsUpdate: z.input<typeof UpdateCampaignInputSchema>;
	campaignsRemove: z.input<typeof IdInputSchema>;
	campaignsSend: z.input<typeof IdInputSchema>;
	campaignsCancel: z.input<typeof IdInputSchema>;
	campaignsCopy: z.input<typeof IdInputSchema>;
	campaignsRestoreToDraft: z.input<typeof IdInputSchema>;
	campaignsSendTestEmail: z.input<typeof SendTestEmailInputSchema>;
	campaignsGetUtm: z.input<typeof IdInputSchema>;
	campaignsSetUtm: z.input<typeof SetUtmInputSchema>;
	eventsSend: z.input<typeof EventsSendInputSchema>;
	eventsQueryMetadata: z.input<typeof EventsQueryMetadataInputSchema>;
	eventsDefineSchema: z.input<typeof EventsDefineSchemaInputSchema>;
	eventsUpdateSchema: z.input<typeof EventsUpdateSchemaInputSchema>;
	productsList: z.input<typeof ProductsListInputSchema>;
	productsGet: z.input<typeof IdInputSchema>;
	productsCreate: z.input<typeof ProductWriteSchema>;
	productsReplace: z.input<typeof ProductWriteSchema>;
	productsRemove: z.input<typeof IdInputSchema>;
	categoriesList: z.input<typeof CategoriesListInputSchema>;
	categoriesGet: z.input<typeof IdInputSchema>;
	categoriesCreate: z.input<typeof CategoriesCreateInputSchema>;
	categoriesUpdate: z.input<typeof CategoriesUpdateInputSchema>;
	categoriesRemove: z.input<typeof IdInputSchema>;
	templatesList: z.input<typeof TemplatesListInputSchema>;
	templatesGet: z.input<typeof IdInputSchema>;
	templatesCreate: z.input<typeof TemplatesCreateInputSchema>;
	templatesReplace: z.input<typeof TemplatesReplaceInputSchema>;
	templatesRemove: z.input<typeof IdInputSchema>;
	templatesImportFromHtml: z.input<typeof TemplatesImportInputSchema>;
	templatesRender: z.input<typeof IdInputSchema>;
	emailContentGet: z.input<typeof EmailContentGetInputSchema>;
	emailContentReplace: z.input<typeof EmailContentReplaceInputSchema>;
	emailContentRender: z.input<typeof EmailContentGetInputSchema>;
	batchesCreate: z.input<typeof BatchesCreateInputSchema>;
	batchesList: z.input<typeof BatchesListInputSchema>;
	batchesGet: z.input<typeof IdInputSchema>;
	batchesListItems: z.input<typeof IdInputSchema>;
};

export type OmnisendEndpointOutputs = {
	contactsList: z.infer<typeof ContactsListResponseSchema>;
	contactsGet: z.infer<typeof ContactsGetResponseSchema>;
	contactsUpsert: z.infer<typeof ContactsMutateResponseSchema>;
	contactsUpdate: z.infer<typeof ContactsMutateResponseSchema>;
	contactsUpdateByEmail: z.infer<typeof ContactsMutateResponseSchema>;
	contactsAddTags: z.infer<typeof AcceptedSchema>;
	contactsRemoveTags: z.infer<typeof AcceptedSchema>;
	campaignsList: z.infer<typeof CampaignsListResponseSchema>;
	campaignsGet: z.infer<typeof CampaignsGetResponseSchema>;
	campaignsCreate: z.infer<typeof CampaignsGetResponseSchema>;
	campaignsUpdate: z.infer<typeof CampaignsGetResponseSchema>;
	campaignsRemove: z.infer<typeof AcceptedSchema>;
	campaignsSend: z.infer<typeof AcceptedSchema>;
	campaignsCancel: z.infer<typeof AcceptedSchema>;
	campaignsCopy: z.infer<typeof CampaignsGetResponseSchema>;
	campaignsRestoreToDraft: z.infer<typeof AcceptedSchema>;
	campaignsSendTestEmail: z.infer<typeof AcceptedSchema>;
	campaignsGetUtm: z.infer<typeof UtmResponseSchema>;
	campaignsSetUtm: z.infer<typeof UtmResponseSchema>;
	eventsSend: z.infer<typeof AcceptedSchema>;
	eventsQueryMetadata: z.infer<typeof EventsQueryMetadataResponseSchema>;
	eventsDefineSchema: z.infer<typeof EventsWriteResponseSchema>;
	eventsUpdateSchema: z.infer<typeof EventsWriteResponseSchema>;
	productsList: z.infer<typeof ProductsListResponseSchema>;
	productsGet: z.infer<typeof ProductsGetResponseSchema>;
	productsCreate: z.infer<typeof ProductsMutateResponseSchema>;
	productsReplace: z.infer<typeof ProductsMutateResponseSchema>;
	productsRemove: z.infer<typeof AcceptedSchema>;
	categoriesList: z.infer<typeof CategoriesListResponseSchema>;
	categoriesGet: z.infer<typeof CategoriesGetResponseSchema>;
	categoriesCreate: z.infer<typeof CategoryMutateResponseSchema>;
	categoriesUpdate: z.infer<typeof CategoryMutateResponseSchema>;
	categoriesRemove: z.infer<typeof AcceptedSchema>;
	templatesList: z.infer<typeof TemplatesListResponseSchema>;
	templatesGet: z.infer<typeof TemplatesGetResponseSchema>;
	templatesCreate: z.infer<typeof TemplatesGetResponseSchema>;
	templatesReplace: z.infer<typeof TemplatesGetResponseSchema>;
	templatesRemove: z.infer<typeof AcceptedSchema>;
	templatesImportFromHtml: z.infer<typeof TemplatesGetResponseSchema>;
	templatesRender: z.infer<typeof RenderResponseSchema>;
	emailContentGet: z.infer<typeof ContentSchema>;
	emailContentReplace: z.infer<typeof ContentSchema>;
	emailContentRender: z.infer<typeof RenderResponseSchema>;
	batchesCreate: z.infer<typeof BatchesCreateResponseSchema>;
	batchesList: z.infer<typeof BatchesListResponseSchema>;
	batchesGet: z.infer<typeof BatchesGetResponseSchema>;
	batchesListItems: z.infer<typeof BatchesGetResponseSchema>;
};

const DeletedSchema = z.object({ accepted: z.boolean() });

export const OmnisendEndpointInputSchemas = {
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsUpsert: ContactsUpsertInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsUpdateByEmail: ContactsUpdateByEmailInputSchema,
	contactsAddTags: ContactsAddTagsInputSchema,
	contactsRemoveTags: ContactsRemoveTagsInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsGet: IdInputSchema,
	campaignsCreate: CreateCampaignInputSchema,
	campaignsUpdate: UpdateCampaignInputSchema,
	campaignsRemove: IdInputSchema,
	campaignsSend: IdInputSchema,
	campaignsCancel: IdInputSchema,
	campaignsCopy: IdInputSchema,
	campaignsRestoreToDraft: IdInputSchema,
	campaignsSendTestEmail: SendTestEmailInputSchema,
	campaignsGetUtm: IdInputSchema,
	campaignsSetUtm: SetUtmInputSchema,
	eventsSend: EventsSendInputSchema,
	eventsQueryMetadata: EventsQueryMetadataInputSchema,
	eventsDefineSchema: EventsDefineSchemaInputSchema,
	eventsUpdateSchema: EventsUpdateSchemaInputSchema,
	productsList: ProductsListInputSchema,
	productsGet: IdInputSchema,
	productsCreate: z.object(ProductWriteSchema).loose(),
	productsReplace: z.object(ProductWriteSchema).loose(),
	productsRemove: IdInputSchema,
	categoriesList: CategoriesListInputSchema,
	categoriesGet: IdInputSchema,
	categoriesCreate: CategoriesCreateInputSchema,
	categoriesUpdate: CategoriesUpdateInputSchema,
	categoriesRemove: IdInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: IdInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesReplace: TemplatesReplaceInputSchema,
	templatesRemove: IdInputSchema,
	templatesImportFromHtml: TemplatesImportInputSchema,
	templatesRender: IdInputSchema,
	emailContentGet: EmailContentGetInputSchema,
	emailContentReplace: EmailContentReplaceInputSchema,
	emailContentRender: EmailContentGetInputSchema,
	batchesCreate: BatchesCreateInputSchema,
	batchesList: BatchesListInputSchema,
	batchesGet: IdInputSchema,
	batchesListItems: IdInputSchema,
} as const;

export const OmnisendEndpointOutputSchemas = {
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsUpsert: ContactsMutateResponseSchema,
	contactsUpdate: ContactsMutateResponseSchema,
	contactsUpdateByEmail: ContactsMutateResponseSchema,
	contactsAddTags: DeletedSchema,
	contactsRemoveTags: DeletedSchema,
	campaignsList: CampaignsListResponseSchema,
	campaignsGet: CampaignsGetResponseSchema,
	campaignsCreate: CampaignsGetResponseSchema,
	campaignsUpdate: CampaignsGetResponseSchema,
	campaignsRemove: DeletedSchema,
	campaignsSend: DeletedSchema,
	campaignsCancel: DeletedSchema,
	campaignsCopy: CampaignsGetResponseSchema,
	campaignsRestoreToDraft: DeletedSchema,
	campaignsSendTestEmail: DeletedSchema,
	campaignsGetUtm: UtmResponseSchema,
	campaignsSetUtm: UtmResponseSchema,
	eventsSend: DeletedSchema,
	eventsQueryMetadata: EventsQueryMetadataResponseSchema,
	eventsDefineSchema: EventsWriteResponseSchema,
	eventsUpdateSchema: EventsWriteResponseSchema,
	productsList: ProductsListResponseSchema,
	productsGet: ProductsGetResponseSchema,
	productsCreate: ProductsMutateResponseSchema,
	productsReplace: ProductsMutateResponseSchema,
	productsRemove: DeletedSchema,
	categoriesList: CategoriesListResponseSchema,
	categoriesGet: CategoriesGetResponseSchema,
	categoriesCreate: CategoryMutateResponseSchema,
	categoriesUpdate: CategoryMutateResponseSchema,
	categoriesRemove: DeletedSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesCreate: TemplatesGetResponseSchema,
	templatesReplace: TemplatesGetResponseSchema,
	templatesRemove: DeletedSchema,
	templatesImportFromHtml: TemplatesGetResponseSchema,
	templatesRender: RenderResponseSchema,
	emailContentGet: ContentSchema,
	emailContentReplace: ContentSchema,
	emailContentRender: RenderResponseSchema,
	batchesCreate: BatchesCreateResponseSchema,
	batchesList: BatchesListResponseSchema,
	batchesGet: BatchesGetResponseSchema,
	batchesListItems: BatchesGetResponseSchema,
} as const;
