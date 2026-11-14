import type { ProabonoEndpoints } from '..';
import { asList, call } from './call';
import {
	ProabonoEndpointInputSchemas as Inputs,
	ProabonoEndpointOutputSchemas as Outputs,
} from './types';

export const create: ProabonoEndpoints['customersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
		},
		input,
		({ Metadata, ...body }) => ({
			method: 'POST',
			path: '/v1/Customer',
			body: { ...body, Metadata },
		}),
		{ log: (_, result) => ({ customerId: result.Id ?? undefined }) },
	);

export const get: ProabonoEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
			emptyValue: () => ({ customers: [] }),
		},
		input,
		({ ReferenceCustomer }) => ({
			method: 'GET',
			path: '/v1/Customer',
			query: { ReferenceCustomer },
		}),
		{ log: (_, result) => ({ customerId: result.Id ?? undefined }) },
	);

export const list: ProabonoEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
			emptyValue: () => ({ customers: [] }),
		},
		input,
		({ ReferenceSegment, Page, SizePage }) => ({
			method: 'GET',
			path: '/v1/Customers',
			query: { ReferenceSegment, Page, SizePage },
		}),
		{
			shape: asList('customers'),
			log: (_, result) => ({ count: result.customers.length }),
		},
	);

export const update: ProabonoEndpoints['customersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/Customer', body }),
		{ log: (_, result) => ({ customerId: result.Id ?? undefined }) },
	);

/** Anonymization erases the customer's personal data and cannot be undone. */
export const anonymize: ProabonoEndpoints['customersAnonymize'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.anonymize',
			input: Inputs.customersAnonymize,
			output: Outputs.customersAnonymize,
		},
		input,
		({ ReferenceCustomer }) => ({
			method: 'POST',
			path: '/v1/Customer/Anonymization',
			body: { ReferenceCustomer },
		}),
		{ log: ({ ReferenceCustomer }) => ({ reference: ReferenceCustomer }) },
	);

/** Invalidating stops the customer's subscriptions and links. */
export const invalidate: ProabonoEndpoints['customersInvalidate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.invalidate',
			input: Inputs.customersInvalidate,
			output: Outputs.customersInvalidate,
		},
		input,
		({ ReferenceCustomer }) => ({
			method: 'POST',
			path: '/v1/Customer/Invalidation',
			body: { ReferenceCustomer },
		}),
		{ log: ({ ReferenceCustomer }) => ({ reference: ReferenceCustomer }) },
	);

/** Suspending pauses the customer without deleting anything. */
export const suspend: ProabonoEndpoints['customersSuspend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.suspend',
			input: Inputs.customersSuspend,
			output: Outputs.customersSuspend,
		},
		input,
		({ ReferenceCustomer }) => ({
			method: 'POST',
			path: '/v1/Customer/Suspension',
			body: { ReferenceCustomer },
		}),
		{ log: ({ ReferenceCustomer }) => ({ reference: ReferenceCustomer }) },
	);
