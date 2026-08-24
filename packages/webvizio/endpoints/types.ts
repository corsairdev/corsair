import { z } from 'zod';

const WebvizioProjectSchema = z
        .object({
                id: z.string(),
                name: z.string().optional(),
                description: z.string().optional(),
        })
        .passthrough();

export type WebvizioProject = z.infer<typeof WebvizioProjectSchema>;

const WebvizioWebhookSubscriptionSchema = z
        .object({
                id: z.string().optional(),
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
