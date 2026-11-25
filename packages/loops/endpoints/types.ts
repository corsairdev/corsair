import { z } from 'zod';

/** Loops custom property and data variable value types, per the docs. */
const CustomPropertyValueSchema = z.union([
	z.string().max(500),
	z.number(),
	z.boolean(),
]);

// unknown: a template defines its own data variable shapes; the docs let
// values be strings, numbers, booleans, arrays or nested objects, so any
// stricter union would reject template data the API accepts.
const TemplateDataSchema = z.record(z.string(), z.unknown());

const MailingListsSchema = z.record(z.string(), z.boolean());

/**
 * Custom contact properties ride as additional top-level keys on the request
 * body, next to the fixed fields, so a key like `email` here would overwrite
 * the selector. Callers pass them under `customProperties` and this schema
 * rejects every fixed field name.
 */
const RESERVED_BODY_FIELDS = [
	'email',
	'userId',
	'firstName',
	'lastName',
	'source',
	'subscribed',
	'userGroup',
	'mailingLists',
	'customProperties',
] as const;

// unknown: the caller's input type carries the fixed fields; only the
// customProperties map is checked here.
function rejectReservedProperties<
	T extends { customProperties?: Record<string, unknown> },
>(value: T, ctx: z.RefinementCtx): void {
	const custom = value.customProperties;
	if (!custom) return;
	for (const key of RESERVED_BODY_FIELDS) {
		if (key in custom) {
			ctx.addIssue({
				code: 'custom',
				path: ['customProperties', key],
				message: `"${key}" is a fixed field; pass it at the top level instead of in customProperties`,
			});
		}
	}
}

function requireExactlyOneIdentifier(
	value: { email?: string; userId?: string },
	ctx: z.RefinementCtx,
): void {
	if (!value.email && !value.userId) {
		ctx.addIssue({
			code: 'custom',
			message: 'Provide exactly one of email or userId.',
		});
	}
	if (value.email && value.userId) {
		ctx.addIssue({
			code: 'custom',
			message: 'Provide email or userId, not both.',
		});
	}
}

function requireOneIdentifier(
	value: { email?: string; userId?: string },
	ctx: z.RefinementCtx,
): void {
	if (!value.email && !value.userId) {
		ctx.addIssue({
			code: 'custom',
			message: 'Provide email or userId.',
		});
	}
}

const ContactFieldsSchema = z.object({
	email: z.email().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	source: z.string().optional(),
	subscribed: z.boolean().optional(),
	userGroup: z.string().optional(),
	userId: z.string().optional(),
	mailingLists: MailingListsSchema.optional(),
	customProperties: z.record(z.string(), CustomPropertyValueSchema).optional(),
});

// apikey.verifyConnection

const VerifyConnectionInputSchema = z.object({});

const VerifyConnectionResponseSchema = z.object({
	success: z.literal(true),
	teamName: z.string(),
});

// contacts.find

const ContactsFindInputSchema = z
	.object({
		email: z.email().optional(),
		userId: z.string().optional(),
	})
	.superRefine(requireExactlyOneIdentifier);

const ContactSchema = z
	.object({
		id: z.string(),
		email: z.string(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		source: z.string(),
		subscribed: z.boolean(),
		userGroup: z.string(),
		userId: z.string().nullish(),
		mailingLists: MailingListsSchema.optional(),
		optInStatus: z.enum(['accepted', 'pending', 'rejected']).nullish(),
	})
	// Custom contact properties come back inline beside the fixed fields.
	.loose();

const ContactsFindResponseSchema = z.array(ContactSchema);

// contacts.create

const ContactsCreateInputSchema = ContactFieldsSchema.superRefine(
	rejectReservedProperties,
);

const ContactWriteResponseSchema = z.object({
	success: z.literal(true),
	id: z.string(),
});

// contacts.update

const ContactsUpdateInputSchema = ContactFieldsSchema.superRefine(
	(value, ctx) => {
		rejectReservedProperties(value, ctx);
		requireOneIdentifier(value, ctx);
	},
);

// contacts.delete

const ContactsDeleteInputSchema = z
	.object({
		email: z.email().optional(),
		userId: z.string().optional(),
	})
	.superRefine(requireExactlyOneIdentifier);

const ContactsDeleteResponseSchema = z.object({
	success: z.literal(true),
	// Loops answers "Contact deleted."; a bodyless success fails here instead
	// of looking like a delete that worked.
	message: z.string(),
});

// contacts.listProperties

const ContactsListPropertiesInputSchema = z.object({
	list: z.enum(['all', 'custom']).optional(),
});

const ContactPropertySchema = z
	.object({
		key: z.string(),
		label: z.string(),
		type: z.enum(['string', 'number', 'boolean', 'date']),
	})
	.loose();

const ContactsListPropertiesResponseSchema = z.array(ContactPropertySchema);

// contacts.getSuppression

const ContactsGetSuppressionInputSchema = z
	.object({
		email: z.email().optional(),
		userId: z.string().optional(),
	})
	.superRefine(requireExactlyOneIdentifier);

const ContactsGetSuppressionResponseSchema = z
	.object({
		contact: z
			.object({
				id: z.string(),
				email: z.string(),
				userId: z.string().nullish(),
			})
			.loose(),
		isSuppressed: z.boolean(),
		removalQuota: z
			.object({
				limit: z.number(),
				remaining: z.number(),
			})
			.loose(),
	})
	.loose();

// events.send

const EventsSendInputSchema = z
	.object({
		eventName: z.string(),
		email: z.email().optional(),
		userId: z.string().optional(),
		eventProperties: TemplateDataSchema.optional(),
		mailingLists: MailingListsSchema.optional(),
		customProperties: z
			.record(z.string(), CustomPropertyValueSchema)
			.optional(),
	})
	.superRefine((value, ctx) => {
		rejectReservedProperties(value, ctx);
		requireOneIdentifier(value, ctx);
	});

const EventsSendResponseSchema = z.object({
	success: z.literal(true),
});

// transactional.send

const AttachmentSchema = z.object({
	filename: z.string(),
	contentType: z.string(),
	// Base64-encoded file content, as the spec defines.
	data: z.base64(),
});

const TransactionalSendInputSchema = z.object({
	email: z.email(),
	transactionalId: z.string(),
	addToAudience: z.boolean().optional(),
	dataVariables: TemplateDataSchema.optional(),
	attachments: z.array(AttachmentSchema).optional(),
	// Reusing a key within 24 hours answers 409; the API recommends a V4 UUID.
	idempotencyKey: z.string().max(100).optional(),
});

const TransactionalSendResponseSchema = z.object({
	success: z.literal(true),
});

// lists.list

const ListsListInputSchema = z.object({});

const MailingListSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullish(),
		isPublic: z.boolean(),
	})
	.loose();

const ListsListResponseSchema = z.array(MailingListSchema);

export type VerifyConnectionInput = z.input<typeof VerifyConnectionInputSchema>;
export type VerifyConnectionResponse = z.infer<
	typeof VerifyConnectionResponseSchema
>;
export type ContactsFindInput = z.input<typeof ContactsFindInputSchema>;
export type ContactsFindResponse = z.infer<typeof ContactsFindResponseSchema>;
export type LoopsContact = z.infer<typeof ContactSchema>;
export type ContactsCreateInput = z.input<typeof ContactsCreateInputSchema>;
export type ContactsCreateResponse = z.infer<typeof ContactWriteResponseSchema>;
export type ContactsUpdateInput = z.input<typeof ContactsUpdateInputSchema>;
export type ContactsUpdateResponse = z.infer<typeof ContactWriteResponseSchema>;
export type ContactsDeleteInput = z.input<typeof ContactsDeleteInputSchema>;
export type ContactsDeleteResponse = z.infer<
	typeof ContactsDeleteResponseSchema
>;
export type ContactsListPropertiesInput = z.input<
	typeof ContactsListPropertiesInputSchema
>;
export type ContactsListPropertiesResponse = z.infer<
	typeof ContactsListPropertiesResponseSchema
>;
export type ContactsGetSuppressionInput = z.input<
	typeof ContactsGetSuppressionInputSchema
>;
export type ContactsGetSuppressionResponse = z.infer<
	typeof ContactsGetSuppressionResponseSchema
>;
export type EventsSendInput = z.input<typeof EventsSendInputSchema>;
export type EventsSendResponse = z.infer<typeof EventsSendResponseSchema>;
export type TransactionalSendInput = z.input<
	typeof TransactionalSendInputSchema
>;
export type TransactionalSendResponse = z.infer<
	typeof TransactionalSendResponseSchema
>;
export type ListsListInput = z.input<typeof ListsListInputSchema>;
export type ListsListResponse = z.infer<typeof ListsListResponseSchema>;

export type LoopsEndpointInputs = {
	apikeyVerifyConnection: VerifyConnectionInput;
	contactsFind: ContactsFindInput;
	contactsCreate: ContactsCreateInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
	contactsListProperties: ContactsListPropertiesInput;
	contactsGetSuppression: ContactsGetSuppressionInput;
	eventsSend: EventsSendInput;
	transactionalSend: TransactionalSendInput;
	listsList: ListsListInput;
};

export type LoopsEndpointOutputs = {
	apikeyVerifyConnection: VerifyConnectionResponse;
	contactsFind: ContactsFindResponse;
	contactsCreate: ContactsCreateResponse;
	contactsUpdate: ContactsUpdateResponse;
	contactsDelete: ContactsDeleteResponse;
	contactsListProperties: ContactsListPropertiesResponse;
	contactsGetSuppression: ContactsGetSuppressionResponse;
	eventsSend: EventsSendResponse;
	transactionalSend: TransactionalSendResponse;
	listsList: ListsListResponse;
};

export const LoopsEndpointInputSchemas = {
	apikeyVerifyConnection: VerifyConnectionInputSchema,
	contactsFind: ContactsFindInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsListProperties: ContactsListPropertiesInputSchema,
	contactsGetSuppression: ContactsGetSuppressionInputSchema,
	eventsSend: EventsSendInputSchema,
	transactionalSend: TransactionalSendInputSchema,
	listsList: ListsListInputSchema,
} as const;

export const LoopsEndpointOutputSchemas = {
	apikeyVerifyConnection: VerifyConnectionResponseSchema,
	contactsFind: ContactsFindResponseSchema,
	contactsCreate: ContactWriteResponseSchema,
	contactsUpdate: ContactWriteResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
	contactsListProperties: ContactsListPropertiesResponseSchema,
	contactsGetSuppression: ContactsGetSuppressionResponseSchema,
	eventsSend: EventsSendResponseSchema,
	transactionalSend: TransactionalSendResponseSchema,
	listsList: ListsListResponseSchema,
} as const;
