import { logEventFromContext } from 'corsair/core';
import type { HubPlannerEndpoints } from '..';
import { makeHubPlannerRequest } from '../client';
import type { Resource, Tag } from './types';
import {
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
} from './types';

export const Resources = {
	list: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.list'].parse(input);
		const response = await makeHubPlannerRequest<Resource[]>(
			'/resource',
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
			HubPlannerEndpointOutputSchemas['resources.list'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.list'],

	get: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.get'].parse(input);
		const response = await makeHubPlannerRequest<Resource>(
			`/resource/${encodeURIComponent(parsedInput.resourceId)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['resources.get'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.get',
			{ resourceId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.get'],

	create: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.create'].parse(input);
		const response = await makeHubPlannerRequest<Resource>(
			'/resource',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['resources.create'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.create',
			{ resourceId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.create'],

	update: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.update'].parse(input);
		const response = await makeHubPlannerRequest<Resource[]>(
			'/resource',
			ctx.key,
			{
				method: 'PATCH',
				body: parsedInput.resources,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['resources.update'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.update',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.update'],

	delete: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.delete'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/resource/${encodeURIComponent(parsedInput.resourceId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['resources.delete'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.delete',
			{ resourceId: parsedInput.resourceId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.delete'],

	deleteBulk: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.deleteBulk'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>('/resource', ctx.key, {
			method: 'DELETE',
			body: parsedInput.resourceIds,
		});
		const parsed =
			HubPlannerEndpointOutputSchemas['resources.deleteBulk'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.deleteBulk',
			{ count: parsedInput.resourceIds.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.deleteBulk'],

	search: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.search'].parse(input);
		const response = await makeHubPlannerRequest<Resource[]>(
			'/resource/search',
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
			HubPlannerEndpointOutputSchemas['resources.search'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.search',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.search'],

	getTags: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.getTags'].parse(input);
		const response = await makeHubPlannerRequest<Tag[]>(
			`/resource/${encodeURIComponent(parsedInput.resourceId)}/tag`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['resources.getTags'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.getTags',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.getTags'],

	addTags: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.addTags'].parse(input);
		const response = await makeHubPlannerRequest<Resource>(
			`/resource/${encodeURIComponent(parsedInput.resourceId)}/tag`,
			ctx.key,
			{
				method: 'PATCH',
				body: { tags: parsedInput.tags },
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['resources.addTags'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.addTags',
			{ resourceId: parsedInput.resourceId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.addTags'],

	removeTag: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['resources.removeTag'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/resource/${encodeURIComponent(parsedInput.resourceId)}/tag/${encodeURIComponent(parsedInput.tagId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['resources.removeTag'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.resources.removeTag',
			{ tagId: parsedInput.tagId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['resources.removeTag'],
};
