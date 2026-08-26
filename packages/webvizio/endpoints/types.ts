import { z } from 'zod';

export const WebvizioProjectSchema = z
	.object({
		uuid: z.string().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		url: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const WebvizioWebhookSubscriptionSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		url: z.string().optional(),
		event: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const WebvizioEndpointInputSchemas = {
	projectsList: z.object({}),
	webhooksList: z.object({}),
};

export const WebvizioEndpointOutputSchemas = {
	projectsList: z.array(WebvizioProjectSchema),
	webhooksList: z.array(WebvizioWebhookSubscriptionSchema),
};

export type WebvizioProjectItem = z.infer<typeof WebvizioProjectSchema>;
export type WebvizioWebhookSubscription = z.infer<
	typeof WebvizioWebhookSubscriptionSchema
>;

export type ProjectsListInput = z.infer<
	typeof WebvizioEndpointInputSchemas.projectsList
>;
export type ProjectsListResponse = z.infer<
	typeof WebvizioEndpointOutputSchemas.projectsList
>;

export type WebhooksListInput = z.infer<
	typeof WebvizioEndpointInputSchemas.webhooksList
>;
export type WebhooksListResponse = z.infer<
	typeof WebvizioEndpointOutputSchemas.webhooksList
>;

export type WebvizioEndpointInputs = {
	projectsList: ProjectsListInput;
	webhooksList: WebhooksListInput;
};

export type WebvizioEndpointOutputs = {
	projectsList: ProjectsListResponse;
	webhooksList: WebhooksListResponse;
};
