import { z } from 'zod';

export const WebvizioProjectSchema = z
	.object({
		uuid: z.string().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.passthrough();

export type WebvizioProject = z.infer<typeof WebvizioProjectSchema>;

export const WebvizioWebhookSubscriptionSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		url: z.string().optional(),
		event: z.string().optional(),
	})
	.passthrough();

export type WebvizioWebhookSubscription = z.infer<
	typeof WebvizioWebhookSubscriptionSchema
>;

export type WebvizioEndpointInputs = {
	projectsList: Record<string, never>;
	webhooksList: Record<string, never>;
};

export type WebvizioEndpointOutputs = {
	projectsList: WebvizioProject[];
	webhooksList: WebvizioWebhookSubscription[];
};

export const WebvizioEndpointInputSchemas = {
	projectsList: z.object({}),
	webhooksList: z.object({}),
} as const;

export const WebvizioEndpointOutputSchemas = {
	projectsList: z.array(WebvizioProjectSchema),
	webhooksList: z.array(WebvizioWebhookSubscriptionSchema),
} as const;
