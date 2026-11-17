import { z } from 'zod';

/**
 * SuperSaaS's own names are used throughout. Outputs are `.loose()` and their
 * optional fields `.nullish()` so a field SuperSaaS adds or omits cannot fail a
 * read that already succeeded.
 *
 * A wrapped document is required only on write: SuperSaaS wants `{ user: {...} }`,
 * `{ booking: {...} }` or `{ slot: {...} }`, and the endpoints build that
 * wrapper. Record and list reads answer the bare record or a bare array; the
 * schedule reads (changes, range, agenda, free) answer `{ bookings }` or
 * `{ slots }`. Ids arrive as numbers (checked live 11-16), so output ids take
 * a number or a string.
 *
 * Contract: https://www.supersaas.com/info/dev/user_api and /appointment_api
 */

// ── Shared pieces ─────────────────────────────────────────────────────────

/** An id as SuperSaaS returns it: a number, or a string for your own keys. */
const IdOut = z.union([z.number(), z.string()]).nullish();

/** A number SuperSaaS may send as text, such as a price or credit. */
const NumOrStr = z.union([z.number(), z.string()]).nullish();

/** An id a caller passes: a number or a digit string, sent in the URL. */
const IdIn = z
	.union([z.number().int(), z.string().min(1)])
	.transform((value) => String(value));

/** The schedule a booking or slot belongs to, sent as a query parameter. */
const ScheduleId = z
	.number()
	.int()
	.describe(
		'The schedule id, the number at the end of the Configure Overview URL.',
	);

/** SuperSaaS dates are local wall-clock times, either a date or with a time. */
const LocalDateTime = z
	.string()
	.describe(
		'A local wall-clock value, as YYYY-MM-DD or YYYY-MM-DD HH:MM:SS. SuperSaaS applies the schedule timezone.',
	);

const UserId = z
	.string()
	.min(1)
	.describe("The user's SuperSaaS id, or your own key in the form 1234fk.");

/**
 * SuperSaaS pages with `limit` and `offset` rather than a cursor. A read of more
 * than 1000 records has to be split, so `offset` is how a caller advances.
 */
const paging = {
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Records to return. SuperSaaS defaults to 100.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Records to skip, which is how a caller reads past 1000.'),
};

// ── Record schemas ────────────────────────────────────────────────────────

/**
 * A user. `name` is the login name, which is an email address when the account
 * is configured that way, and it is the only field SuperSaaS requires.
 */
const UserSchema = z
	.object({
		id: IdOut,
		fk: IdOut.describe('Your own key, when you supplied one.'),
		name: z.string().nullish(),
		email: z.string().nullish(),
		full_name: z.string().nullish(),
		address: z.string().nullish(),
		mobile: z.string().nullish(),
		phone: z.string().nullish(),
		country: z.string().nullish(),
		timezone: z.string().nullish(),
		field_1: z.string().nullish(),
		field_2: z.string().nullish(),
		super_field: z.string().nullish(),
		credit: NumOrStr,
		role: z.number().nullish().describe('3 regular, 4 superuser, -1 blocked.'),
		group: IdOut,
		created_on: z.string().nullish(),
		last_login: z.string().nullish(),
	})
	.loose();

export type SupersaasUser = z.infer<typeof UserSchema>;

/** A booking. Its fields are set per schedule, so most are optional here. */
const BookingSchema = z
	.object({
		id: IdOut,
		start: LocalDateTime.nullish(),
		finish: LocalDateTime.nullish(),
		created_on: z.string().nullish(),
		updated_on: z.string().nullish(),
		created_by: z.string().nullish(),
		schedule_id: IdOut,
		schedule_name: z.string().nullish(),
		price: NumOrStr,
		waitlisted: z
			.union([z.boolean(), z.string()])
			.nullish()
			.describe('false, or "W" (documented) / true when on the waiting list.'),
		deleted: z.boolean().nullish(),
		user_id: IdOut,
		user_name: z.string().nullish(),
		full_name: z.string().nullish(),
		email: z.string().nullish(),
		address: z.string().nullish(),
		mobile: z.string().nullish(),
		phone: z.string().nullish(),
		country: z.string().nullish(),
		resource_id: IdOut,
		resource_name: z.string().nullish(),
		slot_id: IdOut,
		lat: z.number().nullish(),
		long: z.number().nullish(),
		field_1: z.string().nullish(),
		field_2: z.string().nullish(),
		field_1_r: z.string().nullish(),
		field_2_r: z.string().nullish(),
		super_field: z.string().nullish(),
		form_id: IdOut,
	})
	.loose();

export type SupersaasBooking = z.infer<typeof BookingSchema>;

/** A slot, which exists only on a capacity-type schedule. */
const SlotSchema = z
	.object({
		id: IdOut,
		start: LocalDateTime.nullish(),
		finish: LocalDateTime.nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		location: z.string().nullish(),
		created_on: z.string().nullish(),
		updated_on: z.string().nullish(),
		count: z.number().nullish().describe('Bookings in the slot (free reads).'),
		capacity: z
			.number()
			.nullish()
			.describe('Null or empty means no limit; 0 accepts no bookings.'),
		price: NumOrStr,
		resource_id: IdOut,
		resource_name: z.string().nullish(),
		bookings: z.array(BookingSchema).nullish(),
	})
	.loose();

export type SupersaasSlot = z.infer<typeof SlotSchema>;

/**
 * The schedule reads answer an envelope: `{ bookings: [...] }` for a resource
 * or service schedule, `{ slots: [...] }` for a capacity schedule or with
 * `slot=true` (each slot then carries its `bookings`), checked live 11-16.
 */
const ScheduleReadSchema = z
	.object({
		bookings: z.array(BookingSchema).nullish(),
		slots: z.array(SlotSchema).nullish(),
	})
	.loose();

export type SupersaasScheduleRead = z.infer<typeof ScheduleReadSchema>;

/** Updates answer 200 with an empty body, so the result records the id. */
const UpdatedSchema = z.object({
	id: z.string(),
	updated: z.literal(true),
});

export type SupersaasUpdated = z.infer<typeof UpdatedSchema>;

/**
 * Creates answer 201 with an empty body and the new record's URL in the
 * `Location` header; the id is read from it.
 */
const CreatedSchema = z.object({
	created: z.literal(true),
	id: z.string().describe('The new record id, from the Location header.'),
	location: z.string().describe('The new record URL SuperSaaS returned.'),
});

export type SupersaasCreated = z.infer<typeof CreatedSchema>;

// ── users ─────────────────────────────────────────────────────────────────

const UsersListInputSchema = z.object({ ...paging });

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UsersListResponseSchema = z.array(UserSchema);

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

/**
 * Only `name` is required. `group` takes an id from the List Groups API rather
 * than a name, and `role` takes 3, 4 or -1.
 */
const userBody = {
	name: z
		.string()
		.min(1)
		.describe(
			'The login name, max 50 characters. It must be a valid email address when the account uses email as the login name.',
		),
	email: z.string().nullish(),
	password: z.string().nullish(),
	full_name: z.string().nullish(),
	address: z.string().nullish(),
	mobile: z.string().nullish(),
	phone: z.string().nullish(),
	country: z.string().nullish().describe('A two-letter ISO 3166-1 code.'),
	timezone: z.string().nullish().describe('An IANA TZ identifier.'),
	field_1: z.string().nullish(),
	field_2: z.string().nullish(),
	super_field: z.string().nullish(),
	credit: z
		.string()
		.nullish()
		.describe('A credit level; the format is set on the Payment Setup screen.'),
	role: z
		.union([z.literal(3), z.literal(4), z.literal(-1)])
		.optional()
		.describe('3 regular, 4 superuser, -1 blocked.'),
	group: z.string().nullish().describe('A group id, never the group name.'),
	webhook: z
		.boolean()
		.optional()
		.describe('Trigger the account webhooks as part of the write.'),
};

const UsersCreateInputSchema = z.object(userBody);

export type UsersCreateInput = z.input<typeof UsersCreateInputSchema>;

/** Supplying your own key turns a create into an update of that key. */
const UsersCreateWithKeyInputSchema = z.object({
	key: z
		.string()
		.min(1)
		.describe(
			'Your own key for this user, such as 1234fk. Reusing it updates the existing record instead of creating another.',
		),
	...userBody,
});

export type UsersCreateWithKeyInput = z.input<
	typeof UsersCreateWithKeyInputSchema
>;

const UserTargetSchema = z.object({ id: UserId });
// UserId is a string already; numeric ids pass as digit strings.

export type UserTargetInput = z.input<typeof UserTargetSchema>;

const UsersGetResponseSchema = UserSchema;

export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

const UsersUpdateInputSchema = z.object({
	id: UserId,
	...userBody,
	/**
	 * A PUT to an unknown id creates it, which is surprising for an update. Set
	 * this to `error` for a 404 or `ignore` for a silent 200.
	 */
	notfound: z
		.enum(['error', 'ignore'])
		.optional()
		.describe(
			'What an update does when the id is unknown: error for a 404, ignore for a silent 200. Defaults to creating the record.',
		),
});

export type UsersUpdateInput = z.input<typeof UsersUpdateInputSchema>;

const UsersUpdateResponseSchema = UpdatedSchema;

export type UsersUpdateResponse = z.infer<typeof UsersUpdateResponseSchema>;

/** A delete answers 200 with no body, so the result records the id. */
const DeletedSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type SupersaasDeleted = z.infer<typeof DeletedSchema>;

// ── bookings ──────────────────────────────────────────────────────────────

const ScheduleTargetSchema = z.object({ schedule_id: ScheduleId });

export type ScheduleTargetInput = z.input<typeof ScheduleTargetSchema>;

const BookingsListInputSchema = z.object({
	schedule_id: ScheduleId,
	start: LocalDateTime.optional().describe(
		'Only bookings from this time (resource and service schedules).',
	),
	finish: LocalDateTime.optional().describe(
		'Only bookings up to this time (resource and service schedules).',
	),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Records to return. For paging use schedules.range.'),
});

export type BookingsListInput = z.input<typeof BookingsListInputSchema>;

const BookingsListResponseSchema = z.array(BookingSchema);

export type BookingsListResponse = z.infer<typeof BookingsListResponseSchema>;

/**
 * A booking belongs to a schedule, and its required fields are set per schedule
 * in the SuperSaaS UI. A resource schedule needs `start` and `finish`; a capacity
 * schedule needs `slot_id` instead. The schema accepts either and rejects
 * sending a slot id on a resource booking's fields at once.
 */
const bookingBody = {
	schedule_id: ScheduleId,
	start: LocalDateTime.optional(),
	finish: LocalDateTime.optional(),
	slot_id: IdIn.optional(),
	resource_id: IdIn.optional(),
	full_name: z.string().nullish(),
	email: z.string().nullish(),
	address: z.string().nullish(),
	mobile: z.string().nullish(),
	phone: z.string().nullish(),
	country: z.string().nullish(),
	field_1: z.string().nullish(),
	field_2: z.string().nullish(),
	field_1_r: z.string().nullish(),
	field_2_r: z.string().nullish(),
	super_field: z.string().nullish(),
	form_id: z.string().nullish(),
};

const BookingsCreateInputSchema = z
	.object({
		...bookingBody,
		user_id: IdIn.optional().describe(
			'Create the booking on behalf of this user (id or your own key).',
		),
		webhook: z
			.boolean()
			.optional()
			.describe("Trigger the schedule's webhooks for this booking."),
	})
	.superRefine((value, ctx) => {
		// A schedule is either resource-based (start and finish) or capacity-based
		// (a slot), and a booking that names neither is rejected by SuperSaaS
		// after the call.
		const hasSlot = value.slot_id !== undefined;
		const hasTime = value.start !== undefined || value.finish !== undefined;
		if (!hasSlot && !hasTime) {
			ctx.addIssue({
				code: 'custom',
				path: ['start'],
				message:
					'Send start and finish for a resource schedule, or slot_id for a capacity schedule.',
			});
		}
		if (hasSlot && (value.start !== undefined || value.finish !== undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['slot_id'],
				message:
					'A capacity booking takes slot_id instead of start and finish, not both.',
			});
		}
	});

export type BookingsCreateInput = z.input<typeof BookingsCreateInputSchema>;

const BookingsCreateResponseSchema = CreatedSchema;

export type BookingsCreateResponse = z.infer<
	typeof BookingsCreateResponseSchema
>;

const BookingTargetSchema = z.object({
	schedule_id: ScheduleId,
	booking_id: IdIn,
});

export type BookingTargetInput = z.input<typeof BookingTargetSchema>;

const BookingsGetResponseSchema = BookingSchema;

export type BookingsGetResponse = z.infer<typeof BookingsGetResponseSchema>;

const BookingsUpdateInputSchema = z.object({
	...bookingBody,
	booking_id: IdIn,
});

export type BookingsUpdateInput = z.input<typeof BookingsUpdateInputSchema>;

const BookingsUpdateResponseSchema = UpdatedSchema;

export type BookingsUpdateResponse = z.infer<
	typeof BookingsUpdateResponseSchema
>;

// ── slots ─────────────────────────────────────────────────────────────────

const SlotsListInputSchema = z.object({
	schedule_id: ScheduleId,
	from: LocalDateTime.optional().describe(
		'Slots from this time (sent as start).',
	),
	to: LocalDateTime.optional().describe(
		'Slots up to this time (sent as finish).',
	),
	limit: z
		.number()
		.int()
		.min(1)
		.max(2500)
		.optional()
		.describe('Records to return, default 100, max 2500.'),
	offset: z.number().int().min(0).optional().describe('Records to skip.'),
});

export type SlotsListInput = z.input<typeof SlotsListInputSchema>;

const SlotsListResponseSchema = z.array(SlotSchema);

export type SlotsListResponse = z.infer<typeof SlotsListResponseSchema>;

const slotBody = {
	schedule_id: ScheduleId,
	start: LocalDateTime,
	finish: LocalDateTime,
	title: z.string().optional(),
	description: z.string().max(2000).optional(),
	location: z.string().optional(),
	capacity: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Bookings the slot takes; 0 closes it.'),
	price: z.union([z.number(), z.string()]).optional(),
};

const SlotsCreateInputSchema = z.object(slotBody);

export type SlotsCreateInput = z.input<typeof SlotsCreateInputSchema>;

const SlotsCreateResponseSchema = CreatedSchema;

export type SlotsCreateResponse = z.infer<typeof SlotsCreateResponseSchema>;

const SlotTargetSchema = z.object({
	schedule_id: ScheduleId,
	slot_id: IdIn,
});

export type SlotTargetInput = z.input<typeof SlotTargetSchema>;

const SlotsGetResponseSchema = SlotSchema;

export type SlotsGetResponse = z.infer<typeof SlotsGetResponseSchema>;

const SlotsUpdateInputSchema = z.object({
	schedule_id: ScheduleId,
	slot_id: IdIn,
	start: LocalDateTime.optional(),
	finish: LocalDateTime.optional(),
	title: slotBody.title,
	description: slotBody.description,
	location: slotBody.location,
	capacity: slotBody.capacity,
	price: slotBody.price,
});

export type SlotsUpdateInput = z.input<typeof SlotsUpdateInputSchema>;

const SlotsUpdateResponseSchema = UpdatedSchema;

export type SlotsUpdateResponse = z.infer<typeof SlotsUpdateResponseSchema>;

// ── schedule reads ────────────────────────────────────────────────────────

const scheduleReadPaging = {
	limit: z.number().int().min(1).optional().describe('Records to return.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Records to skip, to read past a full page.'),
	slot: z
		.boolean()
		.optional()
		.describe('Group the answer by slot (capacity schedules).'),
};

const ScheduleChangesInputSchema = z.object({
	schedule_id: ScheduleId,
	from: z
		.string()
		.optional()
		.describe(
			'Only changes after this UTC time (YYYY-MM-DD HH:MM:SS), not the schedule timezone. Omitted shows the ten most recent.',
		),
	to: z
		.string()
		.optional()
		.describe('Only changes before this UTC time (YYYY-MM-DD HH:MM:SS).'),
	...scheduleReadPaging,
});

export type ScheduleChangesInput = z.input<typeof ScheduleChangesInputSchema>;

const ScheduleChangesResponseSchema = ScheduleReadSchema;

export type ScheduleChangesResponse = z.infer<
	typeof ScheduleChangesResponseSchema
>;

const ScheduleRangeInputSchema = z.object({
	schedule_id: ScheduleId,
	from: LocalDateTime.optional().describe(
		'Appointments starting at or after this.',
	),
	to: LocalDateTime.optional().describe('Appointments starting before this.'),
	...scheduleReadPaging,
});

export type ScheduleRangeInput = z.input<typeof ScheduleRangeInputSchema>;

const ScheduleRangeResponseSchema = ScheduleReadSchema;

export type ScheduleRangeResponse = z.infer<typeof ScheduleRangeResponseSchema>;

/**
 * The agenda lists one user's appointments. `schedule_id` is optional here but
 * `account` is then required, which the endpoint fills from the credentials.
 */
const ScheduleAgendaInputSchema = z.object({
	schedule_id: ScheduleId.optional(),
	user: z
		.string()
		.describe("The user's name or id, or 0 for the administrator."),
	from: LocalDateTime.optional(),
});

export type ScheduleAgendaInput = z.input<typeof ScheduleAgendaInputSchema>;

const ScheduleAgendaResponseSchema = ScheduleReadSchema;

export type ScheduleAgendaResponse = z.infer<
	typeof ScheduleAgendaResponseSchema
>;

const ScheduleFreeInputSchema = z.object({
	schedule_id: ScheduleId,
	from: LocalDateTime.describe(
		'Return free spaces that occur after this time.',
	),
	maxresults: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Spaces to return, default 10.'),
});

export type ScheduleFreeInput = z.input<typeof ScheduleFreeInputSchema>;

const ScheduleFreeResponseSchema = ScheduleReadSchema;

export type ScheduleFreeResponse = z.infer<typeof ScheduleFreeResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SupersaasEndpointInputs = {
	usersList: UsersListInput;
	usersGet: UserTargetInput;
	usersCreate: UsersCreateInput;
	usersCreateWithKey: UsersCreateWithKeyInput;
	usersUpdate: UsersUpdateInput;
	usersDelete: UserTargetInput;
	bookingsList: BookingsListInput;
	bookingsGet: BookingTargetInput;
	bookingsCreate: BookingsCreateInput;
	bookingsUpdate: BookingsUpdateInput;
	bookingsDelete: BookingTargetInput;
	slotsList: SlotsListInput;
	slotsGet: SlotTargetInput;
	slotsCreate: SlotsCreateInput;
	slotsUpdate: SlotsUpdateInput;
	slotsDelete: SlotTargetInput;
	scheduleChanges: ScheduleChangesInput;
	scheduleRange: ScheduleRangeInput;
	scheduleAgenda: ScheduleAgendaInput;
	scheduleFree: ScheduleFreeInput;
};

export type SupersaasEndpointOutputs = {
	usersList: UsersListResponse;
	usersGet: UsersGetResponse;
	usersCreate: UsersCreateResponse;
	usersCreateWithKey: UsersCreateWithKeyResponse;
	usersUpdate: SupersaasUpdated;
	usersDelete: SupersaasDeleted;
	bookingsList: BookingsListResponse;
	bookingsGet: BookingsGetResponse;
	bookingsCreate: BookingsCreateResponse;
	bookingsUpdate: SupersaasUpdated;
	bookingsDelete: SupersaasDeleted;
	slotsList: SlotsListResponse;
	slotsGet: SlotsGetResponse;
	slotsCreate: SlotsCreateResponse;
	slotsUpdate: SupersaasUpdated;
	slotsDelete: SupersaasDeleted;
	scheduleChanges: ScheduleChangesResponse;
	scheduleRange: ScheduleRangeResponse;
	scheduleAgenda: ScheduleAgendaResponse;
	scheduleFree: ScheduleFreeResponse;
};

const UsersCreateResponseSchema = CreatedSchema;
/**
 * A new key answers 201 with a Location header; a key that already exists turns
 * the call into an update, which answers an empty 200 with no Location.
 */
const UsersCreateWithKeyResponseSchema = z.union([
	CreatedSchema,
	UpdatedSchema,
]);

export type UsersCreateResponse = z.infer<typeof UsersCreateResponseSchema>;
export type UsersCreateWithKeyResponse = z.infer<
	typeof UsersCreateWithKeyResponseSchema
>;

export const SupersaasEndpointInputSchemas = {
	usersList: UsersListInputSchema,
	usersGet: UserTargetSchema,
	usersCreate: UsersCreateInputSchema,
	usersCreateWithKey: UsersCreateWithKeyInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	usersDelete: UserTargetSchema,
	bookingsList: BookingsListInputSchema,
	bookingsGet: BookingTargetSchema,
	bookingsCreate: BookingsCreateInputSchema,
	bookingsUpdate: BookingsUpdateInputSchema,
	bookingsDelete: BookingTargetSchema,
	slotsList: SlotsListInputSchema,
	slotsGet: SlotTargetSchema,
	slotsCreate: SlotsCreateInputSchema,
	slotsUpdate: SlotsUpdateInputSchema,
	slotsDelete: SlotTargetSchema,
	scheduleChanges: ScheduleChangesInputSchema,
	scheduleRange: ScheduleRangeInputSchema,
	scheduleAgenda: ScheduleAgendaInputSchema,
	scheduleFree: ScheduleFreeInputSchema,
} as const;

export const SupersaasEndpointOutputSchemas = {
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersCreate: UsersCreateResponseSchema,
	usersCreateWithKey: UsersCreateWithKeyResponseSchema,
	usersUpdate: UsersUpdateResponseSchema,
	usersDelete: DeletedSchema,
	bookingsList: BookingsListResponseSchema,
	bookingsGet: BookingsGetResponseSchema,
	bookingsCreate: BookingsCreateResponseSchema,
	bookingsUpdate: BookingsUpdateResponseSchema,
	bookingsDelete: DeletedSchema,
	slotsList: SlotsListResponseSchema,
	slotsGet: SlotsGetResponseSchema,
	slotsCreate: SlotsCreateResponseSchema,
	slotsUpdate: SlotsUpdateResponseSchema,
	slotsDelete: DeletedSchema,
	scheduleChanges: ScheduleChangesResponseSchema,
	scheduleRange: ScheduleRangeResponseSchema,
	scheduleAgenda: ScheduleAgendaResponseSchema,
	scheduleFree: ScheduleFreeResponseSchema,
} as const;
