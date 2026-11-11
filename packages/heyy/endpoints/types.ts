import { z } from 'zod';

// Inputs and outputs follow https://docs.heyy.io/api-reference/openapi-v3.json
// (Heyy API 3.0.0). That is the current version: v2 was sunset on
// 1 November 2026, and v3 replaces the list GETs with `POST .../search`.
//
// Outputs are `.loose()` and their fields nullish, because the spec marks most
// contact fields nullable and a field Heyy starts sending must not fail a call
// that has already happened.

// ── Shared pieces ────────────────────────────────────────────────────────────

const TimestampSchema = z.string().describe('ISO 8601 timestamp.');

/**
 * A value from a vendor payload.
 *
 * The shapes differ per channel type, so the leaves are typed as JSON rather
 * than by a provider model. It is recursive on purpose: `vendorDetails` and
 * `messageContent` can hold nested objects, and a schema that accepted only
 * scalars would throw *after* a successful call.
 *
 * Written as a union rather than `z.unknown()` because the docs generator
 * renders `ZodUnknown` as `any`, and this states what the field can hold.
 */
type VendorValue =
	| string
	| number
	| boolean
	| null
	| VendorValue[]
	| { [key: string]: VendorValue };

const VendorValueSchema: z.ZodType<VendorValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(VendorValueSchema),
		z.record(z.string(), VendorValueSchema),
	]),
);

/** A JSON object whose shape belongs to the channel vendor. */
const VendorPayloadSchema = z
	.record(z.string(), VendorValueSchema)
	.describe('Channel-specific fields, passed through as Heyy sends them.');

/**
 * A Heyy record id. Every id Heyy issues is a UUID, and a path id that is not
 * one (a label name, a typo) gets a 500 `internal_error` instead of a 404, so
 * it is refused before the request. `guid` rather than `uuid`: the check is the
 * shape, not the version.
 */
function heyyId(what: string) {
	return z
		.guid({ message: `${what} must be a Heyy id, a UUID.` })
		.describe(`${what}, a UUID.`);
}

/** The one field every successful search response carries. */
const SuccessSchema = z.literal(true);

const PaginationSchema = z
	.object({
		page: z.number().describe('Zero-based page index.'),
		limit: z.number(),
		total: z.number().describe('Total rows matching the query.'),
	})
	.loose();

export type HeyyPagination = z.infer<typeof PaginationSchema>;

/**
 * The shared search body.
 *
 * `query` is a structured expression, not a keyword: `equals(status, 'open')`,
 * `and(...)`, `contains(name, 'Acme')`. `search` is the free-text field, and
 * mixing the two up still returns 200 with rows the caller did not ask for,
 * which is why both are documented where an agent reads them. `query` is
 * added per resource by `searchParams`, because each search route filters on
 * different fields.
 */
const SearchBodySchema = z.object({
	sortBy: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Sort expression, such as "desc(createdAt)" or "asc(name)", with an optional null placement like "desc(updatedAt, \'nulls last\')". Chain keys with sort(...).',
		),
	search: z
		.string()
		.min(1)
		.optional()
		.describe(
			"Free-text search over the resource's searchable fields. `query` is the field for structured filters; the two can be combined.",
		),
	pagination: z
		.object({
			page: z
				.number()
				.int()
				.min(0)
				.describe('Zero-based page index. Defaults to 0.'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.describe('Rows per page, 1 to 100. Defaults to 10.'),
		})
		.describe('Paging. Defaults to page 0, limit 10.')
		.optional(),
});

/** How many rows a search returns when the caller asks for nothing. */
export const HEYY_DEFAULT_PAGE_SIZE = 10;

/** The maximum `pagination.limit` the API accepts. */
export const HEYY_MAX_PAGE_SIZE = 100;

/**
 * The search body for one resource, with `query` describing the fields that
 * route can filter on (from each route's `query` description in the v3 spec).
 *
 * `query` and `search` may be sent together: Heyy's search guide shows both in
 * one body, and each narrows the rows.
 */
function searchParams(filterableFields: string, example: string) {
	return SearchBodySchema.extend({
		query: z
			.string()
			.min(1)
			.optional()
			.describe(
				`Structured filter, such as "${example}". Filterable fields: ${filterableFields}. Combine with and(), or(), not(); see the query syntax reference. Can be combined with \`search\`. Omit for no filter.`,
			),
	});
}

/** What a search returns besides its rows. */
export const heyySearchResultShape = {
	pagination: PaginationSchema,
	success: SuccessSchema,
};

// ── contacts.search ─────────────────────────────────────────────────────────

/**
 * One attribute value on a contact. The spec returns the value row's own id,
 * the contact id and the attribute definition it belongs to; the attribute's
 * name sits under `attribute`, not on the row.
 */
const ContactAttributeValueSchema = z
	.object({
		id: z.string().nullish(),
		contactId: z.string().nullish(),
		attribute: z
			.object({
				id: z.string(),
				name: z.string(),
				displayName: z.string().nullish(),
				type: z.string().nullish(),
			})
			.loose()
			.nullish()
			.describe('The attribute definition, as `attributes.search` returns it.'),
		value: z.union([z.string(), z.number(), z.array(z.string())]).nullish(),
	})
	.loose();

const ContactSchema = z
	.object({
		id: z.string(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		fullName: z.string().nullish(),
		displayName: z.string().nullish(),
		isSubscribed: z.boolean().nullish(),
		phoneNumber: z.string().nullish(),
		email: z.string().nullish(),
		labels: z
			.array(z.union([z.string(), z.object({ id: z.string() }).loose()]))
			.nullish(),
		attributes: z.array(ContactAttributeValueSchema).nullish(),
		// unknown: the spec types handles, chats and metadata as five-variant
		// unions per channel, which are large and change with each channel type,
		// so they pass through as Heyy sends them.
		handles: z.array(VendorPayloadSchema).nullish(),
		chats: z.array(VendorPayloadSchema).nullish(),
		metadata: VendorPayloadSchema.nullish(),
	})
	.loose();

export type HeyyContact = z.infer<typeof ContactSchema>;

const ContactsSearchInputSchema = searchParams(
	"id, createdAt, updatedAt, firstName, lastName, isSubscribed, labels, notes, groups, phoneNumber, email; custom attributes through getBy('attributes', 'name', 'plan')",
	"equals(email, 'jordan@acme.com')",
);

export type ContactsSearchInput = z.input<typeof ContactsSearchInputSchema>;

const ContactsSearchResponseSchema = z.object({
	contacts: z.array(ContactSchema),
	...heyySearchResultShape,
});

export type ContactsSearchResponse = z.infer<
	typeof ContactsSearchResponseSchema
>;

// ── contacts.create ─────────────────────────────────────────────────────────

/** An attribute value attached to a contact, keyed by attribute id. */
const ContactAttributeInputSchema = z.object({
	id: z.string().min(1).describe('The attribute id, from `attributes.search`.'),
	value: z
		.union([z.string(), z.number(), z.array(z.string()), z.null()])
		.describe(
			'The value. Use an array for a multi_select attribute and null to clear it.',
		),
});

const ContactsCreateInputSchema = z.object({
	firstName: z.string().nullish().describe('Contact first name.'),
	lastName: z.string().nullish().describe('Contact last name.'),
	phoneNumber: z
		.string()
		.nullish()
		.describe('Phone number, in E.164 where the channel needs it.'),
	email: z.email().nullish().describe('Contact email address.'),
	attributes: z
		.array(ContactAttributeInputSchema)
		.optional()
		.describe('Custom attribute values.'),
	labels: z
		.array(z.object({ id: z.string().min(1) }))
		.optional()
		.describe('Label ids, from `labels.search`, to attach on creation.'),
});

export type ContactsCreateInput = z.input<typeof ContactsCreateInputSchema>;

const ContactsCreateResponseSchema = z.object({
	contact: ContactSchema,
	success: SuccessSchema,
});

export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

// ── attributes ──────────────────────────────────────────────────────────────

export const HEYY_ATTRIBUTE_TYPES = [
	'text',
	'number',
	'single_select',
	'multi_select',
	'date',
	'datetime',
] as const;

const AttributeVisibilitySchema = z.object({
	inbox: z.boolean().describe('Show it on the inbox contact card.'),
	contacts: z.boolean().describe('Show it on the contacts page.'),
	create: z.boolean().describe('Allow setting it when creating a contact.'),
});

const AttributeOptionSchema = z.object({
	value: z.string().min(1).describe('The value stored on contacts.'),
	color: z.string().min(1).describe('Colour for the option.'),
});

const AttributeSchema = z
	.object({
		id: z.string(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
		name: z.string(),
		type: z.string(),
		displayName: z.string().nullish(),
		visibility: AttributeVisibilitySchema.loose().nullish(),
		details: z
			.object({ options: z.array(AttributeOptionSchema).nullish() })
			.loose()
			.nullish(),
	})
	.loose();

export type HeyyAttribute = z.infer<typeof AttributeSchema>;

const AttributesSearchInputSchema = searchParams(
	'id, createdAt, updatedAt, name, type, displayName, description, visibility, details',
	"equals(type, 'single_select')",
);

export type AttributesSearchInput = z.input<typeof AttributesSearchInputSchema>;

const AttributesSearchResponseSchema = z.object({
	attributes: z.array(AttributeSchema),
	...heyySearchResultShape,
});

export type AttributesSearchResponse = z.infer<
	typeof AttributesSearchResponseSchema
>;

const AttributesCreateInputSchema = z
	.object({
		type: z
			.enum(HEYY_ATTRIBUTE_TYPES)
			.describe('The kind of value the attribute holds.'),
		displayName: z.string().min(1).describe('The name shown in the app.'),
		visibility: AttributeVisibilitySchema.describe(
			'Where the attribute appears in Heyy.',
		),
		details: z
			.object({ options: z.array(AttributeOptionSchema).min(1).optional() })
			.optional()
			.describe(
				'Options for a single_select or multi_select attribute. Required for those two types.',
			),
	})
	.superRefine((value, ctx) => {
		// The API rejects a select attribute with no options, and one whose
		// options are pointless on a text attribute.
		const needsOptions =
			value.type === 'single_select' || value.type === 'multi_select';
		const hasOptions = (value.details?.options?.length ?? 0) > 0;
		if (needsOptions && !hasOptions) {
			ctx.addIssue({
				code: 'custom',
				path: ['details', 'options'],
				message: `A ${value.type} attribute needs at least one option.`,
			});
		}
		if (!needsOptions && hasOptions) {
			ctx.addIssue({
				code: 'custom',
				path: ['details', 'options'],
				message: `Options only apply to single_select and multi_select, not ${value.type}.`,
			});
		}
	});

export type AttributesCreateInput = z.input<typeof AttributesCreateInputSchema>;

const AttributesCreateResponseSchema = z.object({
	attribute: AttributeSchema,
	success: SuccessSchema,
});

export type AttributesCreateResponse = z.infer<
	typeof AttributesCreateResponseSchema
>;

const AttributesRemoveInputSchema = z.object({
	attributeId: heyyId('The attribute to delete'),
});

export type AttributesRemoveInput = z.input<typeof AttributesRemoveInputSchema>;

/** Every delete route answers with what it removed and what it could not find. */
const DeleteResultSchema = z
	.object({
		deletedIds: z.array(z.string()),
		notFoundIds: z
			.array(z.string())
			.describe('Ids that did not exist; the call still succeeded.'),
	})
	.loose();

const AttributesRemoveResponseSchema = z.object({
	result: DeleteResultSchema,
	success: SuccessSchema,
});

export type AttributesRemoveResponse = z.infer<
	typeof AttributesRemoveResponseSchema
>;

// ── labels ──────────────────────────────────────────────────────────────────

const LabelSchema = z
	.object({
		id: z.string(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
		name: z.string(),
		color: z.string().nullish(),
	})
	.loose();

export type HeyyLabel = z.infer<typeof LabelSchema>;

const LabelsSearchInputSchema = searchParams(
	'id, createdAt, updatedAt, name',
	"contains(name, 'VIP')",
);

export type LabelsSearchInput = z.input<typeof LabelsSearchInputSchema>;

const LabelsSearchResponseSchema = z.object({
	labels: z.array(LabelSchema),
	...heyySearchResultShape,
});

export type LabelsSearchResponse = z.infer<typeof LabelsSearchResponseSchema>;

const LabelsCreateInputSchema = z.object({
	name: z.string().min(1).describe('Label name.'),
	color: z
		.string()
		.min(1)
		.describe('Hex colour for the label, such as #3B82F6.'),
});

export type LabelsCreateInput = z.input<typeof LabelsCreateInputSchema>;

const LabelsCreateResponseSchema = z.object({
	label: LabelSchema,
	success: SuccessSchema,
});

export type LabelsCreateResponse = z.infer<typeof LabelsCreateResponseSchema>;

const LabelsRemoveInputSchema = z.object({
	labelId: heyyId('The label to delete'),
});

export type LabelsRemoveInput = z.input<typeof LabelsRemoveInputSchema>;

const LabelsRemoveResponseSchema = z.object({
	result: DeleteResultSchema,
	success: SuccessSchema,
});

export type LabelsRemoveResponse = z.infer<typeof LabelsRemoveResponseSchema>;

// ── apiWebhooks ─────────────────────────────────────────────────────────────

export const HEYY_WEBHOOK_EVENT_TYPES = [
	'whatsapp_message_received',
	'whatsapp_message_status',
	'message.received',
	'message.sent',
	'message.updated',
] as const;

const WebhookEventSchema = z
	.object({
		type: z.string(),
		scopes: z
			.array(
				z
					.object({
						type: z.string().describe('`channel`.'),
						ids: z.array(z.string()),
					})
					.loose(),
			)
			.nullish()
			.describe('Limits the delivery to these channels.'),
	})
	.loose();

const WebhookSchema = z
	.object({
		id: z.string(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
		url: z.string(),
		status: z.string().describe('`active` or `inactive`.'),
		events: z.array(WebhookEventSchema).nullish(),
	})
	.loose();

export type HeyyWebhook = z.infer<typeof WebhookSchema>;

/** The event list both the create and update routes take. */
const WebhookEventInputSchema = z.object({
	type: z.enum(HEYY_WEBHOOK_EVENT_TYPES).describe('The event to deliver.'),
	// The spec marks `scopes` required on every event and the webhook guide says
	// at least one channel is required per event, so an unscoped event is
	// refused here rather than by a 400.
	scopes: z
		.array(
			z.object({
				type: z.literal('channel'),
				ids: z.array(z.string().min(1)).min(1),
			}),
		)
		.min(1)
		.describe(
			'The channels this event is delivered for, as [{ type: "channel", ids: [...] }] with ids from `channels.search`. Heyy requires at least one channel per event.',
		),
});

const ApiWebhooksCreateInputSchema = z
	.object({
		url: z.url().describe('HTTPS URL that receives the webhook POSTs.'),
		events: z
			.array(WebhookEventInputSchema)
			.min(1)
			.describe('The events to deliver to this URL.'),
	})
	.superRefine((value, ctx) => {
		// The spec says HTTPS, and a plain http URL silently fails delivery.
		if (!value.url.startsWith('https://')) {
			ctx.addIssue({
				code: 'custom',
				path: ['url'],
				message: 'Heyy only delivers webhooks to an https:// URL.',
			});
		}
	});

export type ApiWebhooksCreateInput = z.input<
	typeof ApiWebhooksCreateInputSchema
>;

const ApiWebhooksCreateResponseSchema = z.object({
	webhook: WebhookSchema,
	success: SuccessSchema,
});

export type ApiWebhooksCreateResponse = z.infer<
	typeof ApiWebhooksCreateResponseSchema
>;

const ApiWebhooksSearchInputSchema = searchParams(
	'id, createdAt, updatedAt, status, url, events',
	"equals(status, 'active')",
);

export type ApiWebhooksSearchInput = z.input<
	typeof ApiWebhooksSearchInputSchema
>;

const ApiWebhooksSearchResponseSchema = z.object({
	webhooks: z.array(WebhookSchema),
	...heyySearchResultShape,
});

export type ApiWebhooksSearchResponse = z.infer<
	typeof ApiWebhooksSearchResponseSchema
>;

const ApiWebhooksUpdateInputSchema = z
	.object({
		webhookId: heyyId('The webhook to change'),
		url: z.url().optional().describe('New HTTPS URL for deliveries.'),
		status: z
			.enum(['active', 'inactive'])
			.optional()
			.describe('Pause deliveries with `inactive`.'),
		events: z
			.array(WebhookEventInputSchema)
			.min(1)
			.optional()
			.describe('Replace the delivered events.'),
	})
	.superRefine((value, ctx) => {
		// The body carries only the fields to change, so an empty one is a call
		// that cannot do anything.
		if (
			value.url === undefined &&
			value.status === undefined &&
			value.events === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['status'],
				message: 'Pass at least one of url, status or events.',
			});
		}
		if (value.url !== undefined && !value.url.startsWith('https://')) {
			ctx.addIssue({
				code: 'custom',
				path: ['url'],
				message: 'Heyy only delivers webhooks to an https:// URL.',
			});
		}
	});

export type ApiWebhooksUpdateInput = z.input<
	typeof ApiWebhooksUpdateInputSchema
>;

const ApiWebhooksUpdateResponseSchema = z.object({
	webhook: WebhookSchema,
	success: SuccessSchema,
});

export type ApiWebhooksUpdateResponse = z.infer<
	typeof ApiWebhooksUpdateResponseSchema
>;

const ApiWebhooksRemoveInputSchema = z.object({
	webhookId: heyyId('The webhook to delete'),
});

export type ApiWebhooksRemoveInput = z.input<
	typeof ApiWebhooksRemoveInputSchema
>;

const ApiWebhooksRemoveResponseSchema = z.object({
	result: DeleteResultSchema,
	success: SuccessSchema,
});

export type ApiWebhooksRemoveResponse = z.infer<
	typeof ApiWebhooksRemoveResponseSchema
>;

// ── channels ────────────────────────────────────────────────────────────────

const ChannelSchema = z
	.object({
		id: z.string(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
		name: z.string(),
		type: z
			.string()
			.describe(
				'The channel kind: whatsapp, instagram, messenger, sms or live_chat.',
			),
		status: z.string(),
		vendor: z.string().nullish(),
		vendorId: z.string().nullish(),
		// unknown: vendorDetails differs per channel type and the spec types it as
		// an unconstrained object.
		vendorDetails: VendorPayloadSchema.nullish(),
	})
	.loose();

export type HeyyChannel = z.infer<typeof ChannelSchema>;

const ChannelsSearchInputSchema = searchParams(
	'id, createdAt, updatedAt, name, type, status, vendor, vendorId',
	"equals(type, 'whatsapp')",
);

export type ChannelsSearchInput = z.input<typeof ChannelsSearchInputSchema>;

const ChannelsSearchResponseSchema = z.object({
	channels: z.array(ChannelSchema),
	...heyySearchResultShape,
});

export type ChannelsSearchResponse = z.infer<
	typeof ChannelsSearchResponseSchema
>;

// ── automations ─────────────────────────────────────────────────────────────

export const HEYY_AUTOMATION_STATUSES = ['draft', 'active', 'paused'] as const;

const AutomationSchema = z
	.object({
		id: z.string(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
		name: z.string(),
		status: z
			.string()
			.describe(
				'`draft`, `active` or `paused`; kept as a string for new values.',
			),
	})
	.loose();

export type HeyyAutomation = z.infer<typeof AutomationSchema>;

const AutomationsSearchInputSchema = searchParams(
	'id, createdAt, updatedAt, name, status, activeVersionId, activeVersionTriggerType, activeVersionTriggerParametersChannelId, latestVersionTriggerType, latestVersionTriggerParametersChannelId, latestVersionId',
	"equals(status, 'active')",
);

export type AutomationsSearchInput = z.input<
	typeof AutomationsSearchInputSchema
>;

const AutomationsSearchResponseSchema = z.object({
	automations: z.array(AutomationSchema),
	...heyySearchResultShape,
});

export type AutomationsSearchResponse = z.infer<
	typeof AutomationsSearchResponseSchema
>;

// ── messageTemplates ────────────────────────────────────────────────────────

const MessageTemplateSchema = z
	.object({
		id: z.string(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
		name: z.string(),
		type: z.string().nullish(),
		status: z.string().nullish(),
		vendorId: z.string().nullish(),
		channelId: z.string().nullish(),
		// unknown: the spec types messageContent and vendorDetails as objects that
		// differ per channel.
		messageContent: VendorPayloadSchema.nullish(),
		variables: z
			.array(z.string())
			.nullish()
			.describe('The template variable names, such as "1" for {{1}}.'),
		vendorDetails: VendorPayloadSchema.nullish(),
	})
	.loose();

export type HeyyMessageTemplate = z.infer<typeof MessageTemplateSchema>;

const MessageTemplatesSearchInputSchema = searchParams(
	'id, createdAt, updatedAt, name, vendorId, status, channelId, type, vendorDetailsName',
	"equals(channelId, 'channel-id')",
);

export type MessageTemplatesSearchInput = z.input<
	typeof MessageTemplatesSearchInputSchema
>;

const MessageTemplatesSearchResponseSchema = z.object({
	messageTemplates: z.array(MessageTemplateSchema),
	...heyySearchResultShape,
});

export type MessageTemplatesSearchResponse = z.infer<
	typeof MessageTemplatesSearchResponseSchema
>;

// ── Registry ────────────────────────────────────────────────────────────────

export type HeyyEndpointInputs = {
	contactsSearch: z.input<typeof ContactsSearchInputSchema>;
	contactsCreate: z.input<typeof ContactsCreateInputSchema>;
	attributesSearch: z.input<typeof AttributesSearchInputSchema>;
	attributesCreate: z.input<typeof AttributesCreateInputSchema>;
	attributesRemove: z.input<typeof AttributesRemoveInputSchema>;
	labelsSearch: z.input<typeof LabelsSearchInputSchema>;
	labelsCreate: z.input<typeof LabelsCreateInputSchema>;
	labelsRemove: z.input<typeof LabelsRemoveInputSchema>;
	apiWebhooksCreate: z.input<typeof ApiWebhooksCreateInputSchema>;
	apiWebhooksSearch: z.input<typeof ApiWebhooksSearchInputSchema>;
	apiWebhooksUpdate: z.input<typeof ApiWebhooksUpdateInputSchema>;
	apiWebhooksRemove: z.input<typeof ApiWebhooksRemoveInputSchema>;
	channelsSearch: z.input<typeof ChannelsSearchInputSchema>;
	automationsSearch: z.input<typeof AutomationsSearchInputSchema>;
	messageTemplatesSearch: z.input<typeof MessageTemplatesSearchInputSchema>;
};

export type HeyyEndpointOutputs = {
	contactsSearch: ContactsSearchResponse;
	contactsCreate: ContactsCreateResponse;
	attributesSearch: AttributesSearchResponse;
	attributesCreate: AttributesCreateResponse;
	attributesRemove: AttributesRemoveResponse;
	labelsSearch: LabelsSearchResponse;
	labelsCreate: LabelsCreateResponse;
	labelsRemove: LabelsRemoveResponse;
	apiWebhooksCreate: ApiWebhooksCreateResponse;
	apiWebhooksSearch: ApiWebhooksSearchResponse;
	apiWebhooksUpdate: ApiWebhooksUpdateResponse;
	apiWebhooksRemove: ApiWebhooksRemoveResponse;
	channelsSearch: ChannelsSearchResponse;
	automationsSearch: AutomationsSearchResponse;
	messageTemplatesSearch: MessageTemplatesSearchResponse;
};

export const HeyyEndpointInputSchemas = {
	contactsSearch: ContactsSearchInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	attributesSearch: AttributesSearchInputSchema,
	attributesCreate: AttributesCreateInputSchema,
	attributesRemove: AttributesRemoveInputSchema,
	labelsSearch: LabelsSearchInputSchema,
	labelsCreate: LabelsCreateInputSchema,
	labelsRemove: LabelsRemoveInputSchema,
	apiWebhooksCreate: ApiWebhooksCreateInputSchema,
	apiWebhooksSearch: ApiWebhooksSearchInputSchema,
	apiWebhooksUpdate: ApiWebhooksUpdateInputSchema,
	apiWebhooksRemove: ApiWebhooksRemoveInputSchema,
	channelsSearch: ChannelsSearchInputSchema,
	automationsSearch: AutomationsSearchInputSchema,
	messageTemplatesSearch: MessageTemplatesSearchInputSchema,
} as const;

export const HeyyEndpointOutputSchemas = {
	contactsSearch: ContactsSearchResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	attributesSearch: AttributesSearchResponseSchema,
	attributesCreate: AttributesCreateResponseSchema,
	attributesRemove: AttributesRemoveResponseSchema,
	labelsSearch: LabelsSearchResponseSchema,
	labelsCreate: LabelsCreateResponseSchema,
	labelsRemove: LabelsRemoveResponseSchema,
	apiWebhooksCreate: ApiWebhooksCreateResponseSchema,
	apiWebhooksSearch: ApiWebhooksSearchResponseSchema,
	apiWebhooksUpdate: ApiWebhooksUpdateResponseSchema,
	apiWebhooksRemove: ApiWebhooksRemoveResponseSchema,
	channelsSearch: ChannelsSearchResponseSchema,
	automationsSearch: AutomationsSearchResponseSchema,
	messageTemplatesSearch: MessageTemplatesSearchResponseSchema,
} as const;
