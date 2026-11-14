import { logEventFromContext } from 'corsair/core';
import type { HubPlannerEndpoints } from '..';
import { makeHubPlannerRequest } from '../client';
import type { BookingCategory, CategoryGroup, CostCategory } from './types';
import {
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
} from './types';

export const Categories = {
	list: (async (ctx, input) => {
		HubPlannerEndpointInputSchemas['categories.list'].parse(input);
		const response = await makeHubPlannerRequest<BookingCategory[]>(
			'/categories',
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.list'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.list'],

	get: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['categories.get'].parse(input);
		const response = await makeHubPlannerRequest<BookingCategory>(
			`/categories/${encodeURIComponent(parsedInput.categoryId)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.get'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.get',
			{ categoryId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.get'],

	create: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['categories.create'].parse(input);
		const response = await makeHubPlannerRequest<BookingCategory>(
			'/categories',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.create'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.create',
			{ categoryId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.create'],

	update: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['categories.update'].parse(input);
		const { categoryId, ...body } = parsedInput;
		const response = await makeHubPlannerRequest<BookingCategory>(
			`/categories/${encodeURIComponent(categoryId)}`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.update'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.update',
			{ categoryId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.update'],

	search: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['categories.search'].parse(input);
		const response = await makeHubPlannerRequest<BookingCategory[]>(
			'/categories/search',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput.query ?? {},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.search'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.search',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.search'],

	listGroups: (async (ctx, input) => {
		HubPlannerEndpointInputSchemas['categories.listGroups'].parse(input);
		const response = await makeHubPlannerRequest<CategoryGroup[]>(
			'/category-groups',
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.listGroups'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.listGroups',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.listGroups'],

	listCostCategories: (async (ctx, input) => {
		HubPlannerEndpointInputSchemas['categories.listCostCategories'].parse(
			input,
		);
		const response = await makeHubPlannerRequest<CostCategory[]>(
			'/costCategories',
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.listCostCategories'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.listCostCategories',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.listCostCategories'],

	getCostCategory: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['categories.getCostCategory'].parse(input);
		const response = await makeHubPlannerRequest<CostCategory>(
			`/costCategories/${encodeURIComponent(parsedInput.costCategoryId)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.getCostCategory'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.getCostCategory',
			{ costCategoryId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.getCostCategory'],

	createCostCategory: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['categories.createCostCategory'].parse(
				input,
			);
		const response = await makeHubPlannerRequest<CostCategory>(
			'/costCategories',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.createCostCategory'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.createCostCategory',
			{ costCategoryId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.createCostCategory'],

	updateCostCategory: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['categories.updateCostCategory'].parse(
				input,
			);
		const { costCategoryId, ...body } = parsedInput;
		const response = await makeHubPlannerRequest<CostCategory>(
			`/costCategories/${encodeURIComponent(costCategoryId)}`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.updateCostCategory'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.updateCostCategory',
			{ costCategoryId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.updateCostCategory'],

	searchCostCategories: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['categories.searchCostCategories'].parse(
				input,
			);
		const response = await makeHubPlannerRequest<CostCategory[]>(
			'/costCategories/search',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput.query ?? {},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.searchCostCategories'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.searchCostCategories',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.searchCostCategories'],

	deleteCostCategory: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['categories.deleteCostCategory'].parse(
				input,
			);
		const raw = await makeHubPlannerRequest<unknown>(
			`/costCategories/${encodeURIComponent(parsedInput.costCategoryId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		// 'unknown' raw response normalized to SuccessResponse object
		const normalized =
			typeof raw === 'object' && raw !== null
				? { success: true, ...raw }
				: { success: true };
		const parsed =
			HubPlannerEndpointOutputSchemas['categories.deleteCostCategory'].parse(
				normalized,
			);
		await logEventFromContext(
			ctx,
			'hubplanner.categories.deleteCostCategory',
			{ costCategoryId: parsedInput.costCategoryId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['categories.deleteCostCategory'],
};
