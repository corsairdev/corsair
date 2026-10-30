import { defineOperation, noContent } from './call';

// List all Calendars (GET /v2/{account_id}/calendars)
export const list = defineOperation('calendarsList', 'calendars.list', {
	method: 'GET',
	path: '/v2/{account_id}/calendars',
	query: ['offset', 'cursor', 'limit'],
});

// Create a Calendar (POST /v2/{account_id}/calendars)
export const create = defineOperation('calendarsCreate', 'calendars.create', {
	method: 'POST',
	path: '/v2/{account_id}/calendars',
	body: ['name', 'description', 'background_color', 'timezone'],
});

// Get a Calendar (GET /v2/{account_id}/calendars/{calendar_id})
export const get = defineOperation('calendarsGet', 'calendars.get', {
	method: 'GET',
	path: '/v2/{account_id}/calendars/{calendar_id}',
});

// Update a Calendar (PATCH /v2/{account_id}/calendars/{calendar_id})
export const update = defineOperation('calendarsUpdate', 'calendars.update', {
	method: 'PATCH',
	path: '/v2/{account_id}/calendars/{calendar_id}',
	body: ['name', 'description', 'background_color', 'timezone'],
});

// Delete a Calendar (DELETE /v2/{account_id}/calendars/{calendar_id})
export const remove = defineOperation(
	'calendarsDelete',
	'calendars.delete',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/calendars/{calendar_id}',
	},
	noContent,
);
