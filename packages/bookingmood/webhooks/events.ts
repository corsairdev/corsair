import type { BookingmoodEventType, BookingmoodWebhookPayload } from './types';
import {
	BOOKINGMOOD_EVENT_TYPES,
	createBookingmoodMatch,
	eventHandlerName,
	verifyBookingmoodWebhookSignature,
} from './types';

const ENTITY_BY_EVENT: Partial<Record<string, string>> = {
	bookings: 'bookings',
	products: 'products',
	contacts: 'contacts',
	members: 'members',
	widgets: 'widgets',
	calendar_events: 'calendar_events',
	invoices: 'invoices',
	payments: 'payments',
};

function rowId(row: Record<string, unknown> | undefined): string | undefined {
	return typeof row?.id === 'string' ? row.id : undefined;
}

function handlerFor(eventType: BookingmoodEventType) {
	const resource = eventType.split('.')[0] ?? '';
	const entity = ENTITY_BY_EVENT[resource];
	return {
		match: createBookingmoodMatch(eventType),
		handler: async (
			ctx: {
				key: string;
				db?: Record<
					string,
					{
						upsertByEntityId?: (
							id: string,
							row: Record<string, unknown>,
						) => Promise<unknown>;
						findByEntityId?: (
							id: string,
						) => Promise<Record<string, unknown> | null>;
						deleteByEntityId?: (id: string) => Promise<unknown>;
					}
				>;
			},
			request: {
				payload: BookingmoodWebhookPayload;
				headers: Record<string, string>;
			},
		) => {
			const verification = verifyBookingmoodWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}

			const next = request.payload.payload.new;
			const previous = request.payload.payload.old;
			const table = entity ? ctx.db?.[entity] : undefined;

			try {
				const id = rowId(next) ?? rowId(previous);
				if (table?.upsertByEntityId && next && id) {
					const existing = table.findByEntityId
						? await table.findByEntityId(id)
						: null;
					await table.upsertByEntityId(id, {
						...(existing ?? {}),
						...next,
						id,
					});
				} else if (table?.deleteByEntityId && !next && previous && id) {
					await table.deleteByEntityId(id);
				}
			} catch (error) {
				return {
					success: false,
					statusCode: 500,
					error:
						error instanceof Error
							? error.message
							: 'Webhook persistence failed',
				};
			}

			return { success: true, data: request.payload };
		},
	};
}

export const BookingmoodWebhooks = Object.fromEntries(
	BOOKINGMOOD_EVENT_TYPES.map((eventType) => [
		eventHandlerName(eventType),
		handlerFor(eventType),
	]),
) as Record<string, ReturnType<typeof handlerFor>>;
