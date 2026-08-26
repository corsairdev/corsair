import { z } from 'zod';

/** Official MCP project row: https://github.com/Webvizio/mcp/blob/main/src/types.ts */
export const WebvizioProjectSchema = z
	.object({
		uuid: z.string(),
		name: z.string(),
		id: z.number().optional(),
		externalId: z.string().nullable().optional(),
		screenshot: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		createdAt: z.string().nullable().optional(),
		updatedAt: z.string().nullable().optional(),
	})
	.passthrough();

/** Official REST Hooks subscription fields: https://webvizio.com/help-center/rest-hooks/ */
export const WebvizioWebhookSubscriptionSchema = z
	.object({
		id: z.number(),
		url: z.string(),
		event: z.string(),
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
