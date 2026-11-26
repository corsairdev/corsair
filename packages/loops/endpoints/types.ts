import { z } from 'zod';
import type {
	ContentEndpointInputs,
	ContentEndpointOutputs,
} from './content-types';
import {
	ContentEndpointInputSchemas,
	ContentEndpointOutputSchemas,
} from './content-types';
import { joinLazy } from './memo';

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

// Sent as the Idempotency-Key header. Fetch trims spaces, tabs and line breaks
// from header values, so a key made only of them would go out empty: Loops
// would not deduplicate it, yet the send would count as replay-safe.
const IdempotencyKeySchema = z
	.string()
	.min(1)
	.max(100)
	.refine((key) => /[^\t\n\r ]/.test(key), {
		message: 'The idempotency key cannot be blank.',
	});

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
	// events.send body fields; a custom property with one of these names
	// would overwrite them.
	'eventName',
	'eventProperties',
	'idempotencyKey',
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

// A selector counts as given whenever it is present: the request builders
// send any defined value, so an empty userId would go out as `userId=` next
// to the email.
function requireExactlyOneIdentifier(
	value: { email?: string; userId?: string },
	ctx: z.RefinementCtx,
): void {
	if (value.userId === '') {
		ctx.addIssue({
			code: 'custom',
			path: ['userId'],
			message: 'userId cannot be empty; leave it out instead.',
		});
	}
	const hasEmail = value.email !== undefined;
	const hasUserId = value.userId !== undefined;
	if (!hasEmail && !hasUserId) {
		ctx.addIssue({
			code: 'custom',
			message: 'Provide exactly one of email or userId.',
		});
	}
	if (hasEmail && hasUserId) {
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
		// id and email identify the record, so a contact without one of them is
		// not usable by any caller and fails the parse loudly.
		id: z.string(),
		email: z.string(),
		// The spec's Contact schema declares no required fields, so older or
		// partial contacts can omit any non-identity field.
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		source: z.string().nullish(),
		subscribed: z.boolean().nullish(),
		userGroup: z.string().nullish(),
		userId: z.string().nullish(),
		mailingLists: MailingListsSchema.optional(),
		// accepted, pending or rejected today; open so a new status still parses.
		optInStatus: z.string().nullish(),
	})
	// Custom contact properties come back inline beside the fixed fields.
	.loose();

const ContactsFindResponseSchema = z.array(ContactSchema);

// contacts.create

const ContactsCreateInputSchema = ContactFieldsSchema.superRefine(
	(value, ctx) => {
		rejectReservedProperties(value, ctx);
		// The spec's create request is ContactFields with required: ['email'];
		// unlike update, create has no userId-only form, and Loops answers 400
		// for one, so require the email here instead of spending the call.
		if (!value.email) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide an email to create a contact.',
			});
		}
	},
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
		// string, number, boolean or date today; open so a new type still parses.
		type: z.string(),
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
		// Sent as the Idempotency-Key header; a reuse within 24 hours answers 409.
		idempotencyKey: IdempotencyKeySchema.optional(),
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
	idempotencyKey: IdempotencyKeySchema.optional(),
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
} & ContentEndpointInputs;

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
} & ContentEndpointOutputs;

const HandWrittenInputSchemas = {
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

export const LoopsEndpointInputSchemas = joinLazy(
	HandWrittenInputSchemas,
	ContentEndpointInputSchemas,
);

const HandWrittenOutputSchemas = {
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

export const LoopsEndpointOutputSchemas = joinLazy(
	HandWrittenOutputSchemas,
	ContentEndpointOutputSchemas,
);
