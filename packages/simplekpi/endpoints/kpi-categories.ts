import type { SimplekpiEndpoints } from '..';
import { segment } from '../client';
import { call, deletion } from './shared';
import {
	SimplekpiEndpointInputSchemas as Inputs,
	SimplekpiEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimplekpiEndpoints['kpiCategoriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.list',
			input: Inputs.kpiCategoriesList,
			output: Outputs.kpiCategoriesList,
		},
		input,
		({ page, rows }) => ({
			method: 'GET',
			path: '/v1/kpicategories',
			query: { page, rows },
		}),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const create: SimplekpiEndpoints['kpiCategoriesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.create',
			input: Inputs.kpiCategoriesCreate,
			output: Outputs.kpiCategoriesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/kpicategories', body }),
		{ log: (_, result) => ({ categoryId: result.id }) },
	);

export const get: SimplekpiEndpoints['kpiCategoriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.get',
			input: Inputs.kpiCategoriesGet,
			output: Outputs.kpiCategoriesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/v1/kpicategories/${segment(id)}` }),
		{ log: ({ id }) => ({ categoryId: id }) },
	);

export const update: SimplekpiEndpoints['kpiCategoriesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.update',
			input: Inputs.kpiCategoriesUpdate,
			output: Outputs.kpiCategoriesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/v1/kpicategories/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ categoryId: id }) },
	);

export const remove: SimplekpiEndpoints['kpiCategoriesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiCategories.delete',
			input: Inputs.kpiCategoriesDelete,
			output: Outputs.kpiCategoriesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/v1/kpicategories/${segment(id)}`,
		}),
		{
			shape: (raw, { id }) => deletion(raw, 'kpiCategories.delete', id),
			log: ({ id }) => ({ categoryId: id }),
		},
	);
