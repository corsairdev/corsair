import { z } from 'zod';

// ── Shared input pieces ─────────────────────────────────────────────────────

const EventId = z
	.string()
	.min(1)
	.describe('Event id hash, the `id` from events.list.');
const PresentationId = z
	.union([z.number().int(), z.string().min(1)])
	.describe('Presentation (session) id from presentations.list.');
const OrderId = z.string().min(1).describe('Order id from orders.list.');
const ParticipantId = z
	.union([z.number().int(), z.string().min(1)])
	.describe('Participant id from participants.list.');
const TicketNumber = z
	.string()
	.min(1)
	.describe('Ticket number printed on the ticket, e.g. 94461180000001.');

const Timezone = z
	.string()
	.min(1)
	.optional()
	.describe(
		'IANA timezone for dates in and out. Sympla default: America/Sao_Paulo.',
	);
const Fields = z
	.string()
	.min(1)
	.optional()
	.describe('Comma-separated snake_case fields to return. Omit for all.');
const Cursor = z
	.string()
	.min(1)
	.optional()
	.describe('pagination.next_cursor from the previous page.');
const Sort = z.enum(['asc', 'desc']).optional().describe('Sort direction.');
const From = z
	.string()
	.min(1)
	.optional()
	.describe(
		'Start of the date range, local ISO-8601, e.g. 2025-09-08T00:00:00.',
	);
const To = z
	.string()
	.min(1)
	.optional()
	.describe('End of the date range, local ISO-8601, e.g. 2025-09-09T23:59:59.');
const CancelledFilter = z
	.enum(['none', 'include', 'only'])
	.optional()
	.describe('Cancelled records: none (default), include or only.');

function pageSize(max: number) {
	return z
		.number()
		.int()
		.min(1)
		.max(max)
		.optional()
		.describe(`Items per page, 1 to ${max}. Sympla default 100.`);
}

const OrderListFilters = {
	timezone: Timezone,
	from: From,
	to: To,
	fields: Fields,
	cancelled_filter: CancelledFilter,
	buyer_email: z
		.string()
		.email()
		.optional()
		.describe('Only orders by this buyer email (exact match).'),
	page_size: pageSize(200),
	cursor: Cursor,
	field_sort: z
		.enum([
			'order_date',
			'updated_date',
			'approved_date',
			'buyer_email',
			'status',
			'id',
		])
		.optional()
		.describe('Sort field. Sympla default: order_date.'),
	sort: Sort,
};

const ParticipantListFilters = {
	timezone: Timezone,
	from: From.describe('Start of the ticket_updated_at range, local ISO-8601.'),
	to: To.describe('End of the ticket_updated_at range, local ISO-8601.'),
	fields: Fields,
	cancelled_filter: CancelledFilter,
	participant_email: z
		.string()
		.email()
		.optional()
		.describe('Only participants with this email (exact match).'),
	page_size: pageSize(500),
	cursor: Cursor,
	field_sort: z
		.enum(['ticket_created_at', 'ticket_updated_at'])
		.optional()
		.describe('Sort field. Sympla default: ticket_created_at.'),
	sort: Sort,
};

// ── Shared response pieces (lenient: Sympla omits null fields) ──────────────

const IdValue = z.union([z.string(), z.number()]);
const Flag = z.union([z.boolean(), z.number()]).nullable().optional();
const Text = z.string().nullable().optional();
const Num = z.number().nullable().optional();
// unknown: nested objects (address, host, invoice, utm) vary by event and are passed through.
const Nested = z.record(z.string(), z.unknown()).nullable().optional();

const CursorPaginationSchema = z
	.object({
		next_cursor: Text,
		page_size: Num,
		quantity: Num,
	})
	.passthrough();

function listOf<T extends z.ZodTypeAny>(item: T) {
	return z
		.object({
			data: z.array(item),
			pagination: CursorPaginationSchema.optional(),
			sort: z.object({ field_sort: Text, sort: Text }).passthrough().optional(),
		})
		.passthrough();
}

/** A single record, bare or wrapped in `{ data }` (the reference shows both). */
function oneOf<T extends z.ZodTypeAny>(item: T) {
	return z.union([z.object({ data: item }).passthrough(), item]);
}

export const EventSchema = z
	.object({
		id: IdValue,
		reference_id: Num,
		name: Text,
		detail: Text,
		start_date: Text,
		end_date: Text,
		private_event: Flag,
		published: Flag,
		cancelled: Flag,
		image: Text,
		url: Text,
		address: Nested,
		host: Nested,
		category_prim: Nested,
		category_sec: Nested,
	})
	.passthrough();

export type SymplaEvent = z.infer<typeof EventSchema>;

const PresentationSchema = z
	.object({
		id: IdValue,
		event_id: z.union([z.string(), z.number()]).nullable().optional(),
		presentation_url: Text,
		closed: Flag,
		enabled: Flag,
		private_presentation: Flag,
		published: Flag,
		start_date: Text,
		end_date: Text,
		start_date_utc: Text,
		end_date_utc: Text,
		sectors: z
			.array(
				z
					.object({
						id: IdValue.nullable().optional(),
						name: Text,
						has_online_sale_available: Flag,
					})
					.passthrough(),
			)
			.nullable()
			.optional(),
	})
	.passthrough();

const OrderSchema = z
	.object({
		id: IdValue,
		event_id: z.union([z.string(), z.number()]).nullable().optional(),
		presentation_id: z.union([z.string(), z.number()]).nullable().optional(),
		order_date: Text,
		order_status: Text,
		updated_date: Text,
		approved_date: Text,
		discount_code: Text,
		transaction_type: Text,
		order_total_sale_price: Num,
		order_total_net_value: Num,
		buyer_first_name: Text,
		buyer_last_name: Text,
		buyer_email: Text,
		invoice_info: Nested,
		utm: Nested,
	})
	.passthrough();

const ParticipantSchema = z
	.object({
		id: IdValue,
		event_id: z.union([z.string(), z.number()]).nullable().optional(),
		presentation_id: z.union([z.string(), z.number()]).nullable().optional(),
		order_id: z.union([z.string(), z.number()]).nullable().optional(),
		order_status: Text,
		first_name: Text,
		last_name: Text,
		email: Text,
		ticket_number: Text,
		ticket_num_qr_code: Text,
		ticket_name: Text,
		ticket_status: Text,
		ticket_sale_price: Num,
		ticket_net_value: Num,
		sector_name: Text,
		// The reference shows check-in both as { check_in, check_in_date } and as { date, id }.
		checkin: Nested,
		// unknown: custom form answers are the organizer's own questions; the reference shows an array and an object.
		custom_form: z
			.union([z.array(z.unknown()), z.record(z.string(), z.unknown())])
			.nullable()
			.optional(),
	})
	.passthrough();

const CheckInResultSchema = z
	.object({
		data: z
			.object({
				check_in: z.boolean().nullable().optional(),
				check_in_date: Text,
				check_in_id: IdValue.nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

// ── events ──────────────────────────────────────────────────────────────────

export const ListEventsInputSchema = z.object({
	published: z
		.enum(['published', 'not_published', 'all'])
		.optional()
		.describe('Publication filter. Sympla default: published.'),
	from: From,
	timezone: Timezone,
	sort: Sort,
	field_sort: z
		.enum(['start_date', 'end_date', 'name'])
		.optional()
		.describe('Sort field. Sympla default: start_date.'),
	page_size: pageSize(200),
	cursor: Cursor,
	fields: Fields,
});
export const ListEventsResponseSchema = listOf(EventSchema);

export const GetEventInputSchema = z.object({
	event_id: EventId,
	timezone: Timezone,
	fields: Fields,
});
export const GetEventResponseSchema = oneOf(EventSchema);

// ── presentations ───────────────────────────────────────────────────────────

export const ListPresentationsInputSchema = z.object({
	event_id: EventId,
	published: z
		.boolean()
		.optional()
		.describe('Only published presentations. Sympla default: true.'),
	from: From,
	timezone: Timezone,
	sort: Sort,
	field_sort: z
		.enum(['start_date'])
		.optional()
		.describe('Sort field: start_date.'),
	filter_online_sector: z
		.boolean()
		.optional()
		.describe('Only sectors sold online. Sympla default: true.'),
	page_size: pageSize(200),
	cursor: Cursor,
	fields: Fields,
});
export const ListPresentationsResponseSchema = listOf(PresentationSchema);

export const GetPresentationInputSchema = z.object({
	event_id: EventId,
	presentation_id: PresentationId,
	timezone: Timezone,
	fields: Fields,
});
export const GetPresentationResponseSchema = oneOf(PresentationSchema);

// ── orders ──────────────────────────────────────────────────────────────────

export const ListOrdersInputSchema = z.object({
	event_id: EventId,
	...OrderListFilters,
});
export const ListOrdersResponseSchema = listOf(OrderSchema);

export const ListPresentationOrdersInputSchema = z.object({
	event_id: EventId,
	presentation_id: PresentationId,
	...OrderListFilters,
});
export const ListPresentationOrdersResponseSchema = listOf(OrderSchema);

export const GetOrderInputSchema = z.object({
	event_id: EventId,
	order_id: OrderId,
});
export const GetOrderResponseSchema = oneOf(OrderSchema);

// ── participants ────────────────────────────────────────────────────────────

export const ListParticipantsInputSchema = z.object({
	event_id: EventId,
	...ParticipantListFilters,
});
export const ListParticipantsResponseSchema = listOf(ParticipantSchema);

export const ListOrderParticipantsInputSchema = z.object({
	event_id: EventId,
	order_id: OrderId,
	fields: Fields,
	timezone: Timezone,
	cancelled_filter: CancelledFilter,
	page_size: pageSize(500),
	cursor: Cursor,
	field_sort: ParticipantListFilters.field_sort,
	sort: Sort,
});
export const ListOrderParticipantsResponseSchema = listOf(ParticipantSchema);

export const ListPresentationParticipantsInputSchema = z.object({
	event_id: EventId,
	presentation_id: PresentationId,
	...ParticipantListFilters,
});
export const ListPresentationParticipantsResponseSchema =
	listOf(ParticipantSchema);

export const GetParticipantInputSchema = z.object({
	event_id: EventId,
	participant_id: ParticipantId,
	timezone: Timezone,
	fields: Fields,
});
export const GetParticipantResponseSchema = oneOf(ParticipantSchema);

export const GetParticipantByTicketInputSchema = z.object({
	event_id: EventId,
	ticket_number: TicketNumber,
	timezone: Timezone,
	fields: Fields,
});
export const GetParticipantByTicketResponseSchema = oneOf(ParticipantSchema);

// ── check-in ────────────────────────────────────────────────────────────────

export const CheckInParticipantInputSchema = z.object({
	event_id: EventId,
	participant_id: ParticipantId,
});
export const CheckInParticipantResponseSchema = CheckInResultSchema;

export const CheckInByTicketInputSchema = z.object({
	event_id: EventId,
	ticket_number: TicketNumber,
});
export const CheckInByTicketResponseSchema = CheckInResultSchema;

export const CheckInByQrCodeInputSchema = z.object({
	event_id: EventId,
	itemId: z
		.string()
		.min(1)
		.describe('itemId from the scanned QR code payload.'),
	walletId: z
		.string()
		.min(1)
		.describe('walletId from the scanned QR code payload.'),
	signature: z
		.string()
		.min(130)
		.max(132)
		.describe('signature from the scanned QR code payload.'),
	timestamp: z
		.number()
		.int()
		.describe('timestamp from the scanned QR code payload.'),
	version: z.number().describe('version from the scanned QR code payload.'),
});
export const CheckInByQrCodeResponseSchema = CheckInResultSchema;

// ── Types ───────────────────────────────────────────────────────────────────

export type ListEventsInput = z.infer<typeof ListEventsInputSchema>;
export type ListEventsResponse = z.infer<typeof ListEventsResponseSchema>;
export type GetEventInput = z.infer<typeof GetEventInputSchema>;
export type GetEventResponse = z.infer<typeof GetEventResponseSchema>;
export type ListPresentationsInput = z.infer<
	typeof ListPresentationsInputSchema
>;
export type ListPresentationsResponse = z.infer<
	typeof ListPresentationsResponseSchema
>;
export type GetPresentationInput = z.infer<typeof GetPresentationInputSchema>;
export type GetPresentationResponse = z.infer<
	typeof GetPresentationResponseSchema
>;
export type ListOrdersInput = z.infer<typeof ListOrdersInputSchema>;
export type ListOrdersResponse = z.infer<typeof ListOrdersResponseSchema>;
export type ListPresentationOrdersInput = z.infer<
	typeof ListPresentationOrdersInputSchema
>;
export type ListPresentationOrdersResponse = z.infer<
	typeof ListPresentationOrdersResponseSchema
>;
export type GetOrderInput = z.infer<typeof GetOrderInputSchema>;
export type GetOrderResponse = z.infer<typeof GetOrderResponseSchema>;
export type ListParticipantsInput = z.infer<typeof ListParticipantsInputSchema>;
export type ListParticipantsResponse = z.infer<
	typeof ListParticipantsResponseSchema
>;
export type ListOrderParticipantsInput = z.infer<
	typeof ListOrderParticipantsInputSchema
>;
export type ListOrderParticipantsResponse = z.infer<
	typeof ListOrderParticipantsResponseSchema
>;
export type ListPresentationParticipantsInput = z.infer<
	typeof ListPresentationParticipantsInputSchema
>;
export type ListPresentationParticipantsResponse = z.infer<
	typeof ListPresentationParticipantsResponseSchema
>;
export type GetParticipantInput = z.infer<typeof GetParticipantInputSchema>;
export type GetParticipantResponse = z.infer<
	typeof GetParticipantResponseSchema
>;
export type GetParticipantByTicketInput = z.infer<
	typeof GetParticipantByTicketInputSchema
>;
export type GetParticipantByTicketResponse = z.infer<
	typeof GetParticipantByTicketResponseSchema
>;
export type CheckInParticipantInput = z.infer<
	typeof CheckInParticipantInputSchema
>;
export type CheckInParticipantResponse = z.infer<
	typeof CheckInParticipantResponseSchema
>;
export type CheckInByTicketInput = z.infer<typeof CheckInByTicketInputSchema>;
export type CheckInByTicketResponse = z.infer<
	typeof CheckInByTicketResponseSchema
>;
export type CheckInByQrCodeInput = z.infer<typeof CheckInByQrCodeInputSchema>;
export type CheckInByQrCodeResponse = z.infer<
	typeof CheckInByQrCodeResponseSchema
>;

export const SymplaEndpointInputSchemas = {
	listEvents: ListEventsInputSchema,
	getEvent: GetEventInputSchema,
	listPresentations: ListPresentationsInputSchema,
	getPresentation: GetPresentationInputSchema,
	listOrders: ListOrdersInputSchema,
	listPresentationOrders: ListPresentationOrdersInputSchema,
	getOrder: GetOrderInputSchema,
	listParticipants: ListParticipantsInputSchema,
	listOrderParticipants: ListOrderParticipantsInputSchema,
	listPresentationParticipants: ListPresentationParticipantsInputSchema,
	getParticipant: GetParticipantInputSchema,
	getParticipantByTicket: GetParticipantByTicketInputSchema,
	checkInParticipant: CheckInParticipantInputSchema,
	checkInByTicket: CheckInByTicketInputSchema,
	checkInByQrCode: CheckInByQrCodeInputSchema,
} as const;

export const SymplaEndpointOutputSchemas = {
	listEvents: ListEventsResponseSchema,
	getEvent: GetEventResponseSchema,
	listPresentations: ListPresentationsResponseSchema,
	getPresentation: GetPresentationResponseSchema,
	listOrders: ListOrdersResponseSchema,
	listPresentationOrders: ListPresentationOrdersResponseSchema,
	getOrder: GetOrderResponseSchema,
	listParticipants: ListParticipantsResponseSchema,
	listOrderParticipants: ListOrderParticipantsResponseSchema,
	listPresentationParticipants: ListPresentationParticipantsResponseSchema,
	getParticipant: GetParticipantResponseSchema,
	getParticipantByTicket: GetParticipantByTicketResponseSchema,
	checkInParticipant: CheckInParticipantResponseSchema,
	checkInByTicket: CheckInByTicketResponseSchema,
	checkInByQrCode: CheckInByQrCodeResponseSchema,
} as const;
