import { z } from 'zod';
import { AccountId, NoContentSchema } from './shared';

// Generated from the per-operation OpenAPI definitions in Unipile's v2
// reference (API 2.62). Inputs follow the spec field for field; outputs
// type two levels of each response and pass the rest through.

const CalendarEventsCreateShape1 = z
	.object({
		provider: z
			.string()
			.describe(
				'The conference provider. - `google_meet` is a Google Meet conference. - `zoom` is a Zoom conference. - `skype` is a Skype conference.',
			),
		hosting: z
			.string()
			.describe(
				'How the conference is attached to the event. - `native`: hosted by the calendar provider (Microsoft Teams or Skype on Outlook, Google Meet on Google).',
			),
		conference_id: z
			.string()
			.nullish()
			.describe('The conference identifier assigned by its provider.'),
		url: z.string().describe('The URL used to join the conference.'),
	})
	.loose();

const CalendarEventsCreateShape2 = z
	.object({
		type: z.string().nullish().describe('Indicates a date-time value.'),
		date_time: z
			.string()
			.nullish()
			.describe(
				'The date and time. May include a UTC offset, or be expressed as a local date and time without an offset (e.g. `2026-10-08T10:00:00`).',
			),
		timezone: z
			.string()
			.nullish()
			.describe(
				'The IANA timezone in which the date and time is expressed (e.g. `Europe/Paris`). When omitted, uses the event-level timezone if set; otherwise defaults to UTC.',
			),
		date: z
			.string()
			.nullish()
			.describe(
				'The date. Must use a supported date format. See supported date formats.',
			),
	})
	.loose();

const CalendarsCreateShape3 = z
	.object({
		object: z.string(),
		id: z.string().describe('The ID of the calendar.'),
		name: z.string().describe('Name of the calendar.'),
		description: z.string().nullish().describe('Description of the calendar.'),
		is_read_only: z
			.boolean()
			.describe('Indicates if the calendar is read-only or not.'),
		is_owned_by_user: z
			.boolean()
			.describe('Indicates if the user owns this calendar.'),
		is_default: z
			.boolean()
			.describe('Indicates if this is the primary calendar of the user.'),
		background_color: z
			.string()
			.describe('Background color of the calendar in hexadecimal format.'),
		text_color: z
			.string()
			.nullish()
			.describe('Foreground color of the calendar in hexadecimal format.'),
		timezone: z.string().nullish().describe('Timezone used in this calendar.'),
		specifics: z
			.unknown()
			.nullish()
			.describe('Object containing provider-specific calendar data.'),
	})
	.loose();

const CalendarEventsCreateShape4 = z
	.object({
		object: z.string(),
		id: z.string().describe('The ID of the calendar event.'),
		master_event_id: z
			.string()
			.nullish()
			.describe('If event instance, the ID of the master event.'),
		calendar_id: z
			.string()
			.describe('The ID of the calendar the event belongs to.'),
		ical_uid: z
			.string()
			.nullish()
			.describe(
				'The iCalendar UID (RFC5545 UID) of the event. Unlike `id`, it is shared by every copy of the event across the calendars of its attendees, and stays stable when…',
			),
		created_at: z
			.string()
			.describe(
				'The date the event was created. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SSZ).',
			),
		updated_at: z
			.string()
			.describe(
				'The date the event was last updated. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
			),
		title: z.string().describe('The title of the event.'),
		body: z.string().nullish().describe('The body of the event.'),
		location: z.string().nullish().describe('The location of the event.'),
		is_cancelled: z.boolean().describe('Is the event cancelled.'),
		is_all_day: z.boolean().describe('Is the event all day.'),
		is_attendees_list_hidden: z
			.boolean()
			.describe('Is the attendees list hidden for attendees.'),
		attendees: z
			.array(
				z
					.object({
						email: z.string(),
						display_name: z.string().nullish(),
						comment: z.string().nullish(),
						is_organizer: z.boolean(),
						is_self: z.boolean(),
						is_optional: z.boolean(),
						is_resource: z.boolean(),
						type: z.string(),
						response_status: z.string(),
					})
					.loose(),
			)
			.nullish()
			.describe('The attendees of the event.'),
		start: CalendarEventsCreateShape2.describe(
			'The start date and time of the event.',
		),
		end: CalendarEventsCreateShape2.describe(
			'The end date and time of the event.',
		),
		recurrence: z
			.array(z.string())
			.nullish()
			.describe(
				'List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545.',
			),
		organizer: z
			.object({
				email: z.string().describe('Email address of the organizer.'),
				display_name: z
					.string()
					.nullish()
					.describe('Display name of the organizer.'),
			})
			.loose(),
		conference: CalendarEventsCreateShape1.nullish(),
		visibility: z
			.string()
			.describe(
				'The visibility of the event. - `public` is visible to all. - `private` is visible only to the calendar owner.',
			),
		transparency: z
			.string()
			.describe(
				'The transparency of the event. - `opaque` does block time on the calendar and is equivalent to setting Show me as to Busy in the Calendar UI.',
			),
		event_type: z
			.string()
			.describe(
				'The type of the event (`birthday`, `fromGmail`, `outOfOffice`...)',
			),
		timezone: z
			.string()
			.nullish()
			.describe(
				'The IANA timezone when start and end share the same timezone (e.g. `Europe/Paris`). Omitted when they differ; use `start.timezone` and `end.timezone` instead.',
			),
		background_color: z
			.string()
			.nullish()
			.describe('Background color of the calendar in hexadecimal format.'),
		text_color: z
			.string()
			.nullish()
			.describe('Foreground color of the event in hexadecimal format.'),
		specifics: z
			.unknown()
			.nullish()
			.describe('Object containing provider-specific calendar event data.'),
	})
	.loose();

export const CalendarInputSchemas = {
	calendarsList: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	calendarsCreate: z.object({
		account_id: AccountId,
		name: z.string().describe('Name of the new calendar'),
		description: z.string().optional().describe('Description of the calendar'),
		background_color: z
			.string()
			.optional()
			.describe('Background color of the calendar in hexadecimal format.'),
		timezone: z
			.string()
			.optional()
			.describe('Timezone used in this calendar (IANA, e.g. `Europe/Paris`).'),
	}),
	calendarsGet: z.object({
		calendar_id: z
			.string()
			.min(1)
			.describe('Identifier of the calendar to retrieve'),
		account_id: AccountId,
	}),
	calendarsUpdate: z.object({
		calendar_id: z.string().min(1).describe('ID of the Calendar to update.'),
		account_id: AccountId,
		name: z.string().optional().describe('Name of the new calendar'),
		description: z.string().optional().describe('Description of the calendar'),
		background_color: z
			.string()
			.optional()
			.describe('Background color of the calendar in hexadecimal format.'),
		timezone: z
			.string()
			.optional()
			.describe('Timezone used in this calendar (IANA, e.g. `Europe/Paris`).'),
	}),
	calendarsDelete: z.object({
		calendar_id: z.string().min(1).describe('ID of the calendar to delete.'),
		account_id: AccountId,
	}),
	calendarEventsList: z.object({
		calendar_id: z.string().min(1).describe('Identifier of the calendar.'),
		account_id: AccountId,
		is_cancelled: z.boolean().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		ical_uid: z.string().optional(),
		location: z.string().optional(),
		start: z.string().optional(),
		end: z.string().optional(),
		busy: z.boolean().optional(),
		updated_before: z.string().optional(),
		updated_after: z.string().optional(),
		attendees: z.string().optional(),
		event_type: z.string().optional(),
		expand_recurring: z.boolean().optional(),
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	calendarEventsCreate: z.object({
		calendar_id: z
			.string()
			.min(1)
			.describe('Identifier of the parent calendar.'),
		account_id: AccountId,
		title: z.string().describe('The title of the event.'),
		body: z.string().optional().describe('The body of the event.'),
		location: z.string().optional().describe('The location of the event.'),
		background_color: z
			.string()
			.optional()
			.describe(
				'Background color of the calendar in hexadecimal format. For Google we match the closest palette available',
			),
		transparency: z
			.enum(['opaque', 'transparent'])
			.optional()
			.describe(
				'The transparency of the event. - `opaque` does block time on the calendar and is equivalent to setting Show me as to Busy in the Calendar UI.',
			),
		visibility: z
			.enum(['public', 'private'])
			.optional()
			.describe(
				'The visibility of the event. - `public` is visible to all. - `private` is visible only to the calendar owner.',
			),
		conference: z
			.object({
				provider: z
					.enum(['google_meet', 'zoom', 'skype', 'teams', 'unknown'])
					.describe('The conference provider to generate or attach.'),
				conference_id: z
					.string()
					.optional()
					.describe('The conference identifier assigned by its provider.'),
				url: z
					.string()
					.optional()
					.describe(
						'The URL of an existing conference to attach to the event. Must be an absolute credential-free HTTPS URL. When omitted, conference generation is requested.',
					),
			})
			.optional()
			.describe(
				'A conference to generate or attach to the event. The way the conference is associated with the event may vary depending on the calendar and the selected provider: it can be generated and hosted natively by the provider (e.g.',
			),
		is_attendees_list_hidden: z
			.boolean()
			.optional()
			.describe('Is the attendees list hidden for attendees.'),
		attendees: z.array(
			z.object({
				email: z.string().describe('Email of the attendee.'),
				type: z
					.enum(['required', 'optional'])
					.optional()
					.describe(
						'The type of the attendee. - `required` the attendance of the attendee is required. - `optional` the attendance of the attendee is optional.',
					),
			}),
		),
		recurrence: z
			.array(z.string())
			.optional()
			.describe(
				'List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545.',
			),
		start: z
			.union([
				z.object({
					type: z.enum(['datetime']).describe('Indicates a date-time value.'),
					date_time: z
						.string()
						.describe(
							'The date and time. May include a UTC offset, or be expressed as a local date and time without an offset (e.g. `2026-10-08T10:00:00`).',
						),
					timezone: z
						.string()
						.optional()
						.describe(
							'The IANA timezone in which the date and time is expressed (e.g. `Europe/Paris`). When omitted, uses the event-level timezone if set; otherwise defaults to UTC.',
						),
				}),
				z.object({
					type: z
						.enum(['date'])
						.describe('Indicates a date-only value (for all-day events).'),
					date: z
						.string()
						.describe(
							'The date. Must use a supported date format. See supported date formats.',
						),
					timezone: z
						.string()
						.optional()
						.describe(
							'The IANA timezone in which the date is expressed (e.g. `Europe/Paris`).',
						),
				}),
			])
			.describe(
				'The start date and time of the event. Use date for all day events.',
			),
		end: z
			.union([
				z.object({
					type: z.enum(['datetime']).describe('Indicates a date-time value.'),
					date_time: z
						.string()
						.describe(
							'The date and time. May include a UTC offset, or be expressed as a local date and time without an offset (e.g. `2026-10-08T10:00:00`).',
						),
					timezone: z
						.string()
						.optional()
						.describe(
							'The IANA timezone in which the date and time is expressed (e.g. `Europe/Paris`). When omitted, uses the event-level timezone if set; otherwise defaults to UTC.',
						),
				}),
				z.object({
					type: z
						.enum(['date'])
						.describe('Indicates a date-only value (for all-day events).'),
					date: z
						.string()
						.describe(
							'The date. Must use a supported date format. See supported date formats.',
						),
					timezone: z
						.string()
						.optional()
						.describe(
							'The IANA timezone in which the date is expressed (e.g. `Europe/Paris`).',
						),
				}),
			])
			.describe(
				'The end date and time of the event. Use date for all day events.',
			),
		notify: z
			.enum(['all', 'externalOnly', 'none'])
			.optional()
			.describe(
				"Only available for google, guests to send updates to: - `all`: Notify all guests. - `externalOnly`: Notify only guests not on the calendar's domain. - `none`: Do not notify any guests.",
			),
		timezone: z
			.string()
			.optional()
			.describe(
				'The IANA timezone the event is expressed in (e.g. `Europe/Paris`). Defaults to UTC when omitted.',
			),
	}),
	calendarEventsGet: z.object({
		calendar_id: z
			.string()
			.min(1)
			.describe('Identifier of the parent calendar.'),
		event_id: z.string().min(1).describe('Identifier of the event to retrieve'),
		account_id: AccountId,
	}),
	calendarEventsUpdate: z.object({
		calendar_id: z
			.string()
			.min(1)
			.describe('Identifier of the parent calendar.'),
		event_id: z.string().min(1).describe('ID of the event to update.'),
		account_id: AccountId,
		title: z.string().optional().describe('The title of the event.'),
		body: z.string().optional().describe('The body of the event.'),
		location: z.string().optional().describe('The location of the event.'),
		background_color: z
			.string()
			.optional()
			.describe(
				'Background color of the calendar in hexadecimal format. For Google we match the closest palette available',
			),
		transparency: z
			.enum(['opaque', 'transparent'])
			.optional()
			.describe(
				'The transparency of the event. - `opaque` does block time on the calendar and is equivalent to setting Show me as to Busy in the Calendar UI.',
			),
		visibility: z
			.enum(['public', 'private'])
			.optional()
			.describe(
				'The visibility of the event. - `public` is visible to all. - `private` is visible only to the calendar owner.',
			),
		conference: z
			.object({
				provider: z
					.enum(['google_meet', 'zoom', 'skype', 'teams', 'unknown'])
					.describe('The conference provider to generate or attach.'),
				conference_id: z
					.string()
					.optional()
					.describe('The conference identifier assigned by its provider.'),
				url: z
					.string()
					.optional()
					.describe(
						'The URL of an existing conference to attach to the event. Must be an absolute credential-free HTTPS URL. When omitted, conference generation is requested.',
					),
			})
			.nullable()
			.optional()
			.describe(
				'A conference to generate or attach, or `null` to remove the conference currently on the event.',
			),
		is_attendees_list_hidden: z
			.boolean()
			.optional()
			.describe('Is the attendees list hidden for attendees.'),
		attendees: z
			.array(
				z.object({
					email: z.string().describe('Email of the attendee.'),
					type: z
						.enum(['required', 'optional'])
						.optional()
						.describe(
							'The type of the attendee. - `required` the attendance of the attendee is required. - `optional` the attendance of the attendee is optional.',
						),
				}),
			)
			.optional(),
		recurrence: z
			.array(z.string())
			.optional()
			.describe(
				'List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545.',
			),
		start: z
			.union([
				z.object({
					type: z.enum(['datetime']).describe('Indicates a date-time value.'),
					date_time: z
						.string()
						.describe(
							'The date and time. May include a UTC offset, or be expressed as a local date and time without an offset (e.g. `2026-10-08T10:00:00`).',
						),
					timezone: z
						.string()
						.optional()
						.describe(
							'The IANA timezone in which the date and time is expressed (e.g. `Europe/Paris`). When omitted, uses the event-level timezone if set; otherwise defaults to UTC.',
						),
				}),
				z.object({
					type: z
						.enum(['date'])
						.describe('Indicates a date-only value (for all-day events).'),
					date: z
						.string()
						.describe(
							'The date. Must use a supported date format. See supported date formats.',
						),
					timezone: z
						.string()
						.optional()
						.describe(
							'The IANA timezone in which the date is expressed (e.g. `Europe/Paris`).',
						),
				}),
			])
			.optional()
			.describe('The start date and time of the event.'),
		end: z
			.union([
				z.object({
					type: z.enum(['datetime']).describe('Indicates a date-time value.'),
					date_time: z
						.string()
						.describe(
							'The date and time. May include a UTC offset, or be expressed as a local date and time without an offset (e.g. `2026-10-08T10:00:00`).',
						),
					timezone: z
						.string()
						.optional()
						.describe(
							'The IANA timezone in which the date and time is expressed (e.g. `Europe/Paris`). When omitted, uses the event-level timezone if set; otherwise defaults to UTC.',
						),
				}),
				z.object({
					type: z
						.enum(['date'])
						.describe('Indicates a date-only value (for all-day events).'),
					date: z
						.string()
						.describe(
							'The date. Must use a supported date format. See supported date formats.',
						),
					timezone: z
						.string()
						.optional()
						.describe(
							'The IANA timezone in which the date is expressed (e.g. `Europe/Paris`).',
						),
				}),
			])
			.optional()
			.describe('The end date and time of the event.'),
		notify: z
			.enum(['all', 'externalOnly', 'none'])
			.optional()
			.describe(
				"Only available for google, guests to send updates to: - `all`: Notify all guests. - `externalOnly`: Notify only guests not on the calendar's domain. - `none`: Do not notify any guests.",
			),
		timezone: z
			.string()
			.optional()
			.describe(
				'The IANA timezone the event is expressed in (e.g. `Europe/Paris`). Defaults to UTC when omitted.',
			),
	}),
	calendarEventsDelete: z.object({
		calendar_id: z
			.string()
			.min(1)
			.describe('Identifier of the parent calendar.'),
		event_id: z.string().min(1).describe('ID of the event to delete.'),
		account_id: AccountId,
	}),
	calendarEventsRespond: z.object({
		calendar_id: z
			.string()
			.min(1)
			.describe('Identifier of the parent calendar.'),
		event_id: z.string().min(1).describe('ID of the event to respond to.'),
		account_id: AccountId,
		status: z
			.enum(['yes', 'maybe', 'no'])
			.describe(
				'The response of the connected account to the invitation. - `yes` accepts the invitation. - `maybe` accepts the invitation tentatively. - `no` declines the invitation.',
			),
		comment: z
			.string()
			.optional()
			.describe('A comment sent to the organizer along with the response.'),
	}),
	calendarEventsCancel: z.object({
		calendar_id: z
			.string()
			.min(1)
			.describe('Identifier of the parent calendar.'),
		event_id: z.string().min(1).describe('ID of the event to cancel.'),
		account_id: AccountId,
		comment: z
			.string()
			.optional()
			.describe(
				'A message about the cancellation sent to the attendees. Only available for outlook.',
			),
	}),
	calendarEventsRestore: z.object({
		calendar_id: z
			.string()
			.min(1)
			.describe('Identifier of the parent calendar.'),
		event_id: z.string().min(1).describe('ID of the event to restore.'),
		account_id: AccountId,
	}),
} as const;

export const CalendarOutputSchemas = {
	calendarsList: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						name: z.string(),
						description: z.string().nullish(),
						is_read_only: z.boolean(),
						is_owned_by_user: z.boolean(),
						is_default: z.boolean(),
						background_color: z.string(),
						text_color: z.string().nullish(),
						timezone: z.string().nullish(),
						specifics: z.unknown().nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	calendarsCreate: CalendarsCreateShape3,
	calendarsGet: CalendarsCreateShape3,
	calendarsUpdate: CalendarsCreateShape3,
	calendarsDelete: NoContentSchema,
	calendarEventsList: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						master_event_id: z.string().nullish(),
						calendar_id: z.string(),
						ical_uid: z.string().nullish(),
						created_at: z.string(),
						updated_at: z.string(),
						title: z.string(),
						body: z.string().nullish(),
						location: z.string().nullish(),
						is_cancelled: z.boolean(),
						is_all_day: z.boolean(),
						is_attendees_list_hidden: z.boolean(),
						attendees: z.array(z.unknown()).nullish(),
						start: z.record(z.string(), z.unknown()),
						end: z.record(z.string(), z.unknown()),
						recurrence: z.array(z.string()).nullish(),
						organizer: z.record(z.string(), z.unknown()),
						conference: z.record(z.string(), z.unknown()).nullish(),
						visibility: z.string(),
						transparency: z.string(),
						event_type: z.string(),
						timezone: z.string().nullish(),
						background_color: z.string().nullish(),
						text_color: z.string().nullish(),
						specifics: z.unknown().nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	calendarEventsCreate: CalendarEventsCreateShape4,
	calendarEventsGet: CalendarEventsCreateShape4,
	calendarEventsUpdate: CalendarEventsCreateShape4,
	calendarEventsDelete: NoContentSchema,
	calendarEventsRespond: NoContentSchema,
	calendarEventsCancel: NoContentSchema,
	calendarEventsRestore: NoContentSchema,
} as const;
