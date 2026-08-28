import { createHash, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const BOOKINGMOOD_EVENT_TYPES = [
	'bookings.created',
	'bookings.updated',
	'calendar_event_tasks.created',
	'calendar_event_tasks.updated',
	'calendar_event_tasks.completed',
	'calendar_events.created',
	'calendar_events.updated',
	'calendar_events.confirmed',
	'calendar_events.cancelled',
	'contacts.created',
	'contacts.updated',
	'invoices.created',
	'invoices.updated',
	'payments.created',
	'payments.updated',
	'payments.paid',
	'members.created',
	'members.updated',
	'products.created',
	'products.updated',
	'sites.created',
	'sites.updated',
	'widgets.created',
	'widgets.updated',
] as const;

export type BookingmoodEventType = (typeof BOOKINGMOOD_EVENT_TYPES)[number];

const ChangePayloadSchema = z
	.object({
		new: z.record(z.string(), z.unknown()).optional(),
		old: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export const BookingmoodWebhookPayloadSchema = z.object({
	id: z.string(),
	date: z.union([z.number(), z.string()]),
	event_type: z.string(),
	payload: ChangePayloadSchema,
});

export type BookingmoodWebhookPayload = z.infer<
	typeof BookingmoodWebhookPayloadSchema
>;

function eventSchema(eventType: BookingmoodEventType) {
	return BookingmoodWebhookPayloadSchema.extend({
		event_type: z.literal(eventType),
	});
}

export const BookingsCreatedEventSchema = eventSchema('bookings.created');
export const BookingsUpdatedEventSchema = eventSchema('bookings.updated');
export const CalendarEventTasksCreatedEventSchema = eventSchema(
	'calendar_event_tasks.created',
);
export const CalendarEventTasksUpdatedEventSchema = eventSchema(
	'calendar_event_tasks.updated',
);
export const CalendarEventTasksCompletedEventSchema = eventSchema(
	'calendar_event_tasks.completed',
);
export const CalendarEventsCreatedEventSchema = eventSchema(
	'calendar_events.created',
);
export const CalendarEventsUpdatedEventSchema = eventSchema(
	'calendar_events.updated',
);
export const CalendarEventsConfirmedEventSchema = eventSchema(
	'calendar_events.confirmed',
);
export const CalendarEventsCancelledEventSchema = eventSchema(
	'calendar_events.cancelled',
);
export const ContactsCreatedEventSchema = eventSchema('contacts.created');
export const ContactsUpdatedEventSchema = eventSchema('contacts.updated');
export const InvoicesCreatedEventSchema = eventSchema('invoices.created');
export const InvoicesUpdatedEventSchema = eventSchema('invoices.updated');
export const PaymentsCreatedEventSchema = eventSchema('payments.created');
export const PaymentsUpdatedEventSchema = eventSchema('payments.updated');
export const PaymentsPaidEventSchema = eventSchema('payments.paid');
export const MembersCreatedEventSchema = eventSchema('members.created');
export const MembersUpdatedEventSchema = eventSchema('members.updated');
export const ProductsCreatedEventSchema = eventSchema('products.created');
export const ProductsUpdatedEventSchema = eventSchema('products.updated');
export const SitesCreatedEventSchema = eventSchema('sites.created');
export const SitesUpdatedEventSchema = eventSchema('sites.updated');
export const WidgetsCreatedEventSchema = eventSchema('widgets.created');
export const WidgetsUpdatedEventSchema = eventSchema('widgets.updated');

export type BookingsCreatedEvent = z.infer<typeof BookingsCreatedEventSchema>;
export type BookingsUpdatedEvent = z.infer<typeof BookingsUpdatedEventSchema>;
export type CalendarEventTasksCreatedEvent = z.infer<
	typeof CalendarEventTasksCreatedEventSchema
>;
export type CalendarEventTasksUpdatedEvent = z.infer<
	typeof CalendarEventTasksUpdatedEventSchema
>;
export type CalendarEventTasksCompletedEvent = z.infer<
	typeof CalendarEventTasksCompletedEventSchema
>;
export type CalendarEventsCreatedEvent = z.infer<
	typeof CalendarEventsCreatedEventSchema
>;
export type CalendarEventsUpdatedEvent = z.infer<
	typeof CalendarEventsUpdatedEventSchema
>;
export type CalendarEventsConfirmedEvent = z.infer<
	typeof CalendarEventsConfirmedEventSchema
>;
export type CalendarEventsCancelledEvent = z.infer<
	typeof CalendarEventsCancelledEventSchema
>;
export type ContactsCreatedEvent = z.infer<typeof ContactsCreatedEventSchema>;
export type ContactsUpdatedEvent = z.infer<typeof ContactsUpdatedEventSchema>;
export type InvoicesCreatedEvent = z.infer<typeof InvoicesCreatedEventSchema>;
export type InvoicesUpdatedEvent = z.infer<typeof InvoicesUpdatedEventSchema>;
export type PaymentsCreatedEvent = z.infer<typeof PaymentsCreatedEventSchema>;
export type PaymentsUpdatedEvent = z.infer<typeof PaymentsUpdatedEventSchema>;
export type PaymentsPaidEvent = z.infer<typeof PaymentsPaidEventSchema>;
export type MembersCreatedEvent = z.infer<typeof MembersCreatedEventSchema>;
export type MembersUpdatedEvent = z.infer<typeof MembersUpdatedEventSchema>;
export type ProductsCreatedEvent = z.infer<typeof ProductsCreatedEventSchema>;
export type ProductsUpdatedEvent = z.infer<typeof ProductsUpdatedEventSchema>;
export type SitesCreatedEvent = z.infer<typeof SitesCreatedEventSchema>;
export type SitesUpdatedEvent = z.infer<typeof SitesUpdatedEventSchema>;
export type WidgetsCreatedEvent = z.infer<typeof WidgetsCreatedEventSchema>;
export type WidgetsUpdatedEvent = z.infer<typeof WidgetsUpdatedEventSchema>;

export const EVENT_SCHEMAS = {
	'bookings.created': BookingsCreatedEventSchema,
	'bookings.updated': BookingsUpdatedEventSchema,
	'calendar_event_tasks.created': CalendarEventTasksCreatedEventSchema,
	'calendar_event_tasks.updated': CalendarEventTasksUpdatedEventSchema,
	'calendar_event_tasks.completed': CalendarEventTasksCompletedEventSchema,
	'calendar_events.created': CalendarEventsCreatedEventSchema,
	'calendar_events.updated': CalendarEventsUpdatedEventSchema,
	'calendar_events.confirmed': CalendarEventsConfirmedEventSchema,
	'calendar_events.cancelled': CalendarEventsCancelledEventSchema,
	'contacts.created': ContactsCreatedEventSchema,
	'contacts.updated': ContactsUpdatedEventSchema,
	'invoices.created': InvoicesCreatedEventSchema,
	'invoices.updated': InvoicesUpdatedEventSchema,
	'payments.created': PaymentsCreatedEventSchema,
	'payments.updated': PaymentsUpdatedEventSchema,
	'payments.paid': PaymentsPaidEventSchema,
	'members.created': MembersCreatedEventSchema,
	'members.updated': MembersUpdatedEventSchema,
	'products.created': ProductsCreatedEventSchema,
	'products.updated': ProductsUpdatedEventSchema,
	'sites.created': SitesCreatedEventSchema,
	'sites.updated': SitesUpdatedEventSchema,
	'widgets.created': WidgetsCreatedEventSchema,
	'widgets.updated': WidgetsUpdatedEventSchema,
} as const;

export type BookingmoodWebhookOutputs = {
	[K in BookingmoodEventType as CamelEvent<K>]: z.infer<
		(typeof EVENT_SCHEMAS)[K]
	>;
};

type CamelEvent<S extends string> = S extends `${infer A}.${infer B}`
	? `${A}${Capitalize<B>}`
	: S;

export function eventHandlerName(eventType: BookingmoodEventType): string {
	const [resource, action] = eventType.split('.') as [string, string];
	return (
		resource.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()) +
		action.charAt(0).toUpperCase() +
		action.slice(1)
	);
}

export function parseBody(body: unknown): Record<string, unknown> | null {
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
		return parsedBody !== null && parsedBody.event_type === eventType;
	};
}

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const value = headers[name] ?? headers[name.toLowerCase()];
	return Array.isArray(value) ? value[0] : value;
}

function signedPayload(payload: BookingmoodWebhookPayload): string {
	return JSON.stringify({
		id: payload.id,
		event_type: payload.event_type,
		date: payload.date,
		payload: payload.payload,
	});
}

export function verifyBookingmoodWebhookSignature(
	request: WebhookRequest<BookingmoodWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret)
		return { valid: false, error: 'No webhook signing secret provided' };
	if (request.hubVerified) return { valid: true };

	const signature = headerValue(request.headers, 'x-signature');
	if (!signature) {
		return { valid: false, error: 'Missing X-Signature header' };
	}

	const expected = createHash('md5')
		.update(`${secret}.${signedPayload(request.payload)}`)
		.digest('hex');

	const received = Buffer.from(signature);
	const computed = Buffer.from(expected);
	if (
		received.length !== computed.length ||
		!timingSafeEqual(received, computed)
	) {
		return { valid: false, error: 'Invalid webhook signature' };
	}
	return { valid: true };
}
