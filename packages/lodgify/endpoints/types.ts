import { z } from 'zod';

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
		amenities: z
			.record(
				z.string(),
				z
					.array(
						z
							.object({
								name: z.string().nullable().optional(),
								prefix: z.string().nullable().optional(),
								bracket: z.string().nullable().optional(),
								text: z.string().nullable().optional(),
							})
							.strict(),
					)
					.nullable(),
			)
			.nullable()
			.optional(),
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
	.passthrough(); // passthrough because paged reservations may include additional summary metadata

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

const LodgifyGuestBreakdownSchema = z
	.object({
		adults: z.number().int().nonnegative().optional(),
		children: z.number().int().nonnegative().optional(),
		infants: z.number().int().nonnegative().optional(),
		pets: z.number().int().nonnegative().optional(),
	})
	.strict();

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

export const LodgifyReservationsGetEnquiryOutputSchema = LodgifyInboxItemSchema;
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

// ==========================================
// Rate Schemas
// ==========================================

export const LodgifyRatePriceSchema = z.number();

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
						price_per_day: z.number().optional(),
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

export const LodgifyQuoteSchema = z
	.object({
		total_including_vat: z.number().nullable().optional(),
		total_excluding_vat: z.number().nullable().optional(),
		total_vat: z.number().nullable().optional(),
		property_id: z.number().int().optional(),
		date_arrival: z.string().optional(),
		date_departure: z.string().optional(),
		currency_code: z.string().nullable().optional(),
		room_types: z
			.array(
				z
					.object({
						room_type_id: z.number().int().optional(),
						name: z.string().nullable().optional(),
						people: z.number().int().optional(),
						price_types: z
							.array(
								z
									.object({
										type: z
											.enum([
												'RoomRate',
												'Promotion',
												'Fee',
												'AddOn',
												'Tax',
												'Other',
											])
											.optional(),
										is_negative: z.boolean().optional(),
										description: z.string().nullable().optional(),
										prices: z
											.array(
												z
													.object({
														uid: z.string().nullable().optional(),
														description: z.string().nullable().optional(),
														amount: z.number().optional(),
														fee_type: LodgifyQuoteFeeTypeSchema.optional(),
														room_rate_type: z
															.enum(['Stay', 'ShortStayPremium'])
															.optional(),
													})
													.strict(),
											)
											.nullable()
											.optional(),
										subtotal: z.number().optional(),
									})
									.strict(),
							)
							.nullable()
							.optional(),
						subtotal: z.number().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		add_ons: z
			.array(
				z
					.object({
						add_on_id: z.number().int().optional(),
						name: z.string().nullable().optional(),
						units: z.number().int().nullable().optional(),
						amount: z.number().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		other_items: z
			.array(
				z
					.object({
						type: z.string().nullable().optional(),
						description: z.string().nullable().optional(),
						amount: z.number().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		add_ons_subtotal: z.number().optional(),
		rate_policy_user_id: z.number().int().nullable().optional(),
		scheduled_payments: z
			.array(
				z
					.object({
						type: z.string().nullable().optional(),
						date_due: z.string().nullable().optional(),
						amount: z.number().optional(),
						is_current: z.boolean().optional(),
						status: z.string().nullable().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		scheduled_damage_protection: z
			.array(
				z
					.object({
						type: z.string().nullable().optional(),
						date_due: z.string().nullable().optional(),
						amount: z.number().optional(),
						is_current: z.boolean().optional(),
						status: z.string().nullable().optional(),
					})
					.strict(),
			)
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
	'properties.list': LodgifyPropertiesListInputSchema,
	'properties.get': LodgifyPropertiesGetInputSchema,
	'properties.getRooms': LodgifyPropertiesGetRoomsInputSchema,
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
	'availability.get': LodgifyAvailabilityGetInputSchema,
	'availability.getAll': LodgifyAvailabilityGetAllInputSchema,
	'availability.getRoomType': LodgifyAvailabilityGetRoomTypeInputSchema,
	'availability.set': LodgifyAvailabilitySetInputSchema,
	'rates.calendar': LodgifyRatesCalendarInputSchema,
	'rates.calendarSimple': LodgifyRatesCalendarInputSchema,
	'rates.settings': LodgifyRatesSettingsInputSchema,
	'rates.update': LodgifyRateUpdateInputSchema,
	'quotes.calculate': LodgifyQuotesCalculateInputSchema,
	'messages.list': LodgifyMessagesListInputSchema,
	'messages.send': LodgifyMessagesSendInputSchema,
} as const;

export const LodgifyEndpointOutputSchemas = {
	'properties.list': LodgifyPropertiesListOutputSchema,
	'properties.get': LodgifyPropertiesGetOutputSchema,
	'properties.getRooms': LodgifyPropertiesGetRoomsOutputSchema,
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
	'availability.get': LodgifyAvailabilityGetOutputSchema,
	'availability.getAll': LodgifyAvailabilityGetAllOutputSchema,
	'availability.getRoomType': LodgifyAvailabilityGetRoomTypeOutputSchema,
	'availability.set': LodgifyAvailabilitySetOutputSchema,
	'rates.calendar': LodgifyRatesCalendarOutputSchema,
	'rates.calendarSimple': LodgifyRatesCalendarSimpleOutputSchema,
	'rates.settings': LodgifyRatesSettingsOutputSchema,
	'rates.update': LodgifyRateUpdateOutputSchema,
	'quotes.calculate': LodgifyQuotesCalculateOutputSchema,
	'messages.list': LodgifyMessagesListOutputSchema,
	'messages.send': LodgifyMessagesSendOutputSchema,
} as const;

export type LodgifyEndpointInputs = {
	'properties.list': z.infer<typeof LodgifyPropertiesListInputSchema>;
	'properties.get': z.infer<typeof LodgifyPropertiesGetInputSchema>;
	'properties.getRooms': z.infer<typeof LodgifyPropertiesGetRoomsInputSchema>;
	'properties.getDeleted': z.infer<
		typeof LodgifyPropertiesGetDeletedInputSchema
	>;
	'properties.getAddons': z.infer<typeof LodgifyPropertiesGetAddonsInputSchema>;
	'properties.getPayments': z.infer<
		typeof LodgifyPropertiesGetPaymentsInputSchema
	>;
	'reservations.list': z.infer<typeof LodgifyReservationsListInputSchema>;
	'reservations.listInbox': z.infer<
		typeof LodgifyReservationsInboxListInputSchema
	>;
	'reservations.get': z.infer<typeof LodgifyReservationsGetInputSchema>;
	'reservations.getEnquiry': z.infer<
		typeof LodgifyReservationsGetEnquiryInputSchema
	>;
	'reservations.create': z.infer<typeof LodgifyReservationsCreateInputSchema>;
	'reservations.createEnquiry': z.infer<
		typeof LodgifyReservationsCreateEnquiryInputSchema
	>;
	'reservations.unreadCount': z.infer<
		typeof LodgifyReservationsUnreadCountInputSchema
	>;
	'availability.get': z.infer<typeof LodgifyAvailabilityGetInputSchema>;
	'availability.getAll': z.infer<typeof LodgifyAvailabilityGetAllInputSchema>;
	'availability.getRoomType': z.infer<
		typeof LodgifyAvailabilityGetRoomTypeInputSchema
	>;
	'availability.set': z.infer<typeof LodgifyAvailabilitySetInputSchema>;
	'rates.calendar': z.infer<typeof LodgifyRatesCalendarInputSchema>;
	'rates.calendarSimple': z.infer<typeof LodgifyRatesCalendarInputSchema>;
	'rates.settings': z.infer<typeof LodgifyRatesSettingsInputSchema>;
	'rates.update': z.infer<typeof LodgifyRateUpdateInputSchema>;
	'quotes.calculate': z.infer<typeof LodgifyQuotesCalculateInputSchema>;
	'messages.list': z.infer<typeof LodgifyMessagesListInputSchema>;
	'messages.send': z.infer<typeof LodgifyMessagesSendInputSchema>;
};

export type LodgifyEndpointOutputs = {
	'properties.list': z.infer<typeof LodgifyPropertiesListOutputSchema>;
	'properties.get': z.infer<typeof LodgifyPropertiesGetOutputSchema>;
	'properties.getRooms': z.infer<typeof LodgifyPropertiesGetRoomsOutputSchema>;
	'properties.getDeleted': z.infer<
		typeof LodgifyPropertiesGetDeletedOutputSchema
	>;
	'properties.getAddons': z.infer<
		typeof LodgifyPropertiesGetAddonsOutputSchema
	>;
	'properties.getPayments': z.infer<
		typeof LodgifyPropertiesGetPaymentsOutputSchema
	>;
	'reservations.list': z.infer<typeof LodgifyReservationsListOutputSchema>;
	'reservations.listInbox': z.infer<
		typeof LodgifyReservationsInboxListOutputSchema
	>;
	'reservations.get': z.infer<typeof LodgifyReservationsGetOutputSchema>;
	'reservations.getEnquiry': z.infer<
		typeof LodgifyReservationsGetEnquiryOutputSchema
	>;
	'reservations.create': z.infer<typeof LodgifyReservationsCreateOutputSchema>;
	'reservations.createEnquiry': z.infer<
		typeof LodgifyReservationsCreateEnquiryOutputSchema
	>;
	'reservations.unreadCount': z.infer<
		typeof LodgifyReservationsUnreadCountOutputSchema
	>;
	'availability.get': z.infer<typeof LodgifyAvailabilityGetOutputSchema>;
	'availability.getAll': z.infer<typeof LodgifyAvailabilityGetAllOutputSchema>;
	'availability.getRoomType': z.infer<
		typeof LodgifyAvailabilityGetRoomTypeOutputSchema
	>;
	'availability.set': z.infer<typeof LodgifyAvailabilitySetOutputSchema>;
	'rates.calendar': z.infer<typeof LodgifyRatesCalendarOutputSchema>;
	'rates.calendarSimple': z.infer<
		typeof LodgifyRatesCalendarSimpleOutputSchema
	>;
	'rates.settings': z.infer<typeof LodgifyRatesSettingsOutputSchema>;
	'rates.update': z.infer<typeof LodgifyRateUpdateOutputSchema>;
	'quotes.calculate': z.infer<typeof LodgifyQuotesCalculateOutputSchema>;
	'messages.list': z.infer<typeof LodgifyMessagesListOutputSchema>;
	'messages.send': z.infer<typeof LodgifyMessagesSendOutputSchema>;
};
