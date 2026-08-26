import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const BookingmoodWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()),
});

export type BookingmoodWebhookPayload = z.infer<
	typeof BookingmoodWebhookPayloadSchema
>;

export const BookingCreatedEventSchema = BookingmoodWebhookPayloadSchema.extend(
	{
		type: z.literal('booking.created'),
		data: z
			.object({
				id: z.string(),
				product_id: z.string().optional(),
				start_date: z.string().optional(),
				end_date: z.string().optional(),
				status: z.string().optional(),
			})
			.passthrough(),
	},
);

export type BookingCreatedEvent = z.infer<typeof BookingCreatedEventSchema>;

export const BookingUpdatedEventSchema = BookingmoodWebhookPayloadSchema.extend(
	{
		type: z.literal('booking.updated'),
		data: z
			.object({
				id: z.string(),
				product_id: z.string().optional(),
				start_date: z.string().optional(),
				end_date: z.string().optional(),
				status: z.string().optional(),
			})
			.passthrough(),
	},
);

export type BookingUpdatedEvent = z.infer<typeof BookingUpdatedEventSchema>;

export const BookingDeletedEventSchema = BookingmoodWebhookPayloadSchema.extend(
	{
		type: z.literal('booking.deleted'),
		data: z
			.object({
				id: z.string(),
			})
			.passthrough(),
	},
);

export type BookingDeletedEvent = z.infer<typeof BookingDeletedEventSchema>;

export const ProductCreatedEventSchema = BookingmoodWebhookPayloadSchema.extend(
	{
		type: z.literal('product.created'),
		data: z
			.object({
				id: z.string(),
				name: z.string().optional(),
			})
			.passthrough(),
	},
);

export type ProductCreatedEvent = z.infer<typeof ProductCreatedEventSchema>;

export const ProductUpdatedEventSchema = BookingmoodWebhookPayloadSchema.extend(
	{
		type: z.literal('product.updated'),
		data: z
			.object({
				id: z.string(),
				name: z.string().optional(),
			})
			.passthrough(),
	},
);

export type ProductUpdatedEvent = z.infer<typeof ProductUpdatedEventSchema>;

export type BookingmoodWebhookOutputs = {
	bookingCreated: BookingCreatedEvent;
	bookingUpdated: BookingUpdatedEvent;
	bookingDeleted: BookingDeletedEvent;
	productCreated: ProductCreatedEvent;
	productUpdated: ProductUpdatedEvent;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

export function createBookingmoodMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyBookingmoodWebhookSignature(
	request: WebhookRequest<BookingmoodWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) return { valid: true };
	const signature =
		request.headers['x-bookingmood-signature'] ||
		request.headers['x-signature'];
	if (!signature) {
		return { valid: false, error: 'Missing webhook signature header' };
	}
	return { valid: true };
}
