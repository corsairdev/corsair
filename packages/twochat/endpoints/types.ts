import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

const contactDetailType = z
	.enum(['E', 'A', 'PH', 'WAPH'])
	.describe(
		'Contact detail type: E=Email, A=Address, PH=Phone, WAPH=WhatsApp phone',
	);

const contactDetailValue = z
	.string()
	.describe('The contact detail value (email, phone number, or address)');

// Create returns unix seconds (and updated_at: 0); list returns ISO strings.
const contactDetailTimestamp = z.union([z.string(), z.number()]).optional();

export const ContactDetailInputSchema = z.object({
	type: contactDetailType,
	value: contactDetailValue,
});

export const ContactDetailSchema = z.object({
	type: contactDetailType,
	value: contactDetailValue,
	id: z
		.number()
		.optional()
		.describe('Unique numeric ID for the contact detail'),
	created_at: contactDetailTimestamp.describe(
		'ISO timestamp or unix seconds when the contact detail was created',
	),
	updated_at: contactDetailTimestamp.describe(
		'ISO timestamp or unix seconds when the contact detail was updated',
	),
});

export type ContactDetail = z.infer<typeof ContactDetailSchema>;

export const ContactSchema = z.object({
	uuid: z.string().describe('Unique identifier for the contact'),
	first_name: z.string().describe('Contact first name'),
	last_name: z.string().optional().describe('Contact last name'),
	name: z.string().optional().describe('Contact full display name'),
	channel_uuid: z
		.string()
		.nullable()
		.optional()
		.describe('UUID of the WhatsApp channel associated with this contact'),
	profile_pic_url: z
		.string()
		.nullable()
		.optional()
		.describe('URL to the contact profile picture'),
	details: z.array(ContactDetailSchema).optional(),
	contact_details: z.array(ContactDetailSchema).optional(),
	last_updated: z
		.string()
		.optional()
		.describe('ISO timestamp when contact was last updated'),
	created_at: z
		.string()
		.optional()
		.describe('ISO timestamp when contact was created'),
});

export type Contact = z.infer<typeof ContactSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Create Contact
// POST /open/contacts
// ─────────────────────────────────────────────────────────────────────────────

export const CreateContactInputSchema = z.object({
	first_name: z.string().describe('First name of the new contact'),
	last_name: z.string().optional().describe('Last name of the new contact'),
	profile_pic_url: z
		.string()
		.url()
		.optional()
		.describe('Publicly accessible URL to the contact profile picture'),
	channel_uuid: z
		.string()
		.optional()
		.describe(
			'UUID of a WhatsApp channel — if provided the contact is also created on that WhatsApp account',
		),
	contact_details: z
		.array(ContactDetailInputSchema)
		.min(1)
		.describe(
			'At least one contact detail (email, phone, or address). Required.',
		),
});

export type CreateContactInput = z.infer<typeof CreateContactInputSchema>;

export const CreateContactResponseSchema = z.object({
	success: z.boolean(),
	contact: ContactSchema,
});

export type CreateContactResponse = z.infer<typeof CreateContactResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Get API Usage Info  (also used for Test API Key)
// GET /open/info
// ─────────────────────────────────────────────────────────────────────────────

export const GetApiUsageInfoInputSchema = z.object({});

export type GetApiUsageInfoInput = z.infer<typeof GetApiUsageInfoInputSchema>;

export const AccountInfoSchema = z.object({
	name: z.string().optional(),
	uuid: z.string().optional(),
	on_trial: z.boolean().optional(),
	blocked: z.boolean().optional(),
	created_at: z.string().optional(),
	expires_at: z.string().optional(),
});

export const ApiLimitsSchema = z.object({
	requests_per_minute: z.number().optional(),
});

export const ApiUsageSchema = z.object({
	api_request_count: z.number().optional(),
	max_api_request_count: z.number().optional(),
	number_check_count: z.number().optional(),
	max_number_check_count: z.number().optional(),
});

export const GetApiUsageInfoResponseSchema = z.object({
	success: z.boolean(),
	account: AccountInfoSchema.optional(),
	limits: ApiLimitsSchema.optional(),
	usage: ApiUsageSchema.optional(),
});

export type GetApiUsageInfoResponse = z.infer<
	typeof GetApiUsageInfoResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Test API Key  (same endpoint as GetApiUsageInfo, separated for clarity)
// GET /open/info
// ─────────────────────────────────────────────────────────────────────────────

export const TestApiKeyInputSchema = z.object({});

export type TestApiKeyInput = z.infer<typeof TestApiKeyInputSchema>;

export const TestApiKeyResponseSchema = GetApiUsageInfoResponseSchema;

export type TestApiKeyResponse = z.infer<typeof TestApiKeyResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// List Contacts
// GET /open/contacts
// ─────────────────────────────────────────────────────────────────────────────

export const ListContactsInputSchema = z.object({
	page_number: z
		.number()
		.int()
		.min(0)
		.optional()
		.default(0)
		.describe('Zero-based page number for pagination'),
	results_per_page: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.default(30)
		.describe('Number of contacts per page (1–100)'),
});

export type ListContactsInput = z.infer<typeof ListContactsInputSchema>;

export const ListContactsResponseSchema = z.object({
	success: z.boolean(),
	page: z.number(),
	count: z.number(),
	contacts: z.array(ContactSchema),
});

export type ListContactsResponse = z.infer<typeof ListContactsResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// List Webhook Subscriptions
// GET /open/webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const ListWebhooksInputSchema = z.object({});

export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

export const WebhookSubscriptionSchema = z.object({
	uuid: z.string().describe('Unique identifier for the webhook subscription'),
	event_name: z.string().describe('Event type this webhook is subscribed to'),
	channel_uuid: z
		.string()
		.optional()
		.describe('UUID of the WhatsApp channel this webhook is tied to'),
	hook_url: z.string().describe('Callback URL called when the event fires'),
	hook_params: z
		.record(z.string(), z.string())
		.optional()
		.describe('Custom webhook parameters (key-value strings)'),
	created_at: z
		.string()
		.optional()
		.describe('ISO timestamp when the webhook was created'),
});

export type WebhookSubscription = z.infer<typeof WebhookSubscriptionSchema>;

export const ListWebhooksResponseSchema = z.object({
	success: z.boolean().optional(),
	webhooks: z.array(WebhookSubscriptionSchema),
});

export type ListWebhooksResponse = z.infer<typeof ListWebhooksResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Aggregate input/output maps (required by validate:plugins)
// ─────────────────────────────────────────────────────────────────────────────

export type TwoChatEndpointInputs = {
	createContact: CreateContactInput;
	getApiUsageInfo: GetApiUsageInfoInput;
	testApiKey: TestApiKeyInput;
	listContacts: ListContactsInput;
	listWebhooks: ListWebhooksInput;
};

export type TwoChatEndpointOutputs = {
	createContact: CreateContactResponse;
	getApiUsageInfo: GetApiUsageInfoResponse;
	testApiKey: TestApiKeyResponse;
	listContacts: ListContactsResponse;
	listWebhooks: ListWebhooksResponse;
};

export const TwoChatEndpointInputSchemas = {
	createContact: CreateContactInputSchema,
	getApiUsageInfo: GetApiUsageInfoInputSchema,
	testApiKey: TestApiKeyInputSchema,
	listContacts: ListContactsInputSchema,
	listWebhooks: ListWebhooksInputSchema,
} as const;

export const TwoChatEndpointOutputSchemas = {
	createContact: CreateContactResponseSchema,
	getApiUsageInfo: GetApiUsageInfoResponseSchema,
	testApiKey: TestApiKeyResponseSchema,
	listContacts: ListContactsResponseSchema,
	listWebhooks: ListWebhooksResponseSchema,
} as const;
