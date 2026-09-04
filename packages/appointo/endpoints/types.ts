import { z } from 'zod';

const ProductsListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	search_term: z.string().optional(),
	offset: z.number().int().min(0).optional(),
});

const AppointmentsListInputSchema = z.object({
	appointment_id: z.number().int().optional(),
	product_id: z.number().int().optional(),
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
	search_term: z.string().optional(),
});

const AppointmentsGetAvailabilityInputSchema = z.object({
	appointment_id: z.number().int(),
	start_date: z.string(),
	end_date: z.string().optional(),
	impersonated_tms: z.array(z.number().int()).optional(),
});

const AppointmentConfigSchema = z
	.object({
		timezone: z.string().optional(),
		duration: z.string().optional(),
		minimum_notice: z.string().optional(),
		max_capacity: z.string().optional(),
		meeting_detail: z.string().optional(),
		note: z.string().optional(),
		interval: z.string().optional(),
		reminder_duration: z.string().optional(),
		send_reminder: z.boolean().optional(),
		whatsapp_duration: z.string().optional(),
		send_whatsapp_reminder: z.boolean().optional(),
		enable_max_events_per_day: z.boolean().optional(),
		max_events_per_day: z.number().int().optional(),
		start_buffer_time: z.string().optional(),
		end_buffer_time: z.string().optional(),
		location_type: z.string().optional(),
		location_value: z.string().optional(),
		allow_cancel: z.boolean().optional(),
		allow_reschedule: z.boolean().optional(),
		reschedule_duration: z.number().int().optional(),
		cancel_duration: z.number().int().optional(),
		date_range_type: z.string().optional(),
		tm_assign_rule: z.string().optional(),
		days_in_future: z.string().optional(),
		start_date_range: z.string().optional(),
		end_date_range: z.string().optional(),
		is_combo_service: z.boolean().optional(),
		send_text_reminder: z.boolean().optional(),
		text_duration: z.string().optional(),
		min_day_duration: z.string().optional(),
		max_day_duration: z.string().optional(),
		fixed_multi_day_price: z.boolean().optional(),
		rem_group_slot_after_booking: z.boolean().optional(),
		start_month: z.string().optional(),
		color: z.string().optional(),
		allow_waitlist: z.boolean().optional(),
		email_label: z.string().optional(),
		name_label: z.string().optional(),
		phone_label: z.string().optional(),
		show_phone: z.boolean().optional(),
	})
	.loose();

const AvailabilitySlotSchema = z
	.object({
		start_time: z.string(),
		end_time: z.string(),
		surge: z.boolean().optional(),
		price: z.string().optional(),
	})
	.loose();

const AvailabilitySchema = z
	.object({
		id: z.number().int().optional(),
		weekday: z.string().optional(),
		weekday_index: z.number().int().optional(),
		slots: z.array(AvailabilitySlotSchema).optional(),
		shop_id: z.number().int().optional(),
		appointment_id: z.number().int().optional(),
		day_available: z.boolean().optional(),
		max_capacity: z.number().int().nullable().optional(),
	})
	.loose();

const OverrideSchema = z
	.object({
		id: z.number().int().optional(),
		day: z.string(),
		slots: z.array(AvailabilitySlotSchema).optional(),
		shop_id: z.number().int().optional(),
		appointment_id: z.number().int().optional(),
		day_available: z.boolean().optional(),
	})
	.loose();

const AppointmentsUpsertConfigInputSchema = z.object({
	appointment_id: z.number().int(),
	config: AppointmentConfigSchema.optional(),
	availabilities: z.array(AvailabilitySchema).optional(),
	override: z.array(OverrideSchema).optional(),
});

const BookingsListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
	status: z.enum(['past', 'upcoming']).optional(),
	booking_id: z.number().int().optional(),
	search_term: z.string().optional(),
});

const BookingsCreateInputSchema = z.object({
	appointment_id: z.number().int(),
	timestring: z.string(),
	email: z.string().email(),
	name: z.string(),
	quantity: z.number().int().positive().optional(),
	phone: z.string().optional(),
});

const BookingsRescheduleInputSchema = z.object({
	booking_id: z.number().int(),
	timestring: z.string(),
	customer_ids: z.array(z.number().int()).optional(),
	override: z.boolean().optional(),
});

const BookingsCancelInputSchema = z.object({
	booking_id: z.number().int(),
	customer_ids: z.array(z.number().int()).optional(),
});

const BookingsUpdateInputSchema = z.object({
	booking_id: z.number().int(),
	start_buffer_time: z.number().int().positive().optional(),
	end_buffer_time: z.number().int().positive().optional(),
});

const SubscriptionsListInputSchema = z.object({
	search_term: z.string().optional(),
});

export type ProductsListInput = z.infer<typeof ProductsListInputSchema>;
export type AppointmentsListInput = z.infer<typeof AppointmentsListInputSchema>;
export type AppointmentsGetAvailabilityInput = z.infer<
	typeof AppointmentsGetAvailabilityInputSchema
>;
export type AppointmentsUpsertConfigInput = z.infer<
	typeof AppointmentsUpsertConfigInputSchema
>;
export type BookingsListInput = z.infer<typeof BookingsListInputSchema>;
export type BookingsCreateInput = z.infer<typeof BookingsCreateInputSchema>;
export type BookingsRescheduleInput = z.infer<
	typeof BookingsRescheduleInputSchema
>;
export type BookingsCancelInput = z.infer<typeof BookingsCancelInputSchema>;
export type BookingsUpdateInput = z.infer<typeof BookingsUpdateInputSchema>;
export type SubscriptionsListInput = z.infer<
	typeof SubscriptionsListInputSchema
>;

const ProductAppointmentSchema = z
	.object({
		id: z.number().int(),
		activate: z.boolean().nullable().optional(),
		product_uuid: z.string().optional(),
		calendly_event_uuid: z.string().nullable().optional(),
		duration_uuid: z.string().optional(),
		shop_id: z.number().int().optional(),
		product_detail_id: z.number().int().optional(),
		name: z.string().optional(),
		is_combo_service: z.boolean().optional(),
		price: z.string().optional(),
		currency: z.string().optional(),
		description: z.string().nullable().optional(),
		archived: z.boolean().optional(),
	})
	.loose();

const ProductSchema = z
	.object({
		id: z.number().int(),
		activate: z.boolean().optional(),
		product_uuid: z.string().optional(),
		shop_id: z.number().int().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		product_name: z.string().optional(),
		show_widget: z.boolean().optional(),
		appointment_type: z.string().optional(),
		vendor_name: z.string().optional(),
		include_variant_booking: z.boolean().optional(),
		book_without_pay: z.boolean().optional(),
		image_url: z.string().nullable().optional(),
		variants_count: z.number().int().optional(),
		appointments: z.array(ProductAppointmentSchema).optional(),
	})
	.loose();

const ProductsListResponseSchema = z.array(ProductSchema);

const AppointmentSchema = z
	.object({
		id: z.number().int(),
		activate: z.boolean().nullable().optional(),
		product_uuid: z.string().optional(),
		calendly_event_uuid: z.string().nullable().optional(),
		duration_uuid: z.string().optional(),
		shop_id: z.number().int().optional(),
		product_detail_id: z.number().int().optional(),
		name: z.string().optional(),
		is_combo_service: z.boolean().optional(),
		price: z.string().optional(),
		currency: z.string().optional(),
		description: z.string().nullable().optional(),
		archived: z.boolean().optional(),
	})
	.loose();

const AppointmentsListResponseSchema = z.array(AppointmentSchema);

const AvailabilityResponseItemSchema = z
	.object({
		id: z.number().int().optional(),
		weekday: z.string().optional(),
		weekday_index: z.number().int().optional(),
		slots: z.array(AvailabilitySlotSchema).optional(),
		shop_id: z.number().int().optional(),
		appointment_id: z.number().int().optional(),
		day_available: z.boolean().optional(),
		max_capacity: z.number().int().nullable().optional(),
	})
	.loose();

const AppointmentsGetAvailabilityResponseSchema = z.array(
	AvailabilityResponseItemSchema,
);

const AppointmentsUpsertConfigResponseSchema = z.array(AppointmentSchema);

const CustomerSchema = z
	.object({
		id: z.number().int(),
		email: z.string().optional(),
		payload: z
			.object({
				phone: z.string().optional(),
			})
			.optional(),
		name: z.string().optional(),
		shop_id: z.number().int().optional(),
		appointment_id: z.number().int().optional(),
		booking_id: z.number().int().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		customer_uuid: z.string().optional(),
		reschedule_uuid: z.string().nullable().optional(),
		cancel_uuid: z.string().nullable().optional(),
		order_name: z.string().optional(),
		order_uuid: z.string().nullable().optional(),
		shipping_address: z.record(z.string(), z.unknown()).optional(),
		override: z.boolean().optional(),
		signpanda_cust_uuid: z.string().nullable().optional(),
		parent_customer_id: z.number().int().nullable().optional(),
		is_active_sub: z.boolean().optional(),
		sub_interval: z.string().nullable().optional(),
		sub_booking_count: z.number().int().nullable().optional(),
		sub_booking_num: z.number().int().nullable().optional(),
		sub_recurring_type: z.string().nullable().optional(),
		customer_type: z.string().nullable().optional(),
		customer_timezone: z.string().nullable().optional(),
		archived: z.boolean().optional(),
		subscription_contract_id: z.string().nullable().optional(),
		selling_plan_id: z.string().nullable().optional(),
		checkin: z.boolean().optional(),
		checkin_qr_code: z.string().nullable().optional(),
		image_data: z.string().nullable().optional(),
	})
	.loose();

const BookingAppointmentSchema = z
	.object({
		id: z.number().int(),
		activate: z.boolean().nullable().optional(),
		product_uuid: z.string().optional(),
		duration_uuid: z.string().optional(),
		shop_id: z.number().int().optional(),
		product_detail_id: z.number().int().optional(),
		name: z.string().optional(),
		is_combo_service: z.boolean().optional(),
		price: z.string().optional(),
		currency: z.string().optional(),
		description: z.string().nullable().optional(),
		archived: z.boolean().optional(),
	})
	.loose();

const BookingSchema = z
	.object({
		id: z.number().int(),
		selected_time: z.string().optional(),
		timestring: z.string().optional(),
		shop_id: z.number().int().optional(),
		appointment_id: z.number().int().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		customers_count: z.number().int().optional(),
		duration: z.number().int().optional(),
		product_name: z.string().optional(),
		variant_name: z.string().optional(),
		order_uuid: z.string().optional(),
		price: z.string().optional(),
		order_name: z.string().optional(),
		currency: z.string().optional(),
		meeting_detail: z.string().optional(),
		note: z.string().optional(),
		google_meta: z.record(z.string(), z.unknown()).optional(),
		google_event_id: z.string().optional(),
		location_value: z.string().nullable().optional(),
		location_type: z.string().nullable().optional(),
		location_meta: z.record(z.string(), z.unknown()).nullable().optional(),
		quantity: z.number().int().optional(),
		team_member_id: z.string().nullable().optional(),
		scenario: z.string().optional(),
		day_duration: z.number().int().optional(),
		end_date: z.string().optional(),
		start_date: z.string().optional(),
		group_id: z.string().nullable().optional(),
		start_buffer_time: z.number().int().optional(),
		end_buffer_time: z.number().int().optional(),
		category: z.string().nullable().optional(),
		archived: z.boolean().optional(),
		notes_count: z.number().int().optional(),
		customers: z.array(CustomerSchema).optional(),
		archived_customers: z.array(CustomerSchema).optional(),
		appointment: BookingAppointmentSchema.optional(),
	})
	.loose();

const BookingsListResponseSchema = z.array(BookingSchema);
const BookingsCreateResponseSchema = z.array(BookingSchema);

const BookingsMutationResponseSchema = z
	.object({
		response: z
			.object({
				status: z.string(),
				booking: BookingSchema.optional(),
			})
			.optional(),
	})
	.loose();

const BookingsRescheduleResponseSchema = BookingsMutationResponseSchema;
const BookingsCancelResponseSchema = BookingsMutationResponseSchema;
const BookingsUpdateResponseSchema = BookingsMutationResponseSchema;

const SubscriptionSchema = z
	.object({
		id: z.number().int().optional(),
	})
	.loose();

const SubscriptionsListResponseSchema = z.array(SubscriptionSchema);

export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;
export type AppointmentsListResponse = z.infer<
	typeof AppointmentsListResponseSchema
>;
export type AppointmentsGetAvailabilityResponse = z.infer<
	typeof AppointmentsGetAvailabilityResponseSchema
>;
export type AppointmentsUpsertConfigResponse = z.infer<
	typeof AppointmentsUpsertConfigResponseSchema
>;
export type BookingsListResponse = z.infer<typeof BookingsListResponseSchema>;
export type BookingsCreateResponse = z.infer<
	typeof BookingsCreateResponseSchema
>;
export type BookingsRescheduleResponse = z.infer<
	typeof BookingsRescheduleResponseSchema
>;
export type BookingsCancelResponse = z.infer<
	typeof BookingsCancelResponseSchema
>;
export type BookingsUpdateResponse = z.infer<
	typeof BookingsUpdateResponseSchema
>;
export type SubscriptionsListResponse = z.infer<
	typeof SubscriptionsListResponseSchema
>;

export const AppointoEndpointInputSchemas = {
	productsList: ProductsListInputSchema,
	appointmentsList: AppointmentsListInputSchema,
	appointmentsGetAvailability: AppointmentsGetAvailabilityInputSchema,
	appointmentsUpsertConfig: AppointmentsUpsertConfigInputSchema,
	bookingsList: BookingsListInputSchema,
	bookingsCreate: BookingsCreateInputSchema,
	bookingsReschedule: BookingsRescheduleInputSchema,
	bookingsCancel: BookingsCancelInputSchema,
	bookingsUpdate: BookingsUpdateInputSchema,
	subscriptionsList: SubscriptionsListInputSchema,
} as const;

export type AppointoEndpointInputs = {
	[K in keyof typeof AppointoEndpointInputSchemas]: z.infer<
		(typeof AppointoEndpointInputSchemas)[K]
	>;
};

export const AppointoEndpointOutputSchemas = {
	productsList: ProductsListResponseSchema,
	appointmentsList: AppointmentsListResponseSchema,
	appointmentsGetAvailability: AppointmentsGetAvailabilityResponseSchema,
	appointmentsUpsertConfig: AppointmentsUpsertConfigResponseSchema,
	bookingsList: BookingsListResponseSchema,
	bookingsCreate: BookingsCreateResponseSchema,
	bookingsReschedule: BookingsRescheduleResponseSchema,
	bookingsCancel: BookingsCancelResponseSchema,
	bookingsUpdate: BookingsUpdateResponseSchema,
	subscriptionsList: SubscriptionsListResponseSchema,
} as const;

export type AppointoEndpointOutputs = {
	[K in keyof typeof AppointoEndpointOutputSchemas]: z.infer<
		(typeof AppointoEndpointOutputSchemas)[K]
	>;
};
