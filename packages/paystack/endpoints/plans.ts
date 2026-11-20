import type { PaystackEndpoints } from '..';
import { call } from './call';
import {
	PaystackEndpointInputSchemas as Inputs,
	PaystackEndpointOutputSchemas as Outputs,
} from './types';

export const create: PaystackEndpoints['plansCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'plans.create',
			input: Inputs.plansCreate,
			output: Outputs.plansCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/plan', body }),
		{ log: (_, result) => ({ planCode: result.data.plan_code ?? undefined }) },
	);

export const list: PaystackEndpoints['plansList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'plans.list',
			input: Inputs.plansList,
			output: Outputs.plansList,
		},
		input,
		(query) => ({ method: 'GET', path: '/plan', query }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PaystackEndpoints['plansGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'plans.get',
			input: Inputs.plansGet,
			output: Outputs.plansGet,
		},
		input,
		({ idOrCode }) => ({
			method: 'GET',
			path: `/plan/${encodeURIComponent(idOrCode)}`,
		}),
		{ log: (_, result) => ({ planCode: result.data.plan_code ?? undefined }) },
	);

export const update: PaystackEndpoints['plansUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'plans.update',
			input: Inputs.plansUpdate,
			output: Outputs.plansUpdate,
		},
		input,
		({ idOrCode, ...body }) => ({
			method: 'PUT',
			path: `/plan/${encodeURIComponent(idOrCode)}`,
			body,
		}),
		{ log: (_, result) => ({ planCode: result.data.plan_code ?? undefined }) },
	);
