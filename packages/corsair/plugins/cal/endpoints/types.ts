import { z } from 'zod';

const BookingsListInputSchema = z.object({
	status: z
		.enum(['upcoming', 'recurring', 'past', 'cancelled', 'unconfirmed'])
		.optional(),
	attendeeEmail: z.string().optional(),
	attendeeName: z.string().optional(),
	eventTypeIds: z.string().optional(),
	eventTypeId: z.number().optional(),
	teamsIds: z.string().optional(),
	teamId: z.number().optional(),
	afterStart: z.string().optional(),
	beforeEnd: z.string().optional(),
	sortStart: z.enum(['asc', 'desc']).optional(),
	sortEnd: z.enum(['asc', 'desc']).optional(),
	sortCreated: z.enum(['asc', 'desc']).optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
});

const BookingsGetInputSchema = z.object({
	uid: z.string(),
});

const BookingsCreateInputSchema = z.object({
	start: z.string(),
	eventTypeId: z.number(),
	attendee: z.object({
		name: z.string(),
		email: z.string(),
		timeZone: z.string(),
	}),
	meetingUrl: z.string().optional(),
	lengthInMinutes: z.number().optional(),
	// Custom form field responses with dynamic field names and values
	bookingFieldsResponses: z.record(z.unknown()).optional(),
	// Additional metadata that can be attached to the booking
	metadata: z.record(z.unknown()).optional(),
});

const BookingsCancelInputSchema = z.object({
	uid: z.string(),
	cancellationReason: z.string().optional(),
	allRemainingBookings: z.boolean().optional(),
});

const BookingsRescheduleInputSchema = z.object({
	uid: z.string(),
	start: z.string(),
	rescheduledBy: z.string().optional(),
});

const BookingsConfirmInputSchema = z.object({
	uid: z.string(),
});

const BookingsDeclineInputSchema = z.object({
	uid: z.string(),
	reason: z.string().optional(),
});

export type BookingsListInput = z.infer<typeof BookingsListInputSchema>;
export type BookingsGetInput = z.infer<typeof BookingsGetInputSchema>;
export type BookingsCreateInput = z.infer<typeof BookingsCreateInputSchema>;
export type BookingsCancelInput = z.infer<typeof BookingsCancelInputSchema>;
export type BookingsRescheduleInput = z.infer<
	typeof BookingsRescheduleInputSchema
>;
export type BookingsConfirmInput = z.infer<typeof BookingsConfirmInputSchema>;
export type BookingsDeclineInput = z.infer<typeof BookingsDeclineInputSchema>;

const AttendeeSchema = z
	.object({
		name: z.string(),
		email: z.string(),
		timeZone: z.string(),
		language: z.string().optional(),
		absent: z.boolean().optional(),
	})
	.passthrough();

const HostSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		email: z.string().optional(),
		username: z.string().optional(),
		timeZone: z.string().optional(),
	})
	.passthrough();

const BookingSchema = z
	.object({
		id: z.number(),
		uid: z.string(),
		title: z.string().optional(),
		description: z.string().nullable().optional(),
		status: z.string(),
		start: z.string().optional(),
		end: z.string().optional(),
		duration: z.number().optional(),
		eventTypeId: z.number().optional(),
		eventType: z
			.object({
				id: z.number(),
				slug: z.string().optional(),
			})
			.passthrough()
			.optional(),
		meetingUrl: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		absentHost: z.boolean().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		cancellationReason: z.string().nullable().optional(),
		reschedulingReason: z.string().nullable().optional(),
		rescheduledFromUid: z.string().nullable().optional(),
		attendees: z.array(AttendeeSchema).optional(),
		hosts: z.array(HostSchema).optional(),
		guests: z.array(z.string()).optional(),
		// Custom metadata associated with the booking
		metadata: z.record(z.unknown()).nullable().optional(),
		// Responses to custom booking form fields
		bookingFieldsResponses: z.record(z.unknown()).nullable().optional(),
	})
	.passthrough();

const CalResponseSchema = z
	.object({
		status: z.string(),
		// Response data from Cal.com API - structure varies by endpoint
		data: z.unknown().optional(),
	})
	.passthrough();

const BookingsListResponseSchema = CalResponseSchema.extend({
	data: z.array(BookingSchema).optional(),
}).passthrough();

const BookingsGetResponseSchema = CalResponseSchema.extend({
	data: BookingSchema.optional(),
}).passthrough();

const BookingsCreateResponseSchema = CalResponseSchema.extend({
	data: BookingSchema.optional(),
}).passthrough();

const BookingsCancelResponseSchema = CalResponseSchema.extend({
	data: BookingSchema.optional(),
}).passthrough();

const BookingsRescheduleResponseSchema = CalResponseSchema.extend({
	data: BookingSchema.optional(),
}).passthrough();

const BookingsConfirmResponseSchema = CalResponseSchema.extend({
	data: BookingSchema.optional(),
}).passthrough();

const BookingsDeclineResponseSchema = CalResponseSchema.extend({
	data: BookingSchema.optional(),
}).passthrough();

export const CalEndpointInputSchemas = {
	bookingsList: BookingsListInputSchema,
	bookingsGet: BookingsGetInputSchema,
	bookingsCreate: BookingsCreateInputSchema,
	bookingsCancel: BookingsCancelInputSchema,
	bookingsReschedule: BookingsRescheduleInputSchema,
	bookingsConfirm: BookingsConfirmInputSchema,
	bookingsDecline: BookingsDeclineInputSchema,
} as const;

export type CalEndpointInputs = {
	[K in keyof typeof CalEndpointInputSchemas]: z.infer<
		(typeof CalEndpointInputSchemas)[K]
	>;
};

export const CalEndpointOutputSchemas = {
	bookingsList: BookingsListResponseSchema,
	bookingsGet: BookingsGetResponseSchema,
	bookingsCreate: BookingsCreateResponseSchema,
	bookingsCancel: BookingsCancelResponseSchema,
	bookingsReschedule: BookingsRescheduleResponseSchema,
	bookingsConfirm: BookingsConfirmResponseSchema,
	bookingsDecline: BookingsDeclineResponseSchema,
} as const;

export type CalEndpointOutputs = {
	[K in keyof typeof CalEndpointOutputSchemas]: z.infer<
		(typeof CalEndpointOutputSchemas)[K]
	>;
};

export type BookingsListResponse = z.infer<
	typeof CalEndpointOutputSchemas.bookingsList
>;
export type BookingsGetResponse = z.infer<
	typeof CalEndpointOutputSchemas.bookingsGet
>;
export type BookingsCreateResponse = z.infer<
	typeof CalEndpointOutputSchemas.bookingsCreate
>;
export type BookingsCancelResponse = z.infer<
	typeof CalEndpointOutputSchemas.bookingsCancel
>;
export type BookingsRescheduleResponse = z.infer<
	typeof CalEndpointOutputSchemas.bookingsReschedule
>;
export type BookingsConfirmResponse = z.infer<
	typeof CalEndpointOutputSchemas.bookingsConfirm
>;
export type BookingsDeclineResponse = z.infer<
	typeof CalEndpointOutputSchemas.bookingsDecline
>;
