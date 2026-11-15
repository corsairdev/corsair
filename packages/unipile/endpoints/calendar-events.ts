import { defineOperation, noContent } from './call';

// List all calendar events (GET /v2/{account_id}/calendars/{calendar_id}/events)
export const list = defineOperation(
	'calendarEventsList',
	'calendarEvents.list',
	{
		method: 'GET',
		path: '/v2/{account_id}/calendars/{calendar_id}/events',
		query: [
			'is_cancelled',
			'title',
			'description',
			'ical_uid',
			'location',
			'start',
			'end',
			'busy',
			'updated_before',
			'updated_after',
			'attendees',
			'event_type',
			'expand_recurring',
			'offset',
			'cursor',
			'limit',
		],
	},
);

// Create a calendar event (POST /v2/{account_id}/calendars/{calendar_id}/events)
export const create = defineOperation(
	'calendarEventsCreate',
	'calendarEvents.create',
	{
		method: 'POST',
		path: '/v2/{account_id}/calendars/{calendar_id}/events',
		body: [
			'title',
			'body',
			'location',
			'background_color',
			'transparency',
			'visibility',
			'conference',
			'is_attendees_list_hidden',
			'attendees',
			'recurrence',
			'start',
			'end',
			'notify',
			'timezone',
		],
	},
);

// Get a calendar event (GET /v2/{account_id}/calendars/{calendar_id}/events/{event_id})
export const get = defineOperation('calendarEventsGet', 'calendarEvents.get', {
	method: 'GET',
	path: '/v2/{account_id}/calendars/{calendar_id}/events/{event_id}',
});

// Update a calendar event (PATCH /v2/{account_id}/calendars/{calendar_id}/events/{event_id})
export const update = defineOperation(
	'calendarEventsUpdate',
	'calendarEvents.update',
	{
		method: 'PATCH',
		path: '/v2/{account_id}/calendars/{calendar_id}/events/{event_id}',
		body: [
			'title',
			'body',
			'location',
			'background_color',
			'transparency',
			'visibility',
			'conference',
			'is_attendees_list_hidden',
			'attendees',
			'recurrence',
			'start',
			'end',
			'notify',
			'timezone',
		],
	},
);

// Delete a Calendar event (DELETE /v2/{account_id}/calendars/{calendar_id}/events/{event_id})
export const remove = defineOperation(
	'calendarEventsDelete',
	'calendarEvents.delete',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/calendars/{calendar_id}/events/{event_id}',
	},
	noContent,
);

// Respond to a calendar event (POST /v2/{account_id}/calendars/{calendar_id}/events/{event_id}/rsvp)
export const respond = defineOperation(
	'calendarEventsRespond',
	'calendarEvents.respond',
	{
		method: 'POST',
		path: '/v2/{account_id}/calendars/{calendar_id}/events/{event_id}/rsvp',
		body: ['status', 'comment'],
	},
	noContent,
);

// Cancel a calendar event (POST /v2/{account_id}/calendars/{calendar_id}/events/{event_id}/cancel)
export const cancel = defineOperation(
	'calendarEventsCancel',
	'calendarEvents.cancel',
	{
		method: 'POST',
		path: '/v2/{account_id}/calendars/{calendar_id}/events/{event_id}/cancel',
		body: ['comment'],
	},
	noContent,
);

// Restore a cancelled calendar event (POST /v2/{account_id}/calendars/{calendar_id}/events/{event_id}/restore)
export const restore = defineOperation(
	'calendarEventsRestore',
	'calendarEvents.restore',
	{
		method: 'POST',
		path: '/v2/{account_id}/calendars/{calendar_id}/events/{event_id}/restore',
	},
	noContent,
);
