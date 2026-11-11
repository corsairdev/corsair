import type { EventbriteEndpoints } from '..';
import { segment } from '../client';
import { call, commaList } from './call';
import {
	EventbriteEndpointInputSchemas as Inputs,
	EventbriteEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Event reads. Every event route answers with the event object itself, so the
 * same output schema serves all of them; `expand` is the one query value that
 * changes the shape.
 */
export const get: EventbriteEndpoints['eventsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.get',
			input: Inputs.eventsGet,
			output: Outputs.eventsGet,
		},
		input,
		({ event_id, expand }) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/`,
			query: { expand: commaList(expand) },
		}),
		{
			log: ({ event_id }) => ({ eventId: event_id }),
		},
	);

export const listByOrganization: EventbriteEndpoints['eventsListByOrganization'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'events.listByOrganization',
				input: Inputs.eventsListByOrganization,
				output: Outputs.eventsListByOrganization,
			},
			input,
			({
				organization_id,
				status,
				name_filter,
				currency_filter,
				order_by,
				time_filter,
				series_filter,
				show_series_parent,
				venue_filter,
				organizer_filter,
				inventory_type_filter,
				event_ids,
				event_ids_to_exclude,
				event_group_id,
				collection_id,
				collection_ids_to_exclude,
				page_size,
				continuation,
				page,
			}) => ({
				method: 'GET',
				path: `/organizations/${segment(organization_id)}/events/`,
				query: {
					status: commaList(status),
					name_filter,
					currency_filter,
					order_by,
					time_filter,
					series_filter: commaList(series_filter),
					show_series_parent,
					venue_filter: commaList(venue_filter),
					organizer_filter: commaList(organizer_filter),
					inventory_type_filter: commaList(inventory_type_filter),
					event_ids: commaList(event_ids),
					event_ids_to_exclude: commaList(event_ids_to_exclude),
					event_group_id,
					collection_id,
					collection_ids_to_exclude: commaList(collection_ids_to_exclude),
					page_size,
					continuation,
					page,
				},
			}),
			{
				log: ({ organization_id }, result) => ({
					organizationId: organization_id,
					count: result.events.length,
				}),
			},
		);

export const listByVenue: EventbriteEndpoints['eventsListByVenue'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.listByVenue',
			input: Inputs.eventsListByVenue,
			output: Outputs.eventsListByVenue,
		},
		input,
		({
			venue_id,
			status,
			order_by,
			only_public,
			'start_date.range_start': rangeStart,
			'start_date.range_end': rangeEnd,
			page_size,
			continuation,
			page,
		}) => ({
			method: 'GET',
			path: `/venues/${segment(venue_id)}/events/`,
			query: {
				status: commaList(status),
				order_by,
				only_public,
				'start_date.range_start': rangeStart,
				'start_date.range_end': rangeEnd,
				page_size,
				continuation,
				page,
			},
		}),
		{
			log: ({ venue_id }, result) => ({
				venueId: venue_id,
				count: result.events.length,
			}),
		},
	);

export const listBySeries: EventbriteEndpoints['eventsListBySeries'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.listBySeries',
			input: Inputs.eventsListBySeries,
			output: Outputs.eventsListBySeries,
		},
		input,
		({
			event_series_id,
			time_filter,
			order_by,
			'start_date.range_start': rangeStart,
			'start_date.range_end': rangeEnd,
			page_size,
			continuation,
			page,
		}) => ({
			method: 'GET',
			path: `/series/${segment(event_series_id)}/events/`,
			query: {
				time_filter,
				order_by,
				'start_date.range_start': rangeStart,
				'start_date.range_end': rangeEnd,
				page_size,
				continuation,
				page,
			},
		}),
		{
			log: ({ event_series_id }, result) => ({
				seriesId: event_series_id,
				count: result.events.length,
			}),
		},
	);

export const create: EventbriteEndpoints['eventsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.create',
			input: Inputs.eventsCreate,
			output: Outputs.eventsCreate,
		},
		input,
		({ organization_id, event }) => ({
			method: 'POST',
			path: `/organizations/${segment(organization_id)}/events/`,
			body: { event },
		}),
		{
			log: ({ organization_id }, result) => ({
				organizationId: organization_id,
				eventId: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

export const update: EventbriteEndpoints['eventsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.update',
			input: Inputs.eventsUpdate,
			output: Outputs.eventsUpdate,
		},
		input,
		({ event_id, event }) => ({
			method: 'POST',
			path: `/events/${segment(event_id)}/`,
			body: { event },
		}),
		{
			log: ({ event_id }) => ({ eventId: event_id }),
		},
	);

/**
 * Publish, unpublish and cancel all answer 200 with a single boolean under a
 * key named after the action. The key is kept as the provider names it so a
 * caller can read `result.published` from the docs.
 */
export const publish: EventbriteEndpoints['eventsPublish'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.publish',
			input: Inputs.eventsPublish,
			output: Outputs.eventsPublish,
		},
		input,
		({ event_id }) => ({
			method: 'POST',
			path: `/events/${segment(event_id)}/publish/`,
		}),
		{
			log: ({ event_id }) => ({ eventId: event_id }),
		},
	);

export const unpublish: EventbriteEndpoints['eventsUnpublish'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.unpublish',
			input: Inputs.eventsUnpublish,
			output: Outputs.eventsUnpublish,
		},
		input,
		({ event_id }) => ({
			method: 'POST',
			path: `/events/${segment(event_id)}/unpublish/`,
		}),
		{
			log: ({ event_id }) => ({ eventId: event_id }),
		},
	);

export const cancel: EventbriteEndpoints['eventsCancel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.cancel',
			input: Inputs.eventsCancel,
			output: Outputs.eventsCancel,
		},
		input,
		({ event_id }) => ({
			method: 'POST',
			path: `/events/${segment(event_id)}/cancel/`,
		}),
		{
			log: ({ event_id }) => ({ eventId: event_id }),
		},
	);

/** `remove` because `delete` is a reserved word; registered under `delete`. */
export const remove: EventbriteEndpoints['eventsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.delete',
			input: Inputs.eventsDelete,
			output: Outputs.eventsDelete,
		},
		input,
		({ event_id }) => ({
			method: 'DELETE',
			path: `/events/${segment(event_id)}/`,
		}),
		{
			log: ({ event_id }) => ({ eventId: event_id }),
		},
	);

export const copy: EventbriteEndpoints['eventsCopy'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.copy',
			input: Inputs.eventsCopy,
			output: Outputs.eventsCopy,
		},
		input,
		({ event_id, name, start_date, end_date, timezone, summary }) => ({
			method: 'POST',
			path: `/events/${segment(event_id)}/copy/`,
			// This route takes the copy's fields bare; `{ event: … }` is rejected
			// as an unknown parameter.
			body: { name, start_date, end_date, timezone, summary },
		}),
		{
			log: ({ event_id }, result) => ({
				sourceEventId: event_id,
				eventId: result.id ?? undefined,
			}),
		},
	);

export const description: EventbriteEndpoints['eventsDescription'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.description',
			input: Inputs.eventsDescription,
			output: Outputs.eventsDescription,
		},
		input,
		({ event_id }) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/description/`,
		}),
		{
			log: ({ event_id }) => ({ eventId: event_id }),
		},
	);

export const displaySettings: EventbriteEndpoints['eventsDisplaySettings'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.displaySettings',
			input: Inputs.eventsDisplaySettings,
			output: Outputs.eventsDisplaySettings,
		},
		input,
		({ event_id }) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/display_settings/`,
		}),
		{
			log: ({ event_id }) => ({ eventId: event_id }),
		},
	);

export const updateDisplaySettings: EventbriteEndpoints['eventsUpdateDisplaySettings'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'events.updateDisplaySettings',
				input: Inputs.eventsUpdateDisplaySettings,
				output: Outputs.eventsUpdateDisplaySettings,
			},
			input,
			({ event_id, display_settings }) => ({
				method: 'POST',
				path: `/events/${segment(event_id)}/display_settings/`,
				// Bare `show_map` is rejected as an unknown parameter; this route
				// does want the `display_settings` wrapper.
				body: { display_settings },
			}),
			{
				log: ({ event_id }) => ({ eventId: event_id }),
			},
		);
