import type { SimplekpiEndpoints } from '..';
import { segment } from '../client';
import { call, deletion } from './shared';
import {
	SimplekpiEndpointInputSchemas as Inputs,
	SimplekpiEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The same KPI resource, reached through its category. A KPI created here lands
 * in the category in the path even when the body names another one, and a KPI
 * under a different category answers 404, which is how the API keeps a caller
 * from reaching the wrong parent.
 */
function categoryPath(categoryId: number, suffix = ''): string {
	return `/v1/kpicategories/${segment(categoryId)}/kpis${suffix}`;
}

export const list: SimplekpiEndpoints['categoryKpisList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.kpis.list',
			input: Inputs.categoryKpisList,
			output: Outputs.categoryKpisList,
		},
		input,
		({ category_id, page, rows }) => ({
			method: 'GET',
			path: categoryPath(category_id),
			query: { page, rows },
		}),
		{
			log: ({ category_id }, result) => ({
				categoryId: category_id,
				count: result.length,
			}),
		},
	);

export const create: SimplekpiEndpoints['categoryKpisCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.kpis.create',
			input: Inputs.categoryKpisCreate,
			output: Outputs.categoryKpisCreate,
		},
		input,
		({ category_id, ...body }) => ({
			method: 'POST',
			path: categoryPath(category_id),
			body,
		}),
		{
			log: ({ category_id }, result) => ({
				categoryId: category_id,
				kpiId: result.id,
			}),
		},
	);

export const get: SimplekpiEndpoints['categoryKpisGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.kpis.get',
			input: Inputs.categoryKpisGet,
			output: Outputs.categoryKpisGet,
		},
		input,
		({ category_id, id }) => ({
			method: 'GET',
			path: categoryPath(category_id, `/${segment(id)}`),
		}),
		{
			log: ({ category_id, id }) => ({ categoryId: category_id, kpiId: id }),
		},
	);

export const update: SimplekpiEndpoints['categoryKpisUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.kpis.update',
			input: Inputs.categoryKpisUpdate,
			output: Outputs.categoryKpisUpdate,
		},
		input,
		({ category_id, id, ...body }) => ({
			method: 'PUT',
			path: categoryPath(category_id, `/${segment(id)}`),
			body,
		}),
		{
			log: ({ category_id, id }) => ({ categoryId: category_id, kpiId: id }),
		},
	);

export const remove: SimplekpiEndpoints['categoryKpisDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.kpis.delete',
			input: Inputs.categoryKpisDelete,
			output: Outputs.categoryKpisDelete,
		},
		input,
		({ category_id, id }) => ({
			method: 'DELETE',
			path: categoryPath(category_id, `/${segment(id)}`),
		}),
		{
			shape: (raw, { id }) => deletion(raw, 'kpiCategories.kpis.delete', id),
			log: ({ category_id, id }) => ({ categoryId: category_id, kpiId: id }),
		},
	);
