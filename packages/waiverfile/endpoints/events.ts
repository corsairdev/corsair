import type { WaiverFileEndpoints } from '..';
import { call } from './call';
import {
	WaiverFileEndpointInputSchemas as Inputs,
	WaiverFileEndpointOutputSchemas as Outputs,
} from './types';

export const byDateRange: WaiverFileEndpoints['eventsByDateRange'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.byDateRange',
			input: Inputs.eventsByDateRange,
			output: Outputs.eventsByDateRange,
		},
		input,
		({ startDateUTC, endDateUTC }) => ({
			method: 'GET',
			path: '/api/v1/GetEventsByDateRange',
			query: { startDateUTC, endDateUTC },
		}),
		{
			log: (_, result) => ({
				count: (result.Events ?? result.WaiverEvents)?.length ?? 0,
			}),
		},
	);

export const byCategory: WaiverFileEndpoints['eventsByCategory'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.byCategory',
			input: Inputs.eventsByCategory,
			output: Outputs.eventsByCategory,
		},
		input,
		({ eventCategoryID, startDateUTC, endDateUTC }) => ({
			method: 'GET',
			path: '/api/v1/GetEventsByCategory',
			query: { eventCategoryID, startDateUTC, endDateUTC },
		}),
		{
			log: (parsed, result) => ({
				category: parsed.eventCategoryID,
				count: (result.Events ?? result.WaiverEvents)?.length ?? 0,
			}),
		},
	);

/** Upcoming events, capped at 3,000 by the API. */
export const upcoming: WaiverFileEndpoints['eventsUpcoming'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.upcoming',
			input: Inputs.eventsUpcoming,
			output: Outputs.eventsUpcoming,
		},
		input,
		({ startDateUTC, endDateUTC }) => ({
			method: 'GET',
			path: '/api/v1/GetUpcomingEvents',
			query: { startDateUTC, endDateUTC },
		}),
		{
			// The 3,000 cap is the API's, not the plugin's, so the count is the
			// only way a caller can notice it was reached.
			log: (_, result) => ({
				count: (result.Events ?? result.WaiverEvents)?.length ?? 0,
			}),
		},
	);

/** The waivers signed for one event. */
export const waivers: WaiverFileEndpoints['eventsWaivers'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.waivers',
			input: Inputs.eventsWaivers,
			output: Outputs.eventsWaivers,
		},
		input,
		({ waiverEventID }) => ({
			method: 'GET',
			path: '/api/v1/GetWaiversForEvent',
			query: { waiverEventID },
		}),
		{
			log: (_, result) => ({ count: result.Waivers?.length ?? 0 }),
		},
	);

export const get: WaiverFileEndpoints['eventsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'events.get', input: Inputs.eventsGet, output: Outputs.eventsGet },
		input,
		({ eventID }) => ({
			method: 'GET',
			path: '/api/v1/GetEvent',
			query: { eventID },
		}),
		{
			log: (_, result) => ({
				id: result.WaiverEventID ?? undefined,
				signed: result.NumSignedWaivers ?? undefined,
			}),
		},
	);

/**
 * Creates an event.
 *
 * This is the one route that carries the credentials in the **body** rather
 * than the query string, spelled `APIKey` and `SiteID`. `call` has already
 * resolved the packed key, but the body needs the raw pair, so this reads it
 * back off the client's own resolution — the request builder below adds them.
 */
export const create: WaiverFileEndpoints['eventsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.create',
			input: Inputs.eventsCreate,
			output: Outputs.eventsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/v1/InsertEvent',
			// The credentials are appended by the client for query-string routes;
			// this body carries its own, which `makeWaiverFileRequest` cannot know
			// about — so they are added here from the context key.
			body: {
				APIKey: ctx.key.split('\n')[0]?.trim(),
				SiteID: ctx.key.split('\n')[1]?.trim(),
				EventName: parsed.eventName,
				DateStart: parsed.dateStart,
				DateEnd: parsed.dateEnd,
				IsAllDay: parsed.isAllDay,
				EventCategoryID: parsed.eventCategoryID,
				ManagerEmailList: parsed.managerEmailList,
				ManagerEmailMessage: parsed.managerEmailMessage,
				WaiverFormIDList: parsed.waiverFormIDList,
				EventLocation: parsed.eventLocation,
				SigningCutoff: parsed.signingCutoff,
				MaxParticipants: parsed.maxParticipants,
				WorkflowIDList: parsed.workflowIDList,
			},
		}),
		{
			log: (parsed, result) => ({
				id: result.WaiverEventID ?? undefined,
				name: parsed.eventName,
			}),
		},
	);

export const update: WaiverFileEndpoints['eventsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.update',
			input: Inputs.eventsUpdate,
			output: Outputs.eventsUpdate,
		},
		input,
		({
			eventID,
			eventName,
			dateStart,
			dateEnd,
			isAllDay,
			eventCategoryID,
			waiverFormIDs,
		}) => ({
			method: 'POST',
			path: '/api/v1/UpdateEvent',
			query: {
				eventID,
				eventName,
				dateStart,
				dateEnd,
				isAllDay,
				eventCategoryID,
			},
			// The form IDs are the request body, as a JSON array.
			body: waiverFormIDs ?? [],
			mediaType: 'application/json',
		}),
		{
			log: (parsed, result) => ({
				id: result.WaiverEventID ?? parsed.eventID,
				forms: parsed.waiverFormIDs?.length ?? 0,
			}),
		},
	);

/** Delete is a `GET` here, which is worth knowing before a retry. */
export const remove: WaiverFileEndpoints['eventsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.delete',
			input: Inputs.eventsDelete,
			output: Outputs.eventsDelete,
		},
		input,
		({ eventID }) => ({
			method: 'GET',
			path: '/api/v1/DeleteEvent',
			query: { eventID },
		}),
		{
			log: (parsed, result) => ({
				id: parsed.eventID,
				success: result.Success ?? false,
			}),
		},
	);

/**
 * Invites managers by email. Whether an invitation actually goes out depends on
 * `skipSendingEmailIfAccountExists`, so the response's message is reported.
 */
export const inviteManagers: WaiverFileEndpoints['eventsInviteManagers'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.inviteManagers',
			input: Inputs.eventsInviteManagers,
			output: Outputs.eventsInviteManagers,
		},
		input,
		({
			eventID,
			emailAddresses,
			managerEmailMessage,
			skipSendingEmailIfAccountExists,
		}) => ({
			method: 'POST',
			path: '/api/v1/InviteEventManagers',
			query: {
				eventID,
				emailAddresses,
				managerEmailMessage,
				skipSendingEmailIfAccountExists,
			},
		}),
		{
			// The addresses are people, so only how many were invited is logged.
			log: (parsed, result) => ({
				event: parsed.eventID,
				addresses: parsed.emailAddresses.split(/[,\s]+/).filter(Boolean).length,
				success: result.Success ?? false,
			}),
		},
	);

export const removeManagers: WaiverFileEndpoints['eventsRemoveManagers'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.removeManagers',
			input: Inputs.eventsRemoveManagers,
			output: Outputs.eventsRemoveManagers,
		},
		input,
		({ eventID, emailAddresses }) => ({
			method: 'POST',
			path: '/api/v1/RemoveEventManagers',
			query: { eventID, emailAddresses },
		}),
		{
			log: (parsed, result) => ({
				event: parsed.eventID,
				success: result.Success ?? false,
			}),
		},
	);
