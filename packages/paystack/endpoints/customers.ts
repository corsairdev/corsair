import type { PaystackEndpoints } from '..';
import { call } from './call';
import {
	PaystackEndpointInputSchemas as Inputs,
	PaystackEndpointOutputSchemas as Outputs,
} from './types';

export const create: PaystackEndpoints['customersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/customer', body }),
		{
			log: (_, result) => ({
				customerCode: result.data.customer_code ?? undefined,
			}),
		},
	);

export const list: PaystackEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		(query) => ({ method: 'GET', path: '/customer', query }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PaystackEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		({ emailOrCode }) => ({
			method: 'GET',
			path: `/customer/${encodeURIComponent(emailOrCode)}`,
		}),
		{
			log: (_, result) => ({
				customerCode: result.data.customer_code ?? undefined,
			}),
		},
	);

export const update: PaystackEndpoints['customersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		({ code, ...body }) => ({
			method: 'PUT',
			path: `/customer/${encodeURIComponent(code)}`,
			body,
		}),
		{
			log: (_, result) => ({
				customerCode: result.data.customer_code ?? undefined,
			}),
		},
	);

export const setRiskAction: PaystackEndpoints['customersSetRiskAction'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.setRiskAction',
			input: Inputs.customersSetRiskAction,
			output: Outputs.customersSetRiskAction,
		},
		input,
		(body) => ({ method: 'POST', path: '/customer/set_risk_action', body }),
		{
			log: (_, result) => ({
				customerCode: result.data.customer_code ?? undefined,
				riskAction: result.data.risk_action ?? undefined,
			}),
		},
	);
