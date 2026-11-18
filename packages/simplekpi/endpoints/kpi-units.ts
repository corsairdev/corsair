import type { SimplekpiEndpoints } from '..';
import { segment } from '../client';
import { call, deletion } from './shared';
import {
	SimplekpiEndpointInputSchemas as Inputs,
	SimplekpiEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimplekpiEndpoints['kpiUnitsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiUnits.list',
			input: Inputs.kpiUnitsList,
			output: Outputs.kpiUnitsList,
		},
		input,
		({ page, rows }) => ({
			method: 'GET',
			path: '/v1/kpiunits',
			query: { page, rows },
		}),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const create: SimplekpiEndpoints['kpiUnitsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiUnits.create',
			input: Inputs.kpiUnitsCreate,
			output: Outputs.kpiUnitsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/kpiunits', body }),
		{ log: (_, result) => ({ unitId: result.id }) },
	);

export const get: SimplekpiEndpoints['kpiUnitsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiUnits.get',
			input: Inputs.kpiUnitsGet,
			output: Outputs.kpiUnitsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/v1/kpiunits/${segment(id)}` }),
		{ log: ({ id }) => ({ unitId: id }) },
	);

export const update: SimplekpiEndpoints['kpiUnitsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiUnits.update',
			input: Inputs.kpiUnitsUpdate,
			output: Outputs.kpiUnitsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/v1/kpiunits/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ unitId: id }) },
	);

export const remove: SimplekpiEndpoints['kpiUnitsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiUnits.delete',
			input: Inputs.kpiUnitsDelete,
			output: Outputs.kpiUnitsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/v1/kpiunits/${segment(id)}` }),
		{
			shape: (raw, { id }) => deletion(raw, 'kpiUnits.delete', id),
			log: ({ id }) => ({ unitId: id }),
		},
	);
