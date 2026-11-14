import { logEventFromContext } from 'corsair/core';
import type { HubPlannerEndpoints } from '..';
import { makeHubPlannerRequest } from '../client';
import type { Event, SuccessResponse } from './types';
import {
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
} from './types';

export const Events = {
	list: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['events.list'].parse(input);
		const response = await makeHubPlannerRequest<Event[]>('/event', ctx.key, {
			method: 'GET',
			query: {
				page: parsedInput.page,
				limit: parsedInput.limit,
				sort: parsedInput.sort,
			},
		});
		const parsed =
			HubPlannerEndpointOutputSchemas['events.list'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.events.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['events.list'],

	get: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['events.get'].parse(input);
		const response = await makeHubPlannerRequest<Event>(
			`/event/${encodeURIComponent(parsedInput.eventId)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['events.get'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.events.get',
			{ eventId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['events.get'],

	create: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['events.create'].parse(input);
		const response = await makeHubPlannerRequest<Event>('/event', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		const parsed =
			HubPlannerEndpointOutputSchemas['events.create'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.events.create',
			{ eventId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['events.create'],

	update: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['events.update'].parse(input);
		const { eventId, ...body } = parsedInput;
		const response = await makeHubPlannerRequest<Event>(
			`/event/${encodeURIComponent(eventId)}`,
			ctx.key,
			{
				method: 'PUT',
				body: { _id: eventId, ...body },
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['events.update'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.events.update',
			{ eventId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['events.update'],

	delete: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['events.delete'].parse(input);
		const raw = await makeHubPlannerRequest<SuccessResponse>(
			`/event/${encodeURIComponent(parsedInput.eventId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const parsed = HubPlannerEndpointOutputSchemas['events.delete'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.events.delete',
			{ eventId: parsedInput.eventId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['events.delete'],

	search: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['events.search'].parse(input);
		const response = await makeHubPlannerRequest<Event[]>(
			'/event/search',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput.query ?? {},
				query: {
					page: parsedInput.page,
					limit: parsedInput.limit,
					sort: parsedInput.sort,
				},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['events.search'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.events.search',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['events.search'],
};
