import { makeMoonClerkRequest } from '../client';
import type { MoonClerkEndpoints } from '../index';
import {
	MoonClerkEndpointInputSchemas,
	MoonClerkEndpointOutputSchemas,
} from './types';

export const Forms = {
	list: (async (ctx, input) => {
		const query = MoonClerkEndpointInputSchemas.listForms.parse(input);
		const result = await makeMoonClerkRequest('/forms', ctx.key, query);
		return MoonClerkEndpointOutputSchemas.listForms.parse(result);
	}) satisfies MoonClerkEndpoints['listForms'],
	get: (async (ctx, input) => {
		const { id } = MoonClerkEndpointInputSchemas.getForm.parse(input);
		const result = await makeMoonClerkRequest(
			`/forms/${encodeURIComponent(String(id))}`,
			ctx.key,
		);
		return MoonClerkEndpointOutputSchemas.getForm.parse(result);
	}) satisfies MoonClerkEndpoints['getForm'],
};
export const Customers = {
	list: (async (ctx, input) => {
		const query = MoonClerkEndpointInputSchemas.listCustomers.parse(input);
		const result = await makeMoonClerkRequest('/customers', ctx.key, query);
		return MoonClerkEndpointOutputSchemas.listCustomers.parse(result);
	}) satisfies MoonClerkEndpoints['listCustomers'],
	get: (async (ctx, input) => {
		const { id } = MoonClerkEndpointInputSchemas.getCustomer.parse(input);
		const result = await makeMoonClerkRequest(
			`/customers/${encodeURIComponent(String(id))}`,
			ctx.key,
		);
		return MoonClerkEndpointOutputSchemas.getCustomer.parse(result);
	}) satisfies MoonClerkEndpoints['getCustomer'],
};
export const Payments = {
	list: (async (ctx, input) => {
		const query = MoonClerkEndpointInputSchemas.listPayments.parse(input);
		const result = await makeMoonClerkRequest('/payments', ctx.key, query);
		return MoonClerkEndpointOutputSchemas.listPayments.parse(result);
	}) satisfies MoonClerkEndpoints['listPayments'],
	get: (async (ctx, input) => {
		const { id } = MoonClerkEndpointInputSchemas.getPayment.parse(input);
		const result = await makeMoonClerkRequest(
			`/payments/${encodeURIComponent(String(id))}`,
			ctx.key,
		);
		return MoonClerkEndpointOutputSchemas.getPayment.parse(result);
	}) satisfies MoonClerkEndpoints['getPayment'],
};
