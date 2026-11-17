import type { SimplekpiEndpoints } from '..';
import { segment } from '../client';
import { call, deletion } from './shared';
import {
	SimplekpiEndpointInputSchemas as Inputs,
	SimplekpiEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimplekpiEndpoints['kpisList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'kpis.list', input: Inputs.kpisList, output: Outputs.kpisList },
		input,
		({ page, rows }) => ({
			method: 'GET',
			path: '/v1/kpis',
			query: { page, rows },
		}),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const create: SimplekpiEndpoints['kpisCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpis.create',
			input: Inputs.kpisCreate,
			output: Outputs.kpisCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/kpis', body }),
		{ log: (_, result) => ({ kpiId: result.id }) },
	);

export const get: SimplekpiEndpoints['kpisGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'kpis.get', input: Inputs.kpisGet, output: Outputs.kpisGet },
		input,
		({ id }) => ({ method: 'GET', path: `/v1/kpis/${segment(id)}` }),
		{
			log: ({ id }, result) => ({
				kpiId: id,
				isCalculated: result.is_calculated ?? undefined,
			}),
		},
	);

export const update: SimplekpiEndpoints['kpisUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpis.update',
			input: Inputs.kpisUpdate,
			output: Outputs.kpisUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/v1/kpis/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ kpiId: id }) },
	);

export const remove: SimplekpiEndpoints['kpisDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpis.delete',
			input: Inputs.kpisDelete,
			output: Outputs.kpisDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/v1/kpis/${segment(id)}` }),
		{
			shape: (raw, { id }) => deletion(raw, 'kpis.delete', id),
			log: ({ id }) => ({ kpiId: id }),
		},
	);
