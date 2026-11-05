import { z } from 'zod';

export const DeliveryEnvelopeSchema = z.looseObject({
	deliveryId: z.string().min(1),
	eventType: z.string().min(1),
	payload: z.looseObject({
		callId: z.string().optional(),
		messageId: z.string().optional(),
		numberId: z.string().optional(),
	}),
});

export type DeliveryEnvelope = z.infer<typeof DeliveryEnvelopeSchema>;

export const ConfirmedDeliverySchema = z.looseObject({
	eventType: z.string(),
	deliveryId: z.string(),
	resource: z.looseObject({}),
});

export type ConfirmedDelivery = z.infer<typeof ConfirmedDeliverySchema>;

export type SaperlyWebhookOutputs = {
	delivery: ConfirmedDelivery;
};
