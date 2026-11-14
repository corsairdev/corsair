import { logEventFromContext } from 'corsair/core';
import type { HubPlannerEndpoints } from '..';
import { makeHubPlannerRequest } from '../client';
import type { TimeEntry } from './types';
import {
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
} from './types';

export const TimeEntries = {
	list: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['timeEntries.list'].parse(input);
		const response = await makeHubPlannerRequest<TimeEntry[]>(
			'/timeentry',
			ctx.key,
			{
				method: 'GET',
				query: {
					page: parsedInput.page,
					limit: parsedInput.limit,
					sort: parsedInput.sort,
					project: parsedInput.project,
					start: parsedInput.start,
					end: parsedInput.end,
				},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['timeEntries.list'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.timeEntries.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['timeEntries.list'],

	get: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['timeEntries.get'].parse(input);
		const response = await makeHubPlannerRequest<TimeEntry>(
			`/timeentry/${encodeURIComponent(parsedInput.timeEntryId)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['timeEntries.get'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.timeEntries.get',
			{ timeEntryId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['timeEntries.get'],

	create: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['timeEntries.create'].parse(input);
		const response = await makeHubPlannerRequest<TimeEntry>(
			'/timeentry',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['timeEntries.create'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.timeEntries.create',
			{ timeEntryId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['timeEntries.create'],

	search: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['timeEntries.search'].parse(input);
		const response = await makeHubPlannerRequest<TimeEntry[]>(
			'/timeentry/search',
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
			HubPlannerEndpointOutputSchemas['timeEntries.search'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.timeEntries.search',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['timeEntries.search'],

	update: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['timeEntries.update'].parse(input);
		const { timeEntryId, ...body } = parsedInput;
		const response = await makeHubPlannerRequest<TimeEntry>(
			`/timeentry/${encodeURIComponent(timeEntryId)}`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['timeEntries.update'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.timeEntries.update',
			{ timeEntryId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['timeEntries.update'],

	delete: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['timeEntries.delete'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/timeentry/${encodeURIComponent(parsedInput.timeEntryId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['timeEntries.delete'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.timeEntries.delete',
			{ timeEntryId: parsedInput.timeEntryId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['timeEntries.delete'],

	deleteBulk: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['timeEntries.deleteBulk'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>('/timeentry', ctx.key, {
			method: 'DELETE',
			body: parsedInput.ids,
		});
		const parsed =
			HubPlannerEndpointOutputSchemas['timeEntries.deleteBulk'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.timeEntries.deleteBulk',
			{ count: parsedInput.ids.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['timeEntries.deleteBulk'],
};
