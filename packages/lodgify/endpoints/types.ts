import { z } from 'zod';

// ==========================================
// Property Schemas
// ==========================================

export const LodgifyPropertyRoomSchema = z
	.object({
		id: z.number(),
		name: z.string().optional(),
		max_people: z.number().optional(),
		bedrooms: z.number().optional(),
		bathrooms: z.number().optional(),
		property_id: z.number().optional(),
		type: z.string().optional().nullable(),
	})
	.passthrough(); // passthrough because Lodgify room records may include additional metadata

export const LodgifyPropertySchema = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string().optional().nullable(),
		latitude: z.number().optional().nullable(),
		longitude: z.number().optional().nullable(),
		address: z.string().optional().nullable(),
		city: z.string().optional().nullable(),
		country_code: z.string().optional().nullable(),
		currency_code: z.string().optional().nullable(),
		rooms: z.array(LodgifyPropertyRoomSchema).optional(),
	})
	.passthrough(); // passthrough because Lodgify property records may include additional settings

export const LodgifyPropertiesListInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		size: z.number().int().positive().optional(),
		includeCount: z.boolean().optional(),
	})
	.strict();

export const LodgifyPropertiesListOutputSchema = z
	.object({
		count: z.number().optional(),
		items: z.array(LodgifyPropertySchema),
	})
	.passthrough(); // passthrough because paged responses may include extra pagination metadata

export const LodgifyPropertiesGetInputSchema = z
	.object({
		id: z.number().int().positive(),
	})
	.strict();

export const LodgifyPropertiesGetOutputSchema = LodgifyPropertySchema;

export const LodgifyPropertiesGetRoomsInputSchema = z
	.object({
		id: z.number().int().positive(),
	})
	.strict();

export const LodgifyPropertiesGetRoomsOutputSchema = z.array(
	LodgifyPropertyRoomSchema,
);

// ==========================================
// Reservation Schemas
// ==========================================

export const LodgifyGuestSchema = z
	.object({
		first_name: z.string().optional().nullable(),
		last_name: z.string().optional().nullable(),
		email: z.string().optional().nullable(),
		phone: z.string().optional().nullable(),
	})
	.passthrough(); // passthrough because guest details may contain custom fields

export const LodgifyReservationSchema = z
	.object({
		id: z.number(),
		property_id: z.number().optional().nullable(),
		status: z.string().optional().nullable(),
		arrival: z.string().optional().nullable(),
		departure: z.string().optional().nullable(),
		total_amount: z.number().optional().nullable(),
		currency: z.string().optional().nullable(),
		guest: LodgifyGuestSchema.optional().nullable(),
		source: z.string().optional().nullable(),
	})
	.passthrough(); // passthrough because reservation records may include channel-specific fields

export const LodgifyReservationsListInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		size: z.number().int().positive().optional(),
		stayFilter: z.enum(['Upcoming', 'Current', 'Historic', 'All']).optional(),
		updatedSince: z.string().optional(),
		includeCount: z.boolean().optional(),
		includeExternal: z.boolean().optional(),
	})
	.strict();

export const LodgifyReservationsListOutputSchema = z
	.object({
		count: z.number().optional(),
		items: z.array(LodgifyReservationSchema),
	})
	.passthrough(); // passthrough because paged reservations may include additional summary metadata

export const LodgifyReservationsGetInputSchema = z
	.object({
		id: z.number().int().positive(),
	})
	.strict();

export const LodgifyReservationsGetOutputSchema = LodgifyReservationSchema;

export const LodgifyReservationsCreateInputSchema = z
	.object({
		property_id: z.number().int().positive(),
		arrival: z.string().min(1),
		departure: z.string().min(1),
		guest: LodgifyGuestSchema.optional(),
		roomTypes: z
			.array(
				z
					.object({
						id: z.number(),
						people: z.number().optional(),
					})
					.strict(),
			)
			.optional(),
		total_amount: z.number().optional(),
		source: z.string().optional(),
		status: z.string().optional(),
	})
	.strict();

export const LodgifyReservationsCreateOutputSchema = LodgifyReservationSchema;

// ==========================================
// Availability Schemas
// ==========================================

export const LodgifyAvailabilityPeriodSchema = z
	.object({
		start: z.string().optional().nullable(),
		end: z.string().optional().nullable(),
		is_available: z.boolean().optional(),
		period_type: z.string().optional().nullable(),
		room_type_id: z.number().optional().nullable(),
	})
	.passthrough(); // passthrough because availability blocks may include minimum stay or price notes

export const LodgifyAvailabilityGetInputSchema = z
	.object({
		propertyId: z.number().int().positive(),
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict();

export const LodgifyAvailabilityGetOutputSchema = z.array(
	LodgifyAvailabilityPeriodSchema,
);

// ==========================================
// Quotes Schemas
// ==========================================

export const LodgifyFeeSchema = z
	.object({
		name: z.string().optional(),
		amount: z.number().optional(),
		included_in_total: z.boolean().optional(),
	})
	.passthrough(); // passthrough because fees may include tax identifiers or notes

export const LodgifyQuotesCalculateInputSchema = z
	.object({
		property_id: z.number().int().positive(),
		arrival: z.string().min(1),
		departure: z.string().min(1),
		room_types: z
			.array(
				z
					.object({
						id: z.number(),
						people: z.number().optional(),
					})
					.strict(),
			)
			.optional(),
		guests: z.number().int().positive().optional(),
		add_ons: z.array(z.union([z.number(), z.string()])).optional(),
	})
	.strict();

export const LodgifyQuotesCalculateOutputSchema = z
	.object({
		property_id: z.number().optional(),
		arrival: z.string().optional(),
		departure: z.string().optional(),
		currency: z.string().optional(),
		subtotal: z.number().optional(),
		grand_total: z.number().optional(),
		balance_to_pay: z.number().optional(),
		tax_amount: z.number().optional(),
		optional_extras_total: z.number().optional(),
		is_available: z.boolean().optional(),
		min_stay: z.number().optional(),
		fees: z.array(LodgifyFeeSchema).optional(),
	})
	.passthrough(); // passthrough because quotes may include promotions or policy details

// ==========================================
// Messages Schemas
// ==========================================

export const LodgifyMessageSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		thread_id: z.string().optional().nullable(),
		booking_id: z.number().optional().nullable(),
		subject: z.string().optional().nullable(),
		message: z.string().optional().nullable(),
		sender: z.string().optional().nullable(),
		created_at: z.string().optional().nullable(),
	})
	.passthrough(); // passthrough because message items may include channel attributes

export const LodgifyMessagesListInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		size: z.number().int().positive().optional(),
		thread_id: z.string().optional(),
		booking_id: z.number().optional(),
	})
	.strict();

export const LodgifyMessagesListOutputSchema = z
	.object({
		count: z.number().optional(),
		items: z.array(LodgifyMessageSchema),
	})
	.passthrough(); // passthrough because message lists may include pagination metadata

export const LodgifyMessagesSendInputSchema = z
	.object({
		message: z.string().min(1),
		thread_id: z.string().optional(),
		booking_id: z.number().optional(),
		subject: z.string().optional(),
		recipient: z.string().optional(),
	})
	.strict();

export const LodgifyMessagesSendOutputSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		thread_id: z.string().optional(),
		status: z.string().optional(),
		sent: z.boolean().optional(),
	})
	.passthrough(); // passthrough because message sending responses may include provider receipts

// ==========================================
// Schema Collections & Type Exports
// ==========================================

export const LodgifyEndpointInputSchemas = {
	'properties.list': LodgifyPropertiesListInputSchema,
	'properties.get': LodgifyPropertiesGetInputSchema,
	'properties.getRooms': LodgifyPropertiesGetRoomsInputSchema,
	'reservations.list': LodgifyReservationsListInputSchema,
	'reservations.get': LodgifyReservationsGetInputSchema,
	'reservations.create': LodgifyReservationsCreateInputSchema,
	'availability.get': LodgifyAvailabilityGetInputSchema,
	'quotes.calculate': LodgifyQuotesCalculateInputSchema,
	'messages.list': LodgifyMessagesListInputSchema,
	'messages.send': LodgifyMessagesSendInputSchema,
} as const;

export const LodgifyEndpointOutputSchemas = {
	'properties.list': LodgifyPropertiesListOutputSchema,
	'properties.get': LodgifyPropertiesGetOutputSchema,
	'properties.getRooms': LodgifyPropertiesGetRoomsOutputSchema,
	'reservations.list': LodgifyReservationsListOutputSchema,
	'reservations.get': LodgifyReservationsGetOutputSchema,
	'reservations.create': LodgifyReservationsCreateOutputSchema,
	'availability.get': LodgifyAvailabilityGetOutputSchema,
	'quotes.calculate': LodgifyQuotesCalculateOutputSchema,
	'messages.list': LodgifyMessagesListOutputSchema,
	'messages.send': LodgifyMessagesSendOutputSchema,
} as const;

export type LodgifyEndpointInputs = {
	'properties.list': z.infer<typeof LodgifyPropertiesListInputSchema>;
	'properties.get': z.infer<typeof LodgifyPropertiesGetInputSchema>;
	'properties.getRooms': z.infer<typeof LodgifyPropertiesGetRoomsInputSchema>;
	'reservations.list': z.infer<typeof LodgifyReservationsListInputSchema>;
	'reservations.get': z.infer<typeof LodgifyReservationsGetInputSchema>;
	'reservations.create': z.infer<typeof LodgifyReservationsCreateInputSchema>;
	'availability.get': z.infer<typeof LodgifyAvailabilityGetInputSchema>;
	'quotes.calculate': z.infer<typeof LodgifyQuotesCalculateInputSchema>;
	'messages.list': z.infer<typeof LodgifyMessagesListInputSchema>;
	'messages.send': z.infer<typeof LodgifyMessagesSendInputSchema>;
};

export type LodgifyEndpointOutputs = {
	'properties.list': z.infer<typeof LodgifyPropertiesListOutputSchema>;
	'properties.get': z.infer<typeof LodgifyPropertiesGetOutputSchema>;
	'properties.getRooms': z.infer<typeof LodgifyPropertiesGetRoomsOutputSchema>;
	'reservations.list': z.infer<typeof LodgifyReservationsListOutputSchema>;
	'reservations.get': z.infer<typeof LodgifyReservationsGetOutputSchema>;
	'reservations.create': z.infer<typeof LodgifyReservationsCreateOutputSchema>;
	'availability.get': z.infer<typeof LodgifyAvailabilityGetOutputSchema>;
	'quotes.calculate': z.infer<typeof LodgifyQuotesCalculateOutputSchema>;
	'messages.list': z.infer<typeof LodgifyMessagesListOutputSchema>;
	'messages.send': z.infer<typeof LodgifyMessagesSendOutputSchema>;
};
