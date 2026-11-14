import { logEventFromContext } from 'corsair/core';
import type { HubPlannerEndpoints } from '..';
import { makeHubPlannerRequest } from '../client';
import type { Milestone, SuccessResponse } from './types';
import {
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
} from './types';

export const Milestones = {
	list: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['milestones.list'].parse(input);
		const response = await makeHubPlannerRequest<Milestone[]>(
			'/milestone',
			ctx.key,
			{
				method: 'GET',
				query: {
					page: parsedInput.page,
					limit: parsedInput.limit,
					sort: parsedInput.sort,
				},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['milestones.list'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.milestones.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['milestones.list'],

	get: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['milestones.get'].parse(input);
		const response = await makeHubPlannerRequest<Milestone>(
			`/milestone/${encodeURIComponent(parsedInput.milestoneId)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['milestones.get'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.milestones.get',
			{ milestoneId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['milestones.get'],

	create: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['milestones.create'].parse(input);
		const response = await makeHubPlannerRequest<Milestone>(
			'/milestone',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['milestones.create'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.milestones.create',
			{ milestoneId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['milestones.create'],

	update: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['milestones.update'].parse(input);
		const { milestoneId, ...body } = parsedInput;
		const response = await makeHubPlannerRequest<Milestone>(
			`/milestone/${encodeURIComponent(milestoneId)}`,
			ctx.key,
			{
				method: 'PUT',
				body: { _id: milestoneId, ...body },
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['milestones.update'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.milestones.update',
			{ milestoneId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['milestones.update'],

	delete: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['milestones.delete'].parse(input);
		const raw = await makeHubPlannerRequest<SuccessResponse>(
			`/milestone/${encodeURIComponent(parsedInput.milestoneId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['milestones.delete'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.milestones.delete',
			{ milestoneId: parsedInput.milestoneId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['milestones.delete'],

	search: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['milestones.search'].parse(input);
		const response = await makeHubPlannerRequest<Milestone[]>(
			'/milestone/search',
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
			HubPlannerEndpointOutputSchemas['milestones.search'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.milestones.search',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['milestones.search'],
};
