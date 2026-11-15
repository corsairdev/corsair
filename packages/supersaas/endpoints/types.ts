import { z } from 'zod';

/**
 * SuperSaaS's own names are used throughout. Outputs are `.loose()` and their
 * optional fields `.nullish()` so a field SuperSaaS adds or omits cannot fail a
 * read that already succeeded.
 *
 * A wrapped document is required only on write: SuperSaaS wants `{ user: {...} }`,
 * `{ booking: {...} }` or `{ slot: {...} }`, and the endpoints build that
 * wrapper. Reads answer the bare record or a bare array.
 *
 * Contract: https://www.supersaas.com/info/dev/user_api and /appointment_api
 */

// ── Shared pieces ─────────────────────────────────────────────────────────

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
		id: z.string().nullish(),
		fk: z.string().nullish().describe('Your own key, when you supplied one.'),
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
		credit: z.string().nullish(),
		role: z.number().nullish().describe('3 regular, 4 superuser, -1 blocked.'),
		group: z.number().nullish(),
		created_on: z.string().nullish(),
		last_login: z.string().nullish(),
	})
	.loose();

export type SupersaasUser = z.infer<typeof UserSchema>;

/** A booking. Its fields are set per schedule, so most are optional here. */
const BookingSchema = z
	.object({
		id: z.string().nullish(),
		start: LocalDateTime.nullish(),
		finish: LocalDateTime.nullish(),
		created_on: z.string().nullish(),
		updated_on: z.string().nullish(),
		user_id: z.string().nullish(),
		user_name: z.string().nullish(),
		full_name: z.string().nullish(),
		email: z.string().nullish(),
		address: z.string().nullish(),
		mobile: z.string().nullish(),
		phone: z.string().nullish(),
		country: z.string().nullish(),
		resource_id: z.string().nullish(),
		resource_name: z.string().nullish(),
		slot_id: z.string().nullish(),
		lat: z.number().nullish(),
		long: z.number().nullish(),
		field_1: z.string().nullish(),
		field_2: z.string().nullish(),
		field_1_r: z.string().nullish(),
		field_2_r: z.string().nullish(),
		super_field: z.string().nullish(),
		form_id: z.string().nullish(),
	})
	.loose();

export type SupersaasBooking = z.infer<typeof BookingSchema>;

/** A slot, which exists only on a capacity-type schedule. */
const SlotSchema = z
	.object({
		id: z.string().nullish(),
		start: LocalDateTime.nullish(),
		finish: LocalDateTime.nullish(),
		created_on: z.string().nullish(),
		updated_on: z.string().nullish(),
		booked: z.number().nullish(),
		capacity: z.number().nullish(),
		resource_id: z.string().nullish(),
		resource_name: z.string().nullish(),
	})
	.loose();

export type SupersaasSlot = z.infer<typeof SlotSchema>;

/**
 * A change record from `/changes`: the same object the booking or slot route
 * returns, plus a `type` naming what happened. It is kept loose because a
 * change can be either kind.
 */
const ChangeSchema = z
	.object({
		type: z
			.string()
			.nullish()
			.describe('What changed, such as booking or slot.'),
		id: z.string().nullish(),
		start: LocalDateTime.nullish(),
		finish: LocalDateTime.nullish(),
		updated_on: z.string().nullish(),
	})
	.loose();

export type SupersaasChange = z.infer<typeof ChangeSchema>;

/** A free-space entry from `/free`. */
const FreeSpaceSchema = z
	.object({
		start: LocalDateTime.nullish(),
		finish: LocalDateTime.nullish(),
		resource_id: z.string().nullish(),
		resource_name: z.string().nullish(),
	})
	.loose();

export type SupersaasFreeSpace = z.infer<typeof FreeSpaceSchema>;

// ── users ─────────────────────────────────────────────────────────────────

const UsersListInputSchema = z.object({ ...paging });

export type UsersListInput = z.infer<typeof UsersListInputSchema>;

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

export type UsersCreateInput = z.infer<typeof UsersCreateInputSchema>;

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

export type UsersCreateWithKeyInput = z.infer<
	typeof UsersCreateWithKeyInputSchema
>;

const UserTargetSchema = z.object({ id: UserId });

export type UserTargetInput = z.infer<typeof UserTargetSchema>;

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

export type UsersUpdateInput = z.infer<typeof UsersUpdateInputSchema>;

const UsersUpdateResponseSchema = UserSchema;

export type UsersUpdateResponse = z.infer<typeof UsersUpdateResponseSchema>;

/** A delete answers 200 with no body, so the result records the id. */
const DeletedSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type SupersaasDeleted = z.infer<typeof DeletedSchema>;

// ── bookings ──────────────────────────────────────────────────────────────

const ScheduleTargetSchema = z.object({
	schedule_id: z
		.number()
		.int()
		.describe(
			'The schedule id, the number at the end of the Configure Overview URL.',
		),
});

export type ScheduleTargetInput = z.infer<typeof ScheduleTargetSchema>;

const BookingsListInputSchema = z.object({
	schedule_id: z.number().int(),
	user_id: z.string().optional(),
	slot_id: z.string().optional(),
	/** SuperSaaS pages bookings by a `from` time rather than by offset. */
	from: LocalDateTime.optional(),
});

export type BookingsListInput = z.infer<typeof BookingsListInputSchema>;

const BookingsListResponseSchema = z.array(BookingSchema);

export type BookingsListResponse = z.infer<typeof BookingsListResponseSchema>;

/**
 * A booking belongs to a schedule, and its required fields are set per schedule
 * in the SuperSaaS UI. A resource schedule needs `start` and `finish`; a capacity
 * schedule needs `slot_id` instead. The schema accepts either and rejects
 * sending a slot id on a resource booking's fields at once.
 */
const bookingBody = {
	schedule_id: z.number().int(),
	start: LocalDateTime.optional(),
	finish: LocalDateTime.optional(),
	slot_id: z.string().optional(),
	resource_id: z.string().optional(),
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
	webhook: z.boolean().optional(),
};

const BookingsCreateInputSchema = z
	.object({
		...bookingBody,
		user_id: z
			.string()
			.optional()
			.describe('Create the booking on behalf of this user.'),
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

export type BookingsCreateInput = z.infer<typeof BookingsCreateInputSchema>;

/** A booking create also answers 201 with an empty body and a Location header. */
const BookingsCreateResponseSchema = createdSchema(z.string());

export type BookingsCreateResponse = z.infer<
	typeof BookingsCreateResponseSchema
>;

const BookingTargetSchema = z.object({
	booking_id: z.string().min(1),
});

export type BookingTargetInput = z.infer<typeof BookingTargetSchema>;

const BookingsGetResponseSchema = BookingSchema;

export type BookingsGetResponse = z.infer<typeof BookingsGetResponseSchema>;

const BookingsUpdateInputSchema = z.object({
	booking_id: z.string().min(1),
	...bookingBody,
});

export type BookingsUpdateInput = z.infer<typeof BookingsUpdateInputSchema>;

const BookingsUpdateResponseSchema = BookingSchema;

export type BookingsUpdateResponse = z.infer<
	typeof BookingsUpdateResponseSchema
>;

// ── slots ─────────────────────────────────────────────────────────────────

const SlotsListInputSchema = z.object({
	schedule_id: z.number().int(),
	from: LocalDateTime.optional(),
	to: LocalDateTime.optional(),
});

export type SlotsListInput = z.infer<typeof SlotsListInputSchema>;

const SlotsListResponseSchema = z.array(SlotSchema);

export type SlotsListResponse = z.infer<typeof SlotsListResponseSchema>;

const slotBody = {
	schedule_id: z.number().int(),
	start: LocalDateTime,
	finish: LocalDateTime,
	capacity: z.number().int().min(1).optional(),
	resource_id: z.string().optional(),
};

const SlotsCreateInputSchema = z.object(slotBody);

export type SlotsCreateInput = z.infer<typeof SlotsCreateInputSchema>;

/** A slot create also answers 201 with an empty body and a Location header. */
const SlotsCreateResponseSchema = createdSchema(z.string());

export type SlotsCreateResponse = z.infer<typeof SlotsCreateResponseSchema>;

const SlotTargetSchema = z.object({ slot_id: z.string().min(1) });

export type SlotTargetInput = z.infer<typeof SlotTargetSchema>;

const SlotsGetResponseSchema = SlotSchema;

export type SlotsGetResponse = z.infer<typeof SlotsGetResponseSchema>;

const SlotsUpdateInputSchema = z.object({
	slot_id: z.string().min(1),
	...slotBody,
});

export type SlotsUpdateInput = z.infer<typeof SlotsUpdateInputSchema>;

const SlotsUpdateResponseSchema = SlotSchema;

export type SlotsUpdateResponse = z.infer<typeof SlotsUpdateResponseSchema>;

// ── schedule reads ────────────────────────────────────────────────────────

const ScheduleChangesInputSchema = z.object({
	schedule_id: z.number().int(),
	from: LocalDateTime.optional().describe(
		'Only changes after this time. Omitted shows the ten most recent.',
	),
});

export type ScheduleChangesInput = z.infer<typeof ScheduleChangesInputSchema>;

const ScheduleChangesResponseSchema = z.array(ChangeSchema);

export type ScheduleChangesResponse = z.infer<
	typeof ScheduleChangesResponseSchema
>;

const ScheduleRangeInputSchema = z.object({
	schedule_id: z.number().int(),
	from: LocalDateTime.optional().describe(
		'Appointments starting at or after this.',
	),
	to: LocalDateTime.optional().describe('Appointments starting before this.'),
});

export type ScheduleRangeInput = z.infer<typeof ScheduleRangeInputSchema>;

const ScheduleRangeResponseSchema = z.array(BookingSchema);

export type ScheduleRangeResponse = z.infer<typeof ScheduleRangeResponseSchema>;

/**
 * The agenda lists one user's appointments. `schedule_id` is optional here but
 * `account` is then required, which the endpoint fills from the credentials.
 */
const ScheduleAgendaInputSchema = z.object({
	schedule_id: z.number().int().optional(),
	user: z
		.string()
		.describe("The user's name or id, or 0 for the administrator."),
	from: LocalDateTime.optional(),
});

export type ScheduleAgendaInput = z.infer<typeof ScheduleAgendaInputSchema>;

const ScheduleAgendaResponseSchema = z.array(BookingSchema);

export type ScheduleAgendaResponse = z.infer<
	typeof ScheduleAgendaResponseSchema
>;

const ScheduleFreeInputSchema = z.object({
	schedule_id: z.number().int(),
	from: LocalDateTime.describe(
		'Return free spaces that occur after this time.',
	),
});

export type ScheduleFreeInput = z.infer<typeof ScheduleFreeInputSchema>;

const ScheduleFreeResponseSchema = z.array(FreeSpaceSchema);

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
	usersUpdate: UsersUpdateResponse;
	usersDelete: SupersaasDeleted;
	bookingsList: BookingsListResponse;
	bookingsGet: BookingsGetResponse;
	bookingsCreate: BookingsCreateResponse;
	bookingsUpdate: BookingsUpdateResponse;
	bookingsDelete: SupersaasDeleted;
	slotsList: SlotsListResponse;
	slotsGet: SlotsGetResponse;
	slotsCreate: SlotsCreateResponse;
	slotsUpdate: SlotsUpdateResponse;
	slotsDelete: SupersaasDeleted;
	scheduleChanges: ScheduleChangesResponse;
	scheduleRange: ScheduleRangeResponse;
	scheduleAgenda: ScheduleAgendaResponse;
	scheduleFree: ScheduleFreeResponse;
};

/**
 * A create answers 201 with an **empty body**: SuperSaaS puts the new id only in
 * a `Location` header, which core's client cannot return alongside the body. The
 * result therefore says what was created and echoes the key the caller supplied,
 * and a read is needed to see the stored record.
 */
function createdSchema<Key extends z.ZodType>(key: Key) {
	return z.object({
		created: z.literal(true),
		/** The key the caller supplied, or the record's login name. */
		key,
		/** The id may be absent, because it lived in the Location header. */
		id: z
			.string()
			.optional()
			.describe(
				'Present only when SuperSaaS answered a body; the id otherwise arrives in a Location header this client cannot read.',
			),
	});
}

const UsersCreateResponseSchema = createdSchema(z.string());
const UsersCreateWithKeyResponseSchema = createdSchema(z.string());

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
