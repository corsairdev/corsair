import { z } from 'zod';

export const CallPageWebhookEventSchema = z.object({
  data: z.object({
    event: z.string(),
    id: z.union([z.number(), z.string()]).optional(),
    status: z.string().optional(),
    ref_id: z.union([z.number(), z.string(), z.null()]).optional(),
    to: z.string().optional(),
    widget_id: z.union([z.number(), z.string()]).optional(),
    created_at: z.string().optional(),
    scheduled_at: z.string().nullable().optional(),
  }).passthrough(),
}).passthrough();

export type CallPageWebhookEvent = z.infer<typeof CallPageWebhookEventSchema>;

export const CallPageWebhookOutputSchema = z.unknown();
export type CallPageWebhookOutputs = { event: unknown };
