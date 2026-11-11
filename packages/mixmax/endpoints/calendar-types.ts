import { z } from 'zod';

// Calendar links, meeting types, and meeting invites
// (developer.mixmax.com/reference, Calendar section). Field names, types, and
// limits mirror the official AppointmentLink, MeetingTypeWrite,
// MeetingTypeDay, MeetingType and MeetingInvite schemas.

// The official pattern for calendar link names: only lowercase letters,
// digits, `-`, `.`, `~` and `_`, up to 255 characters. Enforced up front
// because the provider rejects anything else with a 400.
const AppointmentLinkNameSchema = z.string().regex(/^[a-z0-9\-.~_]{1,255}$/);

// Your Mixmax Calendar link, the last part of `https://cal.mixmax.com/<name>`.
// The official AppointmentLink schema declares both fields without requiring
// them, so they stay optional and the document stays passthrough.
export const AppointmentLinkSchema = z
	.object({
		userId: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();

export type AppointmentLink = z.infer<typeof AppointmentLinkSchema>;

// GET /v1/appointmentlinks checks whether a link name is already in use.
export const AppointmentLinksListInputSchema = z.object({
	// The exact name to check; the match is case-sensitive and exact.
	name: AppointmentLinkNameSchema,
});

export type AppointmentLinksListInput = z.infer<
	typeof AppointmentLinksListInputSchema
>;

// One `{ name }` entry when the name is taken, an empty array when it is
// free. The official item schema documents only `name` and the documented
// response always carries it, so it is required here; the item stays
// passthrough because the provider may attach more detail later.
export const AppointmentLinksListOutputSchema = z.array(
	z
		.object({
			name: z.string(),
		})
		.passthrough(),
);

export type AppointmentLinksListOutput = z.infer<
	typeof AppointmentLinksListOutputSchema
>;

export const AppointmentLinksGetMeInputSchema = z.object({});

export type AppointmentLinksGetMeInput = z.infer<
	typeof AppointmentLinksGetMeInputSchema
>;

// GET /v1/appointmentlinks/me answers 200 with your link, creating one when
// you had none.
export const AppointmentLinksGetMeOutputSchema = AppointmentLinkSchema;

export type AppointmentLinksGetMeOutput = z.infer<
	typeof AppointmentLinksGetMeOutputSchema
>;

// PATCH /v1/appointmentlinks/me requires the new name; a request without one
// fails with `Parameter "name" required`.
export const AppointmentLinksUpdateMeInputSchema = z.object({
	name: AppointmentLinkNameSchema,
});

export type AppointmentLinksUpdateMeInput = z.infer<
	typeof AppointmentLinksUpdateMeInputSchema
>;

// PATCH /v1/appointmentlinks/me answers 204 with no body.
export const AppointmentLinksUpdateMeOutputSchema = z.undefined();

export type AppointmentLinksUpdateMeOutput = z.infer<
	typeof AppointmentLinksUpdateMeOutputSchema
>;

// Availability on one weekday, where `day0` is Sunday. The official schema
// leaves extra properties allowed, so the object stays passthrough.
export const MeetingTypeDaySchema = z
	.object({
		enabled: z.boolean().optional(),
		timeslots: z
			.array(
				z
					.object({
						startTime: z.string().optional(),
						endTime: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

export type MeetingTypeDay = z.infer<typeof MeetingTypeDaySchema>;

// The write fields of a meeting type. Create needs every documented field
// (see MeetingTypesCreateInputSchema); update takes any subset. Every field
// stays optional here and the object passthrough because the official schema
// leaves extra properties allowed and Mixmax keeps adding booking options.
export const MeetingTypeWriteSchema = z
	.object({
		name: z.string().optional(),
		// The booking link's last part. Letters, numbers and URL-safe
		// characters only.
		link: z.string().optional(),
		// Meeting length in minutes.
		durationMin: z.number().int().optional(),
		// `Personal` allows one calendar; `Round Robin` rotates between
		// several.
		type: z.enum(['Personal', 'Round Robin']).optional(),
		calendarIds: z.array(z.string()).optional(),
		// How far ahead people can book, as a `start` and `end` from 0 to 60
		// with a `unit`; the provider declares the object without fixed
		// properties.
		daysFromNow: z.object({}).passthrough().optional(),
		day0: MeetingTypeDaySchema.optional(),
		day1: MeetingTypeDaySchema.optional(),
		day2: MeetingTypeDaySchema.optional(),
		day3: MeetingTypeDaySchema.optional(),
		day4: MeetingTypeDaySchema.optional(),
		day5: MeetingTypeDaySchema.optional(),
		day6: MeetingTypeDaySchema.optional(),
		// Minutes kept free around each meeting, 0 to 60.
		buffer: z.number().int().optional(),
		// The minimum notice, as a `value` from 0 to 999 and a `unit` of
		// `minutes`, `hours`, `days` or `weekdays`; the provider declares the
		// object without fixed properties.
		minNoticeDuration: z.object({}).passthrough().optional(),
		// Ids of more calendars to check for conflicts.
		preventDoubleBooking: z.array(z.string()).optional(),
		// Default title, location and description for booked meetings.
		defaults: z.object({}).passthrough().optional(),
		defaultGuests: z.array(z.object({}).passthrough()).optional(),
		// Extra questions on the booking page.
		customFields: z.array(z.object({}).passthrough()).optional(),
		// The rotation order of a `Round Robin` type, as indexes into
		// `calendarIds`.
		roundRobinQueue: z.array(z.number().int()).optional(),
		includeMessagePermaLink: z.boolean().optional(),
		guestsCanModifyInvites: z.boolean().optional(),
		roomsAndResources: z.array(z.object({}).passthrough()).optional(),
		// Building ids; when set, Mixmax books any free room in the first
		// building.
		anyRoomInBuilding: z.array(z.string()).optional(),
		// The provider declares this object without fixed properties.
		integrations: z.object({}).passthrough().optional(),
		reducedInterval: z.boolean().optional(),
		ruleIds: z.array(z.string()).optional(),
		// `true` to offer times between the dates in `setDateRange` instead of
		// `daysFromNow`.
		useSpecificDates: z.boolean().optional(),
		// With `useSpecificDates`, the first and last bookable day, in
		// milliseconds since the epoch.
		setDateRange: z
			.object({
				startDate: z.number(),
				endDate: z.number(),
			})
			.optional(),
		pageTitle: z.string().optional(),
	})
	.passthrough();

export type MeetingTypeWrite = z.infer<typeof MeetingTypeWriteSchema>;

// A stored meeting type: the write fields plus the provider-managed ones.
// Documented fields stay optional and the document passthrough because the
// provider omits fields that do not apply (`copyOf` and `copies` only exist
// on copied meeting types).
export const MeetingTypeSchema = MeetingTypeWriteSchema.extend({
	_id: z.string().optional(),
	// `Personal` or `Round Robin` today. The write schema keeps the enum;
	// responses take any string so a type Mixmax adds later does not fail
	// every list of meeting templates.
	type: z.string().optional(),
	userId: z.string().optional(),
	// The `_id` of the meeting type this one was copied from, or `null`.
	copyOf: z.string().nullable().optional(),
	// ISO 8601 date-time strings.
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	// Only with `expand=copies`: user ids mapped to when their latest copy
	// was made.
	copies: z.record(z.string(), z.string()).optional(),
});

export type MeetingType = z.infer<typeof MeetingTypeSchema>;

export const MeetingTypesListInputSchema = z.object({
	// `mine` for your own meeting types, `shared` for those shared with you.
	access: z.enum(['mine', 'shared']).optional(),
	// How many meeting types per page.
	limit: z.coerce.number().int().optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
});

export type MeetingTypesListInput = z.infer<typeof MeetingTypesListInputSchema>;

export const MeetingTypesListOutputSchema = z.object({
	results: z.array(MeetingTypeSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type MeetingTypesListOutput = z.infer<
	typeof MeetingTypesListOutputSchema
>;

// POST /v1/meetingtypes. The official body is a MeetingTypeWrite allOf with
// every documented field required plus `userId`, so the required subset is
// pinned here; the remaining fields (`minNoticeDuration`, `useSpecificDates`,
// `setDateRange`, `pageTitle`) stay optional exactly as documented.
export const MeetingTypesCreateInputSchema = MeetingTypeWriteSchema.extend({
	// Who the meeting type is for. Use your own `_id`.
	userId: z.string().min(1),
	name: z.string(),
	link: z.string(),
	durationMin: z.number().int(),
	type: z.enum(['Personal', 'Round Robin']),
	calendarIds: z.array(z.string()),
	daysFromNow: z.object({}).passthrough(),
	day0: MeetingTypeDaySchema,
	day1: MeetingTypeDaySchema,
	day2: MeetingTypeDaySchema,
	day3: MeetingTypeDaySchema,
	day4: MeetingTypeDaySchema,
	day5: MeetingTypeDaySchema,
	day6: MeetingTypeDaySchema,
	// Minutes kept free around each meeting, 0 to 60.
	buffer: z.number().int(),
	preventDoubleBooking: z.array(z.string()),
	defaults: z.object({}).passthrough(),
	defaultGuests: z.array(z.object({}).passthrough()),
	customFields: z.array(z.object({}).passthrough()),
	roundRobinQueue: z.array(z.number().int()),
	includeMessagePermaLink: z.boolean(),
	guestsCanModifyInvites: z.boolean(),
	roomsAndResources: z.array(z.object({}).passthrough()),
	anyRoomInBuilding: z.array(z.string()),
	integrations: z.object({}).passthrough(),
	reducedInterval: z.boolean(),
	ruleIds: z.array(z.string()),
});

export type MeetingTypesCreateInput = z.infer<
	typeof MeetingTypesCreateInputSchema
>;

// POST /v1/meetingtypes answers 200 with the new meeting type.
export const MeetingTypesCreateOutputSchema = MeetingTypeSchema;

export type MeetingTypesCreateOutput = z.infer<
	typeof MeetingTypesCreateOutputSchema
>;

export const MeetingTypesGetInputSchema = z.object({
	id: z.string().min(1),
	// `copies` adds `copies`, the users who have a copy of this meeting type.
	expand: z.enum(['copies']).optional(),
});

export type MeetingTypesGetInput = z.infer<typeof MeetingTypesGetInputSchema>;

export const MeetingTypesGetOutputSchema = MeetingTypeSchema;

export type MeetingTypesGetOutput = z.infer<typeof MeetingTypesGetOutputSchema>;

export const MeetingTypesUpdateInputSchema = MeetingTypeWriteSchema.extend({
	id: z.string().min(1),
});

export type MeetingTypesUpdateInput = z.infer<
	typeof MeetingTypesUpdateInputSchema
>;

// PATCH /v1/meetingtypes/{id} answers 200 with the meeting type's `_id`, the
// fields you changed and `updatedAt` — not the whole meeting type — so the
// shape varies with the request and only the open object is validated.
export const MeetingTypesUpdateOutputSchema = z.object({}).passthrough();

export type MeetingTypesUpdateOutput = z.infer<
	typeof MeetingTypesUpdateOutputSchema
>;

export const MeetingTypesDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type MeetingTypesDeleteInput = z.infer<
	typeof MeetingTypesDeleteInputSchema
>;

// DELETE /v1/meetingtypes/{id} answers 204 with no body.
export const MeetingTypesDeleteOutputSchema = z.undefined();

export type MeetingTypesDeleteOutput = z.infer<
	typeof MeetingTypesDeleteOutputSchema
>;

// A meeting invite you sent: an email where you offered times to meet. Times
// are Unix milliseconds. Documented fields stay optional and the document
// passthrough because the provider adds booking detail it does not pin down.
export const MeetingInviteSchema = z
	.object({
		_id: z.string().optional(),
		// The host, you.
		userId: z.string().optional(),
		creationDate: z.number().int().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		location: z.string().optional(),
		timezone: z.string().optional(),
		// The language of the booking page.
		lng: z.string().optional(),
		calendarId: z.string().optional(),
		calendarName: z.string().optional(),
		// The times offered. A booked slot has the meeting in `events`.
		timeslots: z
			.array(
				z
					.object({
						start: z.number().int().optional(),
						end: z.number().int().optional(),
						// Booked meeting detail; the provider declares the event
						// objects without fixed properties.
						events: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		guestsCanModify: z.boolean().optional(),
		allowDoubleBookings: z.boolean().optional(),
		additionalGuests: z.array(z.object({}).passthrough()).optional(),
		roomsAndResources: z.array(z.object({}).passthrough()).optional(),
		// The provider declares this object without fixed properties.
		anyRoomInBuilding: z.object({}).passthrough().optional(),
		includeMessagePermaLink: z.boolean().optional(),
	})
	.passthrough();

export type MeetingInvite = z.infer<typeof MeetingInviteSchema>;

export const MeetingInvitesListInputSchema = z.object({
	// How many invites per page. Defaults to 50, at most 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type MeetingInvitesListInput = z.infer<
	typeof MeetingInvitesListInputSchema
>;

export const MeetingInvitesListOutputSchema = z.object({
	results: z.array(MeetingInviteSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type MeetingInvitesListOutput = z.infer<
	typeof MeetingInvitesListOutputSchema
>;

export const MeetingInvitesGetInputSchema = z.object({
	id: z.string().min(1),
});

export type MeetingInvitesGetInput = z.infer<
	typeof MeetingInvitesGetInputSchema
>;

export const MeetingInvitesGetOutputSchema = MeetingInviteSchema;

export type MeetingInvitesGetOutput = z.infer<
	typeof MeetingInvitesGetOutputSchema
>;
