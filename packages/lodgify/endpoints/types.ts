import { z } from 'zod';

const LodgifyMoneySchema = z.object({}).strict();

// `unknown` because Lodgify's OpenAPI describes amenities only as an object and does not specify value schemas.
const LodgifyPropertyAmenitiesSchema = z.record(z.string(), z.unknown());

// ==========================================
// Property Schemas
// ==========================================

export const LodgifyPropertyRoomSchema = z
	.object({
		images: z
			.array(
				z
					.object({
						text: z.string().nullable().optional(),
						url: z.string().nullable().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		amenities: LodgifyPropertyAmenitiesSchema.nullable().optional(),
		description: z.string().nullable().optional(),
		breakfast_included: z.boolean().optional(),
		has_parking: z.boolean().optional(),
		adults_only: z.boolean().optional(),
		pets_allowed: z.boolean().nullable().optional(),
		show_additional_key_facts: z.boolean().optional(),
		id: z.number().int(),
		name: z.string().nullable().optional(),
		image_url: z.string().nullable().optional(),
		max_people: z.number().int().optional(),
		units: z.number().int().optional(),
		has_wifi: z.boolean().optional(),
		has_meal_plan: z.boolean().optional(),
		bedrooms: z.number().int().optional(),
		bathrooms: z.number().int().optional(),
		area_unit: z.string().nullable().optional(),
		area: z.number().optional(),
		min_price: z.number().optional(),
		original_min_price: z.number().optional(),
		max_price: z.number().optional(),
		original_max_price: z.number().optional(),
		price_unit_in_days: z.number().int().optional(),
	})
	.strict();

const LodgifyPropertyRoomSummarySchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullable().optional(),
	})
	.strict();

const LodgifyPropertyCalendarItemSchema = z
	.object({
		date: z.string().optional(),
		for: z.string().nullable().optional(),
	})
	.strict();

export const LodgifyPropertySchema = z
	.object({
		id: z.number(),
		name: z.string().nullable().optional(),
		internal_name: z.string().nullable().optional(),
		description: z.string().optional().nullable(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
		address: z.string().optional().nullable(),
		hide_address: z.boolean().optional(),
		zip: z.string().nullable().optional(),
		city: z.string().optional().nullable(),
		state: z.string().nullable().optional(),
		country_code: z.string().optional().nullable(),
		country: z.string().nullable().optional(),
		image_url: z.string().nullable().optional(),
		has_addons: z.boolean().optional(),
		has_agreement: z.boolean().optional(),
		agreement_text: z.string().nullable().optional(),
		agreement_url: z.string().nullable().optional(),
		contact: z
			.object({ spoken_languages: z.array(z.string()).nullable().optional() })
			.strict()
			.optional(),
		rating: z.number().optional(),
		price_unit_in_days: z.number().int().optional(),
		min_price: z.number().optional(),
		original_min_price: z.number().optional(),
		max_price: z.number().optional(),
		original_max_price: z.number().optional(),
		rooms: z.array(LodgifyPropertyRoomSummarySchema).nullable().optional(),
		in_out_max_date: z.string().optional(),
		in_out: z
			.object({
				is_restricted: z.boolean().optional(),
				check_in: z
					.array(LodgifyPropertyCalendarItemSchema)
					.nullable()
					.optional(),
				check_out: z
					.array(LodgifyPropertyCalendarItemSchema)
					.nullable()
					.optional(),
				not_available: z
					.array(LodgifyPropertyCalendarItemSchema)
					.nullable()
					.optional(),
			})
			.strict()
			.optional(),
		currency_code: z.string().optional().nullable(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		is_active: z.boolean().optional(),
		subscription_plans: z.array(z.string()).nullable().optional(),
	})
	.strict();

export const LodgifyPropertiesListInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		size: z.number().int().positive().max(50).optional(),
		wid: z.number().int().positive().optional(),
		updatedSince: z.string().datetime().optional(),
		includeCount: z.boolean().optional(),
		includeInOut: z.boolean().optional(),
	})
	.strict();

export const LodgifyPropertiesListOutputSchema = z
	.object({
		count: z.number().int().nullable().optional(),
		items: z.array(LodgifyPropertySchema).nullable().optional(),
	})
	.strict();

export const LodgifyPropertiesGetInputSchema = z
	.object({
		id: z.number().int().positive(),
		wid: z.number().int().positive().optional(),
		includeInOut: z.boolean().optional(),
	})
	.strict();

export const LodgifyPropertiesGetOutputSchema = LodgifyPropertySchema;

export const LodgifyPropertiesGetRoomsInputSchema = z
	.object({
		id: z.number().int().positive(),
		wid: z.number().int().positive().optional(),
	})
	.strict();

export const LodgifyPropertiesGetRoomsOutputSchema = z.array(
	LodgifyPropertyRoomSchema,
);

export const LodgifyPropertiesGetDeletedInputSchema = z
	.object({ deletedSince: z.string().datetime().optional() })
	.strict();
export const LodgifyPropertiesGetDeletedOutputSchema = z.array(
	z.number().int(),
);

export const LodgifyPropertiesGetAddonsInputSchema = z
	.object({
		id: z.number().int().positive(),
		start: z.string().datetime().optional(),
		end: z.string().datetime().optional(),
		rid: z.number().int().positive().optional(),
	})
	.strict();

const LodgifyPropertyCurrencySchema = z
	.object({
		id: z.number().int().optional(),
		code: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		euro_forex: z.number().optional(),
		symbol: z.string().nullable().optional(),
	})
	.strict();

export const LodgifyPropertyAddonSchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		charge_type: z.string().nullable().optional(),
		rate_type: z.string().nullable().optional(),
		max_quantity: z.number().int().nullable().optional(),
		frequency: z.string().nullable().optional(),
		percentage: z.number().nullable().optional(),
		amount: z.number().nullable().optional(),
		original_amount: z.number().nullable().optional(),
		image_url: z.string().nullable().optional(),
		currency: LodgifyPropertyCurrencySchema.optional(),
	})
	.strict();

export const LodgifyPropertiesGetAddonsOutputSchema = z.array(
	LodgifyPropertyAddonSchema,
);

export const LodgifyPropertiesGetPaymentsInputSchema = z
	.object({ id: z.number().int().positive() })
	.strict();

export const LodgifyPropertiesGetPaymentsOutputSchema = z.array(
	z
		.object({
			id: z.number().int().nullable().optional(),
			payment_address: z.string().nullable().optional(),
			payment_type: z.string().nullable().optional(),
		})
		.strict(),
);

// ==========================================
// Global reference and channel schemas (v1)
// ==========================================

export const LodgifyCountrySchema = z
	.object({
		code: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.strict();

export const LodgifyCountriesListInputSchema = z.object({}).strict();
export const LodgifyCountriesListOutputSchema = z.array(LodgifyCountrySchema);
export const LodgifyCountryGetInputSchema = z
	.object({ code: z.string().min(1) })
	.strict();
export const LodgifyCountryGetOutputSchema = LodgifyCountrySchema;

export const LodgifyCurrencySchema = z
	.object({
		id: z.number().int().optional(),
		code: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		euro_forex: z.number().optional(),
		symbol: z.string().nullable().optional(),
		decimal_places: z.number().int().optional(),
	})
	.strict();

export const LodgifyCurrenciesListInputSchema = z.object({}).strict();
export const LodgifyCurrenciesListOutputSchema = z.array(LodgifyCurrencySchema);
export const LodgifyCurrencyGetInputSchema = z
	.object({ code: z.string().min(1) })
	.strict();
export const LodgifyCurrencyGetOutputSchema = LodgifyCurrencySchema;

const LodgifyChannelRoomTypeSchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().nullable().optional(),
	})
	.strict();

const LodgifyChannelPropertySchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().nullable().optional(),
		last_updated: z.string().datetime().optional(),
		room_types: z
			.object({
				room_type: z.array(LodgifyChannelRoomTypeSchema).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

export const LodgifyChannelInventorySchema = z
	.object({
		name: z.string().nullable().optional(),
		properties: z
			.object({
				property: z.array(LodgifyChannelPropertySchema).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

export const LodgifyChannelInventoryInputSchema = z.object({}).strict();
export const LodgifyChannelInventoryOutputSchema =
	LodgifyChannelInventorySchema;

// ==========================================
// Legacy property schemas (v1)
// ==========================================

const LodgifyLegacyPropertySummarySchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().nullable().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
		rooms: z.array(LodgifyPropertyRoomSummarySchema).nullable().optional(),
		subscription_plans: z.array(z.string()).nullable().optional(),
	})
	.strict();

export const LodgifyPropertiesListV1InputSchema = z
	.object({ wid: z.number().int().optional() })
	.strict();
export const LodgifyPropertiesListV1OutputSchema = z.array(
	LodgifyLegacyPropertySummarySchema,
);

const LodgifyLegacyPropertyCurrencySchema = z
	.object({
		id: z.number().int().optional(),
		code: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		euro_forex: z.number().optional(),
		symbol: z.string().nullable().optional(),
	})
	.strict();

const LodgifyLegacyPropertyRoomSchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().nullable().optional(),
		image_url: z.string().nullable().optional(),
		max_people: z.number().int().optional(),
		units: z.number().int().optional(),
		has_wifi: z.boolean().optional(),
		has_meal_plan: z.boolean().optional(),
		bedrooms: z.number().int().optional(),
		bathrooms: z.number().int().optional(),
		area_unit: z.string().nullable().optional(),
		area: z.number().optional(),
		min_price: z.number().optional(),
		original_min_price: z.number().optional(),
		max_price: z.number().optional(),
		original_max_price: z.number().optional(),
		price_unit_in_days: z.number().int().optional(),
		currency: LodgifyLegacyPropertyCurrencySchema.optional(),
	})
	.strict();

const LodgifyLegacyPropertyCalendarItemSchema = z
	.object({
		date: z.string().datetime().optional(),
		for: z.string().nullable().optional(),
	})
	.strict();

const LodgifyLegacyPropertyInOutSchema = z
	.object({
		is_restricted: z.boolean().optional(),
		check_in: z
			.array(LodgifyLegacyPropertyCalendarItemSchema)
			.nullable()
			.optional(),
		check_out: z
			.array(LodgifyLegacyPropertyCalendarItemSchema)
			.nullable()
			.optional(),
		not_available: z
			.array(LodgifyLegacyPropertyCalendarItemSchema)
			.nullable()
			.optional(),
	})
	.strict();

export const LodgifyPropertyV1Schema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		image_url: z.string().nullable().optional(),
		has_addons: z.boolean().optional(),
		has_agreement: z.boolean().optional(),
		agreement_text: z.string().nullable().optional(),
		agreement_url: z.string().nullable().optional(),
		owner: z
			.object({ spoken_languages: z.array(z.string()).nullable().optional() })
			.strict()
			.optional(),
		rating: z.number().optional(),
		price_unit_in_days: z.number().int().optional(),
		min_price: z.number().optional(),
		original_min_price: z.number().optional(),
		max_price: z.number().optional(),
		original_max_price: z.number().optional(),
		rooms: z.array(LodgifyLegacyPropertyRoomSchema).nullable().optional(),
		in_out_max_date: z.string().datetime().optional(),
		in_out: LodgifyLegacyPropertyInOutSchema.optional(),
		currency: LodgifyLegacyPropertyCurrencySchema.optional(),
		subscription_plans: z.array(z.string()).nullable().optional(),
	})
	.strict();

export const LodgifyPropertiesGetV1InputSchema = z
	.object({
		id: z.number().int().positive(),
		maxDate: z.string().datetime().optional(),
		wid: z.number().int().optional(),
	})
	.strict();
export const LodgifyPropertiesGetV1OutputSchema = LodgifyPropertyV1Schema;

export const LodgifyPropertyRoomV1Schema = z
	.object({
		images: z
			.array(
				z
					.object({
						text: z.string().nullable().optional(),
						url: z.string().nullable().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		amenities: LodgifyPropertyAmenitiesSchema.nullable().optional(),
		description: z.string().nullable().optional(),
		breakfast_included: z.boolean().optional(),
		has_parking: z.boolean().optional(),
		adults_only: z.boolean().optional(),
		pets_allowed: z.boolean().nullable().optional(),
		show_additional_key_facts: z.boolean().optional(),
		id: z.number().int().optional(),
		name: z.string().nullable().optional(),
		image_url: z.string().nullable().optional(),
		max_people: z.number().int().optional(),
		units: z.number().int().optional(),
		has_wifi: z.boolean().optional(),
		has_meal_plan: z.boolean().optional(),
		bedrooms: z.number().int().optional(),
		bathrooms: z.number().int().optional(),
		area_unit: z.string().nullable().optional(),
		area: z.number().optional(),
		min_price: z.number().optional(),
		original_min_price: z.number().optional(),
		max_price: z.number().optional(),
		original_max_price: z.number().optional(),
		price_unit_in_days: z.number().int().optional(),
		currency: LodgifyLegacyPropertyCurrencySchema.optional(),
	})
	.strict();

export const LodgifyPropertiesGetRoomV1InputSchema = z
	.object({
		id: z.number().int().positive(),
		rid: z.number().int().positive(),
		wid: z.number().int().optional(),
	})
	.strict();
export const LodgifyPropertiesGetRoomV1OutputSchema =
	LodgifyPropertyRoomV1Schema;

// ==========================================
// Reservation Schemas
// ==========================================

export const LodgifyGuestSchema = z
	.object({
		name: z.string().nullable().optional(),
		email: z.string().optional().nullable(),
		phone: z.string().optional().nullable(),
		has_temporary_phone: z.boolean().optional(),
		country_code: z.string().nullable().optional(),
	})
	.strict();

const LodgifyV2GuestBreakdownSchema = z
	.object({
		adults: z.number().int().nonnegative().optional(),
		children: z.number().int().nonnegative().optional(),
		infants: z.number().int().nonnegative().optional(),
		pets: z.number().int().nonnegative().optional(),
	})
	.strict();

const LodgifyV2BookingRoomSchema = z
	.object({
		room_type_id: z.number().int().optional(),
		guest_breakdown: LodgifyV2GuestBreakdownSchema,
		people: z.number().int().optional(),
		key_code: z.string().nullable().optional(),
	})
	.strict();

const LodgifyV2CheckInOutSchema = z
	.object({
		time: z.string().nullable().optional(),
		initiator: z.string().nullable().optional(),
	})
	.strict();

const LodgifyV2QuoteStatusSchema = z.enum([
	'Null',
	'NotScheduled',
	'NotSent',
	'Agreed',
	'CancelledByOwner',
	'CancelledByGuest',
	'Rejected',
	'Deactivated',
	'ExpiredByGuest',
	'ExpiredByOwner',
	'PendingForOwner',
	'PendingForGuest',
	'PendingForPayment',
	'RedirectedToOffsitePayment',
	'ChangeRequested',
	'Changed',
	'Disconnected',
]);

const LodgifyV2ScheduledTransactionSchema = z
	.object({
		id: z.number().int().optional(),
		type: z
			.enum([
				'PrePayment',
				'InterimPayment',
				'BalancePayment',
				'PrecedingPayment',
				'Cancellation',
				'DamageDepositAuthorization',
				'DamageDepositVoid',
				'SecurityDepositCharge',
				'SecurityDepositRefund',
			])
			.optional(),
		status: z
			.enum([
				'Scheduled',
				'Overdue',
				'Pending',
				'Partial',
				'Completing',
				'Aborted',
				'Paid',
				'Refunded',
				'Authorized',
				'Voided',
			])
			.optional(),
		amount: LodgifyMoneySchema.optional(),
		due_at: z.string().nullable().optional(),
	})
	.strict();

const LodgifyV2QuotePriceItemSchema = z
	.object({
		type: z.string().nullable().optional(),
		amount: LodgifyMoneySchema.optional(),
		description: z.string().nullable().optional(),
	})
	.strict();

const LodgifyV2QuoteSchema = z
	.object({
		id: z.number().int().optional(),
		policy: z
			.object({
				name: z.string().nullable().optional(),
				payments: z.string().nullable().optional(),
				cancellation: z.string().nullable().optional(),
				damage_deposit: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
		status: LodgifyV2QuoteStatusSchema.optional(),
		scheduled_transactions: z
			.array(LodgifyV2ScheduledTransactionSchema)
			.nullable()
			.optional(),
		scheduled_damage_protection: z
			.array(LodgifyV2ScheduledTransactionSchema)
			.nullable()
			.optional(),
		room_type_items: z
			.array(
				z
					.object({
						room_type_id: z.number().int().optional(),
						subtotal: LodgifyMoneySchema.optional(),
						prices: z
							.array(LodgifyV2QuotePriceItemSchema)
							.nullable()
							.optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		addon_items: z.array(LodgifyV2QuotePriceItemSchema).nullable().optional(),
		other_items: z.array(LodgifyV2QuotePriceItemSchema).nullable().optional(),
		vat_items: z.array(LodgifyV2QuotePriceItemSchema).nullable().optional(),
		rental_contract_uid: z
			.object({
				hash: z.string().uuid().optional(),
				uid: z.string().uuid().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const LodgifyV2TransactionSchema = z
	.object({
		id: z.number().int().optional(),
		type: z
			.enum(['Payment', 'Refund', 'Authorization', 'Void', 'Capture'])
			.optional(),
		status: z
			.enum([
				'Requested',
				'Processing',
				'Done',
				'Failed',
				'Canceled',
				'Abandoned',
				'Unknown',
			])
			.optional(),
		payment_type: z
			.enum([
				'None',
				'PaypalWallet',
				'BankAccount',
				'StripeSpreedly',
				'Payyo',
				'AuthorizeNetSpreedly',
				'BraintreeSpreedly',
				'PayPalProSpreedly',
				'PciProxy',
				'SpreedlyTestSpreedly',
				'StripeSca',
				'LodgifyPaymentsStripe',
			])
			.optional(),
		description: z.string().nullable().optional(),
		amount: LodgifyMoneySchema.optional(),
		processed_at: z.string().datetime().nullable().optional(),
	})
	.strict();

export const LodgifyReservationSchema = z
	.object({
		id: z.number().int(),
		user_id: z.number().int().optional(),
		arrival: z.string().optional(),
		departure: z.string().optional(),
		property_id: z.number().int().optional(),
		rooms: z.array(LodgifyV2BookingRoomSchema).nullable().optional(),
		guest: LodgifyGuestSchema.optional(),
		language: z.string().nullable().optional(),
		status: z.enum(['Open', 'Tentative', 'Booked', 'Declined']).optional(),
		is_unavailable: z.boolean().optional(),
		is_overbooked: z.boolean().optional(),
		tentative_expires_at: z.string().datetime().nullable().optional(),
		source: z
			.enum([
				'Manual',
				'OH',
				'NineFlats',
				'Airbnb',
				'AirbnbIntegration',
				'HomeAway',
				'BookingCom',
				'Expedia',
				'ICal',
				'Email',
				'FacebookMessenger',
				'PublicApi',
				'Other',
			])
			.optional(),
		source_text: z.string().nullable().optional(),
		created_from_ip: z.string().nullable().optional(),
		created_at: z.string().datetime().optional(),
		updated_at: z.string().datetime().optional(),
		canceled_at: z.string().datetime().nullable().optional(),
		is_new: z.boolean().optional(),
		is_deleted: z.boolean().optional(),
		currency_code: z.string().nullable().optional(),
		total_amount: LodgifyMoneySchema.optional(),
		subtotals: z
			.object({
				stay: LodgifyMoneySchema.optional(),
				promotions: LodgifyMoneySchema.optional(),
				fees: LodgifyMoneySchema.optional(),
				taxes: LodgifyMoneySchema.optional(),
				addons: LodgifyMoneySchema.optional(),
				vat: LodgifyMoneySchema.optional(),
			})
			.strict()
			.optional(),
		amount_paid: LodgifyMoneySchema.optional(),
		amount_due: LodgifyMoneySchema.optional(),
		quote: LodgifyV2QuoteSchema.optional(),
		transactions: z.array(LodgifyV2TransactionSchema).nullable().optional(),
		damage_protection: z
			.array(LodgifyV2TransactionSchema)
			.nullable()
			.optional(),
		notes: z.string().nullable().optional(),
		thread_uid: z.string().uuid().optional(),
		external_booking: z.string().nullable().optional(),
		check_in: LodgifyV2CheckInOutSchema.optional(),
		check_out: LodgifyV2CheckInOutSchema.optional(),
		upgraded_enquiry_id: z.number().int().nullable().optional(),
	})
	.strict();

export const LodgifyReservationsListInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		size: z.number().int().positive().optional(),
		stayFilter: z
			.enum([
				'Upcoming',
				'Current',
				'Historic',
				'All',
				'ArrivalDate',
				'DepartureDate',
			])
			.optional(),
		updatedSince: z.string().optional(),
		includeCount: z.boolean().optional(),
		includeTransactions: z.boolean().optional(),
		includeExternal: z.boolean().optional(),
		includeQuoteDetails: z.boolean().optional(),
		trash: z.enum(['False', 'True', 'All']).optional(),
		stayFilterDate: z.string().datetime().optional(),
	})
	.strict();

export const LodgifyReservationsListOutputSchema = z
	.object({
		count: z.number().nullable().optional(),
		items: z.array(LodgifyReservationSchema).nullable().optional(),
	})
	.strict();

export const LodgifyReservationsGetInputSchema = z
	.object({
		id: z.number().int().positive(),
	})
	.strict();

export const LodgifyReservationsGetOutputSchema = LodgifyReservationSchema;

export const LodgifyGuestNameSchema = z
	.object({
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		full_name: z.string().nullable().optional(),
	})
	.strict();

const LodgifyCreateGuestNameSchema = z
	.object({
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
	})
	.strict();

const LodgifyGuestBreakdownSchema = LodgifyV2GuestBreakdownSchema;

const LodgifyCreateBookingRoomSchema = z
	.object({
		room_type_id: z.number().int().positive(),
		guest_breakdown: LodgifyGuestBreakdownSchema,
		people: z.number().int().nonnegative().optional(),
		key_code: z.string().nullable().optional(),
	})
	.strict();

const LodgifyBookingRoomViewSchema = z
	.object({
		room_type_id: z.number().int().optional(),
		guest_breakdown: LodgifyGuestBreakdownSchema.optional(),
		people: z.number().int().optional(),
		key_code: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.strict();

export const LodgifyCreateGuestSchema = z
	.object({
		guest_name: LodgifyCreateGuestNameSchema,
		name: z.string().nullable().optional(),
		external_id: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		has_temporary_phone_numbers: z.boolean().optional(),
		suggested_door_code: z.string().nullable().optional(),
		locale: z.string().nullable().optional(),
		street_address1: z.string().nullable().optional(),
		street_address2: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		postal_code: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
	})
	.strict();

export const LodgifyReservationsInboxListInputSchema = z
	.object({
		offset: z.number().int().nonnegative().optional(),
		limit: z.number().int().positive().max(50).optional(),
		status: z.string().optional(),
		trash: z.boolean().optional(),
		propertyId: z.number().int().positive().optional(),
		periodStart: z.string().datetime().optional(),
		periodEnd: z.string().datetime().optional(),
		modifiedSince: z.string().datetime().optional(),
	})
	.strict();

export const LodgifyGuestViewSchema = z
	.object({
		guest_name: LodgifyGuestNameSchema.optional(),
		name: z.string().nullable().optional(),
		external_id: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		has_temporary_phone_numbers: z.boolean().optional(),
		suggested_door_code: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		locale: z.string().nullable().optional(),
		street_address1: z.string().nullable().optional(),
		street_address2: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		postal_code: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		country_name: z.string().nullable().optional(),
	})
	.strict();

export const LodgifyInboxItemSchema = z
	.object({
		id: z.number().int(),
		type: z.string().nullable().optional(),
		booking_type: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		source: z.string().nullable().optional(),
		source_text: z.string().nullable().optional(),
		guest: LodgifyGuestViewSchema.optional().nullable(),
		arrival: z.string().nullable().optional(),
		departure: z.string().nullable().optional(),
		people: z.number().int().nullable().optional(),
		total_guest_breakdown: LodgifyGuestBreakdownSchema.optional().nullable(),
		property_id: z.number().int().nullable().optional(),
		property_name: z.string().nullable().optional(),
		rooms: z.array(LodgifyBookingRoomViewSchema).nullable().optional(),
		created_at: z.string().optional(),
		is_replied: z.boolean().optional(),
		updated_at: z.string().optional(),
		is_deleted: z.boolean().optional(),
		date_deleted: z.string().nullable().optional(),
		total_amount: z.number().nullable().optional(),
		total_paid: z.number().optional(),
		amount_to_pay: z.number().nullable().optional(),
		thread_uid: z.string().uuid().optional(),
		upgraded_enquiry_id: z.number().int().nullable().optional(),
	})
	.passthrough(); // BookingViewModel may include documented currency and summary metadata.

export const LodgifyReservationsInboxListOutputSchema = z
	.object({
		items: z.array(LodgifyInboxItemSchema).nullable().optional(),
		total: z.number().int(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
	})
	.strict();

export const LodgifyReservationsGetEnquiryInputSchema = z
	.object({ id: z.number().int().positive() })
	.strict();

export const LodgifyReservationsUnreadCountInputSchema = z.object({}).strict();
export const LodgifyReservationsUnreadCountOutputSchema = z
	.number()
	.int()
	.nonnegative();

export const LodgifyReservationsCreateInputSchema = z
	.object({
		property_id: z.number().int().positive(),
		arrival: z.string().datetime(),
		departure: z.string().datetime(),
		rooms: z.array(LodgifyCreateBookingRoomSchema).min(1),
		guest: LodgifyCreateGuestSchema.optional(),
		status: z.enum(['Open', 'Booked', 'Declined', 'Tentative']).optional(),
		source_text: z.string().nullable().optional(),
		payment_type: z.string().nullable().optional(),
		payment_address: z.string().nullable().optional(),
		payment_website_id: z.number().int().nullable().optional(),
		bookability: z
			.enum(['InstantBooking', 'BookingRequest', 'EnquiryOnly'])
			.optional(),
		total: z.number().nullable().optional(),
		currency_code: z.string().nullable().optional(),
		origin: z.string().nullable().optional(),
		thread_id: z.string().uuid().nullable().optional(),
		from: z.number().int().positive().optional(),
	})
	.strict();

export const LodgifyReservationsCreateOutputSchema = z
	.number()
	.int()
	.positive();

export const LodgifyReservationsCreateEnquiryInputSchema = z
	.object({
		arrival: z.string().datetime().nullable().optional(),
		departure: z.string().datetime().nullable().optional(),
		guest_breakdown: LodgifyGuestBreakdownSchema,
		people: z.number().int().nonnegative().nullable().optional(),
		property_id: z.number().int().positive().nullable().optional(),
		room_type_id: z.number().int().positive().nullable().optional(),
		guest: LodgifyCreateGuestSchema.optional(),
		messages: z
			.array(
				z
					.object({
						subject: z.string().nullable().optional(),
						message: z.string().nullable().optional(),
						type: z.enum(['Owner', 'Comment', 'Renter']).optional(),
						send_notification: z.boolean().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		status: z.string().nullable().optional(),
		has_privacy_consent: z.boolean().nullable().optional(),
		origin: z.string().nullable().optional(),
		thread_id: z.string().uuid().nullable().optional(),
	})
	.strict();

export const LodgifyReservationsCreateEnquiryOutputSchema = z
	.number()
	.int()
	.positive();

export const LodgifyReservationsGetBookingV1InputSchema = z
	.object({ id: z.number().int().positive() })
	.strict();

const LodgifyReservationCurrencyViewSchema = z
	.object({
		id: z.number().int().optional(),
		code: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		euro_forex: z.number().optional(),
		symbol: z.string().nullable().optional(),
	})
	.strict();

const LodgifyReservationCheckInOutSchema = z
	.object({
		time: z.string().nullable().optional(),
		initiator: z.string().nullable().optional(),
	})
	.strict();

const LodgifyLegacyBookingRoomSchema = z
	.object({
		room_type_id: z.number().int().optional(),
		guest_breakdown: LodgifyGuestBreakdownSchema.optional(),
		people: z.number().int().optional(),
		key_code: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.strict();

const LodgifyLegacyReservationDetailsFields = {
	id: z.number().int(),
	type: z.string().nullable().optional(),
	booking_type: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	source: z.string().nullable().optional(),
	source_text: z.string().nullable().optional(),
	guest: LodgifyGuestViewSchema.nullable().optional(),
	arrival: z.string().nullable().optional(),
	departure: z.string().nullable().optional(),
	people: z.number().int().nullable().optional(),
	total_guest_breakdown: LodgifyGuestBreakdownSchema.nullable().optional(),
	property_id: z.number().int().nullable().optional(),
	property_name: z.string().nullable().optional(),
	rooms: z.array(LodgifyLegacyBookingRoomSchema).nullable().optional(),
	created_at: z.string().datetime().optional(),
	is_replied: z.boolean().optional(),
	updated_at: z.string().datetime().optional(),
	is_deleted: z.boolean().optional(),
	date_deleted: z.string().datetime().nullable().optional(),
	total_amount: z.number().nullable().optional(),
	total_paid: z.number().optional(),
	amount_to_pay: z.number().nullable().optional(),
	thread_uid: z.string().uuid().optional(),
	currency: LodgifyReservationCurrencyViewSchema.optional(),
	upgraded_enquiry_id: z.number().int().nullable().optional(),
	upgraded_booking_id: z.number().int().nullable().optional(),
	note: z.string().nullable().optional(),
	payment_type: z.string().nullable().optional(),
	payment_address: z.string().nullable().optional(),
	payment_website_id: z.number().int().nullable().optional(),
	check_in: LodgifyReservationCheckInOutSchema.optional(),
	check_out: LodgifyReservationCheckInOutSchema.optional(),
};

export const LodgifyReservationBookingV1Schema = z
	.object(LodgifyLegacyReservationDetailsFields)
	.omit({ upgraded_booking_id: true })
	.strict();
export const LodgifyReservationsGetBookingV1OutputSchema =
	LodgifyReservationBookingV1Schema;

export const LodgifyReservationEnquiryV1Schema = z
	.object(LodgifyLegacyReservationDetailsFields)
	.strict();
export const LodgifyReservationsGetEnquiryV1OutputSchema =
	LodgifyReservationEnquiryV1Schema;
export const LodgifyReservationsGetEnquiryOutputSchema =
	LodgifyReservationEnquiryV1Schema;

const LodgifyReservationGuestUpdateSchema = z
	.object({
		id: z.string().nullable().optional(),
		country_name: z.string().nullable().optional(),
		guest_name: LodgifyCreateGuestNameSchema,
		name: z.string().nullable().optional(),
		external_id: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		has_temporary_phone_numbers: z.boolean().optional(),
		suggested_door_code: z.string().nullable().optional(),
		locale: z.string().nullable().optional(),
		street_address1: z.string().nullable().optional(),
		street_address2: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		postal_code: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
	})
	.strict();

const LodgifyReservationBookingUpdateSchema = z
	.object({
		id: z.number().int().optional(),
		type: z.string().nullable().optional(),
		booking_type: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		source: z.string().nullable().optional(),
		source_text: z.string().nullable().optional(),
		guest: LodgifyReservationGuestUpdateSchema.optional(),
		arrival: z.string().nullable().optional(),
		departure: z.string().nullable().optional(),
		people: z.number().int().nullable().optional(),
		property_id: z.number().int().nullable().optional(),
		property_name: z.string().nullable().optional(),
		rooms: z.array(LodgifyCreateBookingRoomSchema).nullable().optional(),
		created_at: z.string().datetime().optional(),
		is_replied: z.boolean().optional(),
		updated_at: z.string().datetime().optional(),
		is_deleted: z.boolean().optional(),
		date_deleted: z.string().datetime().nullable().optional(),
		total_amount: z.number().nullable().optional(),
		total_paid: z.number().optional(),
		amount_to_pay: z.number().nullable().optional(),
		thread_uid: z.string().uuid().optional(),
		currency: LodgifyReservationCurrencyViewSchema.optional(),
		note: z.string().nullable().optional(),
		messages: z
			.array(
				z
					.object({
						subject: z.string().nullable().optional(),
						message: z.string().nullable().optional(),
						type: z.enum(['Owner', 'Comment', 'Renter']).optional(),
						send_notification: z.boolean().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		payment_type: z.string().nullable().optional(),
		payment_address: z.string().nullable().optional(),
		payment_website_id: z.number().int().nullable().optional(),
	})
	.strict();

export const LodgifyReservationsUpdateBookingInputSchema = z
	.object({
		id: z.number().int().positive(),
		booking: LodgifyReservationBookingUpdateSchema,
	})
	.strict();
export const LodgifyReservationsUpdateBookingOutputSchema = z.undefined();

export const LodgifyReservationsCreateCallMeBackInputSchema = z
	.object({
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.optional(),
		time_zone_info_id: z.string().nullable().optional(),
		time: z.number().int().min(0).max(23).optional(),
		duration: z.number().optional(),
		notes: z.string().nullable().optional(),
		source_text: z.string().nullable().optional(),
		source_address: z.string().nullable().optional(),
		arrival: z.string().datetime().nullable().optional(),
		departure: z.string().datetime().nullable().optional(),
		guest_breakdown: LodgifyGuestBreakdownSchema,
		people: z.number().int().nullable().optional(),
		property_id: z.number().int().nullable().optional(),
		room_type_id: z.number().int().nullable().optional(),
		guest: LodgifyCreateGuestSchema.optional(),
		messages: z
			.array(
				z
					.object({
						subject: z.string().nullable().optional(),
						message: z.string().nullable().optional(),
						type: z.enum(['Owner', 'Comment', 'Renter']).optional(),
						send_notification: z.boolean().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		status: z.string().nullable().optional(),
		has_privacy_consent: z.boolean().nullable().optional(),
		ip_created: z.string().nullable().optional(),
		origin: z.string().nullable().optional(),
		thread_id: z.string().uuid().nullable().optional(),
	})
	.strict();
export const LodgifyReservationsCreateCallMeBackOutputSchema = z
	.number()
	.int()
	.positive();

export const LodgifyReservationActionInputSchema = z
	.object({ id: z.number().int().positive() })
	.strict();
export const LodgifyReservationActionOutputSchema = z.undefined();

const LodgifyBookingQuotePriceItemSchema = z
	.object({
		type: z.string().nullable().optional(),
		amount: LodgifyMoneySchema.optional(),
		amount_details: z
			.object({
				net_amount: LodgifyMoneySchema.optional(),
				gross_amount: LodgifyMoneySchema.optional(),
			})
			.strict()
			.optional(),
		description: z.string().nullable().optional(),
	})
	.strict();

const LodgifyBookingQuoteRoomTypeItemSchema = z
	.object({
		room_type_id: z.number().int().optional(),
		subtotal: LodgifyMoneySchema.optional(),
		subtotal_details: z
			.object({
				net_amount: LodgifyMoneySchema.optional(),
				gross_amount: LodgifyMoneySchema.optional(),
			})
			.strict()
			.optional(),
		prices: z.array(LodgifyBookingQuotePriceItemSchema).nullable().optional(),
	})
	.strict();

export const LodgifyLegacyBookingQuoteSchema = z
	.object({
		id: z.number().int().optional(),
		arrival: z.string().nullable().optional(),
		departure: z.string().nullable().optional(),
		property_id: z.number().int().optional(),
		status: z.string().nullable().optional(),
		currency: LodgifyReservationCurrencyViewSchema.optional(),
		amount_gross: LodgifyMoneySchema.optional(),
		amount_net: LodgifyMoneySchema.optional(),
		date_cancelled: z.string().datetime().nullable().optional(),
		amount_cancelled: LodgifyMoneySchema.optional(),
		date_agreed: z.string().datetime().nullable().optional(),
		is_policy_active: z.boolean().optional(),
		rate_policy_name: z.string().nullable().optional(),
		expiration_hours: z.number().int().nullable().optional(),
		guest_expiration_hours: z.number().int().nullable().optional(),
		owner_expiration_hours: z.number().int().nullable().optional(),
		expiration_date: z.string().datetime().nullable().optional(),
		rental_agreement: z.string().nullable().optional(),
		rental_agreement_accepted: z.boolean().optional(),
		room_type_items: z
			.array(LodgifyBookingQuoteRoomTypeItemSchema)
			.nullable()
			.optional(),
		add_on_items: z
			.array(LodgifyBookingQuotePriceItemSchema)
			.nullable()
			.optional(),
		other_items: z
			.array(LodgifyBookingQuotePriceItemSchema)
			.nullable()
			.optional(),
	})
	.strict();
export const LodgifyReservationsGetQuoteInputSchema =
	LodgifyReservationActionInputSchema;
export const LodgifyReservationsGetQuoteOutputSchema =
	LodgifyLegacyBookingQuoteSchema;

export const LodgifyReservationsSetBookingStatusInputSchema = z
	.object({
		id: z.number().int().positive(),
		requestPayment: z.boolean().optional(),
	})
	.strict();
export const LodgifyReservationsSetBookingStatusOutputSchema = z.undefined();

const LodgifyBatchReservationSchema = z
	.object({
		id: z.number().int().positive(),
		type: z.enum(['Booking', 'Enquiry']),
	})
	.strict();

export const LodgifyReservationsBatchInputSchema = z.array(
	LodgifyBatchReservationSchema,
);
export const LodgifyReservationsBatchOutputSchema = z.undefined();

export const LodgifyReservationsCheckInOutInputSchema = z
	.object({ id: z.number().int().positive(), time: z.string().min(1) })
	.strict();
export const LodgifyReservationsCheckInOutOutputSchema = z.undefined();

export const LodgifyReservationsGetPaymentLinkInputSchema =
	LodgifyReservationActionInputSchema;
export const LodgifyPaymentLinkSchema = z
	.object({ url: z.string().nullable().optional() })
	.strict();
export const LodgifyReservationsGetPaymentLinkOutputSchema =
	LodgifyPaymentLinkSchema;

export const LodgifyExternalBookingSchema = z
	.object({
		created_at: z.string().datetime().optional(),
		content: z.string().nullable().optional(),
	})
	.strict();
export const LodgifyReservationsGetExternalBookingsInputSchema =
	LodgifyReservationActionInputSchema;
export const LodgifyReservationsGetExternalBookingsOutputSchema = z
	.object({
		external_bookings: z
			.array(LodgifyExternalBookingSchema)
			.nullable()
			.optional(),
	})
	.strict();

const LodgifyBookingRoomKeyCodeSchema = z
	.object({
		room_type_id: z.number().int().optional(),
		key_code: z.string().nullable().optional(),
	})
	.strict();
export const LodgifyReservationsUpdateKeyCodesInputSchema = z
	.object({
		id: z.number().int().positive(),
		rooms: z.array(LodgifyBookingRoomKeyCodeSchema).nullable().optional(),
	})
	.strict();
export const LodgifyReservationsUpdateKeyCodesOutputSchema = z
	.object({
		rooms: z.array(LodgifyBookingRoomKeyCodeSchema).nullable().optional(),
	})
	.strict();

export const LodgifyReservationsCreateQuoteInputSchema = z
	.object({
		id: z.number().int().positive(),
		is_policy_active: z.boolean().optional(),
		promotion_code: z.string().nullable().optional(),
		add_ons: z
			.array(
				z
					.object({
						add_on_id: z.number().int(),
						units: z.number().int().nullable().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		room_types: z
			.array(z.object({ room_type_id: z.number().int() }).strict())
			.nullable()
			.optional(),
	})
	.strict();
export const LodgifyReservationsCreateQuoteOutputSchema = z.number().int();

const LodgifyLegacyBookingQuoteRoomPriceSchema = z
	.object({
		type: z.string().nullable().optional(),
		days: z.number().int().optional(),
		value: z.number().optional(),
		is_best: z.boolean().optional(),
		inner_price: z.string().nullable().optional(),
	})
	.strict();
const LodgifyLegacyBookingQuoteRoomDetailsSchema = z
	.object({
		from: z.string().datetime().optional(),
		to: z.string().datetime().optional(),
		prices: z
			.array(LodgifyLegacyBookingQuoteRoomPriceSchema)
			.nullable()
			.optional(),
	})
	.strict();
export const LodgifyLegacyQuoteInputSchema = z
	.object({
		propertyId: z.number().int().positive(),
		arrival: z.string().datetime(),
		departure: z.string().datetime(),
		roomTypes: z
			.array(
				z
					.object({
						id: z.number().int().positive(),
						guest_breakdown: LodgifyGuestBreakdownSchema,
						people: z.number().int().nonnegative().optional(),
					})
					.strict(),
			)
			.min(1),
		addOns: z
			.array(
				z
					.object({
						id: z.number().int().positive(),
						units: z.number().int().nullable().optional(),
					})
					.strict(),
			)
			.optional(),
		promotionCode: z.string().optional(),
	})
	.strict();
const LodgifyLegacyQuoteFeeSchema = z
	.object({
		type: z.enum(['Cleaning', 'Miscellaneous']).optional(),
		name: z.string().nullable().optional(),
		value: z.number().optional(),
	})
	.strict();
const LodgifyApiErrorCodeSchema = z.enum([
	'Unknown',
	'NoRateDefined',
	'MinStayRequired',
	'BookingStatusUnknown',
	'BookingMessageTypeNotAllowed',
	'BookingNoRooms',
	'BookingCannotChangeStatus',
	'EnquiryAlreadyUpgraded',
	'BookingPaymentNotValid',
	'ArrivalNotValid',
	'DepartureNotValid',
	'PropertyNotAvailable',
	'MaxStayExceeded',
	'CaptchaInvalid',
	'StripeError',
	'ValidationError',
	'PaymentError',
	'BookingReadOnly',
	'ArgumentError',
	'NotFound',
	'NotImplemented',
	'NotAuthorized',
]);
const LodgifyLegacyQuoteWarningSchema = z
	.object({
		type: LodgifyApiErrorCodeSchema.optional(),
		message: z.string().nullable().optional(),
	})
	.strict();
const LodgifyLegacyQuoteRoomSchema = z
	.object({
		id: z.number().int().optional(),
		value: z.number().optional(),
		details: z
			.array(LodgifyLegacyBookingQuoteRoomDetailsSchema)
			.nullable()
			.optional(),
		short_stay_premium: z.number().optional(),
		discount: z
			.object({
				description: z.string().nullable().optional(),
				value: z.number().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const LodgifyLegacyQuoteOutputSchema = z.array(
	z
		.object({
			rate_type: z
				.object({ name: z.string().nullable().optional() })
				.strict()
				.optional(),
			currency: z.string().nullable().optional(),
			rent: z.number().optional(),
			discount: z.number().optional(),
			fees: z.array(LodgifyLegacyQuoteFeeSchema).nullable().optional(),
			add_ons: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							name: z.string().nullable().optional(),
							value: z.number().optional(),
							details: z.string().nullable().optional(),
						})
						.strict(),
				)
				.nullable()
				.optional(),
			room_type_quotes: z
				.array(LodgifyLegacyQuoteRoomSchema)
				.nullable()
				.optional(),
			taxes: z.number().optional(),
			security_deposit: z.number().optional(),
			reservation_deposit: z.number().optional(),
			total: z.number().optional(),
			warnings: z.array(LodgifyLegacyQuoteWarningSchema).nullable().optional(),
		})
		.strict(),
);

// ==========================================
// Availability Schemas
// ==========================================

export const LodgifyAvailabilityPeriodSchema = z
	.object({
		start: z.string().optional(),
		end: z.string().optional(),
		available: z.number().int().optional(),
		bookings: z
			.array(
				z
					.object({
						id: z.number().int(),
						status: z.string().nullable().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		channel_calendars: z
			.array(z.object({ id: z.number().int() }).strict())
			.nullable()
			.optional(),
		closed_period: z.object({ id: z.number().int() }).strict().optional(),
	})
	.strict();

export const LodgifyAvailabilityCalendarSchema = z
	.object({
		user_id: z.number().int().optional(),
		property_id: z.number().int().optional(),
		room_type_id: z.number().int().optional(),
		periods: z.array(LodgifyAvailabilityPeriodSchema).nullable().optional(),
	})
	.strict();

export const LodgifyAvailabilityGetInputSchema = z
	.object({
		propertyId: z.number().int().positive(),
		from: z.string().datetime(),
		to: z.string().datetime(),
		includeDetails: z.boolean().optional(),
	})
	.strict();

export const LodgifyAvailabilityGetAllInputSchema = z
	.object({
		from: z.string().datetime(),
		to: z.string().datetime(),
		includeDetails: z.boolean().optional(),
	})
	.strict();

export const LodgifyAvailabilityGetRoomTypeInputSchema = z
	.object({
		propertyId: z.number().int().positive(),
		roomTypeId: z.number().int().positive(),
		from: z.string().datetime(),
		to: z.string().datetime(),
		includeDetails: z.boolean().optional(),
	})
	.strict();

export const LodgifyAvailabilitySetInputSchema = z
	.object({
		propertyId: z.number().int().positive(),
		roomTypeId: z.number().int().positive(),
		period_start: z.string().datetime(),
		period_end: z.string().datetime(),
		available: z.number().int().nonnegative(),
	})
	.strict();

export const LodgifyAvailabilityGetOutputSchema = z.array(
	LodgifyAvailabilityCalendarSchema,
);
export const LodgifyAvailabilityGetAllOutputSchema =
	LodgifyAvailabilityGetOutputSchema;
export const LodgifyAvailabilityGetRoomTypeOutputSchema =
	LodgifyAvailabilityGetOutputSchema;
export const LodgifyAvailabilitySetOutputSchema = z.undefined();

const LodgifyLegacyAvailabilityPeriodSchema = z
	.object({
		property_id: z.number().int().optional(),
		room_type_id: z.number().int().optional(),
		period_start: z.string().datetime().optional(),
		period_end: z.string().datetime().optional(),
		available: z.number().int().optional(),
		total_units: z.number().int().optional(),
		total_overbooked: z.number().int().optional(),
		is_available: z.boolean().optional(),
		booking_ids: z.array(z.number().int()).nullable().optional(),
		closed_period_id: z.number().int().nullable().optional(),
	})
	.strict();

const LodgifyLegacyAvailabilityRangeInputSchema = z
	.object({
		periodStart: z.string().datetime(),
		periodEnd: z.string().datetime(),
		combineRoomTypes: z.boolean().optional(),
		bookingsOnly: z.boolean().optional(),
		includeBookingIds: z.boolean().optional(),
		modifiedSince: z.string().datetime().optional(),
	})
	.strict();

export const LodgifyAvailabilityGetLegacyAllInputSchema =
	LodgifyLegacyAvailabilityRangeInputSchema;
export const LodgifyAvailabilityGetLegacyPropertyInputSchema =
	LodgifyLegacyAvailabilityRangeInputSchema.extend({
		propertyId: z.number().int().positive(),
	}).strict();
export const LodgifyAvailabilityGetLegacyRoomTypeInputSchema =
	LodgifyLegacyAvailabilityRangeInputSchema.extend({
		propertyId: z.number().int().positive(),
		roomTypeId: z.number().int().positive(),
	}).strict();
export const LodgifyAvailabilityLegacyOutputSchema = z.array(
	LodgifyLegacyAvailabilityPeriodSchema,
);

// ==========================================
// Rate Schemas
// ==========================================

// Lodgify's OpenAPI Money component is explicitly an empty, closed object.
export const LodgifyRatePriceSchema = LodgifyMoneySchema;

const LodgifyRateFeePriceSchema = z
	.object({
		is_vat_exclusive: z.boolean().optional(),
		vat_percentage: z.number().optional(),
		rate_type: z.string().nullable().optional(),
		amount: LodgifyRatePriceSchema.optional(),
		percentage: z.number().nullable().optional(),
	})
	.strict();

const LodgifyRatePriceDetailsSchema = z
	.object({
		rate_type: z.string().nullable().optional(),
		amount: LodgifyRatePriceSchema.optional(),
		percentage: z.number().nullable().optional(),
	})
	.strict();

const LodgifyRateFeeSchema = z
	.object({
		fee_name: z.string().nullable().optional(),
		fee_type: z.string().nullable().optional(),
		applied_for_nights: z.number().int().nullable().optional(),
		charge_type: z.string().nullable().optional(),
		frequency: z.string().nullable().optional(),
		price: LodgifyRateFeePriceSchema.optional(),
	})
	.strict();

const LodgifyRateTaxSchema = z
	.object({
		tax_name: z.string().nullable().optional(),
		tax_type: z.string().nullable().optional(),
		charge_type: z.string().nullable().optional(),
		frequency: z.string().nullable().optional(),
		price: LodgifyRatePriceDetailsSchema.optional(),
	})
	.strict();

const LodgifyRateDateRangeSchema = z
	.object({ lower: z.string().optional(), upper: z.string().optional() })
	.strict();

const LodgifyRatePromotionCodeSchema = z
	.object({
		code: z.string().nullable().optional(),
		is_active: z.boolean().optional(),
	})
	.strict();

const LodgifyRatePromotionSchema = z
	.object({
		name: z.string().nullable().optional(),
		price: LodgifyRatePriceDetailsSchema.optional(),
		early_booker_days: z.number().int().nullable().optional(),
		last_minute_days: z.number().int().nullable().optional(),
		minimum_stay_days: z.number().int().nullable().optional(),
		booking_dates: z.array(LodgifyRateDateRangeSchema).nullable().optional(),
		stay_dates: z.array(LodgifyRateDateRangeSchema).nullable().optional(),
		codes: z.array(LodgifyRatePromotionCodeSchema).nullable().optional(),
	})
	.strict();

export const LodgifyRateCalendarItemSchema = z
	.object({
		date: z.string().nullable().optional(),
		is_default: z.boolean().optional(),
		prices: z
			.array(
				z
					.object({
						min_stay: z.number().int().optional(),
						max_stay: z.number().int().optional(),
						price_per_day: LodgifyRatePriceSchema.optional(),
						price_per_additional_guest: LodgifyRatePriceSchema.optional(),
						additional_guests_starts_from: z.number().int().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
	})
	.strict();

export const LodgifyRateSettingsSchema = z
	.object({
		bookability: z.number().int().optional(),
		check_in_hour: z.number().int().nullable().optional(),
		check_out_hour: z.number().int().nullable().optional(),
		booking_window_days: z.number().int().optional(),
		advance_notice_days: z.number().int().optional(),
		advance_notice_hours: z.number().int().nullable().optional(),
		preparation_time_days: z.number().int().optional(),
		currency_code: z.string().nullable().optional(),
		vat: z.number().optional(),
		is_vat_exclusive: z.boolean().optional(),
		fees: z.array(LodgifyRateFeeSchema).nullable().optional(),
		taxes: z.array(LodgifyRateTaxSchema).nullable().optional(),
		promotions: z.array(LodgifyRatePromotionSchema).nullable().optional(),
	})
	.strict();

export const LodgifyRatesCalendarInputSchema = z
	.object({
		houseId: z.number().int().positive(),
		roomTypeId: z.number().int().positive(),
		startDate: z.string().min(1),
		endDate: z.string().min(1),
	})
	.strict();

export const LodgifyRatesCalendarOutputSchema = z
	.object({
		calendar_items: z
			.array(LodgifyRateCalendarItemSchema)
			.nullable()
			.optional(),
		rate_settings: LodgifyRateSettingsSchema.optional(),
	})
	.strict();

export const LodgifyRateSimpleCalendarItemSchema = z
	.object({
		date: z.string().nullable().optional(),
		is_default: z.boolean().optional(),
		prices: z
			.array(
				z
					.object({
						min_stay: z.number().int().optional(),
						max_stay: z.number().int().optional(),
						price_per_day: LodgifyRatePriceSchema.optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
	})
	.strict();

export const LodgifyRatesCalendarSimpleOutputSchema = z.array(
	LodgifyRateSimpleCalendarItemSchema,
);

export const LodgifyRatesSettingsInputSchema = z
	.object({ houseId: z.number().int().positive().optional() })
	.strict();

export const LodgifyRatesSettingsOutputSchema = LodgifyRateSettingsSchema;

export const LodgifyRateUpdateInputSchema = z
	.object({
		property_id: z.number().int().positive(),
		room_type_id: z.number().int().positive(),
		rates: z
			.array(
				z
					.object({
						is_default: z.boolean().optional(),
						start_date: z.string().optional(),
						end_date: z.string().optional(),
						price_per_day: z.number().min(1).max(100_000_000_000).optional(),
						min_stay: z.number().int().nonnegative().optional(),
						max_stay: z.number().int().nonnegative().optional(),
						price_per_additional_guest: z.number().optional(),
						additional_guests_starts_from: z
							.number()
							.int()
							.nonnegative()
							.optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
	})
	.strict();

export const LodgifyRateUpdateOutputSchema = z.boolean();

// ==========================================
// Quotes Schemas
// ==========================================

export const LodgifyQuotesCalculateInputSchema = z
	.object({
		propertyId: z.number().int().positive(),
		arrival: z.string().datetime(),
		departure: z.string().datetime(),
		roomTypes: z
			.array(
				z
					.object({
						id: z.number().int().positive(),
						guest_breakdown: z
							.object({
								adults: z.number().int().nonnegative().optional(),
								children: z.number().int().nonnegative().optional(),
								infants: z.number().int().nonnegative().optional(),
								pets: z.number().int().nonnegative().optional(),
							})
							.strict(),
						people: z.number().int().nonnegative().optional(),
					})
					.strict(),
			)
			.min(1),
		addOns: z
			.array(
				z
					.object({
						id: z.number().int().positive(),
						units: z.number().int().nullable().optional(),
					})
					.strict(),
			)
			.optional(),
		promotionCode: z.string().optional(),
	})
	.strict();

const LodgifyQuoteFeeTypeSchema = z.enum([
	'Cleaning',
	'Miscellaneous',
	'DamageProtectionInsurance',
	'ManagementFee',
	'ServiceFee',
	'Wood',
	'DrinkingWater',
	'WaterCraftMooring',
	'WaterCraft',
	'Water',
	'Vehicle',
	'FoodUtensils',
	'UtensilsCleaning',
	'Transportation',
	'Tour',
	'Toiletries',
	'Spa',
	'Resort',
	'Rent',
	'Parking',
	'Phone',
	'OnSitePaymentMethod',
	'Oil',
	'LinensBed',
	'LinensBath',
	'Linens',
	'Laundry',
	'Labor',
	'Internet',
	'TravelInsurance',
	'HotTub',
	'HighChair',
	'Heating',
	'Gas',
	'Gardening',
	'Food',
	'Equipment',
	'Electricity',
	'Concierge',
	'PoolHeating',
	'Pool',
	'Class',
	'BabyBed',
	'PropertyAssociation',
	'AirConditioning',
	'AdditionalBed',
	'PetFee',
	'ServiceCharge',
	'GratuityFee',
	'DamageWaiver',
	'Community',
]);

const LodgifyQuotePriceSchema = z
	.object({
		uid: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		amount: z.number().optional(),
		fee_type: LodgifyQuoteFeeTypeSchema.optional(),
		room_rate_type: z.enum(['Stay', 'ShortStayPremium']).optional(),
	})
	.strict();

const LodgifyQuotePriceTypeSchema = z
	.object({
		type: z
			.enum(['RoomRate', 'Promotion', 'Fee', 'AddOn', 'Tax', 'Other'])
			.optional(),
		is_negative: z.boolean().optional(),
		description: z.string().nullable().optional(),
		prices: z.array(LodgifyQuotePriceSchema).nullable().optional(),
		subtotal: z.number().optional(),
	})
	.strict();

const LodgifyQuoteRoomTypeSchema = z
	.object({
		room_type_id: z.number().int().optional(),
		name: z.string().nullable().optional(),
		people: z.number().int().optional(),
		price_types: z.array(LodgifyQuotePriceTypeSchema).nullable().optional(),
		subtotal: z.number().optional(),
	})
	.strict();

const LodgifyQuoteAddOnSchema = z
	.object({
		add_on_id: z.number().int().optional(),
		name: z.string().nullable().optional(),
		units: z.number().int().nullable().optional(),
		amount: z.number().optional(),
	})
	.strict();

const LodgifyQuoteOtherItemSchema = z
	.object({
		type: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		amount: z.number().optional(),
	})
	.strict();

const LodgifyQuoteScheduledTransactionSchema = z
	.object({
		type: z.string().nullable().optional(),
		date_due: z.string().nullable().optional(),
		amount: z.number().optional(),
		is_current: z.boolean().optional(),
		status: z.string().nullable().optional(),
	})
	.strict();

export const LodgifyQuoteSchema = z
	.object({
		total_including_vat: z.number().nullable().optional(),
		total_excluding_vat: z.number().nullable().optional(),
		total_vat: z.number().nullable().optional(),
		property_id: z.number().int().optional(),
		date_arrival: z.string().datetime().optional(),
		date_departure: z.string().datetime().optional(),
		currency_code: z.string().nullable().optional(),
		room_types: z.array(LodgifyQuoteRoomTypeSchema).nullable().optional(),
		add_ons: z.array(LodgifyQuoteAddOnSchema).nullable().optional(),
		other_items: z.array(LodgifyQuoteOtherItemSchema).nullable().optional(),
		add_ons_subtotal: z.number().optional(),
		rate_policy_user_id: z.number().int().nullable().optional(),
		scheduled_payments: z
			.array(LodgifyQuoteScheduledTransactionSchema)
			.nullable()
			.optional(),
		scheduled_damage_protection: z
			.array(LodgifyQuoteScheduledTransactionSchema)
			.nullable()
			.optional(),
		security_deposit: z.number().optional(),
		total_scheduled_payments: z.number().optional(),
		total_to_collect_manually: z.number().optional(),
		amount_gross: z.number().optional(),
		rental_agreement: z.string().uuid().nullable().optional(),
		cancellation_policy_text: z.string().nullable().optional(),
		security_deposit_text: z.string().nullable().optional(),
		is_verification: z.boolean().optional(),
	})
	.strict();

export const LodgifyQuotesCalculateOutputSchema = z.array(LodgifyQuoteSchema);

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
		threadGuid: z.string().uuid(),
	})
	.strict();

export const LodgifyThreadMessageSchema = z
	.object({
		id: z.number().int().optional(),
		subject: z.string().nullable().optional(),
		message: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		date_created: z.string().optional(),
		attachments: z
			.array(
				z
					.object({
						file_name: z.string().nullable().optional(),
						content_length: z.string().nullable().optional(),
						content_type: z.string().nullable().optional(),
						file_url: z.string().nullable().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		message_status: z.string().nullable().optional(),
		is_read: z.boolean().optional(),
		route: z.enum(['Email', 'Airbnb', 'BookingCom', 'Vrbo', 'Sms']).optional(),
		is_imported: z.boolean().nullable().optional(),
		message_id: z.string().uuid().nullable().optional(),
	})
	.strict();

export const LodgifyMessageThreadSchema = z
	.object({
		thread_uid: z.string().uuid().optional(),
		guest_name: z.string().nullable().optional(),
		guest_email: z.string().nullable().optional(),
		last_message_date: z.string().optional(),
		is_read: z.boolean().optional(),
		messages: z.array(LodgifyThreadMessageSchema).nullable().optional(),
		is_closed: z.boolean().optional(),
		error_message: z.string().nullable().optional(),
		error_title: z.string().nullable().optional(),
	})
	.strict();

export const LodgifyMessagesListOutputSchema = z.array(
	LodgifyMessageThreadSchema,
);

export const LodgifyMessagesSendInputSchema = z
	.object({
		inboxType: z.enum(['booking', 'enquiry']),
		id: z.number().int().positive(),
		message: z.string().min(1),
		type: z.enum(['Owner', 'Comment', 'Renter']),
		subject: z.string().nullable().optional(),
		send_notification: z.boolean().optional(),
		message_id: z.string().uuid().optional(),
	})
	.strict();

export const LodgifyMessagesSendOutputSchema = z.undefined();

// ==========================================
// Schema Collections & Type Exports
// ==========================================

export const LodgifyEndpointInputSchemas = {
	'countries.list': LodgifyCountriesListInputSchema,
	'countries.get': LodgifyCountryGetInputSchema,
	'currencies.list': LodgifyCurrenciesListInputSchema,
	'currencies.get': LodgifyCurrencyGetInputSchema,
	'channels.inventory': LodgifyChannelInventoryInputSchema,
	'properties.list': LodgifyPropertiesListInputSchema,
	'properties.get': LodgifyPropertiesGetInputSchema,
	'properties.getRooms': LodgifyPropertiesGetRoomsInputSchema,
	'properties.listV1': LodgifyPropertiesListV1InputSchema,
	'properties.getV1': LodgifyPropertiesGetV1InputSchema,
	'properties.getRoomV1': LodgifyPropertiesGetRoomV1InputSchema,
	'properties.getDeleted': LodgifyPropertiesGetDeletedInputSchema,
	'properties.getAddons': LodgifyPropertiesGetAddonsInputSchema,
	'properties.getPayments': LodgifyPropertiesGetPaymentsInputSchema,
	'reservations.list': LodgifyReservationsListInputSchema,
	'reservations.listInbox': LodgifyReservationsInboxListInputSchema,
	'reservations.get': LodgifyReservationsGetInputSchema,
	'reservations.getEnquiry': LodgifyReservationsGetEnquiryInputSchema,
	'reservations.create': LodgifyReservationsCreateInputSchema,
	'reservations.createEnquiry': LodgifyReservationsCreateEnquiryInputSchema,
	'reservations.unreadCount': LodgifyReservationsUnreadCountInputSchema,
	'reservations.getBookingV1': LodgifyReservationsGetBookingV1InputSchema,
	'reservations.updateBooking': LodgifyReservationsUpdateBookingInputSchema,
	'reservations.deleteBooking': LodgifyReservationActionInputSchema,
	'reservations.deleteEnquiry': LodgifyReservationActionInputSchema,
	'reservations.createCallMeBack':
		LodgifyReservationsCreateCallMeBackInputSchema,
	'reservations.createQuote': LodgifyReservationsCreateQuoteInputSchema,
	'reservations.getQuote': LodgifyReservationsGetQuoteInputSchema,
	'reservations.getPaymentLinkV1': LodgifyReservationsGetPaymentLinkInputSchema,
	'reservations.getPaymentLink': LodgifyReservationsGetPaymentLinkInputSchema,
	'reservations.recoverBooking': LodgifyReservationActionInputSchema,
	'reservations.recoverEnquiry': LodgifyReservationActionInputSchema,
	'reservations.reopenBooking': LodgifyReservationActionInputSchema,
	'reservations.declineBooking': LodgifyReservationActionInputSchema,
	'reservations.tentativeBooking':
		LodgifyReservationsSetBookingStatusInputSchema,
	'reservations.bookBooking': LodgifyReservationsSetBookingStatusInputSchema,
	'reservations.declineEnquiry': LodgifyReservationActionInputSchema,
	'reservations.reopenEnquiry': LodgifyReservationActionInputSchema,
	'reservations.deleteMany': LodgifyReservationsBatchInputSchema,
	'reservations.requestPayment': LodgifyReservationActionInputSchema,
	'reservations.checkInV1': LodgifyReservationsCheckInOutInputSchema,
	'reservations.checkOutV1': LodgifyReservationsCheckInOutInputSchema,
	'reservations.markManyReplied': LodgifyReservationsBatchInputSchema,
	'reservations.markManyNotReplied': LodgifyReservationsBatchInputSchema,
	'reservations.markBookingReplied': LodgifyReservationActionInputSchema,
	'reservations.markEnquiryReplied': LodgifyReservationActionInputSchema,
	'reservations.markBookingNotReplied': LodgifyReservationActionInputSchema,
	'reservations.markEnquiryNotReplied': LodgifyReservationActionInputSchema,
	'reservations.checkIn': LodgifyReservationsCheckInOutInputSchema,
	'reservations.checkOut': LodgifyReservationsCheckInOutInputSchema,
	'reservations.getExternalBookings':
		LodgifyReservationsGetExternalBookingsInputSchema,
	'reservations.updateKeyCodes': LodgifyReservationsUpdateKeyCodesInputSchema,
	'availability.get': LodgifyAvailabilityGetInputSchema,
	'availability.getAll': LodgifyAvailabilityGetAllInputSchema,
	'availability.getRoomType': LodgifyAvailabilityGetRoomTypeInputSchema,
	'availability.set': LodgifyAvailabilitySetInputSchema,
	'availability.getLegacyAll': LodgifyAvailabilityGetLegacyAllInputSchema,
	'availability.getLegacyProperty':
		LodgifyAvailabilityGetLegacyPropertyInputSchema,
	'availability.getLegacyRoomType':
		LodgifyAvailabilityGetLegacyRoomTypeInputSchema,
	'rates.calendar': LodgifyRatesCalendarInputSchema,
	'rates.calendarSimple': LodgifyRatesCalendarInputSchema,
	'rates.settings': LodgifyRatesSettingsInputSchema,
	'rates.update': LodgifyRateUpdateInputSchema,
	'quotes.calculate': LodgifyQuotesCalculateInputSchema,
	'quotes.calculateV1': LodgifyLegacyQuoteInputSchema,
	'messages.list': LodgifyMessagesListInputSchema,
	'messages.send': LodgifyMessagesSendInputSchema,
} as const;

export const LodgifyEndpointOutputSchemas = {
	'countries.list': LodgifyCountriesListOutputSchema,
	'countries.get': LodgifyCountryGetOutputSchema,
	'currencies.list': LodgifyCurrenciesListOutputSchema,
	'currencies.get': LodgifyCurrencyGetOutputSchema,
	'channels.inventory': LodgifyChannelInventoryOutputSchema,
	'properties.list': LodgifyPropertiesListOutputSchema,
	'properties.get': LodgifyPropertiesGetOutputSchema,
	'properties.getRooms': LodgifyPropertiesGetRoomsOutputSchema,
	'properties.listV1': LodgifyPropertiesListV1OutputSchema,
	'properties.getV1': LodgifyPropertiesGetV1OutputSchema,
	'properties.getRoomV1': LodgifyPropertiesGetRoomV1OutputSchema,
	'properties.getDeleted': LodgifyPropertiesGetDeletedOutputSchema,
	'properties.getAddons': LodgifyPropertiesGetAddonsOutputSchema,
	'properties.getPayments': LodgifyPropertiesGetPaymentsOutputSchema,
	'reservations.list': LodgifyReservationsListOutputSchema,
	'reservations.listInbox': LodgifyReservationsInboxListOutputSchema,
	'reservations.get': LodgifyReservationsGetOutputSchema,
	'reservations.getEnquiry': LodgifyReservationsGetEnquiryOutputSchema,
	'reservations.create': LodgifyReservationsCreateOutputSchema,
	'reservations.createEnquiry': LodgifyReservationsCreateEnquiryOutputSchema,
	'reservations.unreadCount': LodgifyReservationsUnreadCountOutputSchema,
	'reservations.getBookingV1': LodgifyReservationsGetBookingV1OutputSchema,
	'reservations.updateBooking': LodgifyReservationsUpdateBookingOutputSchema,
	'reservations.deleteBooking': LodgifyReservationActionOutputSchema,
	'reservations.deleteEnquiry': LodgifyReservationActionOutputSchema,
	'reservations.createCallMeBack':
		LodgifyReservationsCreateCallMeBackOutputSchema,
	'reservations.createQuote': LodgifyReservationsCreateQuoteOutputSchema,
	'reservations.getQuote': LodgifyReservationsGetQuoteOutputSchema,
	'reservations.getPaymentLinkV1':
		LodgifyReservationsGetPaymentLinkOutputSchema,
	'reservations.getPaymentLink': LodgifyReservationsGetPaymentLinkOutputSchema,
	'reservations.recoverBooking': LodgifyReservationActionOutputSchema,
	'reservations.recoverEnquiry': LodgifyReservationActionOutputSchema,
	'reservations.reopenBooking': LodgifyReservationActionOutputSchema,
	'reservations.declineBooking': LodgifyReservationActionOutputSchema,
	'reservations.tentativeBooking':
		LodgifyReservationsSetBookingStatusOutputSchema,
	'reservations.bookBooking': LodgifyReservationsSetBookingStatusOutputSchema,
	'reservations.declineEnquiry': LodgifyReservationActionOutputSchema,
	'reservations.reopenEnquiry': LodgifyReservationActionOutputSchema,
	'reservations.deleteMany': LodgifyReservationsBatchOutputSchema,
	'reservations.requestPayment': LodgifyReservationActionOutputSchema,
	'reservations.checkInV1': LodgifyReservationsCheckInOutOutputSchema,
	'reservations.checkOutV1': LodgifyReservationsCheckInOutOutputSchema,
	'reservations.markManyReplied': LodgifyReservationsBatchOutputSchema,
	'reservations.markManyNotReplied': LodgifyReservationsBatchOutputSchema,
	'reservations.markBookingReplied': LodgifyReservationActionOutputSchema,
	'reservations.markEnquiryReplied': LodgifyReservationActionOutputSchema,
	'reservations.markBookingNotReplied': LodgifyReservationActionOutputSchema,
	'reservations.markEnquiryNotReplied': LodgifyReservationActionOutputSchema,
	'reservations.checkIn': LodgifyReservationsCheckInOutOutputSchema,
	'reservations.checkOut': LodgifyReservationsCheckInOutOutputSchema,
	'reservations.getExternalBookings':
		LodgifyReservationsGetExternalBookingsOutputSchema,
	'reservations.updateKeyCodes': LodgifyReservationsUpdateKeyCodesOutputSchema,
	'availability.get': LodgifyAvailabilityGetOutputSchema,
	'availability.getAll': LodgifyAvailabilityGetAllOutputSchema,
	'availability.getRoomType': LodgifyAvailabilityGetRoomTypeOutputSchema,
	'availability.set': LodgifyAvailabilitySetOutputSchema,
	'availability.getLegacyAll': LodgifyAvailabilityLegacyOutputSchema,
	'availability.getLegacyProperty': LodgifyAvailabilityLegacyOutputSchema,
	'availability.getLegacyRoomType': LodgifyAvailabilityLegacyOutputSchema,
	'rates.calendar': LodgifyRatesCalendarOutputSchema,
	'rates.calendarSimple': LodgifyRatesCalendarSimpleOutputSchema,
	'rates.settings': LodgifyRatesSettingsOutputSchema,
	'rates.update': LodgifyRateUpdateOutputSchema,
	'quotes.calculate': LodgifyQuotesCalculateOutputSchema,
	'quotes.calculateV1': LodgifyLegacyQuoteOutputSchema,
	'messages.list': LodgifyMessagesListOutputSchema,
	'messages.send': LodgifyMessagesSendOutputSchema,
} as const;

export type LodgifyEndpointInputs = {
	[K in keyof typeof LodgifyEndpointInputSchemas]: z.infer<
		(typeof LodgifyEndpointInputSchemas)[K]
	>;
};

export type LodgifyEndpointOutputs = {
	[K in keyof typeof LodgifyEndpointOutputSchemas]: z.infer<
		(typeof LodgifyEndpointOutputSchemas)[K]
	>;
};
