import { z } from 'zod';

// Contacts
export const ContactsGetInputSchema = z.object({
	collected_after: z.string().optional(),
	wisepop_id: z.number().optional(),
	page_size: z.number().optional(),
});
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

export const ContactsGetResponseSchema = z.array(
	z.object({
		collected_at: z.string(),
		wisepop_id: z.number(),
		ip: z.string().optional(),
		country_code: z.string().optional(),
		form_session: z.string().optional(),
		fields: z.record(z.string(), z.any()).optional(),
	}),
);
export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

// Performance
export const PerformanceGetInputSchema = z.object({});
export type PerformanceGetInput = z.infer<typeof PerformanceGetInputSchema>;

export const PerformanceGetResponseSchema = z.array(
	z.object({
		id: z.number(),
		label: z.string(),
		created_at: z.string(),
		activated: z.boolean(),
		display_count: z.number(),
		click_count: z.number(),
		email_count: z.number(),
	}),
);
export type PerformanceGetResponse = z.infer<
	typeof PerformanceGetResponseSchema
>;

// Webhooks
export const WebhookCreateInputSchema = z.object({
	event: z.enum(['email', 'phone', 'survey']),
	target_url: z.string(),
	wisepop_id: z.number().optional(),
});
export type WebhookCreateInput = z.infer<typeof WebhookCreateInputSchema>;

export const WebhookCreateResponseSchema = z.object({
	id: z.number(),
});
export type WebhookCreateResponse = z.infer<typeof WebhookCreateResponseSchema>;

export const WebhookDeleteInputSchema = z.object({
	hook_id: z.number(),
});
export type WebhookDeleteInput = z.infer<typeof WebhookDeleteInputSchema>;

export const WebhookDeleteResponseSchema = z.any();
export type WebhookDeleteResponse = z.infer<typeof WebhookDeleteResponseSchema>;

// Data Privacy
export const DataPrivacyDeleteInputSchema = z.object({
	email: z.string().optional(),
	phone: z.string().optional(),
});
export type DataPrivacyDeleteInput = z.infer<
	typeof DataPrivacyDeleteInputSchema
>;

export const DataPrivacyDeleteResponseSchema = z.object({
	deleted: z.number(),
});
export type DataPrivacyDeleteResponse = z.infer<
	typeof DataPrivacyDeleteResponseSchema
>;

// Aggregated Types
export type WisepopsEndpointInputs = {
	contactsGet: ContactsGetInput;
	performanceGet: PerformanceGetInput;
	webhookCreate: WebhookCreateInput;
	webhookDelete: WebhookDeleteInput;
	dataPrivacyDelete: DataPrivacyDeleteInput;
};

export type WisepopsEndpointOutputs = {
	contactsGet: ContactsGetResponse;
	performanceGet: PerformanceGetResponse;
	webhookCreate: WebhookCreateResponse;
	webhookDelete: WebhookDeleteResponse;
	dataPrivacyDelete: DataPrivacyDeleteResponse;
};

export const WisepopsEndpointInputSchemas = {
	contactsGet: ContactsGetInputSchema,
	performanceGet: PerformanceGetInputSchema,
	webhookCreate: WebhookCreateInputSchema,
	webhookDelete: WebhookDeleteInputSchema,
	dataPrivacyDelete: DataPrivacyDeleteInputSchema,
} as const;

export const WisepopsEndpointOutputSchemas = {
	contactsGet: ContactsGetResponseSchema,
	performanceGet: PerformanceGetResponseSchema,
	webhookCreate: WebhookCreateResponseSchema,
	webhookDelete: WebhookDeleteResponseSchema,
	dataPrivacyDelete: DataPrivacyDeleteResponseSchema,
} as const;
