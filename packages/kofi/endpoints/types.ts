import { z } from 'zod';

// Ko-fi publishes no REST API, so there is nothing to call. The one operation
// returns the documented payment types from the webhook reference, the same way
// `woodpeckerco` returns its webhook event catalog without an API call.

const WebhooksListEventsInputSchema = z.object({});

export type WebhooksListEventsInput = z.input<
	typeof WebhooksListEventsInputSchema
>;

const WebhookEventSchema = z.object({
	type: z.string(),
	description: z.string(),
	docs_url: z.string(),
});

export type KofiWebhookEvent = z.infer<typeof WebhookEventSchema>;

const WebhooksListEventsResponseSchema = z.object({
	events: z.array(WebhookEventSchema),
});

export type WebhooksListEventsResponse = z.infer<
	typeof WebhooksListEventsResponseSchema
>;

export type KofiEndpointInputs = {
	webhooksListEvents: WebhooksListEventsInput;
};

export type KofiEndpointOutputs = {
	webhooksListEvents: WebhooksListEventsResponse;
};

export const KofiEndpointInputSchemas = {
	webhooksListEvents: WebhooksListEventsInputSchema,
} as const;

export const KofiEndpointOutputSchemas = {
	webhooksListEvents: WebhooksListEventsResponseSchema,
} as const;
