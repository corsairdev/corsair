import { logEventFromContext } from 'corsair/core';
import type { HubPlannerEndpoints } from '..';
import { makeHubPlannerRequest } from '../client';
import type { Booking, SuccessResponse } from './types';
import {
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
} from './types';

export const Bookings = {
	list: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['bookings.list'].parse(input);
		const response = await makeHubPlannerRequest<Booking[]>(
			'/booking',
			ctx.key,
			{
				method: 'GET',
				query: {
					page: parsedInput.page,
					limit: parsedInput.limit,
					skip: parsedInput.skip,
					cursor: parsedInput.cursor,
					sort: parsedInput.sort,
					deleted: parsedInput.deleted,
					dependencies: parsedInput.dependencies,
				},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['bookings.list'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.bookings.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['bookings.list'],

	get: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['bookings.get'].parse(input);
		const response = await makeHubPlannerRequest<Booking>(
			`/booking/${encodeURIComponent(parsedInput.bookingId)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['bookings.get'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.bookings.get',
			{ bookingId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['bookings.get'],

	create: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['bookings.create'].parse(input);
		const response = await makeHubPlannerRequest<Booking>('/booking', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		const parsed =
			HubPlannerEndpointOutputSchemas['bookings.create'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.bookings.create',
			{ bookingId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['bookings.create'],

	update: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['bookings.update'].parse(input);
		const { bookingId, ...body } = parsedInput;
		const response = await makeHubPlannerRequest<Booking>(
			`/booking/${encodeURIComponent(bookingId)}`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['bookings.update'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.bookings.update',
			{ bookingId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['bookings.update'],

	patch: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['bookings.patch'].parse(input);
		const { bookingId, ...body } = parsedInput;
		const response = await makeHubPlannerRequest<Booking>(
			`/booking/${encodeURIComponent(bookingId)}`,
			ctx.key,
			{
				method: 'PATCH',
				body,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['bookings.patch'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.bookings.patch',
			{ bookingId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['bookings.patch'],

	search: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['bookings.search'].parse(input);
		const response = await makeHubPlannerRequest<Booking[]>(
			'/booking/search',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput.query ?? {},
				query: {
					dependencies: parsedInput.dependencies,
					page: parsedInput.page,
					limit: parsedInput.limit,
					sort: parsedInput.sort,
				},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['bookings.search'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.bookings.search',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['bookings.search'],

	delete: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['bookings.delete'].parse(input);
		const raw = await makeHubPlannerRequest<SuccessResponse>(
			`/booking/${encodeURIComponent(parsedInput.bookingId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['bookings.delete'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.bookings.delete',
			{ bookingId: parsedInput.bookingId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['bookings.delete'],

	deleteBulk: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['bookings.deleteBulk'].parse(input);
		const query: Record<string, string | undefined> = {};
		if (parsedInput.resourceId) query.resourceId = parsedInput.resourceId;
		if (parsedInput.projectId) query.projectId = parsedInput.projectId;
		if (parsedInput.ids && parsedInput.ids.length > 0) {
			query.ids = parsedInput.ids.join(',');
		}

		const raw = await makeHubPlannerRequest<SuccessResponse>(
			'/booking',
			ctx.key,
			{
				method: 'DELETE',
				body: parsedInput.ids,
				query,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['bookings.deleteBulk'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.bookings.deleteBulk',
			parsed.count === undefined ? {} : { count: parsed.count },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['bookings.deleteBulk'],
};
